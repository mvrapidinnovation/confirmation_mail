const router = require('express').Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { registerValidation, loginValidation } = require('../validation');

router.post('/register', async (req, res) => {

    // Validate the data
    const { error } = registerValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    // Check if user is already in DB
    const emailExist = await User.findOne({ email: req.body.email });
    if(emailExist) return res.status(400).send('Email already exists');

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // Create a new user
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
    });

    try {
        const saveUser = await user.save();
        res.send({ user: user._id });
    } catch(err) {
        res.status(400).send(err);
    }
});

router.post('/login', async (req, res) => {
    // Validate the data
    const { error } = loginValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    
    // Check if user is already in DB
    const user = await User.findOne({ email: req.body.email });
    if(!user) return res.status(400).send('Email or Password is wrong');

    // Check if password is correct
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if(!validPass) return res.status(400).send("Invalid Password");

    // Create and sign a token
    const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
    res.header('auth-token', token).send(token);
});

module.exports = router;