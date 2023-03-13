import { Category, toCategoryBack } from "./Categories";
import { Nutrition, NutritionBuilder } from "./NutritionClass";
import * as IngredientBack from "../backends/Ingredient";
import * as DB from "../backends/Database";

export enum weightUnit {
  grams = "grams",
  kg = "kg",
}

export class Ingredient {
  name: string;
  weight: number;
  weightType: weightUnit;
  servingSize: number;
  servingSizeType: weightUnit;
  quantity: number;
  categories: Category[];
  imgSrc: string;
  addDate: Date;
  useDate: Date | undefined;
  expiryDate: Date;
  nutrition: Nutrition;
  id: number;

  constructor(
    name: string,
    weight: number,
    weightType: weightUnit,
    servingSize: number,
    servingSizeType: weightUnit,
    quantity: number,
    categories: Category[],
    imgSrc: string,
    expiryDate: Date,
    useDate: Date | undefined,
    nutrition: Nutrition,
    id: number,
    addDate?: Date
  ) {
    this.name = name;
    this.weight = weight;
    this.weightType = weightType;
    this.servingSize = servingSize;
    this.servingSizeType = servingSizeType;
    this.quantity = quantity;
    this.categories = categories;
    this.imgSrc = imgSrc;
    this.addDate = addDate != undefined ? addDate : new Date();
    this.useDate = useDate;
    this.expiryDate = expiryDate;
    this.nutrition = nutrition;
    this.id = id;
  }

  toIngredientBack(): IngredientBack.Ingredient {
    return new IngredientBack.Ingredient(
      this.name,
      this.quantity,
      this.weightType,
      this.servingSizeType,
      this.nutrition.toNutritionBack(),
      this.categories.map((v) => toCategoryBack(v)).map((v) => v._id),
      this.id,
      this.weight,
      this.servingSize,
      this.imgSrc,
      this.addDate,
      this.useDate,
      this.expiryDate
    );
  }

  //#region getters and setters

  public get getName(): string {
    return this.name;
  }
  public set setName(name: string) {
    this.name = name;
  }

  public get getWeight(): number {
    return this.weight;
  }
  public set setWeight(weight: number) {
    this.weight = weight;
  }

  public get getWeightType(): weightUnit {
    return this.weightType;
  }
  public set setWeightType(weightType: weightUnit) {
    this.weightType = weightType;
  }

  public get getQuantity(): number {
    return this.quantity;
  }
  public set setQuantity(quantity: number) {
    this.quantity = quantity;
  }

  public get getImgSrc(): string {
    return this.imgSrc;
  }
  public set setImgSrc(imgSrc: string) {
    this.imgSrc = imgSrc;
  }

  public get getNutrition(): Nutrition {
    return this.nutrition;
  }
  public set setnutrition(nutrition: Nutrition) {
    this.nutrition = nutrition;
  }

  public get getId(): number {
    return this.id;
  }
  public set setId(id: number) {
    this.id = id;
  }
  //#endregion
}

export class IngredientBuilder {
  private name: string;
  private weight: number;
  private weightType: weightUnit;
  private servingSize: number;
  private servingSizeType: weightUnit;
  private quantity: number;
  private categories: Category[];
  private imgSrc: string;
  private addDate: Date;
  private useDate: Date | undefined;
  private expiryDate: Date;
  private nutrition: NutritionBuilder;
  private id: number;

  constructor() {
    this.name = "";
    this.weight = 0;
    this.weightType = weightUnit.grams;
    this.servingSize = 1;
    this.servingSizeType = weightUnit.grams;
    this.quantity = 1;
    this.categories = [];
    this.imgSrc = "";
    this.addDate = new Date();
    this.useDate = undefined;
    this.expiryDate = new Date();
    this.nutrition = new NutritionBuilder();
    this.id = -1;
  }

  public static fromIngredient(ingredient: Ingredient): IngredientBuilder {
    let builder = new IngredientBuilder();
    builder.name = ingredient.name;
    builder.weight = ingredient.weight;
    builder.weightType = ingredient.weightType;
    builder.servingSize = ingredient.servingSize;
    builder.servingSizeType = ingredient.servingSizeType;
    builder.quantity = ingredient.quantity;
    builder.categories = ingredient.categories;
    builder.imgSrc = ingredient.imgSrc;
    builder.addDate = ingredient.addDate;
    builder.useDate = ingredient.useDate;
    builder.expiryDate = ingredient.expiryDate;
    builder.nutrition = NutritionBuilder.fromNutrition(ingredient.nutrition);
    builder.id = ingredient.id;
    return builder;
  }

  public setName(name: string): IngredientBuilder {
    this.name = name;
    return this;
  }

  public setWeight(weight: number): IngredientBuilder {
    this.weight = weight;
    return this;
  }

  public setWeightType(weightType: weightUnit): IngredientBuilder {
    this.weightType = weightType;
    return this;
  }

  public setServingSize(servingSize: number): IngredientBuilder {
    this.servingSize = servingSize;
    return this;
  }

  public setServingSizeType(servingSizeType: weightUnit): IngredientBuilder {
    this.servingSizeType = servingSizeType;
    return this;
  }

  public setQuantity(
    quantity: number,
    setUsed: boolean = false
  ): IngredientBuilder {
    this.quantity = quantity;
    if (quantity == 0 && setUsed) {
      this.useDate = new Date();
    }
    return this;
  }

  public setCategories(categories: Category[]): IngredientBuilder {
    this.categories = categories;
    return this;
  }

  public setImgSrc(imgSrc: string): IngredientBuilder {
    this.imgSrc = imgSrc;
    return this;
  }

  public setUseDate(useDate: Date): IngredientBuilder {
    this.useDate = useDate;
    return this;
  }

  public setExpiryDate(expiryDate: Date): IngredientBuilder {
    this.expiryDate = expiryDate;
    return this;
  }

  public getNutritionBuilder(): NutritionBuilder {
    return this.nutrition;
  }

  public setId(id: number): IngredientBuilder {
    this.id = id;
    return this;
  }

  public allRequiredFieldsSet(): boolean {
    return this.name !== "" && this.weight !== 0;
  }

  public getName(): string {
    return this.name;
  }

  public getWeight(): number {
    return this.weight;
  }

  public getWeightType(): weightUnit {
    return this.weightType;
  }

  public getServingSize(): number {
    return this.servingSize;
  }

  public getServingSizeType(): weightUnit {
    return this.servingSizeType;
  }

  public getQuantity(): number {
    return this.quantity;
  }

  public getCategories(): Category[] {
    return this.categories;
  }

  public getImgSrc(): string {
    return this.imgSrc;
  }

  public getUseDate(): Date | undefined {
    return this.useDate;
  }

  public getExpiryDate(): Date {
    return this.expiryDate;
  }

  public getId(): number {
    return this.id;
  }

  public build(): Ingredient {
    const ing = new Ingredient(
      this.name,
      this.weight,
      this.weightType,
      this.servingSize,
      this.servingSizeType,
      this.quantity,
      this.categories,
      this.imgSrc,
      this.expiryDate,
      this.useDate,
      this.nutrition.build(),
      this.id,
      this.addDate
    );

    DB.readIngredient(this.id).then((value) => {
      if (value == undefined) {
        DB.create(ing.toIngredientBack());
      } else {
        DB.updateIngredient(ing.toIngredientBack());
      }
    });

    return ing;
  }
}
