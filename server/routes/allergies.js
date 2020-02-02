var express = require('express');
var router = express.Router();
const Clarifai = require('clarifai');
const fetch = require('node-fetch');

const app = new Clarifai.App({apiKey: 'f61f8a17d8ff4eadac96e684a2d6fe9f'});
let apiKey = 'd734ac52a83e44a9bf4d6b99186c1cbd';
// how confident to include
const CONFIDENCE_THRESHOLD = .75;
// which # lowest recipes should be searched
const DEEP_SEARCH = 3;
// how many recipe variants to check
const SAMPLE = 2;


// Given picture, return list of foods in that picture
router.put('/getFoods', function(req, res, next) {
    console.log("Base64: " + JSON.stringify(req.body.base64.slice(0, 100)));
    app.models.predict("bd367be194cf45149e75f01d59f77ba7", {base64: req.body.base64})
        .then(function(response) {
            let data = response.outputs[0].data.concepts;
            // maps food name to their recipe dict
            let foodDict = {};
            // how many async data points there are
            let numDataPoints = 0;
            data.forEach(function (item, index) {
                if(item.value > CONFIDENCE_THRESHOLD)
                    numDataPoints++;
            });
            data.forEach(function (item, index) {
                if(item.value > CONFIDENCE_THRESHOLD)
                {
                    findRecipes(item.name).then( results =>{
                        foodDict[item.name] = results;
                        --numDataPoints;
                        // at this point foodDict should be filled
                        if(numDataPoints <= 0)
                        {
                            // convert dict to list of items
                            let items = Object.keys(foodDict).map(function(key) {
                                return [key, foodDict[key]];
                            });
                            // sort by increasing numRecipes
                            items.sort(function(first, second) {
                                return first[1].numRecipes - second[1].numRecipes;
                            });
                            // get the first few items that need deep searching
                            items = items.slice(0, DEEP_SEARCH);
                            // list to return
                            let confidentFoods = new Set();
                            let numFoodPoints = 0;
                            items.forEach(function(tup){
                                numFoodPoints += tup[1].ids.length;
                            });
                            // for each item
                            items.forEach(function( tup ){
                                // for each ID
                                tup[1].ids.forEach( id => {
                                    findIngredients(id).then(ingredients => {
                                        // add ingredients to list to return
                                        ingredients.forEach(ingredient => {
                                            confidentFoods.add(ingredient);
                                        });
                                        numFoodPoints--;
                                        if(numFoodPoints <= 0)
                                        {
                                            confidentFoods = Array.from(confidentFoods);
                                            items.forEach(function(tup){
                                                confidentFoods.push(tup[0]);
                                            });
                                            res.json({result: confidentFoods});
                                        }
                                    });
                                });
                            });
                        }
                    });
                }
            });
        },
        function(err) {
            console.log("Failure! " + err);
            res.json({result: "Server Error: " + err});
        }
    );
});

router.get("/findRecipes", function(req, res, next) {
    findRecipes(req.query.foodItem).then(results => {
        res.send(`Food ${req.query.foodItem} ID ${results.ids} numRecipes ${results.numRecipes}`)
    });
});

// Given food item (pancakes), return object {id, numRecipes}
async function findRecipes(foodItem) {
    let searchUrl = `https://api.spoonacular.com/recipes/search?apiKey=${apiKey}&query=${foodItem}`;
    let response = await fetch(searchUrl);
    let json = await response.json();
    let ids = [];
    for (let i = 0; i < SAMPLE && i < json.results.length; i++) {
        ids.push(json.results[i].id);
    }
    return {ids: ids, numRecipes: json.totalResults};
}

router.get("/findIngredients", function(req, res, next) {
    findIngredients(req.query.foodID).then(results => {
        res.send(`Food ${req.query.foodID} Ingredients ${JSON.stringify(results)}`);
    });
});

async function findIngredients(foodID) {
    let ingredientUrl = `https://api.spoonacular.com/recipes/${foodID}/information/?apiKey=${apiKey}`;
    let response = await fetch(ingredientUrl);
    let json = await response.json();
    let ingredientJson = json.extendedIngredients;
    let ingredients = [];
    ingredientJson.forEach(item => {
       ingredients.push(item.name);
    });
    return ingredients;
}

router.get("/testList", function(req, res, next){
    let data = [{value: 1, name: "pizza"},
                {value: 1, name: "pie"},
                {value: 1, name: "Cheese"},
                {value: 1, name: "Pepperoni"},
                {value: 0, name: "Crust"},
                {value: 1, name: "Salami"},
                {value: 1, name: "Dough"},
                {value: 0, name: "Ham"},
                {value: 1, name: "Mozzarella"}];
    // maps food name to their recipe dict
    let foodDict = {};
    // how many async data points there are
    let numDataPoints = 0;
    data.forEach(function (item, index) {
        if(item.value > CONFIDENCE_THRESHOLD)
            numDataPoints++;
    });
    data.forEach(function (item, index) {
        if(item.value > CONFIDENCE_THRESHOLD)
        {
            findRecipes(item.name).then( results =>{
                foodDict[item.name] = results;
                --numDataPoints;
                // at this point foodDict should be filled
                if(numDataPoints <= 0)
                {
                    // convert dict to list of items
                    let items = Object.keys(foodDict).map(function(key) {
                        return [key, foodDict[key]];
                    });
                    // sort by increasing numRecipes
                    items.sort(function(first, second) {
                        return first[1].numRecipes - second[1].numRecipes;
                    });
                    // get the first few items that need deep searching
                    items = items.slice(0, DEEP_SEARCH);
                    // list to return
                    let confidentFoods = new Set();
                    let numFoodPoints = 0;
                    items.forEach(function(tup){
                        numFoodPoints += tup[1].ids.length;
                    });
                    // for each item
                    items.forEach(function( tup ){
                        // for each ID
                        tup[1].ids.forEach( id => {
                            findIngredients(id).then(ingredients => {
                                // add ingredients to list to return
                                ingredients.forEach(ingredient => {
                                    confidentFoods.add(ingredient);
                                });
                                numFoodPoints--;
                                if(numFoodPoints <= 0)
                                {
                                    confidentFoods = Array.from(confidentFoods);
                                    res.json({result: confidentFoods});
                                }
                            });
                        });
                    });
                }
            });
        }
    });
});

module.exports = router;
