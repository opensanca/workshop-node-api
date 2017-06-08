import mongoose from 'mongoose';
import userSchema from './schema';
export default mongoose.model('User', userSchema);