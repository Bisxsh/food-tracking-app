
export const Appearance = {
    0: "System",
    1: "Light",
    2: "Dark"
}


export class UserSetting{
    notification: boolean
    appearance: number

    constructor(notification?: boolean, appearance?: number){
        this.notification = (notification != undefined)? notification: true
        this.appearance = (appearance != undefined)? appearance: 0
    }

    toList(): any[]{
        return [this.notification, this.appearance];
    }

    static fromList(properties:any[]):UserSetting{
        return new UserSetting(properties[0], properties[1]);
    }
    
}