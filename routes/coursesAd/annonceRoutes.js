import express from 'express';
const annonceRouter = express.Router(); 


import { createAnnonce, getUserAnnonce, getUserAuthAnnonce, updateAnnonce, getAllAnnonces } from '../../controllers/coursesAd/annonceController.js';
import isLoggedIn from '../../middlewares/isLoggedIn.js';

annonceRouter.post('/create-annonce', isLoggedIn, createAnnonce); 
annonceRouter.get('/user-auth-annonce', isLoggedIn, getUserAuthAnnonce ); 
annonceRouter.get('/user-annonce/:id', getUserAnnonce); 
annonceRouter.put('/update-annonce',isLoggedIn, getUserAnnonce);
annonceRouter.get('/all', getAllAnnonces);  

export default annonceRouter;