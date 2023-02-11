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
          </View>
      </>
  );
}
export default RecipeBox

const styles = StyleSheet.create({
  container: {
    marginTop: "3%",
    width: "90%",
    height: "15%",
    flexDirection: "column",
    backgroundColor: COLOURS.grey,
    borderRadius: 10,
    alignItems: "flex-start",
    justifyContent: "space-around",
  },

  button: {
    paddingTop: SPACING.medium,
    paddingBottom: SPACING.medium,
    paddingLeft: 48,
    paddingRight: 48,
    borderRadius: RADIUS.small,
    textAlign: "center",
    borderColor: COLOURS.primary,
    borderWidth: 1,
  },

  primary: {
    backgroundColor: COLOURS.primary,
  },

  secondary: {
    backgroundColor: COLOURS.white,
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
    bottom: "80%",
    fontSize: 16,
  },

});

