var express = require('express');
var router = express.Router();

var firebase = require("firebase/app");

// Add the Firebase products that you want to use
require("firebase/auth");
require("firebase/firestore");

var database = firebase.firestore();

/* GET users listing. */
router.get('/', function(req, res, next) {
  
  res.json({name:"Aaron", password:"hehexd"});
});

// Creates a new user to store in firebase authentication, and a new document
// in the users collection for the user.
router.get('/createUser', function(req, res, next) {
  console.log("creating a user")
  data = {
    name: 'Raman Gupta',
    email: 'ramanxg@gmail.com',
    password: 'helloworld'
  }
  // data = {
  //   name: req.body.name,
  //   email: req.body.email,
  //   password: req.body.password
  // }
  //email = req.body.email;    password = req.body.password
  firebase.auth().createUserWithEmailAndPassword(data.email, data.password).then(function(user) {
    let user_data = {
      name: data.name,
      email: data.email,
      allergy_list: []
    }
    let setDoc = database.collection('users').doc(data.email).set(user_data);
    res.json({'successful': true});
  }).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    if (errorCode === 'auth/email-already-in-use') {
      console.log("Email is already being used");
    } else {
      console.log(errorMessage);
    }
    res.json({'successful': false, 'message': 'Email is already being used'});
  });
  // if (success) {res.send('Success')} else {res.send('Failure')}
});

// Login the user checking with email and password.
router.get('/loginUser', function(req, res, next) {
  data = {
    email: 'ramanxg@gmail.com',
    password: 'helloworld'
  }
  //email = req.body.email;    password = req.body.password
  firebase.auth().signInWithEmailAndPassword(data.email, data.password)
    .then(function(firebaseUser) {
      //success
      res.json({'successful': true});
    })
    .catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      if (errorCode === 'auth/user-not-found') {
        res.json({'successful': false, 'message': 'Email not found'});
      }
      else if (errorCode === 'auth/wrong-password') {
        res.json({'successful': false, 'message': 'Incorrect Password'});
      } else {
        console.log(errorMessage);
      }
      console.log(error);
  });
});


// Add a list of new allergies to the current user's allergy list, excluding duplicates.
router.get('/addAllergy', function(req, res, next) {
  data = {new_allergies: ['milk', 'wheat']}
  // data = {new_allergies: req.body.new_allergies}
  var user = firebase.auth().currentUser;
  if (user) {
    let userRef = database.collection('users').doc(user.email);
    userRef.get().then( function(docSnap) {
      let arrUnion = userRef.update({
        allergy_list: firebase.firestore.FieldValue.arrayUnion(...data.new_allergies)
      }).then(function(p) {
        res.json({successful:true})
      }).catch((err) => {
        console.log("Error: ", err);
        res.json({successful:false, "message": err})
      });
    });
    
  } else {
    console.log("User not logged in.")
    res.json({successful:false, "message": "User not logged in."})
  }
  
});


router.get('/deleteAllergy', function(req, res, next) {
  data = {new_allergies: ['milk', 'wheat']}
  // data = {new_allergies: req.body.new_allergies}
  var user = firebase.auth().currentUser;
  if (user) {
    let userRef = database.collection('users').doc(user.email);
    userRef.get().then( function(docSnap) {
      let arrUnion = userRef.update({
        allergy_list: firebase.firestore.FieldValue.arrayRemove(...data.new_allergies)
      }).then(function(p) {
        res.json({successful:true})
      }).catch((err) => {
        console.log("Error: ", err);
        res.json({successful:false, "message": err})
      });
    });
    
  } else {
    console.log("User not logged in.")
    res.json({successful:false, "message": "User not logged in."})
  }
});


module.exports = router;
