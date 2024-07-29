import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const userProfileSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    image: { type: String, required: true },
    gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
    dateOfBirth: { 
        type: Date, 
        required: true,
        validate: {
            validator: function(value) {
                const today = new Date();
                let age = today.getFullYear() - value.getFullYear();
                const monthDifference = today.getMonth() - value.getMonth();
                if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < value.getDate())) {
                    age--;
                }
                return age >= 18;
            },
            message: 'User must be at least 18 years old'
        }
    },
    phoneNumber: { type: String, required: true },
    address: {
        street: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        postalCode: { type: String, required: true },
        country: { type: String, required: true }
    }
}, { timestamps: true });

const UserProfile = mongoose.model('UserProfile', userProfileSchema);
export default UserProfile;
