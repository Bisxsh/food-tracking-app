import { Dispatch, SetStateAction, createContext } from "react";
import { Meal } from "../../backends/Meal";
import { MealBuilder } from "../../classes/MealClass";

export interface RecipeContext {
  recipeBeingEdited: MealBuilder | null;
  recipeBeingViewed: Meal | null;
  viewedRecipeFavourite: boolean;
  viewedRecipeSource: string;
  viewedRecipeIngredients: string[];
}

export interface RecipeContextInterface {
  recipeContext: RecipeContext;
  setRecipeContext: Dispatch<SetStateAction<RecipeContext>>;
}

export const DEFAULT_RECIPE_DATA: RecipeContext = {
  recipeBeingEdited: null,
  recipeBeingViewed: null,
  viewedRecipeFavourite: false,
  viewedRecipeSource: "",
  viewedRecipeIngredients: [],
};

export const DEFAULT_RECIPE_CONTEXT: RecipeContextInterface = {
  recipeContext: DEFAULT_RECIPE_DATA,
  setRecipeContext: () => {},
};

export const RecipeContext = createContext<RecipeContextInterface>(
  DEFAULT_RECIPE_CONTEXT
);
