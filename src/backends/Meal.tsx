
export class Meal{
    _id!: number
    name: string
    url?: string
    imgSrc?: string
    categoryId: number[]
    instruction: string[]

    constructor(name: string, categoryId: number[], instruction: string[], _id?:number, url?: string, imgSrc?: string){
        this._id = (_id != undefined)? _id: Meal.count ++
        this.name = name
        this.url = url
        this.imgSrc = imgSrc
        this.categoryId = categoryId
        this.instruction = instruction
    }

    toList(): any[]{
        return [
            this._id, 
            this.name,
            this.url,
            this.imgSrc,
            ","+this.categoryId.toString()+",",
            this.instruction.toString(),
        ];
    }

    static count = 0;

    static fromList(properties:any[]):Meal{
        return new Meal(
            properties[1],  // name
            (properties[4] as string).substring(1,(properties[4] as string).length-1).split(",").map((value)=>Number.parseInt(value)),  // categoryId
            (properties[5] as string).split(","),  // instruction 
            properties[0],  // _id
            properties[2],  // url
            properties[3],  // imgSrc
        );
    }
    
}