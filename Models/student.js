
import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
    name : String,
    email : String,
    assigned_mentor_id : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Mentor'
    }
}, {versionKey : false} );


const Student = mongoose.model('Student', studentSchema);


export default Student;