const express = require('express');
const passport = require('passport');

const router = express.Router();
const defaults = require('../src/defaults');
const upload = require('../src/upload');
const UserModel = require('../models').User;
const MessageModel = require('../models').Message;


const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated() === true) {
        next();
    } else {
        res.redirect('/');
    }
};

router.get('/profile', isAuthenticated, function (req, res) {
    console.log('GET /profile');
    const user = req.user || {};
    MessageModel
        .find({ user: user._id })
        .populate('user')
        .populate('product')
        .exec((err, messageDb) => {
            const paramsTpl = {
                user: user,
                isAuthenticated: req.isAuthenticated(),
                isAdmin: user.role === 'admin',
                page: defaults.page,
                scripts: defaults.scripts,
                stylesheets: defaults.stylesheets,
                isProfilePage: true
            };
            if (err !== null) {
                paramsTpl.isError = true;
                paramsTpl.errorMessage = err.toString();

                console.log('GET /profile paramsTpl', paramsTpl);
                res.render('error/500', paramsTpl);
                return;
            }
            paramsTpl.messages = messageDb;
            console.log('GET /profile paramsTpl', paramsTpl);
            res.render('auth/profile', paramsTpl);
        });
});

router.get('/signup', function (req, res) {
    console.log('GET /signup');
    if (req.isAuthenticated() === true) {
        if (req.user.role === 'admin') {
            res.redirect('/admin');
        } else {
            res.redirect('/profile');
        }
    } else {
        const user = req.user || {};
        const paramsTpl = {
            user: user,
            isAuthenticated: req.isAuthenticated(),
            isAdmin: user.role === 'admin',
            page: defaults.page,
            scripts: defaults.scripts,
            stylesheets: defaults.stylesheets,
            isSignupPage: true
        };
        console.log('GET /signup paramsTpl', paramsTpl);
        res.render("auth/signup", paramsTpl);
    }
});

router.post("/signup", upload.uploader.single('picture'), function (req, res) {
    console.log("POST /signup");

    const username = req.body.username;
    const password = req.body.password;
    const firstName = req.body.firstName;
    const surname = req.body.surname;

    const user = req.user || {};
    const paramsTpl = {
        user: user,
        isAuthenticated: req.isAuthenticated(),
        isAdmin: user.role === 'admin',
        page: defaults.page,
        scripts: defaults.scripts,
        stylesheets: defaults.stylesheets,
        isSignupPage: true
    };

    upload.renameFile(req.file, (err, picture) => {
        if (err !== null) {
            paramsTpl.isError = true;
            paramsTpl.errorMessage = err.toString();
            console.log('POST /signup paramsTpl', paramsTpl);
            return res.render("auth/signup", paramsTpl);
        }
        UserModel.register(
            new UserModel({
                username: username,
                picture: picture,
                firstName: firstName,
                surname: surname
            }),
            password, // password will be hashed
            (err, user) => {
                if (err !== null) {
                    console.log("/signup user register err", err);
                    paramsTpl.isError = true;
                    paramsTpl.errorMessage = err.toString();
                    console.log('POST /signup paramsTpl', paramsTpl);
                    return res.render("auth/signup", paramsTpl);
                } else {
                    passport.authenticate("local")(req, res, function () {
                        res.redirect("/admin");
                    });
                }
            }
        );
    });
});

router.get("/login", function (req, res) {
    console.log('GET /login');
    if (req.isAuthenticated()) {
        res.redirect("/profile");
    } else {
        const user = req.user || {};
        const paramsTpl = {
            user: user,
            isAuthenticated: req.isAuthenticated(),
            isAdmin: user.role === 'admin',
            page: defaults.page,
            scripts: defaults.scripts,
            stylesheets: defaults.stylesheets,
            isLoginPage: true
        };
        console.log('GET /login paramsTpl', paramsTpl);
        res.render("auth/login", paramsTpl);
    }
});

router.post(
    "/login",
    passport.authenticate("local", {
        successRedirect: "/profile",
        failureRedirect: "/login"
    })
);

router.get("/logout", function (req, res) {
    console.log("GET /logout");
    req.logout();
    res.redirect("/");
});

router.get('/toadmin', (req, res) => {
    console.log('GET /toadmin');
    if (Object.keys(req.user).length === 0) {
        return;
    }
    UserModel.updateOne({
        _id: req.user._id
    }, {
        role: 'admin'
    }, (err) => {
        if (err !== null) {
            console.log('User could not be updated to admin');
            return;
        }
        console.log('User updated to admin');
    });
    res.redirect('/');
});

router.get('/deletedb', (req, res) => {
    console.log('GET /deletedb');
    const UserModel = require('../models').User;
    const MessageModel = require('../models').Message;
    const ProductModel = require('../models').Product;

    UserModel.collection.drop();
    MessageModel.collection.drop();
    ProductModel.collection.drop();

    res.json({
        success: true
    });
});


module.exports = router;