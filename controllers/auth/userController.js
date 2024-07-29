import User from "../../models/Auth/User.js";
import asyncHandler from 'express-async-handler';
import UserProfile from '../../models/Auth/UserProfile.js';
import Annonce from "../../models/CoursesAd/CoursesAd.js";

// Créer un profil utilisateur
export const createUserProfile = asyncHandler(async (req, res) => {
    const { image, gender, dateOfBirth, phoneNumber, address } = req.body;
    const userId = req.userAuthId; // Assurez-vous que l'utilisateur est connecté et que son ID est disponible dans req.user._id

    try {
        // const profilExist = await UserProfile.findOne({ user: userId });
        // if (profilExist) {
        //     return res.status(404).json({ message: 'Annonce not found' });
        // }
        const userProfile = new UserProfile({
            user: userId,
            image,
            gender,
            dateOfBirth,
            phoneNumber,
            address
        });

        await userProfile.save();

        res.status(201).json({
            status: 'success',
            message: 'User profile created successfully ✅',
            data: {
                userProfile
            }
        });
    } catch (error) {
        res.status(500).json({error, message: 'Server Error' });
    }
});

// Afficher tous les utilisateurs ayant le rôle de "teacher" avec pagination et tri
export const getAllUsers = asyncHandler(async (req, res) => {
    try {
      // Pagination
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const startIndex = (page - 1) * limit;
  
      // Tri
      const sortField = req.query.sortField || 'name.firstname';
      const sortOrder = req.query.sortOrder === 'desc' ? -1 : 1;
  
      // Fetch users with the role of "teacher" and populate their annonces
      const total = await User.countDocuments({ 'role.name': 'teacher' });
      const users = 
      await User.find({ 'role.name': 'teacher' })
        .populate({
            path: 'annonces',
            populate: { path: 'teacher' } // Populate nested fields if necessary
        })
        .populate('userProfile')
        .exec()
        .catch(error => {
            console.error("Error populating data:", error);
          }); // Populate the annonces field
       
  
      // Configurer la pagination
      const pagination = {};
      if (startIndex + limit < total) {
        pagination.next = {
          page: page + 1,
          limit
        };
      }
      if (startIndex > 0) {
        pagination.prev = {
          page: page - 1,
          limit
        };
      }
  
      res.status(200).json({
        status: 'success',
        total,
        pagination,
        results: users.length,
        users
      });
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ error, message: 'Server Error' });
    }
  });
  


  
  

// Afficher le profil de l'utilisateur connecté (authentifié)
export const getUserAuthProfile = asyncHandler(async (req, res) => {
    const userId = req.userAuthId; // Assurez-vous que l'utilisateur est connecté et que son ID est disponible dans req.user._id

    try {
        const userProfile = await UserProfile.findOne({ user: userId }).populate('user');
        if (!userProfile) {
            return res.status(404).json({ message: 'User profile not found' });
        }

        res.status(200).json({
            status: 'success',
            data: {
                userProfile
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// Afficher un profil utilisateur spécifique
export const getUserProfile = asyncHandler(async (req, res) => {
    const { userId } = req.params; // ID de l'utilisateur passé dans les paramètres de l'URL

    try {
        const userProfile = await UserProfile.findOne({ user: userId }).populate('user');
        if (!userProfile) {
            return res.status(404).json({ message: 'User profile not found' });
        }

        res.status(200).json({
            status: 'success',
            data: {
                userProfile
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});



// REGISTER AS USER 
export const userRegister = asyncHandler(async (req, res) => {
    const { firstname, lastname, email, password } = req.body;
  
    try {
        // Vérification de l'existence de l'utilisateur.
        const userExist = await User.findByEmail(email);
        if (userExist) {
            return res.status(400).json({ email: 'User already exists' });
        }
  
        // Creation du user et le hash pwd est déja fait dans le middleware pre('save')). 
        const user = new User({
            name: { firstname, lastname },
            email,
            password,
            role: [{ name: 'user' }]
        });
  
        await user.save();
  
        // Génération d'un token pour l'utilisateur.
        const token = user.generateToken();
  
        res.status(201).json({
            status: 'success',
            message: 'User registered successfully ✅ ',
            data: {
                user,
                token
            }
        });
    } catch (error) {
        if (error.name === 'ValidationError') {
            const errors = {};
            Object.keys(error.errors).forEach((key) => {
                errors[key] = error.errors[key].message;
            });
            return res.status(400).json(errors);
        }
        res.status(500).json({ message: 'Server Error' });
    }
});

// REGISTER AS TEACHER 
export const teacherRegister = asyncHandler(async (req, res) => {
    const { firstname, lastname, email, password } = req.body;
  
    try {
        // Vérification de l'existence de l'utilisateur.
        const userExist = await User.findByEmail(email);
        if (userExist) {
            return res.status(400).json({ email: 'User already exists' });
        }
  
        // Creation du user et le hash pwd est déja fait dans le middleware pre('save')). 
        const user = new User({
            name: { firstname, lastname },
            email,
            password,
            role: [{ name: 'teacher' }]
        });
  
        await user.save();
  
        // Génération d'un token pour l'utilisateur.
        const token = user.generateToken();
  
        res.status(201).json({
            status: 'success',
            message: 'Teacher registered successfully',
            data: {
                user,
                token
            }
        });
    }catch (error) {
        if (error.name === 'ValidationError') {
            const errors = {};
            Object.keys(error.errors).forEach((key) => {
                errors[key] = error.errors[key].message;
            });
            return res.status(400).json(errors);
        }
        res.status(500).json({ message: 'Server Error' });
    }
});

// LOGIN USER
export const userLogin = asyncHandler(async (req, res) => {
    // Récupération des requetes de l'utilisateur :
    const { email, password } = req.body;
  
    // Vérification de l'existence de l'utilisateur :
    const userFound = await User.findByEmail(email);
  
    // Comparer et vérifier le mot de passe :
    if (userFound && await userFound.comparePassword(password)) {
  
        // Mettre à jour le champ isActive à true
        userFound.isActive = true;
        userFound.lastSeenAt = Date.now();
        await userFound.save();
  
        // Générer le token
        const token = userFound.generateToken();
  
        return res.status(200).json({
            status: 'success',
            message: 'User logged in successfully',
            data: {
              user: userFound,
              token
          }
        })
    }else{
        throw new Error('Looks like either your email address or password were incorrect. Wanna try again?')
    }
});

