import { Setting } from "./Setting"

export class User{
    _id!: number
    name: string
    imgSrc?: string
    dateOfReg: Date
    dietReq: string[]
    setting: Setting

    constructor(name: string, _id?:number, imgSrc?: string, dateOfReq?: Date, dietReq?: string[], setting?: Setting){
        this._id = (_id != undefined)? _id: User.count ++
        this.name = name
        this.imgSrc = imgSrc
        this.dateOfReg = (dateOfReq != undefined)? dateOfReq: new Date()
        this.dietReq = (dietReq != undefined)? dietReq: []
        this.setting = (setting != undefined)? setting: new Setting()
    }

    toList(): any[]{
        return [this._id, this.name, this.imgSrc, this.dateOfReg, this.dietReq, JSON.stringify(this.setting)];
    }

    static count = 0;

    static fromList(properties:any[]):User{
        return new User(properties[1], properties[0], properties[2], properties[3], properties[4], Setting.fromList(Object.values(JSON.parse(properties[5]))));
    }
    
}