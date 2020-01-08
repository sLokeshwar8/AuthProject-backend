const express = require('express'); //import express 
const router = express.Router(); 
const mongoose = require('mongoose');  //import mongoose 
var ObjectId = require('mongodb').ObjectID
const User = require('../models/user');
const Event = require('../models/event');
const jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var Database;
const database = "mongodb+srv://lokeshwar:Mactavish@cluster0-k6fec.mongodb.net/test?retryWrites=true&w=majority"

mongoose.connect(database,{ keepAlive: true,
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false }, (err,db) =>{
   Database = db
   
    if(err){
        console.error('[Error-loki]',err);
    }else{
        console.log("Connected to mongoDB");
    }
})
// verify token
function verifyToken(req, res, next){

    if(!req.headers.authorization){
       return res.status(401).send("Unauthorized request_1");
    }
    let token = req.headers.authorization.split(' ')[1];
    if(token === 'null'){
        return res.status(401).send("Unauthorized request_2");
    }
    let payload = jwt.verify(token, 'secretKey');
    if(!payload){
        return res.status(401).send("Unauthorized request_3");
    }
    req.userId = payload.subject
    next()

}


router.get('/',(req,res) => {
    res.send("From API Route")
})

router.post('/register',(req,res) => {
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(req.body.password, salt, function(err, hash) {
            // Store hash in your password DB.
            let userData = { 
                email: req.body.email, 
                password: hash
            }
            const user = new User(userData);
            user.save((error,registeredUser) => {
                if(error){
                    console.log(error)
                }else{
                    console.log('success')
                    let payload = {subject : registeredUser._id};
                    let token = jwt.sign(payload,'secretKey');
                    res.status(200).send({token})
                }
            })
        });
    });
})

router.post('/login',(req,res) => {
    let userData = req.body;

    console.log(res)
    User.findOne({email:userData.email}, (error, user) =>{
        if(error){
            console.log(error)
        }else{
            if(!user){
                res.status(404).send("Invalid Email");
            }else{
                console.log("else block")
                bcrypt.compare(req.body.password, user.password, function(err, result) {
                    console.log(result)
                    if(result === true){
                        let payload = { subject: user._id }
                        let token = jwt.sign(payload,'secretKey')
                        res.status(200).send({token})
                    }else{
                        res.status(404).send("Invaild Password")
                    }
                });
            }
        }
    })
})

router.get('/events',(req,res) => {
    Database.collection('newEvent').find()
    .toArray((err, results) => {
        if(err) throw err;
        res.json(results)
    })

   
})

router.get('/special',verifyToken,(req,res) => {

    events = [
        {
            "_id":"1",
            "name" : "Auto Expo",
            "description" : "test des",
            "date" : "Wed Nov 13 2019 09:11:04 GMT+0530 (India Standard Time)"
        },
        {
            "_id":"2",
            "name" : "Auto Expo2",
            "description" : "test des2",
            "date" : "Wed Nov 14 2019 09:11:04 GMT+0530 (India Standard Time)"
        }   
    ]

    res.json(events)
})

router.post('/saveNewEvent',(req,res) => {
    let EventData = {
        activityName : req.body.activityName,
        amount: req.body.amount,
        dateEvent: req.body.dateEvent.formatted,
        description: req.body.description,
        location: req.body.location,
        imageUrl: req.body.imageUrl

    };
    const event = new Event(EventData);
    event.save((error, savedEvent) => {
        if(error){
            console.log(error);
        }else{
            console.log('success');
            res.status(200).send(savedEvent)
        }
    })
    


})

router.put('/updateEvent/:id', (req,res,next) =>{
    const id = req.params.id;
    console.log(id);
    Event.findByIdAndUpdate(new ObjectId(id),req.body,{new: true}, (err,doc) => {
        if(err){
            console.log(err.message);
        }
        Event.findOne(new ObjectId(id),(err,doc)=>{
            console.log(doc)
        })
        res.status(200).send(doc)

    })

})

router.put('/getEvent/:id', (req, res) =>{
    const id = req.params.id;
    console.log(id);
    Event.findByIdAndUpdate(new ObjectId(id),req.body,{new: true}, (err,doc) => {
        if(err){
            console.log(err.message);
        }
        Event.findOne(new ObjectId(id),(err,doc)=>{
            console.log(doc)
        })
        res.status(200).send(doc)

    })
});

module.exports = router;

