var express = require('express'),
    router = express.Router(),
    logger = require('../../config/logger'),
    async = require('async'),
    mongoose = require('mongoose'),
    Product = mongoose.model('Product'),
    asyncHandler = require('express-async-handler'),
    multer = require('multer'),
    mkdirp = require('mkdirp'),
    passportService = require('../../config/passport'),
    passport = require('passport');

var requireLogin = passport.authenticate('local', { session: false });
var requireAuth = passport.authenticate('jwt', { session: false });

module.exports = function (app, config) {
    app.use('/api', router);

    router.get('/products', requireAuth, asyncHandler(async (req, res) => {
        logger.log('info', 'Get all products');
        let query = Product.find();
        query.sort(req.query.order)
        await query.exec().then(result => {
            res.status(200).json(result);
        })
    }));

    router.get('/products/:id', requireAuth, asyncHandler(async (req, res) => {
        logger.log('info', 'Get product %s', req.params.id);
        await Product.findById(req.params.id).then(result => {
            res.status(200).json(result);
        })
    }));

    router.post('/products', requireAuth, asyncHandler(async (req, res) => {
        logger.log('info', 'Creating product');
        var product = new Product(req.body.Product);
        await product.save()
        .then(result => {
            res.status(201).json({imageID: image._id});
        })
    }));

    router.put('/products', requireAuth, asyncHandler(async (req, res) => {
        logger.log('info', 'Updating products');
        await Product.findOneAndUpdate({ _id: req.body._id }, req.body, { new: true })
            .then(result => {
                res.status(201).json({imageID: image._id});
            })
    }));

    router.delete('/products/:id', requireAuth, asyncHandler(async (req, res) => {
        logger.log('info', 'Deleting product %s', req.params.id);
        await Product.remove({ _id: req.params.id })
            .then(result => {
                res.status(200).json(result);
            })
    }));

    var storage = multer.diskStorage({
        destination: function (req, image, cb) {
            var path = config.uploads + '/products';
            mkdirp(path, function (err) {
                if (err) {
                    res.status(500).json(err);
                } else {
                    cb(null, path);
                }
            });
        },
        imagename: function (req, image, cb) {
            image.imageName = image.originalname;
            cb(null, image.imagename + '-' + Date.now());
        }
    });

    var upload = multer({ storage: storage });

    router.post('/products/upload/:id', upload.any(), asyncHandler(async (req, res) => {
        logger.log('info', 'Uploading image');
        await Product.findById(req.params.id).then(result => {
            for (var i = 0, x = req.images.length; i < x; i++) {
                var image = {
                    originalImageName: req.images[i].originalname,
                    imageName: req.images[i].imagename
                };
                result.image = image;
            }
            result.save().then(result => {
                res.status(200).json(result);
            });
        })
    }));


};