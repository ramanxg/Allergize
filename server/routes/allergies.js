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
                if(item.value > .6)
                    confidentFoods.push(item.name);
            });
            res.send(confidentFoods);
        },
        function(err) {
            console.log("Error: " + err);
        }
    );
});

function findIngredients(foodItem)
{
    let apiKey = 'd734ac52a83e44a9bf4d6b99186c1cbd';
    let searchUrl = `https://api.spoonacular.com/recipes/search?apiKey=${apiKey}&query=${foodItem}`;
    // get ID of search result
    let id = 0;
    let ingredientUrl = `https://api.spoonacular.com/recipes/${id}/information`
}

module.exports = router;
