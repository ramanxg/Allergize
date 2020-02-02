var express = require('express');
var router = express.Router();
const Clarifai = require('clarifai');

const app = new Clarifai.App({apiKey: 'f61f8a17d8ff4eadac96e684a2d6fe9f'});

function blobToDataURL(blob, callback){
    var a = new FileReader();
    a.onload = function(e) {callback(e.target.result);}
    a.readAsDataURL(blob);
}

// Given picture, return list of foods in that picture
router.put('/getFoods', function(req, res, next) {
    // for(let key of Object.keys(req.body))
    // {
    //     console.log("Key: " + key + " Value: " + req.body[key]);
    // }

    console.log("Base64: " + JSON.stringify(req.body.base64.slice(0, 100)));

    urlToFood = "https://samples.clarifai.com/food.jpg";
    app.models.predict("bd367be194cf45149e75f01d59f77ba7", {base64: req.body.base64})
        .then(function(response) {
            let data = response.outputs[0].data.concepts;
            let confidentFoods = [];
            data.forEach(function (item, index) {
                if(item.value > .6)
                    confidentFoods.push(item.name);
            });
            console.log("Success! " + confidentFoods);
            res.json({result: confidentFoods});
        },
        function(err) {
            console.log("Failure! " + err);
            res.json({result: "Server Error: " + err});
        }
    );
    console.log("End of Get Foods!");
});

// Given food item (pancakes), return list of ingredients (eggs, )
function findIngredients(foodItem)
{
    let apiKey = 'd734ac52a83e44a9bf4d6b99186c1cbd';
    let searchUrl = `https://api.spoonacular.com/recipes/search?apiKey=${apiKey}&query=${foodItem}`;
    // get ID of search result
    let id = 0;
    let ingredientUrl = `https://api.spoonacular.com/recipes/${id}/information/?apiKey=${apiKey}`
}

module.exports = router;
