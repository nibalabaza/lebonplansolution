const express = require('express');
const router = express.Router();

const defaults = require('../src/defaults');

const isAdmin = (req, res, next) => {
    if (
        req.isAuthenticated() === true &&
        req.user.role === 'admin'
    ) {
        next();
    } else {
        res.redirect('/');
    }
};

router.get('/', isAdmin, function (req, res) {
    console.log('GET /admin');
    const user = req.user || {};
    const paramsTpl = {
        user: user,
        isAuthenticated: req.isAuthenticated(),
        isAdmin: user.role === 'admin',
        page: defaults.page,
        scripts: defaults.scripts,
        stylesheets: defaults.stylesheets,
        isAdminPage: true
    };
    console.log('GET /admin paramsTpl', paramsTpl);
    res.render('admin/home', paramsTpl);
});

// Old example, without the middleware isAdmin
// router.get('/admin', function (req, res) {
//     console.log("GET /admin");
//     if (req.isAuthenticated() && req.user.role === 'admin') {
//         const user = req.user || {};
//         const paramsTpl = {
//             user: user,
//             isAuthenticated: req.isAuthenticated(),
//             isAdmin: user.role === 'admin',
//             page: defaults.page,
//             scripts: defaults.scripts,
//             stylesheets: defaults.stylesheets,
//             isAdminPage: true
//         };
//         console.log('GET /admin paramsTpl', paramsTpl);
//         res.render("admin", paramsTpl);
//     } else {
//         res.redirect("/");
//     }
// });

router.get('/products/add', (req, res) => {
    console.log('GET /admin/products/add');
    const user = req.user || {};
    const paramsTpl = {
        user: user,
        isAuthenticated: req.isAuthenticated(),
        isAdmin: user.role === 'admin',
        page: defaults.page,
        scripts: defaults.scripts,
        stylesheets: defaults.stylesheets,
        isAdminPage: true
    };
    console.log('GET /admin/products/add paramsTpl', paramsTpl);
    res.render('admin/addproduct', paramsTpl);
});

module.exports = router;