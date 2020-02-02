import React from 'react';
import {FlatList, View, StyleSheet, Text, Button, AsyncStorage} from "react-native";
import Constants from 'expo-constants';



// function Item({ allergy }) {
//     return (
//       <View style={styles.item}>
//         <Text style={styles.title}>{allergy}</Text>
//         <Button style = {styles.button} title='X' onPress = {() => {this.removeAllergy(allergy)}}></Button>
//       </View>
//     );
//   }

export default class Allergy extends React.Component {


    constructor (props) {
        super(props);

        this.state = {
            allergies: []
        }
        this.getAllergies();
    }

    onlyUnique = (value, index, self) => { 
        return self.indexOf(value) === index;
    }

    addAllergy = async (allergy_list) => {
        console.log("Adding allergy", allergy_list)
        // allergy_list =  ['eggs', 'wheat']
        try {
            const current_list = await AsyncStorage.getItem('@allergies');
            console.log("Current Allergy List: ", current_list)
            allergy_list = allergy_list.concat(JSON.parse(current_list).allergy_list).filter(this.onlyUnique);
            console.log("New Allergy List", allergy_list)
            await AsyncStorage.setItem('@allergies', JSON.stringify({allergy_list}))
            this.getAllergies();
        } catch (e) {
            console.log("Error", e);
        }
    }

    getAllergies = async () => {
        console.log("Getting Allergies");
        try {
            const value = await AsyncStorage.getItem('@allergies')
            let allergy_list = JSON.parse(value).allergy_list
            // construct list for flatlist data
            for (let i = 0; i < allergy_list.length; i++) {
                allergy_list[i] = {"name": allergy_list[i]};
            }
            this.setState({
                allergies: allergy_list
            });
            console.log(allergy_list);
        } catch(e) {
            console.log("Error", e);
        }
        console.log('Done.')
    }

    removeAllergy = async (to_remove) => {
        console.log("Removing value", to_remove);
        try {
            const current_list = await AsyncStorage.getItem('@allergies');
            let allergy_list = JSON.parse(current_list).allergy_list;
            const index = allergy_list.indexOf(to_remove);
            if (index > -1) {
                allergy_list.splice(index, 1);
            }
            console.log("new", allergy_list)
            await AsyncStorage.setItem('@allergies', JSON.stringify({allergy_list}))
            this.getAllergies();
        } catch(e) {
            console.log("Error", e);
        }
        console.log('Done.')
    }

    

  render(){
    return ( 
        <View style = {styles.container}>
            <Button style={{margin: 100}} onPress={() => {this.addAllergy(["eggs", "milk", "wheat"])}} title="Store"></Button>
            <FlatList 
                data = {this.state.allergies}
                keyExtractor={item => item.name}
                renderItem={({ item, index, separators }) => (
                    <View style={styles.item}>
                        <Text style={styles.title}>{item.name}</Text>
                        <Button style = {styles.button} title='X' onPress = {() => {this.removeAllergy(item.name)}}></Button>
                    </View>
                )}
                
                ></FlatList>
        </View>
    );
  }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      marginTop: Constants.statusBarHeight,
    },
    item: {
        flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
      backgroundColor: '#f9c2ff',
      padding: 20,
      marginVertical: 8,
      marginHorizontal: 16,
    },
    title: {
      fontSize: 32,
    },
    button: {
        width: 50,
    }
  });