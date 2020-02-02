import React from 'react';
import { AsyncStorage, FlatList, Text, StyleSheet, View, TouchableOpacity, Image, ImageBackground, Alert} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, FontAwesome, Foundation } from '@expo/vector-icons';

export default class DecisionScreen extends React.Component{

	constructor (props) {
		super(props);
		// Alert.alert("Results: " + this.props.navigation.getParam('allergens', 'failed'));
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
			console.log(this.allergens)
			let found = []
			for (let j = 0; j < allergy_list.length; j++) {
				for (let i = 0; i < this.allergens.length; i++) {
					let temp = {"name": allergy_list[j]};
					if (this.allergens[i].includes(allergy_list[j]) && !found.includes(temp)) {
						found.push(temp);
						break;
					}
				}
			}
            this.setState({
				found: found,
				edible: found.length == 0
            });
        } catch(e) {
            console.log("Error", e);
        }
        console.log('Done.')
    }
	render(){
		const {navigate} = this.props.navigation;
		let conclusion;
		let conclusionColor;

		if (this.state.edible) {
			conclusion = "SAFE TO EAT!";
			conclusionColor = 'rgba(71,204,0,100)';
		} else {
			conclusion = "DO NOT EAT!";
			conclusionColor = 'rgba(240,0,0,100)';
		}
		/*source={require('../images/food_sample.jpg')}>} */
		return(
				<LinearGradient colors={['rgba(255,240,69,100)', 'rgba(255,110,133,100)']} style={{alignItems: 'center', flex: 1}}>
					<ImageBackground style={styles.background} source={require('../images/splotches_2.png')}>
						<ImageBackground style={styles.food_image} source={{uri: `data:image/gif;base64,${this.base64}`}}>
							<TouchableOpacity style={styles.button} onPress={() => navigate('Home')}>
								<Ionicons name='md-arrow-back' size={35} color='rgba(255,255,255,0.85)'/>
							</TouchableOpacity>
						</ImageBackground>
						<View style={styles.allergy}>
							<Text style={{fontSize: 45, fontWeight: 'bold', marginTop: 30, marginBottom: 20, width: 300, color: conclusionColor}}>
								{conclusion} 
							</Text>
							<FlatList
							data = {this.state.found}
							ListHeaderComponent={() => (
								<Text style={styles.allergy_header}>Allergens: </Text>
							)}
							ListEmptyComponent={() => (
								<Text style={styles.item}>None{"\n"}</Text>
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
		marginLeft: 65
	},
	background:{
		flex: 1
	},
	allergy_header:{
		fontSize: 25,
		flex: 1,
		flexDirection: 'column',
		color: 'white',
		fontWeight: 'bold'
	},
	item:{
	    padding: 10,
	    fontSize: 18,
	    height: 44,
	    color: 'white'
  	},
  	button:{
  		marginTop: 40,
		marginLeft: 20,  
  		borderRadius: 50,
		width: 50,
		height: 50,
		alignItems: 'center',
		justifyContent: 'center',
		borderWidth: 4,
		borderColor: 'rgba(255,255,255,0.55)'
	  },
	title:{
		fontSize:20,
		color: 'rgba(255,255,255,0.85)'
	}
});
