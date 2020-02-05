require('dotenv').config();
const express = require('express');
const exphbs = require('express-handlebars');
const expressSession = require('express-session');
const MongoStore = require('connect-mongo')(expressSession);
const mongoose = require('mongoose');
const passport = require('passport');
const bodyParser = require('body-parser');
const LocalStrategy = require('passport-local');

const User = require('./models').User;
const authController = require('./controllers').auth;
const adminController = require('./controllers').admin;
const productController = require('./controllers').product;
const messageController = require('./controllers').message;
const defaults = require('./src/defaults');

var port = process.env.PORT || 3000;

var app = express();

console.log("process.env.MONGODB_URI", process.env.MONGODB_URI);

// DB configuration
mongoose.connect(
    process.env.MONGODB_URI ||
    "mongodb://localhost:27017/lebonplan",
    {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true
    },
    (err) => {
        if (err !== null) {
            console.log('DB connection error err', err);
            return;
        }
        console.log('DB connected');
    }
);

// Express configuration
app.use(express.static('public'));
app.engine("handlebars", exphbs());
app.set("view engine", "handlebars");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// enable session management
app.use(
    expressSession({
        secret: "konexioasso07",
        resave: false,
        saveUninitialized: false,
        store: new MongoStore({ mongooseConnection: mongoose.connection })
    })
);

// enable passport
app.use(passport.initialize());
app.use(passport.session());

// Passport configuration
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser()); // Save the user.id to the session
passport.deserializeUser(User.deserializeUser()); // Receive the user.id from the session and fetch the User from the DB by its ID

app.get('/', (req, res) => {
    console.log('GET /');
    const user = req.user || {};
    const scripts = defaults.scripts;
    const paramsTpl = {
        user: user,
        isAuthenticated: req.isAuthenticated(),
        isAdmin: user.role === 'admin',
        stylesheets: defaults.stylesheets,
        scripts: scripts,
        page: defaults.page,
        isHomePage: true
    };
    console.log('GET / paramsTpl', paramsTpl);
    res.render('home', paramsTpl);
});

app.use('/', authController);
app.use('/admin', adminController);
app.use('/products', productController);
app.use('/messages', messageController);

app.all('*', (req, res) => {
    if (req.url !== '/favicon.ico') {
        console.log('---');
        console.log('Route not found');
        console.log('Route method:', req.method);
        console.log('Route url:', req.url);
        console.log('---');
        process.exit();
        return;
    }
    const user = req.user || {};
    const paramsTpl = {
        stylesheets: defaults.stylesheets,
        scripts: defaults.scripts,
        page: defaults.page,
        user: user,
        isAuthenticated: req.isAuthenticated(),
        isAdmin: user.role === 'admin',
        isErrorPage: true
    };
    res.render('error/404', paramsTpl);
});

app.listen(port, () => {
    console.log('Server started on port', port);
});