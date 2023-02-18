import { USER_COLOURS } from "../util/GlobalStyles";
import { Ingredient, weightUnit } from "./IngredientClass";
import { Nutrition } from "./NutritionClass";

export const DUMMY_CATEGORIES = [
  {
    colour: USER_COLOURS[0],
    name: "Breakfast",
    active: false,
  },
  {
    colour: USER_COLOURS[1],
    name: "Lunch",
    active: false,
  },
  {
    colour: USER_COLOURS[2],
    name: "Dinner",
    active: false,
  },
  {
    colour: USER_COLOURS[3],
    name: "Snacks",
    active: false,
  },
  {
    colour: USER_COLOURS[4],
    name: "MeGusta",
    active: false,
  },
];

export const DUMMY_STORED_INGREDIENTS: Ingredient[] = [
  new Ingredient(
    "Chocapic", //name
    430, //weight
    weightUnit.grams, //weightUnit
    1, //quantity
    [DUMMY_CATEGORIES[0]], //categories
    "https://images.openfoodfacts.org/images/products/761/303/462/6844/front_en.268.400.jpg", //imageSrc
    new Date(new Date().getTime() + 52 * 24 * 60 * 60 * 1000), //expiryDate
    new Date(new Date().getTime() + 52 * 24 * 60 * 60 * 1000), //useByDate
    new Nutrition(0, 0, 0, 0, 0, 0, 0, 0), //nutrition
    0 //id
  ),
  new Ingredient(
    "TUC", //name
    100, //weight
    weightUnit.grams, //weightUnit
    2, //quantity
    [DUMMY_CATEGORIES[3], DUMMY_CATEGORIES[4]], //categories
    "https://images.openfoodfacts.org/images/products/541/004/100/1204/front_en.299.400.jpg", //imageSrc
    new Date(new Date().getTime() + 23 * 24 * 60 * 60 * 1000), //expiryDate
    new Date(new Date().getTime() + 23 * 24 * 60 * 60 * 1000), //useByDate
    new Nutrition(0, 0, 0, 0, 0, 0, 0, 0), //nutrition
    1 //id
  ),
  new Ingredient(
    "Kinder Bueno", //name
    43, //weight
    weightUnit.grams, //weightUnit
    69, //quantity
    [DUMMY_CATEGORIES[2], DUMMY_CATEGORIES[4]], //categories
    "https://images.openfoodfacts.org/images/products/800/050/003/7560/front_en.192.400.jpg", //imageSrc
    new Date(new Date().getTime() + 2 * 24 * 60 * 60 * 1000), //expiryDate
    new Date(new Date().getTime() + 2 * 24 * 60 * 60 * 1000), //useByDate
    new Nutrition(0, 0, 0, 0, 0, 0, 0, 0), //nutrition
    2 //id
  ),
];
