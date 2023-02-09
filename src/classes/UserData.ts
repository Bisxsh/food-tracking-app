import React, { createContext, Dispatch, SetStateAction } from "react";
import { HomeSortingFilter } from "../screens/Home/components/Menu/HomeSortingFilters";
import { IngredientCategory } from "./Categories";
import { Ingredient } from "./IngredientClass";

export interface UserData {
  storedIngredients: Ingredient[];
  ingredientCategories: IngredientCategory[];
  homePageSort: HomeSortingFilter;
  //TODO implement
  // savedRecipes: Recipe[];
  // recipesPageSort: RecipeSortingFilter;
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
  storedIngredients: [],
  ingredientCategories: [],
  homePageSort: HomeSortingFilter.ExpiryDateHighToLow,
};

export const DEFAULT_USER_DATA_CONTEXT: UserDataContextInterface = {
  userData: DEFAULT_USER_DATA,
  setUserData: () => {},
};

export const UserDataContext = createContext<UserDataContextInterface>(
  DEFAULT_USER_DATA_CONTEXT
);
