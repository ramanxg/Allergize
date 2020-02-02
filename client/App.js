import React from 'react';
import Camera from "./Components/Camera"
import DecisionScreen from "./Components/DecisionScreen"
import { Text, StyleSheet, View, TouchableOpacity, Image, ImageBackground} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, FontAwesome, Foundation } from '@expo/vector-icons';
import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import Capture from "./Components/Camera";
import Edit from "./Components/EditAllergies";
import Pick from './Components/PickAllergies';
import {Button, AsyncStorage, Alert} from "react-native";
import Allergy from "./Components/Allergy"

class HomeScreen extends React.Component {

	constructor(props){
		super(props);
		this.state = { onCamera: false };
	}

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

  showHome = () => {
  	this.setState({onCamera:false});
  }

  render(){
  	const onCamera = this.state.onCamera;
  	const {navigate} = this.props.navigation;
    return (
    	<>
	    	{ !onCamera && <LinearGradient colors={['rgba(255,190,69,100)', 'rgba(255,160,133,100)']} style={{alignItems: 'center', flex: 1}}>
	    	    <ImageBackground style={styles.background} source={require('./images/splotches.png')}>
			    	<View style={styles.container}>
			    		<TouchableOpacity style={styles.mainButton} onPress={() => this.setState({onCamera:true})}>
			    			<Text style={styles.buttonText}>
			    				ALLERGIZE!
			    			</Text>
			    		</TouchableOpacity>
			    		<TouchableOpacity style={styles.button} onPress={() => navigate('Profile')}>
			    			<Foundation name='pencil' size={50} color='rgba(255,255,255,0.5)'/>
			    		</TouchableOpacity>
			    	</View>
		    	</ImageBackground>
	    	</LinearGradient>
	    	}
	    	{onCamera && <Capture navigation={this.props.navigation} showHome={this.showHome}/>}
	    </>
    	
    );
  }
}

const styles = StyleSheet.create({
	container:{
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center'
	},
	background:{
		flex: 1,
		width: 450
	},
	buttonText:{
		fontSize: 40,
		fontWeight: 'bold',
		color: 'rgba(255,255,255,0.5)'

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
		marginTop: 50,
		width: 275,
		height: 275,
		marginTop: 200,
		alignItems: 'center',
		justifyContent: 'center',
		borderWidth: 10,
		borderColor: 'rgba(255,255,255,0.5)'
	},
	button:{
		borderRadius: 50,
		marginTop: 50,
		width: 80,
		height: 80,
		marginTop: 100,
		alignItems: 'center',
		justifyContent: 'center',
		borderWidth: 7,
		borderColor: 'rgba(255,255,255,0.5)'
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
  Camera: {screen: Capture},
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



