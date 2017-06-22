import jwt from 'jsonwebtoken';
import config from '../../config/env';
import User from '../user/user.repository';
import APIError from '../../helpers/APIError';
import httpStatus from 'http-status';

async function login(req, res, next) {
    try {
        const data = await User.findOne({ username: req.body.username });
        if (!data) {
            return res.send({
                success: false,
                message: 'Falha na autenticação. Usuário não encontrado.'
            });
        }

        if (data.password != req.body.password) {
            res.send({
                success: false,
                message: 'Falha na autenticação. Senhas não conferem.'
            });
        }

        if (data.password == req.body.password) {
            // Criar token se a senha corresponder e nenhum erro foi encontrado
            const token = jwt.sign({ username: data.username }, config.jwtSecret, {
                expiresIn: "2 days"
            });
            return res.json({
                token,
                username: data.username
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
