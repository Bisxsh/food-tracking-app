import { Nutrition } from "./Nutrition";
import * as IngredientClass from "../classes/IngredientClass"
import * as CategoryClass from "../classes/Categories"
import * as DB from "./Database"

export class Ingredient {
  _id: number;
  name: string;
  quantity: number;
  weight?: number;
  weightUnit: string;
  servingSize?: number;
  servingSizeUnit: string;
  imgSrc?: string;
  addDate: Date;
  useDate?: Date;
  expiryDate?: Date;
  nutrition: Nutrition;
  categoryId: number[];
  barcode?: number;
  memo?: string;

  constructor(
    name: string,
    quantity: number,
    weightUnit: string,
    servingSizeUnit: string,
    nutrition: Nutrition,
    categoryId: number[],
    _id?: number,
    weight?: number,
    servingSize?: number,
    imgSrc?: string,
    addDate?: Date,
    useDate?: Date,
    expiryDate?: Date,
    barcode?: number,
    memo?: string){
        if (_id != undefined){
          Ingredient.count = Math.max(_id, Ingredient.count)
        }else{
          Ingredient.count += 1
        }
        this._id = (_id != undefined)? _id: Ingredient.count
        this.name = name
        this.quantity = quantity
        this.weight = weight
        this.weightUnit = weightUnit
        this.servingSize = servingSize
        this.servingSizeUnit = servingSizeUnit
        this.imgSrc = imgSrc
        this.addDate = (addDate != undefined)? addDate: new Date()
        this.useDate = useDate
        this.expiryDate = expiryDate
        this.nutrition = nutrition
        this.categoryId = categoryId
        this.barcode = barcode
        this.memo = (memo != undefined)? memo: ""
  }

  toList(): any[]{
      return [
          this._id, 
          this.name, 
          this.quantity, 
          this.weight, 
          this.weightUnit, 
          this.servingSize,
          this.servingSizeUnit,
          this.imgSrc, 
          (this.addDate != undefined)? this.addDate.toISOString().replace("T", " ").replace("Z", ""): undefined, 
          (this.useDate != undefined)? this.useDate.toISOString().replace("T", " ").replace("Z", ""): undefined, 
          (this.expiryDate != undefined)? this.expiryDate.toISOString().replace("T", " ").replace("Z", ""): undefined, 
          JSON.stringify(this.nutrition), 
          ","+this.categoryId.toString()+",", 
          this.barcode, 
          this.memo];
  }

  async toIngredientClass(): Promise<IngredientClass.Ingredient>{
    const categories = await DB.readAllCategory()
    const cats: CategoryClass.Category[] = []
    for (const id of this.categoryId) {
      for (const category of categories) {
        if (category._id == id){
          cats.push(category.toCategoryClass())
        }
      }
    }
    return new IngredientClass.Ingredient(
      this.name,
      (this.weight == undefined)? 0: this.weight,
      IngredientClass.weightUnit[this.weightUnit as ("grams" | "kg")],
      (this.servingSize == undefined)? 0: this.servingSize,
      IngredientClass.weightUnit[this.servingSizeUnit as ("grams" | "kg")],
      this.quantity,
      cats,
      (this.imgSrc == undefined)? "": this.imgSrc,
      (this.expiryDate == undefined)? new Date(): this.expiryDate,
      (this.useDate == undefined)? new Date(): this.useDate,
      this.nutrition.toNutritionClass(),
      this._id,
      this.addDate
    )
  }

  //#region getters and setters

  public get getName(): string {
    return this.name;
  }
  public set setName(name: string) {
    this.name = name;
  }

  public get getWeight(): number | undefined {
    return this.weight;
  }
  public set setWeight(weight: number) {
    this.weight = weight;
  }

  public get getWeightUnit(): string {
    return this.weightUnit;
  }
  public set setWeightUnit(weightType: string) {
    this.weightUnit = weightType;
  }

  public get getQuantity(): number {
    return this.quantity;
  }
  public set setQuantity(quantity: number) {
    this.quantity = quantity;
  }

  public get getImgSrc(): string | undefined {
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
    return this._id;
  }

  public set setId(id: number) {
    this._id = id;
  }
  //#endregion

  static count: number = -1;

  static fromList(properties:any[]): Ingredient{
      return new Ingredient(
          properties[1],  // name
          properties[2],  // quantity
          properties[4],  // weightUnit
          properties[6],  // servingSizeUnit
          Nutrition.fromList(Object.values(JSON.parse(properties[11]))),  // Nutrition
          (properties[12] as string).substring(1,(properties[11] as string).length-1).split(",").map((value)=>Number.parseInt(value)),  // CategoryID
          properties[0],  // _id
          properties[3],  // weight
          properties[5],  // servingSize
          properties[7],  // imgSrc
          (properties[8] != undefined)? new Date(properties[8].replace(" ", "T")+"Z"): undefined,  // addDate
          (properties[9] != undefined)? new Date(properties[8].replace(" ", "T")+"Z"): undefined,  // useDate
          (properties[10] != undefined)? new Date(properties[9].replace(" ", "T")+"Z"): undefined,  // expiryDate
          properties[13],  // barcode
          properties[14],  // memo
      )
  }
  
  static reset(){
    Ingredient.count = 0
  }
}
