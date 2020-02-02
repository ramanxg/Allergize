import React from 'react';
import {FlatList, View, StyleSheet, Text, AsyncStorage, TouchableOpacity, ImageBackground} from "react-native";
import Constants from 'expo-constants';
import {Button, Icon, Header} from 'react-native-elements';
import {Ionicons} from 'react-native-vector-icons';
import { TextInput } from 'react-native-gesture-handler';
import { LinearGradient } from 'expo-linear-gradient';

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
        <LinearGradient colors={['rgba(255,240,69,100)', 'rgba(255,110,133,100)']} style={{alignItems: 'center', flex: 1}}>
            <ImageBackground style={styles.background} source={require('../images/splotches_2.png')}>
                <View style = {styles.container}>
                    <Header backgroundColor='rgba(255,169,82,100)'
                        leftComponent={<TouchableOpacity style={styles.backButton} onPress={() => navigate('Home')}>
                                            <Ionicons name='md-arrow-back' size={50} color='rgba(255,255,255,0.85)'/>
                                        </TouchableOpacity>}
                        centerComponent={{text: 'Saved Allergies', style:{fontSize: 32, justifyContent: 'center', fontWeight: 'bold', color:'rgba(255,255,255,1)', marginTop: -30}}}
                    />
                    <View flexDirection='row' justifyContent='space-between' alignItems='center'>
                        <TextInput style={styles.text}
                            placeholder = 'Enter your allergies'
                            placeholderTextColor = 'rgba(255,255,255,100)'
                            onChangeText = {text => (this.setState({'input': text}))}
                            value={this.state.input}
                        />
                        <Button style= {{paddingRight: 30}} title='+' onPress={this.addAllergy}/>
                    </View>
                        
                    {/* <Button style={{margin: 35}} onPress={() => {this.addAllergy(["eggs", "milk", "wheat"])}} title="Store"></Button> */}
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
            </ImageBackground>
        </LinearGradient>
    );
  }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      marginTop: Constants.statusBarHeight,
    },
    background:{
        flex: 1,
        width: 420
    },
    text: {
        width: '80%',
        borderBottomColor: 'rgba(255,255,255,0.5)',
        borderBottomWidth: 1,
        padding: 5,
        margin: 20,
        fontSize: 18,
    },
    item: {
        flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
      backgroundColor: 'rgba(255,150,105,100)',
      padding: 10,
      marginVertical: 8,
      marginHorizontal: 16,
      borderRadius: 10,
      elevation: 4
    },
    backButton: {
        marginHorizontal: 16,
        marginTop: -25
    },
    title: {
        // Styles the text of the item
      fontSize: 25,
      color: 'rgba(255,255,255,0.75)'

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
        color: 'rgba(255,80,80,100)',
        textAlign: 'right',
        paddingTop: 3,
        paddingRight: 5,
    }
  });