import { StyleSheet, Text, TextInput, View, Image, ScrollView, TouchableOpacity } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { readAllIngredient } from "../backends/Database";
import CustomSearchBar from "./CustomSearchBar";
import {Colors, Header} from 'react-native/Libraries/NewAppScreen';
import { getRecipes } from '../util/GetRecipe';
import { COLOURS, DROP_SHADOW, RADIUS, SPACING } from "../util/GlobalStyles";
import IngredientsList from "./InstructionsList";


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
          {console.log(ingredient)}
            return (
                <TouchableOpacity>
                <View style={{padding:10}} key={ingredient}>
                    <Text>{ingredient}</Text>
                    <Image source={{uri: "https://d.newsweek.com/en/full/530445/12-23-lingscars-01.jpg?w=1600&h=1600&q=88&f=526c077afee8b191f79da78615ee562b"}} style={{width: 50, height: 50}} />
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
      height: 250,
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
  
  