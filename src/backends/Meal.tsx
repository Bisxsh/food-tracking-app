import { Ingredient } from "./Ingredient"
import { Nutrition } from "./Nutrition"

export class Meal{
    _id!: number
    name: string
    url?: string
    imgSrc?: string
    categoryId: number[]
    instruction: string[]
    ingredient: Ingredient[]
    source?: string
    cautions?: string[]
    nutrition: Nutrition
    servings: number
    time: number
    favourite: boolean

    constructor(
        name: string, 
        categoryId: number[], 
        instruction: string[], 
        ingredient: Ingredient[], 
        _id?:number, 
        url?: string, 
        imgSrc?: string,
        source?: string,
        cautions?: string[],
        nutrition?: Nutrition,
        servings?: number,
        time?: number,
        favourite?: boolean
    ){
        if (_id != undefined){
            Meal.count = Math.max(_id, Meal.count)
        }else{
            Meal.count += 1
        }
        this._id = (_id != undefined)? _id: Meal.count
        this.name = name
        this.url = url
        this.imgSrc = imgSrc
        this.categoryId = categoryId
        this.instruction = instruction
        this.ingredient = ingredient
        this.source = source
        this.cautions = (cautions != undefined)? cautions: []
        this.nutrition = (nutrition != undefined)? nutrition: new Nutrition()
        this.servings = (servings != undefined)? servings: 1
        this.time = (time != undefined)? time: 0
        this.favourite = (favourite != undefined)? favourite: false
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
            this.source,
            this.cautions?.join("<###>"),
            JSON.stringify(this.nutrition),
            this.servings,
            this.time,
            this.favourite,
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
            properties[7],  // source
            (properties[8] as string).split("<###>"),  // caution
            Nutrition.fromList(Object.values(JSON.parse(properties[9]))),  // Nutrition
            properties[10],  // serving
            properties[11],  // time
            properties[12],  // favourite  
        );
    }

    static reset(){
        Meal.count = 0
    }
    
}