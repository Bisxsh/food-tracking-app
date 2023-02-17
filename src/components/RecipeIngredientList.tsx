import { StyleSheet, Text, TextInput, View } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { readAllIngredient } from "../backends/Database";
import CustomSearchBar from "./CustomSearchBar";

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
    <>
    <Text>RecipeIngredientList</Text>
    <CustomSearchBar textHint={"Search Ingredient"} text={ingredientsSearch} setText={setIngredientsSearch} width={300} height={40} />
    {
        ingredientList.map((ingredient) => {
            return (
                <View key={ingredient.id}>
                    <Text>{ingredient.name}</Text>
                </View>
            )
        })
    }
    </>
  )
}
export default RecipeIngredientList