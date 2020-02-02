import React from 'react';
import { AsyncStorage, FlatList, Text, StyleSheet, View, TouchableOpacity, Image, ImageBackground, Alert} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, FontAwesome, Foundation } from '@expo/vector-icons';

export default class DecisionScreen extends React.Component{

	constructor (props) {
		super(props);
		Alert.alert("Results: " + this.props.navigation.getParam('allergens', 'failed'));
		this.allergens = this.props.navigation.getParam('allergens', 'failed');
		this.base64 = this.props.navigation.state.params.base64;
		console.log(this.allergens)
		this.state = {
			found: [],
			edible: false
		};
		this.getAllergies();
	}
	getAllergies = async () => {
        console.log("Getting Allergies");
        try {
            const value = await AsyncStorage.getItem('@allergies')
            let allergy_list = JSON.parse(value).allergy_list
			console.log(allergy_list);
			let found = allergy_list.filter(value => -1 !== this.allergens.indexOf(value))
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
			conclusion = "SAFE TO EAT!";
		} else {
			conclusion = "DO NOT EAT!";
		}
		/*source={require('../images/food_sample.jpg')}>} */
		return(
				<LinearGradient colors={['rgba(255,190,69,100)', 'rgba(255,153,133,100)']} style={{alignItems: 'center', flex: 1}}>
					<ImageBackground style={styles.background} source={require('../images/splotches_1.png')}>
						<ImageBackground style={styles.food_image} source={{uri: `data:image/gif;base64,${this.base64}`}}>
							<TouchableOpacity style={styles.button} onPress={() => navigate('Home')}>
								<Ionicons name='md-arrow-back' size={50} color='rgba(255,255,255,0.85)'/>
							</TouchableOpacity>
						</ImageBackground>
						<View style={styles.allergy}>
							<Text style={styles.allergy_footer}>
								{conclusion} 
							</Text>
							<FlatList
							data = {this.state.found}
							ListHeaderComponent={() => (
								<Text style={styles.allergy_header}>Allergens: {"\n"}</Text>
							)}
							keyExtractor={item => item.name}
							renderItem={({ item, index, separators }) => (
								<View style={styles.item}>
									<Text style={styles.title}>{item.name}</Text>
								</View>
							)}></FlatList>
						</View>
					</ImageBackground>
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
		flex: 1.75,
		marginLeft: 50
	},
	background:{
		flex: 1
	},
	allergy_footer:{
		fontSize: 45,
		flexDirection: 'column',
		flex: 1,
		fontWeight: 'bold',
		marginTop: 30,
		width: 300
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
		alignItems: 'center',
		justifyContent: 'center',
		borderWidth: 5,
		borderColor: 'rgba(255,255,255,0.55)'
	  },
	title:{
		fontSize:20,
	}
});
