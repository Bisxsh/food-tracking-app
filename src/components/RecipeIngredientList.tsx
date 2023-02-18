import { StyleSheet, Text, TextInput, View, Image, ScrollView, TouchableOpacity } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { readAllIngredient } from "../backends/Database";
import CustomSearchBar from "./CustomSearchBar";
import {Colors, Header} from 'react-native/Libraries/NewAppScreen';
import { getRecipes } from '../util/GetRecipe';
import { COLOURS, DROP_SHADOW, RADIUS, SPACING } from "../util/GlobalStyles";
import IngredientsList from "./IngredientsList";


function RecipeIngredientList() {


    useEffect(() => {
        RecipeIngredientList();
    }, []);

    const [ingredientsSearch, setIngredientsSearch] = useState("");
    const [ingredientList, setIngredientList] = useState<any[]>([]);


    async function RecipeIngredientList() {
        let ingredient = await readAllIngredient();
        setIngredientList(ingredient);
    }

  return (
    <><Text>Ingredients</Text>
    
    <View style={styles.container}>
        <View style={{paddingTop:10}}>
        <ScrollView >
    <CustomSearchBar textHint={"Search Ingredient"} text={ingredientsSearch} setText={setIngredientsSearch} width={360} height={40} />
    {
        ingredientList.map((ingredient) => {
            return (
                <TouchableOpacity>
                <View style={{padding:10}}key={ingredient["_id"]}>
                    <Text>{ingredient.name}</Text>
                    <Image source={{uri: ingredient.image}} style={{width: 50, height: 50}} />
                </View>
                </TouchableOpacity>
            )
        })
    }
    </ScrollView>
    </View>
    </View>
    </>
  )
}
export default RecipeIngredientList

const styles = StyleSheet.create({
    container: {
        height: "40%",
      flexDirection: "column",
      backgroundColor: COLOURS.white,
      borderWidth: 2,
      borderColor: COLOURS.grey,
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
  
  