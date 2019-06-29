

var express = require('express')
var app = express()
app.set("view engine", "ejs")
app.use(express.static('public'))
var fs = require('fs')
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/newdb', { useNewUrlParser: true });
var session = require('express-session')
var _ = require("lodash")
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
const crypto = require('crypto');

var bodyParser = require("body-parser")
// var jsonParser = bodyParser.json()
var urlencodedParser = bodyParser.urlencoded({ extended: false })

app.use(session({ secret: 'keyboard cat', cookie: { maxAge: 1160000 } }))

const secret = 'abcdefg';
const UserSchema = new Schema({
    email: {
        type: String,
        unique: true
    },
    password: String
});


const addSchema = new Schema({
    postedby: {
        type: String,
    //    unique: true
    },
    name:String,
    sno:Number,
    phonenumber: Number
});


const User = mongoose.model('User', UserSchema);
const add = mongoose.model('add', addSchema);

app.get('/login', (req, res) => {
    res.render("index")
})
app.get('/404', (req, res) => {
    res.send("404 error")
})

app.post('/login', urlencodedParser, (req, res) => {
    switch (req.body.action) {
        case 'signup':
            User.findOne({ email: req.body.email }, function (err, doc) {
                if (err) {
                    console.log(err, 'error')
                    res.redirect('/')
                    return
                }
                if (_.isEmpty(doc)) {
                    let newUser = new User();
                    newUser.email = req.body.email;
                    newUser.password = req.body.password;
                    newUser.save(function (err) {
                        if (err) {
                            console.log(err, 'error')
                            return
                        }
                        res.render('index', { message: "Sign Up Successful. Please log in." })
                    });

                } else {
                    res.render('index', { message: "User already exists" })
                }
            })
            break;
        case 'login':
            User.findOne({ email: req.body.email, password: req.body.password }, function (err, doc) {
                if (err) {
                    console.log(err, 'error')
                    res.redirect('/')
                    return
                }
                if (_.isEmpty(doc)) {
                    res.render('index', { message: "Please check email/password" })
                } else {
                    req.session.user = doc
                    res.redirect('/user')
                }
            })
            break;
    }

})


const checkLogIn = (req, res, next) => {
    if (req.session.user) {
        next();
    } else {
        res.redirect('/404')
    }
}
app.get('/', (req, res) => {
   /* let newadd = new add();
    newadd.name = "sam3";
    newadd.sno = 3;
    newadd.phonenumber="3"
    newadd.postedby="sam#3"
    newadd.save(function (err) {
        if (err) {
            console.log(err, 'error')
            return
        }*/
        add.find({}, function (err, doc) {
            if (err) {
                console.log(err, 'error')
                res.redirect('/404')
                return
            }
            else
            {
    
                    res.render('main',{add:doc})
    
            }
   // });
    });



})


app.get('/user', checkLogIn, (req, res) => {
    res.render('user', { user: req.session.user })
})


app.post('/user', checkLogIn, (req, res) => {
    res.redirect("/login")
})
app.listen(3000, () => {
    console.log("Server is running")
})


