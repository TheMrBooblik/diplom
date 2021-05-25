const config = require("../config/default");
const { Router } = require("express");
const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const router = Router();

router.post('/register',
    [
        check('username', 'Incorrect username')
            .not().isEmpty().trim().escape(),
        check('pwd', 'Minimal length is 6 symbols')
            .isLength({ min: 6 })
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: 'Incorrect login/password'
                })
            }

            const { username, pwd } = req.body;

            const applicant = await User.findOne({ username });

            if (applicant) {
                res.status(400).json({
                    errors: [],
                    message: 'Username already exists'
                })
            }

            const hashedPwd = await bcrypt.hash(pwd, 12);
            const user = new User({ username, pwd: hashedPwd, role: 'admin' });

            await user.save();
            res.status(201).json({ message: 'User was created' })
        } catch (e) {
            console.log(e)
            res.status(500).json({ message: 'Something goes wrong...' })
        }
    })

router.post('/login', [
        check('username', 'Incorrect username'),
        check('pwd', 'Minimal length is 6 symbols')
            .isLength({ min: 6 })
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return res.status((400).json({
                    errors: errors.array(),
                    message: 'Incorrect login/password'
                }))
            }

            const { username, pwd } = req.body;

            const user = await User.findOne({ username });

            if (!user) {
                res.status(404).json({ message: 'User with this username not found' })
            }

            const isPwdMatch = await bcrypt.compare(pwd, user.pwd);

            if (isPwdMatch) {
                res.status(404).json({ message: 'Password is incorrect' })
            }

            const token = jwt.sign(
                { userId: user.id },
                config.JWT_SECRET,
                { expiresIn: '1h' },
            )

            res.json({ token, userId: user.id, userRole: user.role });

        } catch (e) {
            res.status(500).json({ message: 'Something goes wrong...' })
        }
    })

module.exports = router;