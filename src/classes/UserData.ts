import React, { createContext, Dispatch, SetStateAction } from "react";
import { HomeSortingFilter } from "../screens/Home/components/Menu/HomeSortingFilters";
import { RecipeSortingFilter } from "../screens/Recipe/RecipeSortingFilters";
import { Category } from "./Categories";
import {
  DUMMY_CATEGORIES,
  DUMMY_STORED_INGREDIENTS,
  DUMMY_MEALS,
} from "./DummyData";
import { Ingredient } from "./IngredientClass";
import { Meal } from "./MealClass";
import { readAllMeal } from "../backends/Database";

export interface UserData {
  storedIngredients: Ingredient[];
  ingredientCategories: Category[];
  homePageSort: HomeSortingFilter;
  savedRecipes: Meal[];
  customRecipes: Meal[];
  recipesPageSort: RecipeSortingFilter;
  exploreRecipes: any[];
  //TODO implement
  // recipeCategories: RecipeCategory[];
  // dietaryRequriements: DietaryRequirement[];
  // ingredientHistory: UsedIngredient[];
  // massWasted: DateMassMap;
  // costWasted: DateCostMap;
}

export interface UserDataContextInterface {
  userData: UserData;
  setUserData: Dispatch<SetStateAction<UserData>>;
}

export const DEFAULT_USER_DATA: UserData = {
  //TODO replace with empty arrays
  storedIngredients: [], // DUMMY_STORED_INGREDIENTS,
  ingredientCategories: [], //DUMMY_CATEGORIES,
  homePageSort: HomeSortingFilter.ExpiryDateFirstToLast,
  recipesPageSort: RecipeSortingFilter.TimeLowToHigh,
  savedRecipes:  DUMMY_MEALS,
  customRecipes: [],
  exploreRecipes: <any>[],
};

export const DEFAULT_USER_DATA_CONTEXT: UserDataContextInterface = {
  userData: DEFAULT_USER_DATA,
  setUserData: () => {},
};

export const UserDataContext = createContext<UserDataContextInterface>(
  DEFAULT_USER_DATA_CONTEXT
);
