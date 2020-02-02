import React from 'react';
import { StyleSheet, Text, View, Button, Alert } from 'react-native';
import { Camera } from 'expo-camera';
import * as Permissions from 'expo-permissions';
import {decode as atob, encode as btoa} from 'base-64';

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
                    Alert.alert("Response: " + JSON.stringify(json));
                })
                .catch(err => {
                    Alert.alert("Error: " + err);
                });
        })
        .catch(err => Alert.alert("Error: " + err));

      // var oReq = new XMLHttpRequest();
      // oReq.open("GET", photo.uri, true);
      // oReq.responseType = "blob";
      //
      // oReq.onload = function(oEvent) {
      //   let blob  = oReq.response;
      //   console.log("Is Blob: " + blob instanceof Blob);
      //   console.log("blob: " + JSON.stringify(blob));
      //   // console.log("Stream: " + blob.stream());
      //   // console.log("Text: " + blob.text().then(res => console.log(res)).catch(err => console.log(err)));
      //   // console.log("AB: " + blob.arrayBuffer().then(res => console.log(res)).catch(err => console.log(err)));
      //
      //   let reader = new FileReader();
      //   reader.readAsDataURL(blob);
      //   reader.onloadend = function() {
      //       var base64data = reader.result;
      //       console.log("Base 64: " + base64data.slice(0,100));
      //       const formData  = new FormData();
      //       formData.append("file", blob);
      //   }
      // };
      // oReq.send();
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
});
