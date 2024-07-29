import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const Schema = mongoose.Schema;

const emailRegexPattern = /\S+@\S+\.\S+/;

const roleSchema = new Schema({
  name: {
    type: String,
    required: true,
    enum: ['user', 'admin', 'teacher'],
    default: 'user'
  }
}, { _id: false });

const userSchema = new Schema({
  name: {
    firstname: {
      type: String,
      required: [true, 'Please enter your firstname']
    },
    lastname: {
      type: String,
      required: [true, 'Please enter your lastname']
    },
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [10, 'Password must be at least 10 characters'],
  },
  passwordChangeAt: {
    type: Date,
    default: Date.now,
    select: false
  },
  passwordResetToken: {
    type: String,
    select: false
  },
  passwordResetExpires: {
    type: Date,
    select: false
  },
  email: {
    type: String,
    required: [true, 'Please enter your email'],
    validate: {
      validator: function(email) {
        return emailRegexPattern.test(email);
      },
      message: 'Please enter a valid email'
    },
    unique: true,
  },
  role: [roleSchema],
  annonces: [{ type: Schema.Types.ObjectId, ref: 'Annonce' }], 
  userProfile: [{ type: Schema.Types.ObjectId, ref: 'UserProfile' }],// Adjusted annonces field
  isActive: {
    type: Boolean,
    default: true,
    required: true,
  },
  lastSeenAt: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

// ################ METHODS INSTANCES DE DOCUMENTS

userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.generateToken = function() {
  return jwt.sign({ id: this._id }, process.env.JWT_KEY, { expiresIn: '3d' });
};

const secret = process.env.JWT_KEY;
userSchema.methods.createPasswordResetToken = function() {
  const resetToken = jwt.sign({ id: this._id }, process.env.JWT_KEY, { expiresIn: '10m' });
  this.passwordResetToken = resetToken;
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

userSchema.statics.findByEmail = async function(email) {
  return this.findOne({ email });
};

userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

userSchema.pre('save', function(next) {
  if (this.isModified('password')) {
    this.passwordChangedAt = Date.now() - 1000;
  }
  next();
});

const User = mongoose.model('User', userSchema);
export default User;
