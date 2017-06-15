import jwt from 'jsonwebtoken';
import config from '../../config/env';
import userRepository from '../user/repository';

async function login(req, res, next) {
    try {
        let data = await userRepository.find({ username: req.body.username, password: req.body.username });
        const token = jwt.sign({ username: data.username }, config.jwtSecret);
        
        return res.json({
            token,
            username: data.username
        });
    } catch (err) {
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
