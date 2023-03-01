import { Ingredient } from "../classes/IngredientClass";

export function getTimeLeft(ingredient: Ingredient) {
  const expiryDate = ingredient.expiryDate;
  const timeLeft = Math.floor(
    (expiryDate.getTime() - new Date().getTime()) / 1000 / 60 / 60 / 24
  );
  if (timeLeft < 0) return "Expired";
  if (timeLeft == 0) return "Today";
  if (timeLeft > 365) return "1 year+";
  return timeLeft + " day" + (timeLeft > 1 ? "s" : "");
}

export const getDaysUntilExpiry = (ingredient: Ingredient) => {
  const expiryDate = ingredient.expiryDate;
  const timeLeft = Math.floor(
    (expiryDate.getTime() - new Date().getTime()) / 1000 / 60 / 60 / 24
  );
  return parseInt(timeLeft.toString());
};
