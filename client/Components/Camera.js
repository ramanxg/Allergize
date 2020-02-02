import React from 'react';
import { StyleSheet, Text, View, Alert, TouchableOpacity } from 'react-native';
import { Camera } from 'expo-camera';
import * as Permissions from 'expo-permissions';
import { FontAwesome } from '@expo/vector-icons';
import {Button, Icon} from 'react-native-elements';
import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';


export default class Capture extends React.Component {
  constructor(props)
  {
    super(props);
    this.state = {
      hasPermission: null,
      type: Camera.Constants.Type.back,
    };
  }


  async componentDidMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasPermission: status === 'granted' });
  }

  takePicture = async () => {
    const {navigate} = this.props.navigation;
    if (this.camera) {
      let photo = await this.camera.takePictureAsync({base64: true});
      console.log("Photo: " + JSON.stringify(photo.base64.slice(0, 100)));
    let fetchOptions = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({base64: photo.base64})
        // body: formData
    };
    fetch('https://hackuci2020.herokuapp.com/allergies/getFoods', fetchOptions)
        .then(response =>
        {
            response.json()
                .then(json => {
                    console.log("Success! " + JSON.stringify(json));
                    // Alert.alert("Response: " + JSON.stringify(json));
                    this.props.showHome();
                    navigate('Decision', { allergens: json.result, base64: photo.base64 });
                })
                .catch(err => {
                    Alert.alert("Error: " + err);
                });
        })
        .catch(err => Alert.alert("Error: " + err));
    }
  }

  render(){
    const { hasPermission } = this.state
    if (hasPermission === null) {
      return <View />;
    } else if (hasPermission === false) {
      return <Text>No access to camera</Text>;
    } else {
      return (
        <View style={{ flex: 1}}>
            <Camera style={{ flex: 1 }} type={this.state.cameraType} ref={ref => {this.camera = ref;}}></Camera>

            <View style={{backgroundColor: 'black', alignItems: 'center'}}>
                <TouchableOpacity style={styles.takePictureButton} onPress={this.takePicture}>
                    <Icon
                        type='font-awesome'
                        name='camera'
                    />  
                </TouchableOpacity>
            </View>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  Button: {
      alignItems: 'center',
  },
  takePictureButton: {
    width: 75,
    height: 75,
    borderWidth: 2,
    borderRadius: 150,
    backgroundColor: 'white',
    justifyContent: 'center',
  },
});
