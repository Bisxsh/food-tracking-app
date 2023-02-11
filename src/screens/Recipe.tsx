import React, { useState, useEffect } from 'react';
import {StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, StatusBar, Text, View, Button, Image} from 'react-native';
import {Colors, Header} from 'react-native/Libraries/NewAppScreen';
import { getRecipes } from '../util/GetRecipe';
import { COLOURS, DROP_SHADOW, RADIUS, SPACING } from "../util/GlobalStyles";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { requestMicrophonePermissionsAsync } from 'expo-camera';
import RecipeBox from '../components/RecipeBox';


export function Recipe(): JSX.Element {
  const isDarkMode = false;

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };


  const [recipes, setRecipes] = useState([]);


  useEffect(() => {
    genRecipe()
  },[]);


  async function genRecipe(){
    var recipeList = await getRecipes("chicken")
    console.log(recipeList.hits[0])
    console.log(typeof(recipeList))
    let recipeImage = recipeList.hits[0].recipe.image
    let recipeName = recipeList.hits[0].recipe.label
    setRecipes(recipeList.hits)
    console.log(recipes[1])
  }


  return (
    // <ScrollView>
    <View
      style={{
        backgroundColor: isDarkMode ? Colors.black : Colors.white,
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
      }}>
      <Text>This is Profile page</Text>
      <Button
          title='Get Chicken'
          onPress={()=>{
            genRecipe();
          }}
        />
        {recipes.map((recipe) => {
          return (
          <RecipeBox recipeImage={recipe["recipe"]["image"]} recipeName={recipe["recipe"]["label"]}/>
          )
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
    marginBottom: 'auto'
  },

  textHeading: {
    left: '35%',
    bottom: "80%",
    fontSize: 16,
  }

});

