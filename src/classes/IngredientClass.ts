import { Category } from "./Categories";
import { Nutrition, NutritionBuilder } from "./NutritionClass";

export enum weightUnit {
  kg = "kg",
  grams = "grams",
}

export class Ingredient {
  name: string;
  weight: number;
  weightType: weightUnit;
  quantity: number;
  categories: Category[];
  imgSrc: string;
  useDate: Date;
  expiryDate: Date;
  nutrition: Nutrition;
  id: number;

  constructor(
    name: string,
    weight: number,
    weightType: weightUnit,
    quantity: number,
    categories: Category[],
    imgSrc: string,
    expiryDate: Date,
    useDate: Date,
    nutrition: Nutrition,
    id: number
  ) {
    this.name = name;
    this.weight = weight;
    this.weightType = weightType;
    this.quantity = quantity;
    this.categories = categories;
    this.imgSrc = imgSrc;
    this.useDate = useDate;
    this.expiryDate = expiryDate;
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
  private categories: Category[];
  private imgSrc: string;
  private useDate: Date;
  private expiryDate: Date;
  private nutrition: NutritionBuilder;
  private id: number;

  constructor() {
    this.name = "";
    this.weight = 0;
    this.weightType = weightUnit.kg;
    this.quantity = 0;
    this.categories = [];
    this.imgSrc = "";
    this.useDate = new Date();
    this.expiryDate = new Date();
    this.nutrition = new NutritionBuilder();
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

  public build(): Ingredient {
    return new Ingredient(
      this.name,
      this.weight,
      this.weightType,
      this.quantity,
      this.categories,
      this.imgSrc,
      this.expiryDate,
      this.useDate,
      this.nutrition.build(),
      this.id
    );
  }
}
