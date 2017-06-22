import mongoose from 'mongoose';
import httpStatus from 'http-status';
import APIError from '../../helpers/APIError';

const UserSchema = mongoose.Schema({
    username: {
        type: String,
        lowercase: true,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

UserSchema.statics = { 
  list (filter, skip, limit, sort, select) {
    try {
        const query = this.find()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);  
        return query.exec();
    } catch (err) {
        const err = new APIError('Nenhum usuário encontrado!', httpStatus.NOT_FOUND);
        return Promise.reject(err);
    }

    /*
    return this.findById(id)
      .exec()
      .then((user) => {
        if (user) {
          return user;
        }
        const err = new APIError('Nenhum usuário encontrado!', httpStatus.NOT_FOUND);
        return Promise.reject(err);
      });
      */
  },

  get (id) {
      try {
          return this.findById(id)
                      .exec();
      } catch (err) {
          const err = new APIError('Nenhum usuário encontrado!', httpStatus.NOT_FOUND);
          return Promise.reject(err);
      }
  }

}

export default UserSchema;
