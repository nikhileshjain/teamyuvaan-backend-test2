const express = require('express');
const app = express();
const path = require('path');
const firestore = require('firebase/firestore');
const firebaseConfig = require('./firebaseConfig.js');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const uuid = require('uuid');
const fs = require('fs');
const ejs = require('ejs');
const mongoose = require('mongoose');
const USER = require('./models/users');
//----------------------------------------------------------------------------------------------

require('dotenv').config();

app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));
app.set('views', path.join(__dirname, 'views'));
app.use(express.static('public'));

//----------------------------------------------------------------------------------------------

const collectionRef = firestore.collection(firebaseConfig.database, 'users');
//---------------------------------------------------------------------------------------------
//using mongodb...

const URL = process.env.DB_URL || "mongodb://localhost:27017/yuvaan23";

const connectDB = async () => {
    try {
        mongoose.set('strictQuery', false);
        const conn = await mongoose.connect(URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            socketTimeoutMS: 60000,
            serverSelectionTimeoutMS: 5000 // 5 seconds

        })
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.log('Mongoose not connected!');
        console.log(error);
    }
  };

// mongoose.set('strictQuery', false);
// mongoose.connect(URL, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//     socketTimeoutMS: 60000,
// })
//     .then(res => {
//         console.log('Mongoose connected!');
//     })
//     .catch(e => {
//         console.log('Mongoose not connected!');
//         console.log(e);
//     })


//--------------------------------------------------------------------
let transporter = nodemailer.createTransport({
    service: 'Godaddy',
    host: "email.secureserver.net",  
    socketTimeoutMS: 60000,
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    },
    tls: {
        rejectUnauthorized: false
    }
});

const getId = () => {
    let str = '';
    for (let i = 0; i < 6; i++) {
        str = str + Math.floor(Math.random() * 9).toString();
    }
    return str;
}



app.get('/register', async (req, res) => {
    const response1 = await USER.findOneAndDelete({
        email: 'nikhil.sunam7@gmail.com',
      })
      console.log(response);

    const response2 = await USER.findOneAndDelete({
        email: 'pankajlahoti296@gmail.com',
      })
      console.log(response2);
    res.render('index');
});

app.post('/register', async (req, res) => {
    console.log(new Date().toLocaleString())
    //check if user already exist
    try {
        const response1 = await USER.find({ email: req.body.email });
        const response2 = await USER.find({ phone: req.body.phone });

        if ((response1.length !== 0) || (response2.length !== 0)) {
            return res.render('userExist');
        }
    }
    catch (e) {
        console.log(e);
    }


    // create and save user
    const data = req.body;
    data.fname = data.fname.toUpperCase();
    data.lname = data.lname.toUpperCase();

    const randomString = getId();
    data.userId = randomString;

    const user = new USER(data);
    try {
        await user.save();
    }
    catch (e) {
        console.log('cannot create user!');
        console.log(e);
    }


    //send mail
    const tempPath = path.join(__dirname, './views/yuvaanPass.ejs');
    const uniqueId = {
        final2: 'final2',
        footerFB: 'footerFB',
        footerINSTA: 'footerINSTA',
        footerIN: 'footerIN'
    }
    const yuvaanPass = await ejs.renderFile(tempPath, { data, uniqueId });

    let mailOptions = {
        from: process.env.EMAIL,
        to: req.body.email,
        subject: 'Yuvaan2023 Pass',
        html: yuvaanPass,
        attachments: [
            {
                filename: 'final2.png',
                path: './images/final2.png',
                cid: uniqueId.final2 //same cid value as in the html img src
            },
            {
                filename: 'footerFB.png',
                path: './images/footerFB.png',
                cid: uniqueId.footerFB
            },
            {
                filename: 'footerInsta.png',
                path: './images/footerInsta.png',
                cid: uniqueId.footerINSTA
            },
            {
                filename: 'footerIN.png',
                path: './images/footerIN.png',
                cid: uniqueId.footerIN
            },
        ]
    };

    try {
        const info = await transporter.sendMail(mailOptions);
    }
    catch (e) {
        console.log('cannot send mail');
        console.log(e);
    }
    console.log(new Date().toLocaleString())
    console.log("Email SENT succesfully!!!! to :" + req.body.email );
    res.render('success');
})


app.get('/check', async (req, res) => {
    const { API_KEY } = req.query;
    if (API_KEY === 'YUVAAN2K23') {
        return res.render('checkUser');
    }
    res.status(404).json();
})

app.post('/check', async (req, res) => {
    const { userId } = req.body;
    try {
        const data = await USER.findOne({ userId });
        if (data !== null) {
            return res.render('verified', { data })
        }
        res.render('notVerified');
    }
    catch (e) {
        console.log('cannot find!');
        console.log(e);
    }
})

app.get('/verified', async (req, res) => {
    const data = {
        userId: '318650',
        fname: 'PARTH',
        lname: 'TYAGI',
        email: 'parthtyagicode@gmail.com',
        phone: 234982479,
    }
    res.render('verified', { data });
})


PORT= process.env.PORT || 3000
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log("listening for requests");
    })
})