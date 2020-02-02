import React from 'react';
import Camera from "./Components/Camera"
import DecisionScreen from "./Components/DecisionScreen"
import { Text, StyleSheet, View, TouchableOpacity, Image} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, FontAwesome, Foundation } from '@expo/vector-icons';
import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import Capture from "./Components/Camera";
import Edit from "./Components/EditAllergies";
import Pick from './Components/PickAllergies';
import {Button, AsyncStorage} from "react-native";
import Allergy from "./Components/Allergy"

class HomeScreen extends React.Component {
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
  	const {navigate} = this.props.navigation;
    return (
    	<LinearGradient colors={['rgba(255,190,69,100)', 'rgba(255,172,128,100)']} style={{alignItems: 'center', flex: 1}}>
	    	<View style={styles.container}>
	    		<Text style={styles.text}>Tap to Allergize</Text>
	    		<TouchableOpacity style={styles.mainButton} onPress={() => navigate('Decision')}>
	    			<Image style={styles.logoIcon} source={require('./images/logo.png')}/>
	    		</TouchableOpacity>
	    		<TouchableOpacity style={styles.button} onPress={() => navigate('Allergy')}>
	    			<Foundation name='pencil' size={50} color='black'/>
	    		</TouchableOpacity>
	    	</View>
    	</LinearGradient>
    );
  }
}

const styles = StyleSheet.create({
	container:{
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center'
	},
	logoIcon:{
		height: 250,
		width: 250
	},
	text:{
		fontSize: 20,
		marginTop: 50,
		marginBottom: -150,
		fontFamily: 'notoserif',
		fontWeight: 'bold'
	},
	mainButton:{
		borderRadius: 500,
		backgroundColor: 'rgba(0,0,0,100)',
		marginTop: 50,
		width: 275,
		height: 275,
		elevation: 15,
		backgroundColor: 'rgba(255,197,110,100)',
		marginTop: 200,
		alignItems: 'center',
		justifyContent: 'center'
	},
	button:{
		borderRadius: 50,
		backgroundColor: 'rgba(0,0,0,100)',
		marginTop: 50,
		width: 75,
		height: 75,
		elevation: 10,
		backgroundColor: 'rgba(255,197,110,100)',
		marginTop: 100,
		alignItems: 'center',
		justifyContent: 'center'
	},
	ImageIconStyle:{
		padding: 10,
	    margin: 5,
	    height: 25,
    	width: 25,
    	resizeMode: 'stretch',
	}
});


const MainNavigator = createStackNavigator({
  Home: {screen: HomeScreen},
  Decision: {screen: DecisionScreen},
  Profile: {screen: Allergy}
},
{
	initialRouteName: 'Home',
	defaultNavigationOptions: {
		headerMode: 'none',
		headerVisible: false,
		header: null
	}
});

const AppContainer = createAppContainer(MainNavigator);

export default class App extends React.Component{
	render() {
		return <AppContainer/>;
	}
}



