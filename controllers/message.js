const express = require('express');

const defaults = require('../src/defaults');
const MessageModel = require('../models').Message;

const router = express.Router();


router.get('/products/:productId', (req, res) => {
    console.log('GET /messages/products/:productId');
    const user = req.user || {};
    const paramsTpl = {
        user: user,
        isAuthenticated: req.isAuthenticated(),
        isAdmin: user.role === 'admin',
        page: defaults.page,
        stylesheets: defaults.stylesheets,
        scripts: defaults.scripts,
        productId: req.params.productId
    };
    console.log('GET /messages/products/:productId paramsTpl', paramsTpl);
    res.render('message', paramsTpl);
});

router.post('/', (req, res) => {
    console.log('POST /messages');

    const content = req.body.content;
    const product = req.body.product; // product ID in a hidden input
    const user = req.body.user; // user ID in a hidden input

    const message = new MessageModel({
        content: content,
        product: product,
        user: user
    });

    message.save((err, messageDb) => {
        if (err !== null) {
            const userParams = req.user || {};
            const paramsTpl = {
                user: userParams,
                isAuthenticated: req.isAuthenticated(),
                isAdmin: userParams.role === 'admin',
                page: defaults.page,
                stylesheets: defaults.stylesheets,
                scripts: defaults.scripts
            };
            paramsTpl.isError = true;
            paramsTpl.errorMessage = err.toString();
            console.log('POST /message save message paramsTpl', paramsTpl);
            res.render('error/500', paramsTpl);
            return;
        }
        // redirect to the product we come from
        res.redirect('/products/' + product);
    });
});

module.exports = router;