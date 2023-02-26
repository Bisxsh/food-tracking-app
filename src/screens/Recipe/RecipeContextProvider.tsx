import { Dispatch, SetStateAction, createContext } from "react";
import { MealBuilder } from "../../classes/MealClass";

export interface RecipeContext {
  recipeBeingEdited: MealBuilder | null;
}

export interface RecipeContextInterface {
  recipeContext: RecipeContext;
  setRecipeContext: Dispatch<SetStateAction<RecipeContext>>;
}

export const DEFAULT_RECIPE_DATA: RecipeContext = {
  recipeBeingEdited: null,
};

export const DEFAULT_RECIPE_CONTEXT: RecipeContextInterface = {
  recipeContext: DEFAULT_RECIPE_DATA,
  setRecipeContext: () => {},
};

export const RecipeContext =
  createContext<RecipeContextInterface>(DEFAULT_RECIPE_CONTEXT);
