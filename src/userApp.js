const express = require('express');
const mongoose = require('mongoose');
const { validate } = require('uuid');
var uuid = require('node-uuid');
const _ = require("lodash")
bodyParser = require('body-parser');


const app = express();
app.use(bodyParser.json());

// app.use(helmet());
// app.use(parser.json());
const port = process.env.Port || 3009;
const {userSchema_}=require('./repo/inputValidation')
//connect MDb
mongoose.connect("mongodb://localhost:27017/testDB");
//Schema creation
const hobby = new mongoose.Schema({
    type: String
})

const userSchema = new mongoose.Schema({
    _id: {
        type: String,
        default: uuid.v1

    },
    username: {
        type: String,
        required: true,
        maxlength: 50
    },
    age: {
        type: Number,
        required: true,
        maxlength: 50
    },
    hobbies: {
        type: [String],
        required: true,
        maxlength: 50
    }

})
//invoke Schema 
const userModel = mongoose.model("users", userSchema);
//fetch all users
app.get('/api/users', async (req, res) => {
    try {
        console.log("get all users");
        userModel.find({}).then((users) => {
            console.log(users)
            return res.status(200).json(users);;
        }).catch(function (error) {
            console.log(error)
            res.status(500)
                .json({
                    success: false,
                    message: "Internal server error"
                })
        })
    } catch (error) {
        return res.status(500)
            .json({
                success: false,
                message: "Internal server error"
            })
    }
});
//find user by id
app.get('/api/users/:userId', async (req, res) => {
    try {
        const id = req.params.userId;
        let data;
        console.log(id, validate(id))
        if (!validate(id)) {
            console.log("invalid user id")
            return res.status(400).json({ "message": "invalid user id" })
        } else {
            data = await userModel.find({ id: id });
            console.log(data.length, "userData")
            if (data.length < 1) return res.status(404).json("userId doesn't exist")
            else
                return res.status(200).json(data);
        }
    } catch (error) {
        return res.status(500)
            .json({
                success: false,
                message: "Internal server error"
            })
    }


});
//create user
app.post('/api/users', async (req, res) => {
    try {
        let payload = req.body
      console.log(payload)
      try{
        await userSchema_.validateAsync(payload);
      }catch(err){
       return res.status(400).json("request body does not contain required fields")
      }
        const data = await userModel.create({username:payload.username,age:payload.age,hobbies:payload.hobbies})
        console.log(data)
        return res.status(201).json(data);
    } catch (error) {
        console.log(error)
        return res.status(500)
            .json({
                success: false,
                message: "Internal server error"
            })
    }
});
//update user age
app.put('/api/users/:userId', async (req, res) => {
    try {
        const id = req.params.userId;
        let data;     
        const findID = {_id: req.params.userId };
        const updateAge = { age: req.body.age };
        console.log(id, validate(id))
        if (!validate(id)) {
            console.log("invalid user id")
            return res.status(400).json({ "message": "invalid user id" })
        } else {
            data = await userModel.findOneAndUpdate(findID,updateAge);
            console.log(data, "userData")
            if (data==null) return res.status(404).json("userId doesn't exist")
            else
                return res.status(200).json(data);
        }
    } catch (error) {
        return res.status(500)
            .json({
                success: false,
                message: "Internal server error"
            })
    }


});

//delete user by id
app.delete('/api/users/:userId', async (req, res) => {
    try {
        const id = req.params.userId;
        let data;     
        const findID = {_id: req.params.userId };
        const updateAge = { age: req.body.age };
        console.log(id, validate(id))
        if (!validate(id)) {
            console.log("invalid user id")
            return res.status(400).json({ "message": "invalid user id" })
        } else {
            data = await userModel.findOneAndDelete(findID,updateAge);
            console.log(data, "userData")
            if (data==null) return res.status(404).json("userId doesn't exist")
            else
                return res.status(204).json(data);
        }
    } catch (error) {
        return res.status(500)
            .json({
                success: false,
                message: "Internal server error"
            })
    }


});

//404 -not found
app.use(function (req, res) {
    res.status(404).json({ "404 Not found Error": req.url });
});
//3, 2, 1, go!
app.listen(port, () => {
    console.info(`Listening on port: ${port}`);
});

exports.module = { app };
