import React from 'react';
import Capture from "./Components/Camera";
import Edit from "./Components/EditAllergies";
import Camera from "./Components/Camera"
import {View, Button, AsyncStorage} from "react-native";
import Allergy from "./Components/Allergy"


export default class App extends React.Component {

  componentDidMount = () => {
      AsyncStorage.getItem('@allergies').then((value) => {
      if (!value) {
        let allergy_list = [];
        AsyncStorage.setItem('@allergies', JSON.stringify({allergy_list}))
        .catch((err) => {
          console.log(err)
        });
      }
    });
  }

  render(){
    return (
      <Camera></Camera>
        // <Allergy></Allergy>
    );
  }
}