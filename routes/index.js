let express = require('express');
let router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Affischkompassen'});
});

router.get('/quiz', function (req, res, next) {
    res.render('quiz', {title: 'Affischkompassen'});
});

module.exports = router;
