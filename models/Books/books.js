import mongoose from "mongoose";

const Schema = mongoose.Schema;

const booksSchema = new Schema({

    title: {
        type: String, 
        unique: true, 
        required: true
    }, 
    description: {
        type: String, 
        required : true,
    },
    year : {
        type: Date, 
        required: true,
    },
    author: {
        type: String, 
        required: true,
    }, 
    category : {
        type: String,
        required: true,
    },
    thumbnail : {
        type: String, 
    }, 
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }

});

// Méthode statique pour récupérer toutes les genres distinctes
// songSchema.statics.getAllGenres = async function() {
//     const genres = await this.aggregate([
//         {
//             $group: {
//                 _id: null,
//                 genre: { $addToSet: "$genre" }
//                 // otherColors: { $addToSet: "$colors.otherColors.name" }
//             }
//         },
//         {
//             $project: {
//                 _id: 0,
//                 allGenre: { $setUnion: ["$genre"] }
//             }
//         }
//     ]);
//     return genres.length ? genres[0].allGenre : [];
// };


const Books = mongoose.model('Books', booksSchema);
export default Books;