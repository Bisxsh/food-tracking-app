import { Nutrition } from "./Nutrition"


export class Ingredient{
    _id: number
    quantity: number
    weight?: number
    weightUnit: string
    imgSrc?: string
    useDate?: Date
    expiryDate?: Date
    nutrition: Nutrition
    categoryId: number

    constructor(quantity: number, weightUnit: string, nutrition: Nutrition, categoryId: number, _id?: number, weight?: number, imgSrc?: string, useDate?: Date, expiryDate?: Date){
        this._id = _id? _id: Ingredient.count ++
        this.quantity = quantity
        this.weight = weight
        this.weightUnit = weightUnit
        this.imgSrc = imgSrc
        this.useDate = useDate
        this.expiryDate = expiryDate
        this.nutrition = nutrition
        this.categoryId = categoryId
    }

    toList(): any[]{
        return [this._id, this.quantity, this.weight, this.weightUnit, this.imgSrc, this.useDate, this.expiryDate, JSON.stringify(this.nutrition), this.categoryId];
    }

    static count:number = 0

    static fromList(properties:any[]): Ingredient{
        return new Ingredient(properties[1],properties[3],Nutrition.fromList(Object.values(JSON.parse(properties[7]))),properties[8],properties[0],properties[2],properties[4],properties[5],properties[6])
    }
}

