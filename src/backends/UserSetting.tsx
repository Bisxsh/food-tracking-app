import {Appearance as SysAppearance} from 'react-native';


export const Appearance = {
    0: "System",
    1: "Light",
    2: "Dark"
}


export class UserSetting{
    notification: boolean
    appearance: number
    debug: boolean

    constructor(notification?: boolean, appearance?: number, debug?: boolean){
        this.notification = (notification != undefined)? notification: true
        this.appearance = (appearance != undefined)? appearance: 0
        this.debug = (debug != undefined)? debug: false
    }

    toList(): any[]{
        return [this.notification, this.appearance, this.debug];
    }

    isDark():boolean{
        return (this.appearance == 2 || (SysAppearance.getColorScheme()=="dark" && this.appearance == 0));
    }

    static fromList(properties:any[]):UserSetting{
        return new UserSetting(properties[0], properties[1], properties[2]);
    }

    static reloadApp?: ()=>void
    
}