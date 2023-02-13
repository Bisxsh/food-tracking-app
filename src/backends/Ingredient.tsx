import { Nutrition } from "./Nutrition";

export class Ingredient {
  _id: number;
  name: string;
  quantity: number;
  weight?: number;
  weightUnit: string;
  imgSrc?: string;
  useDate?: Date;
  expiryDate?: Date;
  nutrition: Nutrition;
  categoryId: number;

  constructor(
    name: string,
    quantity: number,
    weightUnit: string,
    nutrition: Nutrition,
    categoryId: number,
    _id?: number,
    weight?: number,
    imgSrc?: string,
    useDate?: Date,
    expiryDate?: Date
  ) {
    this._id = _id != undefined ? _id : Ingredient.count++;
    this.name = name;
    this.quantity = quantity;
    this.weight = weight;
    this.weightUnit = weightUnit;
    this.imgSrc = imgSrc;
    this.useDate = useDate;
    this.expiryDate = expiryDate;
    this.nutrition = nutrition;
    this.categoryId = categoryId;
  }

  toList(): any[] {
    return [
      this._id,
      this.name,
      this.quantity,
      this.weight,
      this.weightUnit,
      this.imgSrc,
      this.useDate != undefined
        ? this.useDate.toISOString().replace("T", " ").replace("Z", "")
        : undefined,
      this.expiryDate != undefined
        ? this.expiryDate.toISOString().replace("T", " ").replace("Z", "")
        : undefined,
      JSON.stringify(this.nutrition),
      this.categoryId,
    ];
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

  static count: number = 0;

  static fromList(properties: any[]): Ingredient {
    //         Attribute  name           quantity       weightUnit    Nutrition                                                      CategoryID     _id            weight         imgSrc         useDate                                                                                  expiryDate
    return new Ingredient(
      properties[1],
      properties[2],
      properties[4],
      Nutrition.fromList(Object.values(JSON.parse(properties[8]))),
      properties[9],
      properties[0],
      properties[3],
      properties[5],
      properties[6] != undefined
        ? new Date(properties[6].replace(" ", "T") + "Z")
        : undefined,
      properties[7] != undefined
        ? new Date(properties[7].replace(" ", "T") + "Z")
        : undefined
    );
  }
}
