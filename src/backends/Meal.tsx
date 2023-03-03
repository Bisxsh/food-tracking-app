import { Ingredient } from "./Ingredient"

export class Meal{
    _id!: number
    name: string
    url?: string
    imgSrc?: string
    categoryId: number[]
    instruction: string[]
    ingredient: Ingredient[]

    constructor(name: string, categoryId: number[], instruction: string[], ingredient: Ingredient[], _id?:number, url?: string, imgSrc?: string){
        this._id = (_id != undefined)? _id: Meal.count ++
        this.name = name
        this.url = url
        this.imgSrc = imgSrc
        this.categoryId = categoryId
        this.instruction = instruction
        this.ingredient = ingredient
    }

    toList(): any[]{
        return [
            this._id, 
            this.name,
            this.url,
            this.imgSrc,
            ","+this.categoryId.toString()+",",
            this.instruction.join("<###>"),
            this.ingredient.map((value)=>JSON.stringify(value)).join("<###>"),
        ];
    }

    static count = 0;

    static fromList(properties:any[]):Meal{
        console.log(properties)
        return new Meal(
            properties[1],  // name
            (properties[4] as string).substring(1,(properties[4] as string).length-1).split(",").map((value)=>Number.parseInt(value)),  // categoryId
            (properties[5] as string).split("<###>"),  // instruction 
            (properties[6] as string).split("<###>").filter((value)=>value!="").map((value)=>Ingredient.fromList(Object.values(JSON.parse(value)))),  // ingredient
            properties[0],  // _id
            properties[2],  // url
            properties[3],  // imgSrc
        );
    }

    static reset(){
        Meal.count = 0
    }
    
}