import React from 'react';
import { StyleSheet, Text, View, Button, Alert } from 'react-native';
import { Camera } from 'expo-camera';
import * as Permissions from 'expo-permissions';
import { FontAwesome } from '@expo/vector-icons';

export default class Capture extends React.Component {
  state = {
    hasPermission: null,
    type: Camera.Constants.Type.back,
  }

  async componentDidMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasPermission: status === 'granted' });
  }

  takePicture = async () => {
    if (this.camera) {
      Alert.alert("Taking Picture!");
      let photo = await this.camera.takePictureAsync();
      console.log(photo);

      var oReq = new XMLHttpRequest();
      oReq.open("GET", photo.uri, true);
      oReq.responseType = "blob";

      oReq.onload = function(oEvent) {
        var blob = oReq.response;

        // var reader = new FileReader();
        // reader.readAsDataURL(blob); 
        // reader.onloadend = function() {
        //     var base64data = reader.result;                
        //     console.log("Base 64: " + base64data);
        // }
      };

      oReq.send();
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
        <View style={{ flex: 1 }}>
            <Camera style={{ flex: 1 }} type={this.state.cameraType} ref={ref => {this.camera = ref;}}>
            </Camera>
            <Button
                title="Press me"
                color="#f194ff"
                onPress={this.takePicture}
            />
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
      alignItems: 'center'
  },
});
