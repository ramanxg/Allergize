import React from 'react';
import { StyleSheet, Text, View, Alert, TouchableOpacity, ImageBackground} from 'react-native';
import { Camera } from 'expo-camera';
import * as Permissions from 'expo-permissions';
import {Ionicons} from '@expo/vector-icons';
import {Button, Icon} from 'react-native-elements';
import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';


export default class Capture extends React.Component {
  constructor(props)
  {
    super(props);
    this.state = {
      hasPermission: true,
      type: Camera.Constants.Type.back,
      pictureTaken: false,
      picture:""
    };
  }

  backPress = () => {
    const {navigate} = this.props.navigation;
    console.log("hit back button");
    this.props.showHome();
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
      
    this.setState({ pictureTaken:true });
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
    const { hasPermission } = this.state.hasPermission;
    const pictureTaken = this.state.pictureTaken;
    const {navigate} = this.props.navigation;
    let picture = this.state.picture;
    console.log("Picture: ", picture);
    if (hasPermission === null) {
      return <View />;
    } else if (hasPermission === false) {
      return <Text>No access to camera</Text>;
    } else {
      console.log("pictureTaken:" + pictureTaken);
      return (
        <View style={{ flex: 1}}>
           <Camera style={{ flex: 1 }} type={this.state.cameraType} ref={ref => {this.camera = ref;}}></Camera>
            <View>
              {!pictureTaken && <><TouchableOpacity style={styles.button} onPress={this.backPress}>
								 <Ionicons name='md-arrow-back' size={50} color='rgba(255,255,255,0.85)'/>
							  </TouchableOpacity>
                <TouchableOpacity style={styles.takePictureButton} onPress={this.takePicture}>
                    <Icon
                        type='font-awesome'
                        name='camera'
                        color='rgba(255,255,255,0.8)'
                    />  
                </TouchableOpacity></>}
              {pictureTaken && <Text style={{backgroundColor: 'black', color: 'white', fontSize: 20, fontWeight: 'bold', padding: 10}}>Processing Image...</Text>}
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
  button: {
      position: 'absolute',
      bottom: 0,
      left: 10,
      marginBottom: 40,
      marginLeft: 20
  },
  takePictureButton: {
    width: 75,
    height: 75,
    borderWidth: 6,
    borderRadius: 150,
    borderColor: 'rgba(255,255,255,0.8)',
    backgroundColor: 'rgba(0,0,0,0)',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 25,
    left: 170,

  },
});
