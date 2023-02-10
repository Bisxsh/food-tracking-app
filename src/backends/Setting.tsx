
export const Appearance = {
    0: "Automatic",
    1: "Light",
    2: "Dark"
}


export class Setting{
    notification: boolean
    appearance: number

    constructor(notification?: boolean, appearance?: number){
        this.notification = (notification != undefined)? notification: true
        this.appearance = (appearance != undefined)? appearance: 0
    }

    toList(): any[]{
        return [this.notification, this.appearance];
    }

    static fromList(properties:any[]):Setting{
        return new Setting(properties[0], properties[1]);
    }
    
}