let express = require('express');
let router = express.Router();
let fs = require('fs');

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

router.get('/result', function (req, res, next) {
    getVotes(function (err, data) {
        if (err) {
            res.render('error', {message: 'Error when getting votes', error: err});
        }

        res.render('result', {title: 'Affischvalet', data: data, partyData: fs.readFileSync('public/data.json', 'utf8')});
    });
});

router.post('/vote', function (req, res, next) {
    let data = req.body;

    connection.query(`INSERT INTO votes (user_id, party_id, poster_id, date, vote) VALUES ('${data.user_id}', '${data.party_id}', '${data.poster_id}', '${data.date}', '${data.vote}')`, function (err, results, fields) {
        if (err) {

            if (err.code === "ER_DUP_ENTRY") // duplicate entries are processed but ignored
                return res.status(409).send("Duplicate entry");
            else{
                console.log(err);
                return res.status(500).send("Internal server error");
            }
        }

        res.status(200).send("OK");
    });
});

router.get('/votes', function (req, res, next) {
    getVotes(function (err, data) {
        if (err)
            return res.status(500).send("Internal server error");

        res.status(200).send(data);
    });
});

/**
 * Get all votes from the database
 * @param callback function(err, data) where data is an array of votes
 */
function getVotes(callback){
    connection.query(`SELECT party_id, poster_id, vote, COUNT(*) AS count FROM votes GROUP BY party_id, poster_id, vote`, function (err, results, fields) {
        if (err) {
            console.log(err);
            callback(err, null);
        }

        let data = {};

        for (let i = 0; i < results.length; i++) {
            let party = results[i].party_id;
            let poster = results[i].poster_id;
            let vote = results[i].vote;
            let count = results[i].count;

            if (!data.hasOwnProperty(party))
                data[party] = {};

            if (!data[party].hasOwnProperty(poster))
                data[party][poster] = {};

            data[party][poster][vote] = count;
        }

        callback(null, data);
    });
}

router.get('/raw', function (req, res, next) {
    connection.query(`SELECT party_id, poster_id, vote FROM votes`, function (err, results, fields) {
        if (err) {
            console.log(err);
            return res.status(500).send("Internal server error");
        }

        // rename columns
        for (let i = 0; i < results.length; i++) {
            results[i].p = results[i].party_id;
            results[i].t = results[i].poster_id;
            results[i].v = results[i].vote;
            delete results[i].party_id;
            delete results[i].poster_id;
            delete results[i].vote;
        }

        res.status(200).send(results);
    });
});
module.exports = router;
