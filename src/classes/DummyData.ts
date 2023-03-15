import { Meal } from "../backends/Meal";
import { USER_COLOURS } from "../util/GlobalStyles";
import { Ingredient, weightUnit } from "./IngredientClass";
import { Nutrition } from "./NutritionClass";

const today = new Date();

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
  {
    colour: USER_COLOURS[5],
    name: "Fruit & Veg",
    active: false,
  },
  {
    colour: USER_COLOURS[6],
    name: "Meat & Poultry",
    active: false,
  },
  {
    colour: USER_COLOURS[7],
    name: "Fish & Seafood",
    active: false,
  },
];

export const DUMMY_STORED_INGREDIENTS: Ingredient[] = [
  new Ingredient(
    "Chocapic", //name
    430, //weight
    weightUnit.grams, //weightUnit
    30, //servingSize
    weightUnit.grams, //servingSizeType
    0, //quantity
    [DUMMY_CATEGORIES[0]], //categories
    "https://images.openfoodfacts.org/images/products/761/303/462/6844/front_en.268.400.jpg", //imageSrc
    new Date(today.getTime() - 52 * 24 * 60 * 60 * 1000), //expiryDate
    new Date(today.getTime() - 53 * 24 * 60 * 60 * 1000), //useByDate
    new Nutrition(0, 0, 0, 0, 0, 0, 0, 0), //nutrition
    0 //id
  ),
  new Ingredient(
    "TUC", //name
    100, //weight
    weightUnit.grams, //weightUnit
    15, //servingSize
    weightUnit.grams, //servingSizeType
    0, //quantity
    [DUMMY_CATEGORIES[3], DUMMY_CATEGORIES[4]], //categories
    "https://images.openfoodfacts.org/images/products/541/004/100/1204/front_en.299.400.jpg", //imageSrc
    new Date(today.getTime() - 23 * 24 * 60 * 60 * 1000), //expiryDate
    new Date(today.getTime() - 23 * 24 * 60 * 60 * 1000), //useByDate
    new Nutrition(0, 0, 0, 0, 0, 0, 0, 0), //nutrition
    1 //id
  ),
  new Ingredient(
    "Kinder Bueno", //name
    43, //weight
    weightUnit.grams, //weightUnit
    20, //servingSize
    weightUnit.grams, //servingSizeType
    69, //quantity
    [DUMMY_CATEGORIES[2], DUMMY_CATEGORIES[4]], //categories
    "https://images.openfoodfacts.org/images/products/800/050/003/7560/front_en.192.400.jpg", //imageSrc
    new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000), //expiryDate
    new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000), //useByDate
    new Nutrition(0, 0, 0, 0, 0, 0, 0, 0), //nutrition
    2 //id
  ),
  new Ingredient(
    "Oreo", //name
    154, //weight
    weightUnit.grams, //weightUnit
    30, //servingSize
    weightUnit.grams, //servingSizeType
    2, //quantity
    [DUMMY_CATEGORIES[2], DUMMY_CATEGORIES[4]], //categories
    "https://images.openfoodfacts.org/images/products/762/230/033/6738/front_en.145.400.jpg", //imageSrc
    new Date(today.getTime() - 3 * 24 * 60 * 60 * 1000), //expiryDate
    new Date(today.getTime() - 3 * 24 * 60 * 60 * 1000), //useByDate
    new Nutrition(0, 0, 0, 0, 0, 0, 0, 0), //nutrition
    3 //id
  ),
  new Ingredient(
    "Salad Tomatoes", //name
    480, //weight
    weightUnit.grams, //weightUnit
    80, //servingSize
    weightUnit.grams, //servingSizeType
    2, //quantity
    [DUMMY_CATEGORIES[0], DUMMY_CATEGORIES[5]], //categories
    "https://digitalcontent.api.tesco.com/v2/media/ghs/6bf934bc-66b3-47fb-8850-e220f59b15a7/93056288-4f0f-4137-a515-ec3231141ab3_196519809.jpeg", //imageSrc
    new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000), //expiryDate
    new Date(), //useByDate
    new Nutrition(2.5, 16, 0.6, 0.2, 0, 0.8, 0, 0), //nutrition
    4 //id
  ),
  new Ingredient(
    "Salmon Fillets", //name
    220, //weight
    weightUnit.grams, //weightUnit
    110, //servingSize
    weightUnit.grams, //servingSizeType
    1, //quantity
    [DUMMY_CATEGORIES[7]], //categories
    "https://www.masonfoods.co.uk/productimage.aspx?imageid=19053", //imageSrc
    new Date(today.getTime() + 1 * 24 * 60 * 60 * 1000), //expiryDate
    new Date(), //useByDate
    new Nutrition(0, 232, 25.2, 14.6, 2.8, 0, 0.12, 0), //nutrition
    5 //id
  ),
  new Ingredient(
    "Breaded Chicken Mini Fillets", //name
    400, //weight
    weightUnit.grams, //weightUnit
    200, //servingSize
    weightUnit.grams, //servingSizeType
    5, //quantity
    [DUMMY_CATEGORIES[6]], //categories
    "https://groceries.morrisons.com/productImages/581/581679011_0_640x640.jpg", //imageSrc
    new Date(today.getTime() + 5 * 24 * 60 * 60 * 1000), //expiryDate
    new Date(), //useByDate
    new Nutrition(19, 281, 25.5, 10.9, 2.2, 2.5, 0.87, 0), //nutrition
    6 //id
  ),
];

export const DUMMY_MEALS: Meal[] = [
  // new Meal(
  //   "Pasta bacon dish", //name
  //   [1],
  //   ["Add butter", "Add milk"],
  //   1,
  //   "https://www.youtube.com/watch?v=sagjXH3q3g0",
  //   "https://i.dailymail.co.uk/1s/2019/11/13/12/20947788-7680381-This_cheesy_beans_pasta_bacon_and_egg_dish_created_by_Niall_rece-a-1_1573646527575.jpg"
  // ),
  // new Meal(
  //   "Dish 2", //name
  //   [1],
  //   ["Add butter", "Add milk"],
  //   1,
  //   "https://www.youtube.com/watch?v=sagjXH3q3g0",
  //   "https://i.dailymail.co.uk/1s/2019/11/13/12/20947788-7680381-This_cheesy_beans_pasta_bacon_and_egg_dish_created_by_Niall_rece-a-1_1573646527575.jpg"
  // ),
  // new Meal(
  //   "Dish 3", //name
  //   [1],
  //   ["Add butter", "Add milk"],
  //   1,
  //   "https://www.youtube.com/watch?v=sagjXH3q3g0",
  //   "https://i.dailymail.co.uk/1s/2019/11/13/12/20947788-7680381-This_cheesy_beans_pasta_bacon_and_egg_dish_created_by_Niall_rece-a-1_1573646527575.jpg"
  // ),
];
