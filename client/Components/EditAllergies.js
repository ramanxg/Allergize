import React, {useState} from 'react';
import { StyleSheet, Text, View, Button, Checkbox, TextInput, FlatList} from 'react-native';

export default function Edit() {
    const [enteredAllergy, setAllergy] = useState('');

    const allergiesInputHandler = (enteredText) => {
        setAllergy(enteredText);
    };

    const addAllergies = () => {
        console.log(enteredAllergy)
    };

    return (
        <View style={styles.container}>
            <View style={styles.spacing}>
            <TextInput style={styles.text} 
                placeholder='Allergies'
                onChangeText={allergiesInputHandler} 
                value={enteredAllergy}
            />
            <Button title='ADD' onPress={addAllergies}/>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 30,
    },
    spacing: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    text: {
        width: '85%',
        borderBottomColor: 'black',
        borderBottomWidth: 1,
        padding: 10,
    },
});