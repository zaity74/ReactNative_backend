import mongoose from "mongoose";

const Schema = mongoose.Schema;

// Définition du schéma Annonce
const annonceSchema = new Schema(
  {
    teacher: { type: Schema.Types.ObjectId, ref: "User", required: true },
    slug: {
      type: String,
      required: true,
      validate: {
        validator: function (value) {
          const wordCount = value.trim().split(/\s+/).length;
          return wordCount <= 10;
        },
        message: "Slug must contain at most 10 words",
      },
    },
    description: { type: String, required: true },
    courseDescription: { type: String, required: true },
    mainSubject: { type: String, required: true },
    subSpecialties: [String],
    courseMode: {
      type: String,
      enum: ["In-person", "Webcome"],
      required: true,
    },
    city: { type: String, required: true },
    hourlyRate: { type: Number, required: true },
    reviews: [
      {
        user: { type: Schema.Types.ObjectId, ref: "User", required: true },
        rating: { type: Number, min: 1, max: 5, required: true },
        comment: { type: String, required: true },
      },
    ],
    responseTime: { type: String, enum: ["1h", "2h", "24h"], required: true },
  },
  { timestamps: true }
);

annonceSchema.virtual('totalReviews').get(function() {
    const annonce = this;
    return annonce?.reviews?.length
})
annonceSchema.virtual('averageRating').get(function() {
    let total = 0;
    const annonce = this;
    annonce?.reviews?.forEach((r) =>{
        total += r?.rating
    })
    const averageRating = Number(total/annonce?.reviews?.length).toFixed(1)
    return averageRating
})

// Middleware pré-enregistrement pour vérifier les avis uniques
annonceSchema.pre("save", function (next) {
  const annonce = this;

  // Utilisez un ensemble pour garder une trace des utilisateurs qui ont laissé un avis
  const userSet = new Set();

  // Parcourez les avis et vérifiez les doublons
  for (let review of annonce.reviews) {
    if (userSet.has(review.user.toString())) {
      const error = new Error(
        "A user can only leave one review per announcement."
      );
      next(error);
      return;
    }
    userSet.add(review.user.toString());
  }

  next();
});

// Modèles
const Annonce = mongoose.model("Annonce", annonceSchema);

// Exportation des modèles
export default Annonce;
