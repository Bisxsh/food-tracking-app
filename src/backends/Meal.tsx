import * as MealClass from "../classes/MealClass";
import { Ingredient, MealIngredient } from "./Ingredient";
import { Nutrition } from "./Nutrition";

export class Meal {
  _id!: number;
  name: string;
  url?: string;
  imgSrc?: string;
  categoryId: number[];
  instruction: string[];
  ingredient: Ingredient[];
  source?: string;
  cautions?: string[];
  healthLabels?: string[];
  nutrition: Nutrition;
  servings: number;
  time: number;
  favourite: boolean;
  mealIngredients: string[];

  constructor(
    name: string,
    categoryId: number[],
    instruction: string[],
    ingredient: Ingredient[],
    _id?: number,
    url?: string,
    imgSrc?: string,
    source?: string,
    cautions?: string[],
    healthLabels?: string[],
    nutrition?: Nutrition,
    servings?: number,
    time?: number,
    favourite?: boolean,
    mealIngredients?: string[]
  ) {
    if (_id != undefined) {
      Meal.count = Math.max(_id, Meal.count);
    } else if (_id == undefined || _id == -1){
      Meal.count += 1;
    }
    this._id = _id != undefined && _id != -1 ? _id : Meal.count;
    this.name = name;
    this.url = url;
    this.imgSrc = imgSrc;
    this.categoryId = categoryId;
    this.instruction = instruction;
    this.ingredient = ingredient;
    this.source = source;
    this.cautions = cautions != undefined ? cautions : [];
    this.healthLabels = healthLabels != undefined ? healthLabels : [];
    this.nutrition = nutrition != undefined ? nutrition : new Nutrition();
    this.servings = servings != undefined ? servings : 1;
    this.time = time != undefined ? time : 0;
    this.favourite = favourite != undefined ? favourite : false;
    this.mealIngredients = mealIngredients != undefined ? mealIngredients : [];
  }

  toList(): any[] {
    return [
      this._id,
      this.name,
      this.url,
      this.imgSrc,
      "," + this.categoryId.toString() + ",",
      this.instruction.join("<###>"),
      this.ingredient
        .map((value) => value.toList().join("<%%%>"))
        .join("<###>"),
      this.source,
      this.cautions?.join("<###>"),
      JSON.stringify(this.nutrition),
      this.servings,
      this.time,
      this.favourite,
    ];
  }

  static count = -1;

  static fromList(properties: any[]): Meal {
    return new Meal(
      properties[1], // name
      (properties[4] as string)
        .substring(1, (properties[4] as string).length - 1)
        .split(",")
        .map((value) => Number.parseInt(value)), // categoryId
      (properties[5] as string).split("<###>"), // instruction
      (properties[6] as string)
        .split("<###>")
        .filter((value) => value != "")
        .map((value) => Ingredient.fromList(value.split("<%%%>"))), // ingredient
      properties[0], // _id
      properties[2], // url
      properties[3], // imgSrc
      properties[7], // source
      (properties[8] as string).split("<###>"), // caution
      [], // healthLabels
      Nutrition.fromList(Object.values(JSON.parse(properties[9]))), // Nutrition
      properties[10], // serving
      properties[11], // time
      properties[12], // favourite
      [] // mealIngredients
    );
  }

  toMealClass(): MealClass.Meal{
    return new MealClass.Meal(
      this.name,
      this.categoryId,
      this.instruction,
      this.ingredient,
      this._id,
      this.url,
      this.imgSrc
    )
  }

  static reset() {
    Meal.count = 0;
  }

  static fromBuilder(builder: MealClass.MealBuilder) {
    return new Meal(
      builder.getName(),
      builder.getCategoryId(),
      builder.getInstruction(),
      builder.getIngredients(),
      builder.getId(),
      undefined,
      builder.getImgSrc(),
      undefined,
      undefined,
      undefined,
      new Nutrition(
        undefined,
        builder
          .getIngredients()
          .map((v) => v.getNutrition.carbs)
          .reduce((a, b) => a + b, 0),
        "g",
        builder
          .getIngredients()
          .map((v) => v.getNutrition.energy)
          .reduce((a, b) => a + b, 0),
        "kcal",
        builder
          .getIngredients()
          .map((v) => v.getNutrition.protein)
          .reduce((a, b) => a + b, 0),
        "g",
        builder
          .getIngredients()
          .map((v) => v.getNutrition.fat)
          .reduce((a, b) => a + b, 0),
        "g",
        builder
          .getIngredients()
          .map((v) => v.getNutrition.saturatedFat)
          .reduce((a, b) => a + b, 0),
        "g",
        builder
          .getIngredients()
          .map((v) => v.getNutrition.fibre)
          .reduce((a, b) => a + b, 0),
        "g",
        builder
          .getIngredients()
          .map((v) => v.getNutrition.salt)
          .reduce((a, b) => a + b, 0),
        "g",
        builder
          .getIngredients()
          .map((v) => v.getNutrition.sugar)
          .reduce((a, b) => a + b, 0),
        "g"
      )
    );
  }
}
