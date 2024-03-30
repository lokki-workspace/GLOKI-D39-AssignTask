
import express from 'express';
import { apiConnected, assignMentorToStudent, assignStudentsToMentor, createMentor, createStudent, getAllMentors, getAllStudents, getMentorByStudentId, getStudentsByMentorID } from '../Controllers/mainController.js';

const router = express.Router();

router.get('/', apiConnected);


router.post('/newstudent', createStudent);
router.get('/students', getAllStudents);
router.post('/newmentor', createMentor);
router.get('/mentors', getAllMentors);
router.put('/assign-students-mentor/:id', assignStudentsToMentor);
router.put('/assign-mentor-student/:id', assignMentorToStudent);
router.get('/studentby-m/:id', getStudentsByMentorID);
router.get('/mentorby-s/:id', getMentorByStudentId);


export default router;