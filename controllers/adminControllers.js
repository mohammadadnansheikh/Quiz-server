import AdminModel from "../models/Admin.js";
class AdminControllers{
    static  admin =async (req, res)=>{
        try{
            const result = await AdminModel.find()
            res.send(result)
         }catch(err){
          console.log(err);
         }
    }
    static createAdminDoc = async(req, res)=>{
        // post methods for getting data
        console.log(req.body)
        try{
            const doc = AdminModel(req.body);
            const result =  await doc.save();
            res.send(result)
        }catch(err){
            console.log(err);
        }
    }
    static getQuizById = async (req, res)=>{
        try{
            const ID = req.params.id
            const result = await AdminModel.findById(ID)
            res.send(result)
        }catch(err){
            console.log(err)
        }
    }
}

export default AdminControllers;