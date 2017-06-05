'use strict';
const jwt = require('jsonwebtoken');
const config = require('../../config/env');
let User = require('../User/repository');

/**
 * Returns jwt token if valid username and password is provided
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
async function login(req, res, next) {
    try {
        let data = await User.find({ username: req.body.username, password: req.body.username });
        const token = jwt.sign({ username: data.username }, config.jwtSecret);
        
        return res.json({
            token,
            username: data.username
        });
    } catch (err) {
        next(err);
    }
}

/**
 * This is a protected route. Will return random number only if jwt token is provided in header.
 * @param req
 * @param res
 * @returns {*}
 */
function getRandomNumber(req, res) {
  // req.user is assigned by jwt middleware if valid token is provided
  return res.json({
    user: req.user,
    num: Math.random() * 100
  });
}


export { login, getRandomNumber };
