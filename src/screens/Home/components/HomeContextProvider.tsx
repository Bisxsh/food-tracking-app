import { Dispatch, SetStateAction, createContext } from "react";
import { Ingredient } from "../../../backends/Ingredient";
import { IngredientBuilder } from "../../../classes/IngredientClass";

export interface HomeContext {
  ingredientBeingEdited: IngredientBuilder | null;
  displayedIngredients: Ingredient[];
}

export interface HomeContextInterface {
  homeContext: HomeContext;
  setHomeContext: Dispatch<SetStateAction<HomeContext>>;
}

export const DEFAULT_HOME_DATA: HomeContext = {
  ingredientBeingEdited: null,
  displayedIngredients: [],
};

export const DEFAULT_HOME_CONTEXT: HomeContextInterface = {
  homeContext: DEFAULT_HOME_DATA,
  setHomeContext: () => {},
};

export const HomeContext =
  createContext<HomeContextInterface>(DEFAULT_HOME_CONTEXT);
