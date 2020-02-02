import React from 'react';
import { FlatList, Text, StyleSheet, View, TouchableOpacity, Image, ImageBackground, Alert} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, FontAwesome, Foundation } from '@expo/vector-icons';

export default class DecisionScreen extends React.Component{
	constructor(props){
		super(props);
		Alert.alert("Results: " + this.props.navigation.getParam('allergens', 'failed'));
		this.allergens = this.props.navigation.getParam('allergens', 'failed');
	}

	render(){
		const {navigate} = this.props.navigation;
		return(
			<LinearGradient colors={['rgba(255,190,69,100)', 'rgba(255,172,128,100)']} style={{alignItems: 'center', flex: 1}}>
				<ImageBackground style={styles.food_image} source={require('../images/food_sample.jpg')}>
					<TouchableOpacity style={styles.button} onPress={() => navigate('Home')}>
	    				<Ionicons name='ios-arrow-back' size={50} color='black'/>
	    			</TouchableOpacity>
				</ImageBackground>
				<Text style={styles.allergy}>
					<Text style={styles.allergy_header}>
						no this thing has panute{"\n"}{"\n"}
					</Text>
					<Text style={styles.allergy_desc}>
						Ingredients:{"\n"}
						{this.allergens.forEach(answer => {                           
				           <Text>
				           		{answer}
				           </Text>
				       	})
				        }
					</Text>
			    </Text>
    		</LinearGradient>
		);
	}
}

const styles = StyleSheet.create({
	food_image:{
		flex: 1,
		width: 420
	},
	allergy:{
		flex: 1.75
	},
	allergy_header:{
		fontSize: 35,
		flexDirection: 'column',
		flex: 1
	},
	allergy_desc:{
		fontSize: 25,
		flex: 1,
		flexDirection: 'column'
	},
	item:{
	    padding: 10,
	    fontSize: 18,
	    height: 44
  	},
  	button:{
  		marginTop: 40,
  		marginLeft: 20,
  		borderRadius: 50,
		backgroundColor: 'rgba(0,0,0,100)',
		width: 50,
		height: 50,
		elevation: 5,
		backgroundColor: 'rgba(255,197,110,100)',
		alignItems: 'center',
		justifyContent: 'center'
  	}
});
