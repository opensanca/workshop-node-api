import jwt from 'jsonwebtoken';
import config from '../../config/env';
import User from '../user/repository';
import APIError from '../../helpers/APIError';
import httpStatus from 'http-status';



async function login(req, res, next) {
    try {
        const data = await User.findOne({ username: req.body.username });
        if (data) {
            data.comparePassword(req.body.password, function(err, isMatch) {
                if (isMatch && !err) {
                    // Create token if the password matched and no error was thrown
                    const token = jwt.sign({ username: data.username }, config.jwtSecret, {
                        expiresIn: "2 days"
                    });
                    return res.json({
                        token,
                        username: data.username
                    });
                } else {
                    res.send({
                        success: false,
                        message: 'Authentication failed. Passwords did not match.'
                    });
                }
            });
        } else {
            res.send({
                success: false,
                message: 'Authentication failed. User not found.'
            });
        }
    } catch (err) {
        const errMsg = new APIError('Authentication error', httpStatus.UNAUTHORIZED, true);
        next(err);
    }
}

function getRandomNumber(req, res) {
  return res.json({
    user: req.user,
    num: Math.random() * 100
  });
}


export default { login, getRandomNumber };
