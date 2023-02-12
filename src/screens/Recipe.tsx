import React, { useState, useEffect } from 'react';
import {StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, StatusBar, Text, View, Button, Image} from 'react-native';
import {Colors, Header} from 'react-native/Libraries/NewAppScreen';
import { getRecipes, getDietReq } from '../util/GetRecipe';
import { COLOURS, DROP_SHADOW, RADIUS, SPACING } from "../util/GlobalStyles";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { requestMicrophonePermissionsAsync } from 'expo-camera';
import RecipeBox from '../components/RecipeBox';


export function Recipe(): JSX.Element {
  const isDarkMode = false;

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };


  const [recipes, setRecipes] = useState<any[]>([]);


  useEffect(() => {
    genRecipe()
    getDietReq()
  },[]);


  async function genRecipe(){
    const recipeList = await getRecipes()
    setRecipes(recipeList)
  }


  return (
      <View
        style={{
          backgroundColor: isDarkMode ? Colors.black : Colors.white,
          flex: 1,
          justifyContent: "center",
          alignItems: "center"
        }}>
        <Text>This is Profile page</Text>
          {recipes.map((recipe) => {
            if( [].every(elem => recipe["recipe"]["healthLabels"].includes(elem))){
              return (
                <RecipeBox recipeImage={recipe["recipe"]["image"]} recipeName={recipe["recipe"]["label"]} 
                recipeCalories={recipe["recipe"]["calories"]} recipeServings={recipe["recipe"]["yield"]}
                recipeCautions={recipe["recipe"]["cautions"]} recipeIngredients={recipe["recipe"]["ingredients"]}/>
                )
              } 
          })}
      </View>
  );
}

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


  foodImage: {
    borderRadius: RADIUS.small,
    width: 124, 
    height: 124,
    marginRight: 'auto',
    marginBottom: 'auto'
  },

  textHeading: {
    left: '35%',
    bottom: "80%",
    fontSize: 16,
  }

});

