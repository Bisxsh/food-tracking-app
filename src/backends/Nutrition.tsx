
export class Nutrition{
    _id!: number

    constructor(_id?:number){
        this._id = (_id != undefined)? _id: Nutrition.count ++
    }

    static count = 0;

    static fromList(properties:any[]):Nutrition{
        return new Nutrition();
    }
}