import express from 'express';
const authRouter = express.Router(); 


import { teacherRegister, userRegister, userLogin, createUserProfile, getAllUsers, getUserAuthProfile, getUserProfile } from '../../controllers/auth/userController.js';
import isLoggedIn from '../../middlewares/isLoggedIn.js';

authRouter.post('/user-login', userLogin); 
authRouter.post('/create-user-profile',isLoggedIn, createUserProfile); 
authRouter.get('/all-users',getAllUsers); 
authRouter.get('/users-auth-profile', isLoggedIn, getUserAuthProfile); 
authRouter.get('/users-profile/:id', getUserProfile); 
authRouter.post('/user-register', userRegister); 
authRouter.post('/teacher-register', teacherRegister); 

export default authRouter;