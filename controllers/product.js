const express = require('express');

const defaults = require('../src/defaults');
const ProductModel = require('../models').Product;
const upload = require('../src/upload');

const router = express.Router();


router.get('/cities/:city', (req, res) => {
    console.log('GET /products/cities/:city');
    ProductModel
        .find({ city: req.params.city }, (err, products) => {
            const user = req.user || {};
            const paramsTpl = {
                user: user,
                isAuthenticated: req.isAuthenticated(),
                isAdmin: user.role === 'admin',
                page: defaults.page,
                stylesheets: defaults.stylesheets,
                scripts: defaults.scripts,
                isProductsPage: true
            };
            if (err !== null) {
                paramsTpl.isError = true;
                paramsTpl.errorMessage = err.toString();
                console.log('GET /products/cities/:city paramsTpl', paramsTpl);
                res.render('error/500', paramsTpl);
                return;
            }
            const productsWithDate = products.map((product) => {
                const newProduct = product;
                const date = product.created.toLocaleString('default', { weekday: 'long' }) + ' ' + product.created.getDate() + ' ' + product.created.toLocaleString('default', { month: 'long' });
                newProduct.date = date;
                return newProduct;
            });
            paramsTpl.products = productsWithDate;
            console.log('GET /products/cities/:city paramsTpl', paramsTpl);
            res.render('product/list', paramsTpl);
        });
});

router.get('/:id', (req, res) => {
    console.log('GET /products/:id');
    const productId = req.params.id;
    ProductModel
        .findById(productId, (err, product) => {
            const user = req.user || {};
            const paramsTpl = {
                user: user,
                isAuthenticated: req.isAuthenticated(),
                isAdmin: user.role === 'admin',
                page: defaults.page,
                stylesheets: defaults.stylesheets,
                scripts: defaults.scripts,
                isProductsPage: true
            };
            if (err !== null) {
                paramsTpl.isError = true;
                paramsTpl.errorMessage = err.toString();
                console.log('GET /products/:id paramsTpl', paramsTpl);
                res.render('error/500', paramsTpl);
                return;
            }
            // if we cannot find this id
            if (product.toObject().hasOwnProperty('_id') === false) {
                paramsTpl.isError = true;
                paramsTpl.errorMessage = 'Product ID not found [' + productId + ']';
                console.log('GET /products/:id paramsTpl', paramsTpl);
                res.render('error/404', paramsTpl);
                return;
            }
            paramsTpl.product = product;
            console.log('GET /products/:id paramsTpl', paramsTpl);
            res.render('product/single', paramsTpl);
        });
});

router.post('/', upload.uploader.array('pictures'), (req, res) => {
    console.log('POST /products');
    // console.log('req.body', req.body);
    console.log('req.files', req.files); // req.fileS with an S, because of the upload.array middleware

    const name = req.body.name;
    const price = req.body.price;
    const city = req.body.city;
    const description = req.body.description;

    const user = req.user || {};
    const paramsTpl = {
        user: user,
        isAuthenticated: req.isAuthenticated(),
        isAdmin: user.role === 'admin',
        page: defaults.page,
        stylesheets: defaults.stylesheets,
        scripts: defaults.scripts
    };

    upload.renameFiles(req.files, (err, pictures) => {
        if (err !== null) {
            paramsTpl.isError = true;
            paramsTpl.errorMessage = err.toString();
            console.log('POST /products save product paramsTpl', paramsTpl);
            return;
        }
        const product = new ProductModel({
            name: name,
            price: price,
            city: city,
            description: description,
            pictures: pictures
        });

        product.save((err, productDb) => {
            console.log('err', err);
            console.log('POST /products productDb', productDb);
            if (err !== null) {
                paramsTpl.isError = true;
                paramsTpl.errorMessage = err.toString();
                console.log('POST /products save product paramsTpl', paramsTpl);
                res.render('error/500', paramsTpl);
                return;
            }
            // redirect to the newly created product
            const redirectUrl = '/products/' + productDb._id;
            console.log('REDIRECT!!! ' + redirectUrl);
            res.redirect(redirectUrl);
            // process.exit();
        });
    });
});

module.exports = router;