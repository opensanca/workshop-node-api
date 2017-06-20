import bcrypt from 'bcryptjs';
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
        const err = new APIError('No such user exists!', httpStatus.NOT_FOUND);
        return Promise.reject(err);
    }

    /*
    return this.findById(id)
      .exec()
      .then((user) => {
        if (user) {
          return user;
        }
        const err = new APIError('No such user exists!', httpStatus.NOT_FOUND);
        return Promise.reject(err);
      });
      */
  },

  get (id) {
      try {
          return this.findById(id)
                      .exec();
      } catch (err) {
          const err = new APIError('No such user exists!', httpStatus.NOT_FOUND);
          return Promise.reject(err);
      }
  }

}

// Hash da senha do usuário antes de inserir um novo usuário
UserSchema.pre('save', function(next) {
  var user = this;
  if (this.isModified('password') || this.isNew) {
    bcrypt.genSalt(10, function(err, salt) {
      if (err) {
        return next(err);
      }
      bcrypt.hash(user.password, salt, function(err, hash) {
        if (err) {
          return next(err);
        }
        user.password = hash;
        next();
      });
    });
  } else {
    return next();
  }
});


UserSchema.methods = {
  // Compare a entrada de senha com a senha salva no banco de dados
  comparePassword (pw, cb) {
    bcrypt.compare(pw, this.password, (err, isMatch) => {
      if (err) {
        return cb(err);
      }
      cb(null, isMatch);
    })
  }
};

export default UserSchema;
