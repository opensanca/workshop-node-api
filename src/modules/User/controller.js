import userRepository from './repository';

async function list(req, res, next) {
    try {
        const { limit = 50, skip = 0 } = req.query;
        let data = await userRepository.list({ limit, skip });
        res.json({success: true, data});
    } catch (err) {
        next(err);
    }
}

async function get(req, res, next) {
  try {
        let data = await userRepository.get(req.params.userId);
        res.json({ data });
    } catch (err) {
        next(err);
    }
}

async function load(req, res, next, id) {
    try {
        let data = await userRepository.get(id);
        res.json({success: true, data});
    } catch (err) {
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
    const user = await userRepository.get(req.params.userId);
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
        const user = await userRepository.get(req.params.userId);
        let data = await user.remove();
        res.json({success: true, data});
    } catch (err) {
        next(err);
    }
}

export default { load, list, get, create, update, remove };
