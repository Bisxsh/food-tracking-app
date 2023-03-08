import React from "react"
import { Image } from "react-native"
import Axios, { AxiosResponse } from 'axios'
import { readAllIngredient } from "../backends/Database"
import { readAllMeal } from "../backends/Database"
import { UserDataContext } from "../classes/UserData"
import { Meal } from "../classes/MealClass"
import * as DB from "../backends/Database"

var APP_ID = "c86047cc"
var APP_KEY = "a9afdf98df39331609c06cab2fec2b6f"


export async function getRecipes(){
    let mealList =  <Meal[]>([])
    var recipeList: any[]= []
    var newList: any[]= []
    // var currentIngredients = await readAllIngredient()
    //need to pull dietary requirements from user profile
    //need to check for duplicate recipes
    //
    let ingredients = await readAllIngredient()
    var currentIngredientsNames: string[] = [] 
    ingredients.map((ingredient)=>{
        currentIngredientsNames.push(ingredient.name)
    })
    // console.log("current name are")
    // console.log(currentIngredientsNames)
    //probalby only query ingredient close to expiring 
    if(currentIngredientsNames.length == 0){
        return recipeList;
    }
    else{
        console.log(currentIngredientsNames)
        await Promise.all(currentIngredientsNames.map(async (ingredientName) => {
            const url = `https://api.edamam.com/search?q=${ingredientName}&app_id=${APP_ID}&app_key=${APP_KEY}`;
            const data = await Axios.get(url);
            data.data.hits.map( async (recipe: any) => {
                await Image.prefetch(recipe["recipe"]["image"])
            })
            recipeList = recipeList.concat(data.data.hits);
            // data.data.hits.map( (recipe: any) => {
            //     console.log("hit")
            //     const newMeal = new Meal(recipe["recipe"]["label"], [1], ["Add this"], 1 , recipe["recipe"]["image"], recipe["recipe"]["image"])
            //     mealList.push(newMeal)

            // })
        }))
        //console.log(JSON.stringify(recipeList[0]))
        return recipeList
    }
}


export async function getSaved(){
    let meals = await readAllMeal()
    let savedMeals = <Meal[]>([])
    meals.map((meal)=>{
        if(meal.imgSrc != ""){
        
        let temp = new Meal(
                meal.name,
                meal.categoryId,
                meal.instruction,
                meal.ingredient,
                meal._id,
                meal.url,
                meal.imgSrc
        )
        savedMeals.push(temp)
    }})
    return savedMeals
}

export async function getCustom(){
    let meals = await readAllMeal()
    let savedMeals = <Meal[]>([])
    meals.map((meal)=>{
        if(meal.imgSrc == ""){
        
        let temp = new Meal(
                meal.name,
                meal.categoryId,
                meal.instruction,
                meal.ingredient,
                meal._id,
                meal.url,
                meal.imgSrc
        )
        savedMeals.push(temp)
    }})
    return savedMeals
}




export async function getDietReq(){
    // console.log(await readAllIngredient())
    //check for user dietary requirements
    let userData = await DB.readUser(0) == null ? [] : (await DB.readUser(0))?.dietReq
    return userData
}