let express = require('express');
let router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Affischkompassen'});
});

router.get('/quiz', function (req, res, next) {
    res.render('quiz', {title: 'Affischkompassen'});
});

router.post('/result', function (req, res, next) {
    let data = req.body;
    data.votes = JSON.stringify(data.votes);

    connection.query(`INSERT INTO votes (id,
                                         votes,
                                         date)
                      VALUES ('${data.id}',
                              '${data.votes}
                              ',
                              '${data.date}
                              ')`, function (err, results, fields) {
        if (err) {
            console.log(err);

            if (err.code === "ER_DUP_ENTRY")
                res.status(409).send("Duplicate entry");
            else
                res.status(500).send("Internal server error");
        }

        res.status(200).send("OK");
    });
});

router.get('/result/:id', function (req, res, next) {
    connection.query(`SELECT * FROM votes WHERE id = '${req.params.id}'`, function (err, results, fields) {
        if (err) {
            console.log(err);
            res.status(500).send("Internal server error");
        }

        if (results.length === 0)
            res.status(404).send("Not found");
        else
            res.render('result', {title: 'Affischkompassen', data: results[0]});
    });
});

module.exports = router;
