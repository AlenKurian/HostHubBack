const Users = require('../models/userModel')
const jwt = require('jsonwebtoken')

// user registration
exports.userRegister = async (req, res) => {
    console.log('Inside Register method')
    console.log(req.body);
    const {username, email, password, role} = req.body
    try {
        const existingUser = await Users.findOne({ email })
        if (existingUser) {
            res.status(402).json({message:'User already existing...'})
        }
        else {
            const newUser = new Users({ username, email, password, role })
            await newUser.save()
            res.status(200).json({message:'Register Successfull',newUser})
        }
    }
    catch (err) {
        res.status(500).json('Server Err'+err)
    }
}

// user login
exports.userLogin = async (req, res) => {
    console.log('Inside Login method')
    console.log(req.body);
    const { email, password } = req.body
    try {
        const existingUser = await Users.findOne({ email })
        if (existingUser) {
            if (existingUser.password == password) {

                // token generation
                const token = jwt.sign({ userId: existingUser._id, userMail: existingUser.email, role: existingUser.role }, process.env.jwtKey)
                console.log(token);
                // token sent to client
                res.status(200).json({
                    message: 'Login Successfull', token, existingUser: {
                        _id: existingUser._id,
                        username: existingUser.username,
                        email: existingUser.email,
                        role: existingUser.role
                }})
            }
            else {
                res.status(401).json('Password Mismatch!')
            }
        }
        else {
            res.status(401).json('user not found!')
        }
    }
    catch (err) {
        res.status(500).json('Server Err'+err)
    }
}

// google login
exports.googleLogin = async (req, res) => {
    console.log("Inside google login method")
    console.log(req.body);
    const { username, email, password, photo, role } = req.body
    try {
        const existingUser = await Users.findOne({ email })
        if (existingUser) {
            // token generation
            const token = jwt.sign({ userMail: existingUser.email, role: existingUser.role }, process.env.jwtKey)
            console.log(token);
            // token sent to client
            res.status(200).json({ existingUser, token })
        }
        else {
            const newUser = new Users({ username, email, password, profile: photo, role: role })
            await newUser.save()
            // token generation
            const token = jwt.sign({ userId: newUser._id, userMail: newUser.email, role: newUser.role }, process.env.jwtKey)
            console.log(token);
            // token sent to client
            res.status(200).json({ existingUser: newUser, token })
        }
    } catch (err) {
        res.status(500).json("Server Err" + err)
    }
}