import { Category } from "./Categories";
import { Ingredient } from "../backends/Ingredient";
import { Nutrition, NutritionBuilder } from "./NutritionClass";

export enum weightUnit {
  grams = "grams",
  kg = "kg",
}

export class Meal {
  name: string;
  categoryId: number[];
  instruction: string[];
  ingredients: Ingredient[];
  _id?: number;
  url?: string;
  imgSrc?: string;

  constructor(
    name: string,
    categoryId: number[],
    instruction: string[],
    ingredients: Ingredient[],
    _id?: number,
    url?: string,
    imgSrc?: string
  ) {
    this.name = name;
    this.categoryId = categoryId;
    this.instruction = instruction;
    this.ingredients = ingredients;
    this._id = _id;
    this.url = url;
    this.imgSrc = imgSrc;
  }

  public toList(): any[] {
    return [
      this.name,
      this.categoryId,
      this.instruction,
      this._id,
      this.url,
      this.imgSrc,
    ];
  }

  //#region getters and setters

  public get getName(): string {
    return this.name;
  }
  public set setName(name: string) {
    this.name = name;
  }

  public get getCategoryId(): number[] {
    return this.categoryId;
  }
  public set setCategoryId(categoryId: number[]) {
    this.categoryId = categoryId;
  }

  public get getInstruction(): string[] {
    return this.instruction;
  }
  public set setInstruction(instruction: string[]) {
    this.instruction = instruction;
  }

  public get getIngredients(): Ingredient[] {
    return this.ingredients;
  }
  public set setIngredients(ingredients: Ingredient[]) {
    this.ingredients = ingredients;
  }

  public get getId(): number {
    return this._id!;
  }
  public set setId(_id: number) {
    this._id = _id;
  }

  public get getUrl(): string {
    return this.url!;
  }
  public set setUrl(url: string) {
    this.url = url;
  }

  public get getImgSrc(): string {
    return this.imgSrc!;
  }
  public set setImgSrc(imgSrc: string) {
    this.imgSrc = imgSrc;
  }

  //#endregion
}

export class MealBuilder {
  private name: string;
  private categoryId: number[];
  private instruction: string[];
  private ingredients: Ingredient[];
  private _id?: number;
  private url?: string;
  private imgSrc?: string;

  constructor() {
    this.name = "";
    this.categoryId = [];
    this.instruction = [];
    this.ingredients = [];
    this._id = 0;
    this.url = "";
    this.imgSrc = "";
  }

  public static fromIngredient(meal: Meal): MealBuilder {
    let builder = new MealBuilder();
    builder.name = meal.name;
    builder.categoryId = meal.categoryId;
    builder.instruction = meal.instruction;
    builder.ingredients = meal.ingredients;
    builder._id = meal._id;
    builder.url = meal.url;
    builder.imgSrc = meal.imgSrc;
    return builder;
  }

  public setName(name: string): MealBuilder {
    this.name = name;
    return this;
  }

  public setCategoryId(categoryId: number[]): MealBuilder {
    this.categoryId = categoryId;
    return this;
  }

  public setInstruction(instruction: string[]): MealBuilder {
    this.instruction = instruction;
    return this;
  }

  public setIngredients(ingredients: Ingredient[]): MealBuilder {
    this.ingredients = ingredients;
    return this;
  }

  public setId(_id: number): MealBuilder {
    this._id = _id;
    return this;
  }

  public setUrl(url: string): MealBuilder {
    this.url = url;
    return this;
  }

  public setImgSrc(imgSrc: string): MealBuilder {
    this.imgSrc = imgSrc;
    return this;
  }

  public allRequiredFieldsSet(): boolean {
    return this.name !== "";
    // && this.instruction.length !== 0;
  }

  public getName(): string {
    return this.name;
  }

  public getCategoryId(): number[] {
    return this.categoryId;
  }

  public getInstruction(): string[] {
    return this.instruction;
  }

  public getIngredients(): Ingredient[] {
    return this.ingredients;
  }

  public getId(): number {
    return this._id!;
  }

  public getUrl(): string {
    return this.url!;
  }

  public getImgSrc(): string {
    return this.imgSrc!;
  }

  public build(): Meal {
    return new Meal(
      this.name,
      this.categoryId,
      this.instruction,
      this.ingredients,
      this._id,
      this.url,
      this.imgSrc
    );
  }
}
