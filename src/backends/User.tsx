import React, { createContext, Dispatch, SetStateAction } from "react";

import { Category } from "./Category";
import { UserSetting } from "./UserSetting"
import * as DB from "./Database"

/**
 * Map API Parameter to Web Label
 * @type {Object.<string, string>}
 */
export const DietReqs = {
    "alcohol-cocktail": "Alcohol-Cocktail",
    "alcohol-free": "Alcohol-Free",
    "celery-free": "Celery-Free",
    "crustacean-free": "Crustcean-Free",
    "dairy-free": "Dairy-Free",
    "DASH": "DASH",
    "egg-free": "Egg-Free",
    "fish-free": "Fish-Free",
    "fodmap-free": "FODMAP-Free",
    "gluten-free": "Gluten-Free",
    "immuno-supportive": "Immuno-Supportive",
    "keto-friendly": "Keto-Friendly",
    "kidney-friendly": "Kidney-Friendly",
    "kosher": "Kosher",
    "low-potassium": "Low Potassium",
    "low-sugar": "Low Sugar",
    "lupine-free": "Lupine-Free",
    "Mediterranean": "Mediterranean",
    "mollusk-free": "Mollusk-Free",
    "mustard-free": "Mustard-Free",
    "No-oil-added": "No oil added",
    "paleo": "Paleo",
    "peanut-free": "Peanut-Free",
    "pecatarian": "Pescatarian",
    "pork-free": "Pork-Free",
    "red-meat-free": "Red-Meat-Free",
    "sesame-free": "Sesame-Free",
    "shellfish-free": "Shellfish-Free",
    "soy-free": "Soy-Free",
    "sugar-conscious": "Sugar-Conscious",
    "sulfite-free": "Sulfite-Free",
    "tree-nut-free": "Tree-Nut-Free",
    "vegan": "Vegan",
    "vegetarian": "Vegetarian",
    "wheat-free": "Wheat-Free",
}


export class User{
    _id!: number
    name: string
    imgSrc?: string
    dateOfReg: Date
    dietReq: [string, boolean][]
    setting: UserSetting
    consent: boolean
    categories: Category[]
    screenRecord: [number, number, number]

    constructor(name: string, _id?:number, imgSrc?: string, dateOfReq?: Date, dietReq?: [string, boolean][], setting?: UserSetting, consent?: boolean, categories?: Category[], screenRecord?: [number, number, number]){
        if (_id != undefined){
            User.count = Math.max(_id, User.count)
        }else{
            User.count += 1
        }
        this._id = (_id != undefined)? _id: User.count
        this.name = name
        this.imgSrc = imgSrc
        this.dateOfReg = (dateOfReq != undefined)? dateOfReq: new Date()
        this.dietReq = (dietReq != undefined)? dietReq: Object.values(DietReqs).map((value)=>[value, false])
        this.setting = (setting != undefined)? setting: new UserSetting()
        this.consent = (consent != undefined)? consent: false
        this.categories = (categories != undefined)? categories: []
        this.loadCategories()
        this.screenRecord = (screenRecord != undefined)? screenRecord: [0,0,0]
    }

    async loadCategories(){
        (await DB.readAllCategory()).forEach((v)=>{
            if (this.categories.filter((value)=>v.name == value.name).length == 0){
                this.categories.push(v)
            }
        })
    }

    findCategory(_id: number): Category | undefined
    
    findCategory(name: string): Category | undefined
    
    findCategory(value: any): Category | undefined{
        var attribute: keyof Category = "_id"
        switch(typeof value){
            case "number":
                attribute = "_id"
                break;
            case "string":
                attribute = "name"
                break;
        }
        for (const category of this.categories) {
            if (category[attribute] == value){
                return category
            }
        }
        return
    }

    reset(){
        this._id = User.count ++
        this.name = ""
        this.imgSrc = undefined
        this.dateOfReg = new Date()
        this.dietReq = Object.values(DietReqs).map((value)=>[value, false])
        this.setting = new UserSetting()
        this.consent = false
        this.screenRecord = [0,0,0]
    }

    toList(): any[]{
        return [
            this._id, 
            this.name, 
            this.imgSrc, 
            this.dateOfReg.toISOString().replace("T", " ").replace("Z", ""), 
            this.dietReq.map((value)=>value.join("&")).toString(), 
            JSON.stringify(this.setting),
            this.consent?1:0,
            this.screenRecord.join("//")
        ];
    }

    static count = -1;

    static fromList(properties:any[]):User{
        var records: [number, number, number] = [0,0,0];
        (properties[7] as string).split("//").forEach((v, index)=>{
            records[index] = Number.parseFloat(v)
        })
        return new User(
            properties[1],  // name
            properties[0],  // _id
            properties[2],  // imgSrc
            new Date((properties[3] as string).replace(" ", "T")+"Z"),  // dateOfReg
            (properties[4] as string).split(",").map((value)=>[value.split("&")[0], value.split("&")[1]=="true"]),  // dietReq
            UserSetting.fromList(Object.values(JSON.parse(properties[5]))),  // setting
            properties[6]==1,
            undefined,
            records
        );
    }

    static reset(){
        User.count = 0
    }
    
}

export interface UserContextInterface {
    user: User;
    setUser: Dispatch<SetStateAction<User>>;
}

export const DEFAULT_USER: User = new User("Hello Welcome")
  
export const DEFAULT_USER_CONTEXT: UserContextInterface = {
    user: DEFAULT_USER,
    setUser: () => {},
};

export const UserContext = createContext<UserContextInterface>(
    DEFAULT_USER_CONTEXT
);