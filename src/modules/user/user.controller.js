import User from './user.repository';
import APIError from '../../helpers/APIError';
import httpStatus from 'http-status';

async function list(req, res, next) {
    try {
        const { limit = 50, skip = 0 } = req.query;
        let data = await User.list({ limit, skip });
        res.json({success: true, data});
    } catch (err) {
        next(err);
    }
}
/*
function list(req, res, next) {
  const { limit = 50, skip = 0 } = req.query;
  User.list({ limit, skip })
    .then(users => res.json(users))
    .catch(e => next(e));
}
*/

async function get(req, res, next) {
  try {
        let data = await User.get(req.params.userId);
        res.json({ data });
    } catch (err) {
        const err = new APIError('Nenhum usuário encontrado!', httpStatus.NOT_FOUND);
        next(err);
    }
}

async function create(req, res, next) {
    try {
        const user = new User({
            username: req.body.username,
            password: req.body.password,
        });
        let data = await user.save();
        res.json({success: true, data});
    } catch (err) {
        next(err);
    }
}

async function update(req, res, next) {
    const user = await User.get(req.params.userId);
    user.username = req.body.username;
    user.password = req.body.password;

    try {
        let data = await user.save();
        res.json({success: true, data});
    } catch (err) {
        next(err);
    }
}

async function remove(req, res, next) {
    try {
        const user = await User.get(req.params.userId);
        let data = await user.remove();
        res.json({success: true, data});
    } catch (err) {
        next(err);
    }
}

export default { list, get, create, update, remove };
