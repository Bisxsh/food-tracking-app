import { Ingredient } from "../classes/IngredientClass";

export function getTimeLeft(ingredient: Ingredient) {
  const expiryDate = ingredient.expiryDate;
  const timeLeft = Math.floor(
    (expiryDate.getTime() - new Date().getTime()) / 1000 / 60 / 60 / 24
  );
  return timeLeft > 0 ? timeLeft + " days" : "Today";
}
