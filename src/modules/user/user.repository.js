import mongoose from 'mongoose';
import UserSchema from './user.schema';
export default mongoose.model('User', UserSchema);