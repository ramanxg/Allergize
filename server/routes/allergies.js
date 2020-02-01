var express = require('express');
var router = express.Router();
const Clarifai = require('clarifai');

const app = new Clarifai.App({apiKey: 'f61f8a17d8ff4eadac96e684a2d6fe9f'});

/* GET users listing. */
router.get('/getFoods', function(req, res, next) {
    urlToFood = "https://samples.clarifai.com/food.jpg";
    app.models.predict("bd367be194cf45149e75f01d59f77ba7", urlToFood).then(
        function(response) {
            let data = response.outputs[0].data.concepts;
            let confidentFoods = [];
            data.forEach(function (item, index) {
                if(item.value > .9)
                    confidentFoods.push(item.name);
            });
            res.send(confidentFoods);
        },
        function(err) {
            console.log("Error: " + err);
        }
    );
});

module.exports = router;
