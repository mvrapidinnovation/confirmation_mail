const router = require('express').Router();
const User = require('../models/User');

const { registerValidation, loginValidation } = require('../validation');

router.post('/register', async (req, res) => {

    // Validate the data
    const { error } = registerValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    // Check if user is already in DB
    const emailExist = await User.findOne({ email: req.body.email });
    if(emailExist) return res.status(400).send('Email already exists');

    // Create a new user
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    });

    try {
        const saveUser = await user.save();
        res.send(saveUser);
    } catch(err) {
        res.status(400).send(err);
    }
});

// router.post('/login')

module.exports = router;