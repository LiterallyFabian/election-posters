let express = require('express');
let router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Affischvalet'});
});

router.get('/quiz', function (req, res, next) {
    res.render('quiz', {title: 'Affischvalet'});
});

router.get('/about', function (req, res, next) {
    res.render('about', {title: 'Affischvalet'});
});

router.post('/vote', function (req, res, next) {
    let data = req.body;

    connection.query(`INSERT INTO votes (user_id, party_id, poster_id, date, vote) VALUES ('${data.user_id}', '${data.party_id}', '${data.poster_id}', '${data.date}', '${data.vote}')`, function (err, results, fields) {
        if (err) {


            if (err.code === "ER_DUP_ENTRY") // duplicate entries are accepted but ignored
                return res.status(409).send("Duplicate entry");
            else{
                console.log(err);
                return res.status(500).send("Internal server error");
            }
        }

        res.status(200).send("OK");
    });
});

module.exports = router;
