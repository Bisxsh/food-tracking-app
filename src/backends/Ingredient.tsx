import { Nutrition } from "./Nutrition"


export class Ingredient{
    _id: number
    name: string
    quantity: number
    weight?: number
    weightUnit: string
    imgSrc?: string
    useDate?: Date
    expiryDate?: Date
    nutrition: Nutrition
    categoryId: number

    constructor(name:string, quantity: number, weightUnit: string, nutrition: Nutrition, categoryId: number, _id?: number, weight?: number, imgSrc?: string, useDate?: Date, expiryDate?: Date){
        this._id = (_id != undefined)? _id: Ingredient.count ++
        this.name = name
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
        return [this._id, this.name, this.quantity, this.weight, this.weightUnit, this.imgSrc, this.useDate, this.expiryDate, JSON.stringify(this.nutrition), this.categoryId];
    }

    static count:number = 0

    static fromList(properties:any[]): Ingredient{
        //         Attribute  name           quantity       weightUnit    Nutrition                                                      CategoryID     _id            weight         imgSrc         useDate        expiryDate
        return new Ingredient(properties[1], properties[2], properties[4], Nutrition.fromList(Object.values(JSON.parse(properties[8]))), properties[9], properties[0], properties[3], properties[5], properties[6], properties[7])
    }
}

