import mongoose from "mongoose";

// defining schema
const adminSchema = mongoose.Schema({
    category : {type : String, trim : true},
    values : [{
        typeofQues : {type :String},
        difficulty : {type : Number},
        question : {type :String},
        correctAnswer : ["A"],
        incorrectAnswer : ["B", "C", "D"]
    }]
})

// compiling schema

const AdminModel = mongoose.model('admin', adminSchema);
export default AdminModel;