import React from "react";
import { Image } from "react-native";
import Axios, { AxiosResponse } from "axios";
import { readAllIngredient } from "../backends/Database";
import { readAllMeal } from "../backends/Database";
import { UserDataContext } from "../classes/UserData";
import { differenceInDays, isSameDay } from "date-fns";
import * as DB from "../backends/Database";
import { Meal } from "../backends/Meal";
import { getMealFromAPI } from "../screens/Recipe/Recipe";

var APP_ID = "c86047cc";
var APP_KEY = "a9afdf98df39331609c06cab2fec2b6f";

export async function getRecipes() {
  let mealList = <Meal[]>[];
  var recipeList: Meal[] = [];
  var newList: Meal[] = [];
  // var currentIngredients = await readAllIngredient()
  //need to pull dietary requirements from user profile
  //need to check for duplicate recipes
  //
  let ingredients = await readAllIngredient();

  var currentIngredientsTuple: any[] = [];

  ingredients.map((ingredient) => {
    if (ingredient.expiryDate != undefined) {
      if (differenceInDays(ingredient.expiryDate, new Date()) > 0) {
        currentIngredientsTuple.push([
          ingredient.name,
          differenceInDays(ingredient.expiryDate, new Date()),
        ]);
      }
    }
  });
  currentIngredientsTuple = currentIngredientsTuple.sort((a, b) => {
    return a[1] - b[1];
  });

  if (currentIngredientsTuple.length > 9) {
    currentIngredientsTuple = currentIngredientsTuple.slice(0, 9);
  }

  if (currentIngredientsTuple.length == 0) {
    return recipeList;
  } else {
    await Promise.all(
      currentIngredientsTuple.map(async (ingredientName) => {
        const url = `https://api.edamam.com/search?q=${ingredientName[0]}&app_id=${APP_ID}&app_key=${APP_KEY}`;
        const data = await Axios.get(url);
        data.data.hits.map(async (recipe: any) => {
          await Image.prefetch(recipe["recipe"]["image"]);
        });
        recipeList = recipeList.concat(
          data.data.hits.map((r: any) => getMealFromAPI(r.recipe))
        );
        // data.data.hits.map( (recipe: any) => {
        //     console.log("hit")
        //     const newMeal = new Meal(recipe["recipe"]["label"], [1], ["Add this"], 1 , recipe["recipe"]["image"], recipe["recipe"]["image"])
        //     mealList.push(newMeal)

        // })
        // console.log(recipeList);
      })
    );
    //console.log(JSON.stringify(recipeList[0]))
    return recipeList;
  }
}

export async function getSaved() {
  let meals = await readAllMeal();
  //console.log(meals.map((meal) => meal.favourite));

  return meals?.filter((meal) => meal.favourite);
}

export async function getCustom() {
  let meals = await readAllMeal();
  return meals?.filter((meal) => !meal.url);
}

export async function getDietReq() {
  // console.log(await readAllIngredient())
  //check for user dietary requirements
  let userData =
    (await DB.readUser(0)) == undefined ? [] : (await DB.readUser(0))?.dietReq;
  return userData;
}

export async function getSearchRecipe(recipeName: string) {
  var recipeList: any[] = [];

  const url = `https://api.edamam.com/search?q=${recipeName}&app_id=${APP_ID}&app_key=${APP_KEY}`;
  const data = await Axios.get(url);
  data.data.hits.map(async (recipe: any) => {
    await Image.prefetch(recipe["recipe"]["image"]);
  });
  recipeList = recipeList.concat(data.data.hits);
  return recipeList;
}
