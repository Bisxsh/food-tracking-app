export enum RecipeSortingFilter {
  CaloriesLowToHigh = "Calories: Low to High",
  CaloriesHighToLow = "Calories: High to Low",
  IngredientsLowToHigh = "Ingredients: Low to High",
  IngredientsHighToLow = "Ingredients: High to Low",
  TimeLowToHigh = "Time: Low to High",
  TimeHighToLow = "Time: High to Low",
}

export const RecipeSortingFilters = [
  RecipeSortingFilter.TimeLowToHigh,
  RecipeSortingFilter.TimeHighToLow,
  RecipeSortingFilter.CaloriesLowToHigh,
  RecipeSortingFilter.CaloriesHighToLow,
  RecipeSortingFilter.IngredientsLowToHigh,
  RecipeSortingFilter.IngredientsHighToLow,
];
