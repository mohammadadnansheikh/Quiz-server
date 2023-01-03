import mongoose from "mongoose";

// Defining Schema

const userSchema = new mongoose.Schema({
    name :{type : String, required : true, trim : true},
    email :{type : String, required : true, trim : true},
    password :{type : String, required : true, trim : true},
    join :{type : Date, default : Date.now}
})



// Modal

const UserModal = mongoose.model("user", userSchema)

export default UserModal;