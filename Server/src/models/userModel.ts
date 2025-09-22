import mongoose, { Document, Schema, Types } from 'mongoose';
import bcrypt from 'bcryptjs';

// Interface defining the User document structure
export interface IUser extends Document {
  name: string;
  email: string;
  password?: string; // Password is optional on the interface for security
  projects: Types.ObjectId[];
  // A method to compare entered passwords with the stored hash
  matchPassword(enteredPassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, select: false }, // 'select: false' prevents password from being sent in API responses
  projects: [{ type: Schema.Types.ObjectId, ref: 'Project' }],
}, { timestamps: true });

// --- Password Hashing Middleware ---
// This function runs automatically before a new user document is saved.
userSchema.pre('save', async function (next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) {
    return next();
  }
  // Generate a salt and hash the password
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password!, salt);
  next();
});

// --- Password Comparison Method ---
// This adds a custom method to each user document to safely check passwords.
userSchema.methods.matchPassword = async function (enteredPassword: string) {
  // It's important to select the password field when fetching the user for this to work
  return await bcrypt.compare(enteredPassword, this.password);
};

export const UserModel = mongoose.model<IUser>('User', userSchema);

