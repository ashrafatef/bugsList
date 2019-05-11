import mongoose from "mongoose";


const Schema = mongoose.Schema;

let Issue = new Schema({
    title : { type : String},
    resposible : { type : String},
    description : { type : String},
    severity : { type : String},
    status : { type : String , default : 'open'}
});

export default mongoose.model('Issue' , Issue);