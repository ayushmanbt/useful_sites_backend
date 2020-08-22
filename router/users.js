const express = require('express');
const bcrypt = require('bcryptjs');
const Users = require('../model/UserModel');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const authEmailPassword = require('../middleware/authEmailPassword');
//some secrets 
const JWT_SECRET = process.env.JWT_SECRET;
const REFRESH_SECRET = process.env.REFRESH_SECRET;

const userRouter = express.Router();

userRouter.post("/signup", (req, res) => {
    const {email, password} = req.body;

    if(email == undefined || password == undefined) return res.send(400).json({message: "Email & password both are required"})

    const newUser = new Users({
        email,
        password
    })

    newUser.save()
        .then(newUser => {
            res.status(201).json({user: newUser})
        })
        .catch(error => {
            res.status(500).json({message: "Something went wrong", error})
        })
});

userRouter.post("/login",async(req, res) => {
    const {email, password} = req.body;

    if(email == undefined || password == undefined) return res.status(400).json({message: "Email & password both are required"})

    try {
        const user = await Users.findOne({email})
        if(user === null) return res.status(404).json({message: "User not found"})
        else{
            let comparison = bcrypt.compareSync(password, user.password)
            if(comparison){
                const userID = {id: user._id}
                const access_token = jwt.sign(userID, JWT_SECRET, {expiresIn: "1hr"});
                const refresh_token = jwt.sign(userID, REFRESH_SECRET, {expiresIn: "1d"});
                res.cookie('refresh', refresh_token, {
                    httpOnly: true,
                })
                return res.json({message: "SignIN successful", accessToken: access_token})
            }
            return res.status(404).json({message: "User not found"});
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: "Something went wrong!"});
    }
})

userRouter.get('/super_secret', authEmailPassword, (req, res)=> {
    res.json({message: "Passed", id: req.userID});
});

userRouter.post('/refres_login', (req, res) => {
    const refreshToken = req.cookies.refresh;
    if(refreshToken === undefined) return res.status(401).json({message: "No refresh token found, re-veify user"});

    try {
        const userID = jwt.verify(refreshToken, REFRESH_SECRET).id;
        const access_token = jwt.sign({id: userID}, JWT_SECRET, {expiresIn: "1hr"});
        return res.json({message: "SignIN successful", accessToken: access_token})
    } catch (error) {
        console.log(error);
        return res.status(401).json({message: "Invalid refresh token sent"});
    }
})

module.exports = userRouter