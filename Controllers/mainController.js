
import Student from '../Models/student.js';
import Mentor from '../Models/mentor.js';

export const apiConnected = async (req, res)=>{
    try {

        const htmlContent = `
        <html>
            <head>
                <title>Mentor & Student Task</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        background-color:black;
                        margin: 0;
                        padding: 0;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        height: 100vh;
                    }
                    .container {
                        text-align: center;
                    }
                    h1,h3 {
                        color: white;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>Mentor and Student Task API Connected Successfully! </h1>
                    <h3>Kindly test the API in Postman.</h3>
                  <h2>😊</h2>
                <div style="display:flex; justify-content:center;padding:20px;"> 
                <div> 
                <p style="color:white;background-color:#d1ae00; padding:10px 80px; margin:20px 20px; text-align:center ">
                  <a href="/" style="text-decoration:none;color:white;">Home</a>
                </p>
                <p style="color:white;background-color:#046494; padding:10px 80px; margin:20px 20px; text-align:center ">
                <a href="/mentors"  style="text-decoration:none;color:white;">All Mentors list</a></p>
                <p style="color:white;background-color:#94044a; padding:10px 80px; margin:10px 20px; text-align:center ">
                <a href="/students"  style="text-decoration:none;color:white;">All Students list</a></p>

                </div>
                </div>
                </div>
            </body>
        </html>
    `;
        await res.status(200).send(htmlContent);

    } catch (error) {
        res.status(500).json({message : `Internal Server Error`});
    }
}


export const createStudent = async (req, res)=>{
    try {

        const newStudent = new Student(req.body);
        await newStudent.save();
        res.status(201).json({message:`New Student created Successfully!`, data : newStudent});

    } catch (error) {
        res.status(500).json({message : `Internal Server Error`});
    }
}

export const getAllStudents = async (req, res)=>{
    try {

        let students = await Student.find();
        const studentData = students.map(student => ({
            _id : student._id,
            name: student.name,
            email: student.email,
            assigned_mentor_id: student.assigned_mentor_id
        }));

        res.status(200).json({message : 'Student data fetched successfully!', allStudent : studentData});

    } catch (error) {;
        res.status(500).json({message : `Internal Server Error`});
    }
}

export const createMentor = async (req, res)=>{
    try {

        const newMentor = new Mentor(req.body);
        await newMentor.save();
        res.status(201).json({message:`New Mentor created Successfully!`, data : newMentor});

    } catch (error) {
        res.status(500).json({message : `Internal Server Error`});
    }
}

export const getAllMentors = async (req, res)=>{
    try {
        let mentors = await Mentor.find();
        const mentorData = mentors.map(mentor => ({
            _id : mentor._id,
            name: mentor.name,
            email: mentor.email,
            assigned_students_id: mentor.assigned_students_id
        }));

        res.status(200).json({message : 'Mentor data fetched successfully!', allMentor : mentorData});

    } catch (error) {

        res.status(500).json({message : `Internal Server Error`});
    }
}


export const assignStudentsToMentor = async (req, res) => {
    try {

        const mentor_Id = req.params.id;
        const { student_Ids } = req.body;

        for (const student_Id of student_Ids) {
            const existingMentor = await Mentor.findOne({ assigned_students_id: student_Id  });
            if (existingMentor) {
                existingMentor.assigned_students_id = existingMentor.assigned_students_id.filter(id => id.toString() !== student_Id.toString() );
                await existingMentor.save();
            }
        }

        const mentor = await Mentor.findById(mentor_Id);
        mentor.assigned_students_id.push(...student_Ids);
        await mentor.save();

        if(!mentor) {
            return res.status(404).json({ message: 'Mentor not found' });
        }

        await Student.updateMany(
            { _id: { $in: student_Ids } },
            { $set: { assigned_mentor_id: mentor_Id } }
        );

        res.status(200).json({ message: 'Students successfully assigned to mentor!', updatedMentor : mentor });

    } catch (error) {
        res.status(500).json({message : `Internal Server Error`});
    }
};

export const assignMentorToStudent = async (req, res)=>{
    try {
        const student_Id = req.params.id;

        const { mentor_id } = req.body;

        const existingMentor = await Mentor.findOne({ assigned_students_id: student_Id });
        if (existingMentor) {
            existingMentor.assigned_students_id = existingMentor.assigned_students_id.filter(id => id.toString() !== student_Id.toString() );
            
            await existingMentor.save();
        }

        const student = await Student.findByIdAndUpdate(student_Id, { assigned_mentor_id: mentor_id });

        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        const mentor = await Mentor.findById(mentor_id);
        mentor.assigned_students_id.push(student_Id);
        await mentor.save();

        res.status(200).json({ message: 'Mentor successfully assigned to student!', updatedStudent: student });
        
    } catch (error) {
        res.status(500).json({ message: `Internal Server Error` });
    }
}


export const getStudentsByMentorID = async (req, res) => {
    try {
        const mentorId  = req.params.id;
        const mentor = await Mentor.findById(mentorId).populate('assigned_students_id');

        if(!mentor) {
            return res.status(404).json({ message: 'Mentor not found' });
        }
        res.status(200).json({message: 'Data Fetched Successfully', students: mentor.assigned_students_id });

    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
}


export const getMentorByStudentId = async (req, res) => {
    try {
        const student_Id = req.params.id;
        const student = await Student.findById(student_Id).populate('assigned_mentor_id');

        if(!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        res.status(200).json({message: 'Data Fetched Successfully', mentor: student.assigned_mentor_id });

    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
}