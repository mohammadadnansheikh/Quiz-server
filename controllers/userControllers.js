import UserModal from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

class UserController {
  static registration = async (req, res) => {
    try {
      const result = await UserModal.find();
      res.send(result);
    } catch (err) {
      console.log(err);
    }
  };

  static registerUserDoc = async (req, res, next) => {
    const { name, email, password } = req.body;
    console.log("BODY", req.body);
    let existingUser;

    try {
      existingUser = await UserModal.findOne({ email: email });
      if (existingUser) {
        return res.status(400).json({ message: "Email  already exists" });
      }

      const hashPassword = bcrypt.hashSync(password);
      console.log(hashPassword);
      const user = new UserModal({
        name,
        email,
        password: hashPassword,
      });
      await user.save();

      return res.status(201).json({ message: user });
    } catch (err) {
      return res.status(404).json({ message: "Error Occured" });
    }
  };

  static login = async (req, res, next) => {
    const { email, password } = req.body;
    let existingUser;
    try {
      existingUser = await UserModal.findOne({ email: email });
    } catch (err) {
      return res.status(400).json({
        message: "Bad Request! Error Occured",
      });
    }

    if (!existingUser) {
      return res.status(400).json({
        message: "User Not found. Please SignUp first",
      });
    }

    const isPasswordCorrect = bcrypt.compareSync(
      password,
      existingUser.password
    );
    if (!isPasswordCorrect) {
      return res.status(400).json({
        message: "Invalid email/password",
      });
    }
    // after authentication
    const token = jwt.sign(
      { id: existingUser._id },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "35s",
      }
    );
    console.log("Generated Token", token);
    if (req.cookies[`${existingUser._id}`]) {
      req.cookies[`${existingUser._id}`] = "";
    }

    res.cookie(String(existingUser._id), token, {
      path: "/",
      expires: new Date(Date.now() + 1000 * 30),
      httpOnly: true,
      sameSite: "lax",
    });

    return res.status(200).json({
      message: "Successfully Login",
      user: existingUser,
      token,
    });
  };

  static verifyToken = (req, res, next) => {
    const cookies = req.headers.cookie;
    // console.log(cookies)
    const token = cookies.split("=")[1];
    // console.log(token)

    // const headers = req.headers[`authorization`];

    // const token = headers.split(" ")[1];
    if (!token) {
      res.status(404).json({
        message: "No token found",
      });
    }

    // to verify the token in jwt
    jwt.verify(String(token), process.env.JWT_SECRET_KEY, (err, user) => {
      if (err) {
        return res.status(400).json({ message: "Invalid Token" });
      }
      // console.log("USER ID_________________", user)
      req.id = user.id;
    });
    // next Middleware
    next();
  };

  static getUser = async (req, res, next) => {
    const userId = req.id;
    let user;
    try {
      user = await UserModal.findById(userId, "-password");
    } catch (err) {
      return new Error();
    }
    if (!user) {
      res.status(404).json({
        message: "User Not Found",
      });
    }
    return res.status(200).json({ user });
  };

  static refreshToken = (req, res, next) => {
    const cookies = req.headers.cookie;
    // console.log(cookies)
    const prevToken = cookies.split("=")[1];
    //  console.log(token)
    if (!prevToken) {
      return res.status(400).json({
        message: "Could find token",
      });
    }
    // verify the token
    jwt.verify(String(prevToken), process.env.JWT_SECRET_KEY, (err, user) => {
      if (err) {
        console.log(err);
        return res.status(403).json({
          message: "authentication failed",
        });
      }

      res.clearCookie(`${user.id}`);
      req.cookies[`${user.id}`] = "";

      // generate new token

      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET_KEY, {
        expiresIn: "35s",
      });

      // define coookie
      console.log("Regenerated Token\n", token);
      res.cookie(String(user.id), token, {
        path: "/",
        expires: new Date(Date.now() + 1000 * 30),
        httpOnly: true,
        sameSite: "lax",
      });

      // again
      req.id = user.id;
    });
    next();
  };

  static logout = (req, res, next)=>{
    const cookies = req.headers.cookie;
    const prevToken = cookies.split("=")[1];
    if(!prevToken){
        return res.status(400).json({
            message : "Could not find token"
        })
    }

    jwt.verify(String(prevToken), process.env.JWT_SECRET_KEY, (err, user)=>{
        if(err){
            console.log(err);
            return res.status(403).json({
                message : "authentication failed"
            })
        }
        res.clearCookie(`${user.id}`)
        req.cookies[`${user.id}`] = ""
        return res.status(200).json({
            message : "Successfully Logout"
        })
    })
}
}

export default UserController;
