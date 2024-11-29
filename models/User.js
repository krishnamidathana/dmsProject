import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true , match: [/\S+@\S+\.\S+/, 'Please enter a valid email'], },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'driver', 'user'], default: 'user' },
  },
  { timestamps: true }
);

// Hash the password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Method to compare passwords
userSchema.methods.matchPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// Export the User model
const User = mongoose.model('User', userSchema);
export default User;
