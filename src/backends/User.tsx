import React, { createContext, Dispatch, SetStateAction } from "react";

import { UserSetting } from "./UserSetting"

export const DietReqs = [
    "Gluten-free",
    "Wheat-free",
    "Egg-free",
    "Milk-free",
    "Soya-free",
    "Nut-free",
    "Vegan",
]


export class User{
    _id!: number
    name: string
    imgSrc?: string
    dateOfReg: Date
    dietReq: [string, boolean][]
    setting: UserSetting

    constructor(name: string, _id?:number, imgSrc?: string, dateOfReq?: Date, dietReq?: [string, boolean][], setting?: UserSetting){
        this._id = (_id != undefined)? _id: User.count ++
        this.name = name
        this.imgSrc = imgSrc
        this.dateOfReg = (dateOfReq != undefined)? dateOfReq: new Date()
        this.dietReq = (dietReq != undefined)? dietReq: DietReqs.map((value)=>[value, false])
        this.setting = (setting != undefined)? setting: new UserSetting()
        this.dietReq.map((value)=>value.join("&"))
    }

    toList(): any[]{
        return [
            this._id, 
            this.name, 
            this.imgSrc, 
            this.dateOfReg.toISOString().replace("T", " ").replace("Z", ""), 
            this.dietReq.map((value)=>value.join("&")).toString(), 
            JSON.stringify(this.setting)];
    }

    static count = 0;

    static fromList(properties:any[]):User{
        return new User(
            properties[1],  // name
            properties[0],  // _id
            properties[2],  // imgSrc
            new Date((properties[3] as string).replace(" ", "T")+"Z"),  // dateOfReg
            (properties[4] as string).split(",").map((value)=>[value.split("&")[0], value.split("&")[0]=="true"]),  // dietReq
            UserSetting.fromList(Object.values(JSON.parse(properties[5])))  // setting
        );
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