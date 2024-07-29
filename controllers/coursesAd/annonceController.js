import Annonce from '../../models/CoursesAd/CoursesAd.js';
import asyncHandler from 'express-async-handler';

// Créer une annonce
export const createAnnonce = asyncHandler(async (req, res) => {
    const { slug, description, courseDescription, mainSubject, subSpecialties, courseMode, city, hourlyRate, responseTime } = req.body;
    const teacherId = req.userAuthId;  // Assurez-vous que l'utilisateur est connecté et que son ID est disponible dans req.user._id

    try {
        // Vérifier si l'utilisateur a déjà une annonce
        const existingAnnonce = await Annonce.findOne({ teacher: teacherId });
        if (existingAnnonce) {
            return res.status(400).json({
                status: 'fail',
                message: 'You already have an existing announcement. You cannot create another one.',
            });
        }

        // Créer une nouvelle annonce
        const annonce = new Annonce({
            teacher: teacherId,
            slug,
            description,
            courseDescription,
            mainSubject,
            subSpecialties,
            courseMode,
            city,
            hourlyRate,
            responseTime,
        });

        await annonce.save();

        res.status(201).json({
            status: 'success',
            message: 'Annonce created successfully ✅',
            data: {
                annonce
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

// Afficher l'annonce de l'utilisateur connecté
export const getUserAuthAnnonce = asyncHandler(async (req, res) => {
    const teacherId = req.userAuthId;  // Assurez-vous que l'utilisateur est connecté et que son ID est disponible dans req.user._id

    try {
        const annonce = await Annonce.findOne({ teacher: teacherId }).populate('teacher', 'name email');
        if (!annonce) {
            return res.status(404).json({ message: 'Annonce not found' });
        }

        res.status(200).json({
            status: 'success',
            data: {
                annonce
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});


// Afficher l'annonce de l'utilisateur selectionné
export const getUserAnnonce = asyncHandler(async (req, res) => {
    const teacherId = req.user._id;  // Assurez-vous que l'utilisateur est connecté et que son ID est disponible dans req.user._id

    try {
        const annonce = await Annonce.findOne({ teacher: teacherId }).populate('teacher', 'name email');
        if (!annonce) {
            return res.status(404).json({ message: 'Annonce not found' });
        }

        res.status(200).json({
            status: 'success',
            data: {
                annonce
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// Mettre à jour une annonce
export const updateAnnonce = asyncHandler(async (req, res) => {
    const { slug, description, courseDescription, mainSubject, subSpecialties, courseMode, city, hourlyRate, responseTime } = req.body;
    const teacherId = req.userAuthId;  // Assurez-vous que l'utilisateur est connecté et que son ID est disponible dans req.user._id

    try {
        let annonce = await Annonce.findOne({ teacher: teacherId });
        if (!annonce) {
            return res.status(404).json({ message: 'Annonce not found' });
        }

        annonce.slug = slug || annonce.slug;
        annonce.description = description || annonce.description;
        annonce.courseDescription = courseDescription || annonce.courseDescription;
        annonce.mainSubject = mainSubject || annonce.mainSubject;
        annonce.subSpecialties = subSpecialties || annonce.subSpecialties;
        annonce.courseMode = courseMode || annonce.courseMode;
        annonce.city = city || annonce.city;
        annonce.hourlyRate = hourlyRate || annonce.hourlyRate;
        annonce.responseTime = responseTime || annonce.responseTime;

        await annonce.save();

        res.status(200).json({
            status: 'success',
            message: 'Annonce updated successfully ✅',
            data: {
                annonce
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

export const getAllAnnonces = asyncHandler(async (req, res) => {
    try {
        const annonces = await Annonce.find().populate('teacher', 'name email');
        
        res.status(200).json({
            status: 'success',
            results: annonces.length,
            data: {
                annonces
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});