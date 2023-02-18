import React, { useState, useEffect } from 'react';
import {StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, StatusBar, Text, View, Button, Image} from 'react-native';
import {Colors, Header} from 'react-native/Libraries/NewAppScreen';
import { getRecipes } from '../util/GetRecipe';
import { COLOURS, DROP_SHADOW, RADIUS, SPACING } from "../util/GlobalStyles";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { requestMicrophonePermissionsAsync } from 'expo-camera';


type Props = {
    recipeName: string,
    recipeImage: string,
    recipeCalories: string,
    recipeServings: string,
    recipeCautions: string,
    recipeIngredients: string,
  };

const RecipeBox = (props: Props) => {

  const isDarkMode = false;

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
      <>
          <View style={styles.container}>
            <Image source={{uri: props.recipeImage}} style={styles.foodImage}/>
            <Text style={styles.textHeading}>{props.recipeName}</Text>
            <Text style={styles.textSmall}>{parseInt(props.recipeCalories)/parseInt(props.recipeServings)} Calories</Text>
            <Text style={styles.textSmall}>Contains {props.recipeCautions}</Text>
            <Text style={styles.textSmall}>Contains {props.recipeIngredients.length}</Text>
          </View>
      </>
  );
}
export default RecipeBox

const styles = StyleSheet.create({
  container: {
    marginTop: "3%",
    width: "90%",
    height: 125,
    flexDirection: "column",
    backgroundColor: COLOURS.grey,
    borderRadius: 10,
    alignItems: "flex-start",
    justifyContent: "space-around",
  },

  foodImage: {
    borderRadius: RADIUS.small,
    width: 124, 
    height: 124,
    marginRight: 'auto',
    marginBottom: 'auto',
  },

  textHeading: {
    left: '35%',
    bottom: "35%",
    fontSize: 16,
  },

  textSmall: {
    left: '40%',
    bottom: "40%",
    fontSize: 14,
    // position: 'absolute',
  },

});

