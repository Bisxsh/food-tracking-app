import { Nutrition } from "./NutritionClass";

export enum weightUnit {
  kg,
  grams,
}

export class Ingredient {
  name: string;
  weight: number;
  weightType: weightUnit;
  quantity: number;
  //categories: enum
  imgSrc: string;
  //useDate: DateClass;
  //expiryDate: DateClass;
  nutrition: Nutrition;
  id: number;

  constructor(
    name: string,
    weight: number,
    weightType: weightUnit,
    quantity: number,
    imgSrc: string,
    nutrition: Nutrition,
    id: number
  ) {
    //imgSrc: string, expiryDate: DateClass, id: number
    this.name = name;
    this.weight = weight;
    this.weightType = weightType;
    this.quantity = quantity;
    this.imgSrc = imgSrc;
    //this.useDate = no date;
    // this.expiryDate = expiryDate;
    this.nutrition = nutrition;
    this.id = id;
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
  private quantity: number;
  private imgSrc: string;
  private nutrition: Nutrition;
  private id: number;

  constructor() {
    this.name = "";
    this.weight = 0;
    this.weightType = weightUnit.grams;
    this.quantity = 0;
    this.imgSrc = "";
    this.nutrition = new Nutrition(0, 0, 0, 0, 0, 0, 0, 0);
    this.id = 0;
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

  public setQuantity(quantity: number): IngredientBuilder {
    this.quantity = quantity;
    return this;
  }

  public setImgSrc(imgSrc: string): IngredientBuilder {
    this.imgSrc = imgSrc;
    return this;
  }

  public setNutrition(nutrition: Nutrition): IngredientBuilder {
    this.nutrition = nutrition;
    return this;
  }

  public setId(id: number): IngredientBuilder {
    this.id = id;
    return this;
  }

  public build(): Ingredient {
    return new Ingredient(
      this.name,
      this.weight,
      this.weightType,
      this.quantity,
      this.imgSrc,
      this.nutrition,
      this.id
    );
  }
}
