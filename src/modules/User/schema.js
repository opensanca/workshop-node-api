import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import httpStatus from 'http-status';
import APIError from '../../helpers/APIError';

const userSchema = mongoose.Schema({
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

userSchema.statics = { 
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

// Hash the user's password before inserting a new user
userSchema.pre('save', function(next) {
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


userSchema.methods = {
  // Compare password input to password saved in database
  comparePassword (pw, cb) {
    bcrypt.compare(pw, this.password, (err, isMatch) => {
      if (err) {
        return cb(err);
      }
      cb(null, isMatch);
    })
  }
};

export default userSchema;
