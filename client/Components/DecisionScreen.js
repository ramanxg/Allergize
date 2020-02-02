import React from 'react';
import { FlatList, Text, StyleSheet, View, TouchableOpacity, Image, ImageBackground, Alert} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, FontAwesome, Foundation } from '@expo/vector-icons';

export default class DecisionScreen extends React.Component{

	constructor (props) {
		super(props);
		Alert.alert("Results: " + this.props.navigation.getParam('allergens', 'failed'));
		this.allergens = this.props.navigation.getParam('allergens', 'failed');
	}
	getAllergies = async () => {
        console.log("Getting Allergies");
        try {
            const value = await AsyncStorage.getItem('@allergies')
            let allergy_list = JSON.parse(value).allergy_list
			console.log(allergy_list);
			let found = allergy_list.filter(value => -1 !== this.props.allergens.indexOf(value))
			for (let i = 0; i < found.length; i++) {
                found[i] = {"name": found[i]};
            }
            this.setState({
				found: found,
				edible: allergy_list.length == 0
            });
        } catch(e) {
            console.log("Error", e);
        }
        console.log('Done.')
    }
	render(){
		const {navigate} = this.props.navigation;
		let conclusion;

		if (this.state.edible) {
			conclusion = "No allergies found! Eat up!";
		} else {
			conclusion = "You are allergic to these!";
		}
		return(
			<LinearGradient colors={['rgba(255,190,69,100)', 'rgba(255,172,128,100)']} style={{alignItems: 'center', flex: 1}}>
				<ImageBackground style={styles.food_image} source={require('../images/food_sample.jpg')}>
					<TouchableOpacity style={styles.button} onPress={() => navigate('Home')}>
	    				<Ionicons name='ios-arrow-back' size={50} color='black'/>
	    			</TouchableOpacity>
				</ImageBackground>
				<Text style={styles.allergy}>
					<FlatList
					data = {this.state.found}
					ListHeaderComponent={() => (
						<Text style={styles.allergy_header}>{conclusion}</Text>
					)}
					ListFooterComponent={() => (
						<Text style={styles.allergy_footer}>
							no this thing has panute{"\n"}{"\n"}
						</Text>
					)}
					keyExtractor={item => item.name}
					renderItem={({ item, index, separators }) => (
						<View style={styles.item}>
							<Text style={styles.title}>{item.name}</Text>
						</View>
					)}></FlatList>
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
	allergy_footer:{
		fontSize: 35,
		flexDirection: 'column',
		flex: 1
	},
	allergy_header:{
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
		width: 50,
		height: 50,
		elevation: 5,
		backgroundColor: 'rgba(255,197,110,100)',
		alignItems: 'center',
		justifyContent: 'center'
	  },
	title:{
		fontSize:32,
	}
});
