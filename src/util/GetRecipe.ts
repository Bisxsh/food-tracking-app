import React from "react"
import Axios, { AxiosResponse } from 'axios'
import { readAllIngredient } from "../backends/Database"


const APP_ID = "c86047cc"
const APP_KEY = "a9afdf98df39331609c06cab2fec2b6f"


export async function getRecipes(){
    var recipeList: any[]= []
    // var currentIngredients = await readAllIngredient()
    //need to pull dietary requirements from user profile
    //need to check for duplicate recipes
    //
    let ingredients = await readAllIngredient()
    var currentIngredientsNames: string[] = [] 
    ingredients.map((ingredient)=>{
        currentIngredientsNames.push(ingredient.name)
    })
    console.log("current name are")
    console.log(currentIngredientsNames)
    if(currentIngredientsNames.length == 0){
        return recipeList;
    }
    else{
        await Promise.all(currentIngredientsNames.map(async (ingredientName) => {
            const url = `https://api.edamam.com/search?q=${ingredientName}&app_id=${APP_ID}&app_key=${APP_KEY}`;
            const data = await Axios.get(url);
            recipeList = recipeList.concat(data.data.hits);
        }))
        return recipeList
    }

}

export async function getDietReq(){
    console.log(await readAllIngredient())
    //check for user dietary requirements
    return ["Kosher","Dairy-Free"]
}