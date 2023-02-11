import React, { createContext, Dispatch, SetStateAction } from "react";
import { HomeSortingFilter } from "../screens/Home/components/Menu/HomeSortingFilters";
import { Category } from "./Categories";
import { DUMMY_CATEGORIES, DUMMY_STORED_INGREDIENTS } from "./DummyData";
import { Ingredient } from "./IngredientClass";

export interface UserData {
  storedIngredients: Ingredient[];
  ingredientCategories: Category[];
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
  //TODO replace with empty arrays
  storedIngredients: DUMMY_STORED_INGREDIENTS,
  ingredientCategories: DUMMY_CATEGORIES,
  homePageSort: HomeSortingFilter.ExpiryDateFirstToLast,
};

export const DEFAULT_USER_DATA_CONTEXT: UserDataContextInterface = {
  userData: DEFAULT_USER_DATA,
  setUserData: () => {},
};

export const UserDataContext = createContext<UserDataContextInterface>(
  DEFAULT_USER_DATA_CONTEXT
);
