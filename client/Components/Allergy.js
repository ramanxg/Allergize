import React from 'react';
import {FlatList, View, StyleSheet, Text, AsyncStorage, TouchableOpacity} from "react-native";
import Constants from 'expo-constants';
import {Button, Header, Icon} from 'react-native-elements';
import {Ionicons, FontAwesome} from 'react-native-vector-icons';
import { TextInput } from 'react-native-gesture-handler';

export default class Allergy extends React.Component {
    constructor (props) {
        super(props);

        this.state = {
            allergies: [],
            input: ""
        }
        this.getAllergies();
    }

    onlyUnique = (value, index, self) => { 
        return self.indexOf(value) === index;
    }

    addAllergy = async () => {
        // console.log("Adding allergy", allergy_list)
        // allergy_list =  ['eggs', 'wheat']
        if (this.state.input.length > 0) {
           try {
            const current_list = await AsyncStorage.getItem('@allergies');
            console.log("Current Allergy List: ", current_list)
            let allergy_list = JSON.parse(current_list).allergy_list;
            // allergy_list = allergy_list.concat(JSON.parse(current_list).allergy_list).filter(this.onlyUnique);
            console.log("allergy_list", allergy_list);
            let a = this.state.input.toLowerCase();
            console.log(a);
            if (!allergy_list.includes(a)) {
                allergy_list.push(a);
            }
            this.setState({
                input:""
            });
            console.log("New Allergy List", allergy_list)
            await AsyncStorage.setItem('@allergies', JSON.stringify({allergy_list}))
            this.getAllergies();
        } catch (e) {
            console.log("Error", e);
        } 
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
    const {navigate} = this.props.navigation;
    return ( 
        <View style = {styles.container}>
            <Header
                leftComponent={<TouchableOpacity style={styles.backButton} onPress={() => navigate('Home')}>
                                    <Ionicons name='ios-arrow-back' size={50} color='black'/>
                                </TouchableOpacity>}
                centerComponent={{text: 'Saved Allergies', style:{fontSize: 32, justifyContent: 'center'}}}
            />
            <View flexDirection='row' justifyContent='space-between' alignItems='center'>
                <TextInput style={styles.text}
                    placeholder = "Enter the foods that you're allergic to"
                    onChangeText = {text => (this.setState({'input': text}))}
                    value={this.state.input}
                />
                <Button
                    icon={
                        <Icon
                            name='plus'
                            type='font-awesome'
                            color='green'
                        />
                    } 
                    type='clear' 
                    onPress={this.addAllergy}
                />
            </View>
                
            <FlatList 
                data = {this.state.allergies}
                keyExtractor={item => item.name}
                renderItem={({ item, index, separators }) => (
                    <View style={styles.item}>
                        <Text style={styles.title}>{item.name}</Text>
                        <TouchableOpacity style = {styles.closeButton} onPress = {() => {this.removeAllergy(item.name)}}>
                            <Text style = {styles.closeText}>X</Text>
                        </TouchableOpacity>
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
    //   backgroundColor: 'yellow'
    },
    text: {
        width: '80%',
        borderBottomColor: 'black',
        borderBottomWidth: 1,
        padding: 5,
        margin: 20,
        fontSize: 18,
    },
    item: {
        flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
      backgroundColor: '#7aaaf5',
      padding: 10,
      marginVertical: 8,
      marginHorizontal: 16,
      borderRadius: 10,
    },
    backButton: {
        marginLeft: 16,
    },
    title: {
        // Styles the text of the item
      fontSize: 32,

    },
    closeButton: {
        // Styles the X button
        width: 50,
        fontSize: 30,
    },
    closeText: {
        // Styles the text 'X'
        fontSize: 25,
        fontWeight: "bold",
        color: 'red',
        textAlign: 'right',
        paddingTop: 3,
        paddingRight: 5,
    }
  });