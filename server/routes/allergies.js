var express = require('express');
var router = express.Router();
const Clarifai = require('clarifai');

const app = new Clarifai.App({apiKey: 'f61f8a17d8ff4eadac96e684a2d6fe9f'});

/* GET users listing. */
router.get('/getFoods', function(req, res, next) {
    app.models.predict("bd367be194cf45149e75f01d59f77ba7", "https://samples.clarifai.com/food.jpg").then(
        function(response) {
            res.json(response);
        },
        function(err) {
            console.log("Error: " + err);
        }
    );
});

module.exports = router;
