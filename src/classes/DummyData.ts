import { USER_COLOURS } from "../util/GlobalStyles";
import { Ingredient, weightUnit } from "./IngredientClass";
import { Nutrition } from "./NutritionClass";
import { Meal } from "./MealClass";

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


export const DUMMY_MEALS: Meal[] = [
  new Meal(
    "Pasta bacon dish", //name
    [1],
    ["Add butter", "Add milk"],
    1,
    "https://www.youtube.com/watch?v=sagjXH3q3g0",
    "https://i.dailymail.co.uk/1s/2019/11/13/12/20947788-7680381-This_cheesy_beans_pasta_bacon_and_egg_dish_created_by_Niall_rece-a-1_1573646527575.jpg"
  ),
  new Meal(
    "Dish 2", //name
    [1],
    ["Add butter", "Add milk"],
    1,
    "https://www.youtube.com/watch?v=sagjXH3q3g0",
    "https://i.dailymail.co.uk/1s/2019/11/13/12/20947788-7680381-This_cheesy_beans_pasta_bacon_and_egg_dish_created_by_Niall_rece-a-1_1573646527575.jpg"
  ),
  new Meal(
    "Dish 3", //name
    [1],
    ["Add butter", "Add milk"],
    1,
    "https://www.youtube.com/watch?v=sagjXH3q3g0",
    "https://i.dailymail.co.uk/1s/2019/11/13/12/20947788-7680381-This_cheesy_beans_pasta_bacon_and_egg_dish_created_by_Niall_rece-a-1_1573646527575.jpg"
  ),
];

