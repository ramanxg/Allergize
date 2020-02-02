var express = require('express');
var router = express.Router();
const Clarifai = require('clarifai');
const fetch = require('node-fetch');

const app = new Clarifai.App({apiKey: '805b38623dc04964bdb20c970711fe5f'});
let apiKey = '3d524fa5472c4c4585905d82fd4a3f52';
let backupKeys = ['8904b7f5eed5420f872c3d74012971fd',
                '7229c13911f748838ebaa5b8d073b8d0',
                'bc55632df85a4e7294581e8967303fe2',
                'fe8fbdb3515441049bb6383daa73fdbb',
                '8933e9937a184ea1ad1803fce83cf7e9',
                'bc6cb3ebf8a74d2493e9961d871dba38',
                'b30956a5783a49ad885f76c1485d62cb',
                '6bd212001b6f4a839aa2fd085823244f',
                'b207eb7d65ba4509a1e2a1cfe6d0d50d',
                '5d0d53ed87024b0d82bde9fa1f69ac1f'];
let backupIndex = 0;
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
            res.json({result: "Please take the picture farther back!"});
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
    if(json.results)
    {
        console.log("Recipe JSON: ", JSON.stringify(json));
        let ids = [];
        for (let i = 0; i < SAMPLE && i < json.results.length; i++) {
            ids.push(json.results[i].id);
        }
        return {ids: ids, numRecipes: json.totalResults};
    }
    else {
        console.log("Key Expired: Using ",backupIndex);
        backupIndex++;
        backupIndex %= backupKeys.length;
        apiKey = backupKeys[backupIndex];
        return await findRecipes(foodItem);
    }
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
    if(json.extendedIngredients)
    {
        let ingredientJson = json.extendedIngredients;
        let ingredients = [];
        ingredientJson.forEach(item => {
            ingredients.push(item.name);
        });
        return ingredients;
    }
    else {
        console.log("Key Expired: Using ",backupIndex);
        backupIndex++;
        backupIndex %= backupKeys.length;
        apiKey = backupKeys[backupIndex];
        return await findIngredients(foodID);
    }
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
