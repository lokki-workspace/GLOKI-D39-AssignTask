
import mongoose from "mongoose";

const mentorSchema = new mongoose.Schema({
    name : String,
    email : String,
    assigned_students_id :[{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Student'
    }]
}, {versionKey : false});


const Mentor = mongoose.model('Mentor', mentorSchema);

export default Mentor;