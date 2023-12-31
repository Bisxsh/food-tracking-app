import React, { createContext, Dispatch, SetStateAction, useContext, useEffect, useRef, useState } from "react";
import { createNativeStackNavigator, NativeStackScreenProps } from "@react-navigation/native-stack";
import { useNavigation } from '@react-navigation/native';

import { Profile } from "./Screens/Profile";
import { Setting } from "./Screens/Setting";
import { Debug } from "./Screens/Debug";
import { About } from "./Screens/About";
import { Help } from "./Screens/Help";
import { Theme } from "./Screens/Theme";
import { UserContext } from "../../backends/User";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { Account } from "./Screens/Account";
import IngredientEdit from "./Screens/IngredientEdit";
import { Ingredient } from "../../backends/Ingredient";
import { COLOURS } from "../../util/GlobalStyles";
import { AppState } from "react-native";
import * as DB from '../../backends/Database';


export type StackParams ={
    Profile: undefined
    IngredientEdit: Ingredient
    Setting: undefined
    Account: undefined
    Theme: undefined
    Debug: undefined
    Help: undefined
    About: undefined
}

export type ScreenProp = NativeStackScreenProps<StackParams, keyof StackParams>

interface TabNaviContextInterface {
    tabNavi: BottomTabNavigationProp<any, any, any> | undefined;
    setTabNavi: Dispatch<SetStateAction<BottomTabNavigationProp<any, any, any>>>;
}

const DefaultTabNaviContext: TabNaviContextInterface = {
    tabNavi: undefined,
    setTabNavi: ()=>{},
}

export const TabNaviContext = createContext<TabNaviContextInterface>(DefaultTabNaviContext)

const stack = createNativeStackNavigator<StackParams>();

export function ProfileNavigator(): JSX.Element{
    const { user, setUser } = useContext(UserContext);
    const [ tabNavi, setTabNavi ] = useState<BottomTabNavigationProp<any, any, any>>(useNavigation())
    const isDarkMode = user.setting.isDark()
    try {
        tabNavi?.setOptions({
            tabBarStyle: {
            backgroundColor: isDarkMode ? COLOURS.darker : COLOURS.white
            }
        })
    } catch (error) {
        console.log(error)
    }
    
    const [appState, setAppState] = useState(AppState.currentState);
    const init = useRef(true);
    
    const handleAppStateChange = (newState: "active" | "background" | "inactive" | "unknown" | "extension")=>{
        setAppState(newState);
        DB.setTimeStamp(user, newState == "active"? "profile": "inactive")
    }

    useEffect(()=>{
        const subscription = AppState.addEventListener("change", handleAppStateChange)
        return ()=>{
        subscription.remove();
        }
    }, [])

    if (init.current){
        DB.setTimeStamp(user, "profile")
    }

    return (
        <TabNaviContext.Provider value={{tabNavi, setTabNavi}}>
            <stack.Navigator
                initialRouteName="Profile"
                screenOptions={({ route, navigation })=>({
                    headerStyle: {
                        backgroundColor: isDarkMode ? COLOURS.darker : COLOURS.white,
                    },
                    headerTintColor: isDarkMode ? COLOURS.white : COLOURS.black,
                    headerShadowVisible: false,
                    headerBackTitleVisible: false,
                })}
                
            >
                <stack.Screen name="Profile" component={Profile} options={{headerShown: false}}/>
                <stack.Screen name="IngredientEdit" component={IngredientEdit}/>
                <stack.Screen name="Setting" component={Setting}/>
                <stack.Screen name="Account" component={Account}/>
                <stack.Screen name="Theme" component={Theme}/>
                <stack.Screen name="Debug" component={Debug}/>
                <stack.Screen name="Help" component={Help}/>
                <stack.Screen name="About" component={About}/>
            </stack.Navigator>
        </TabNaviContext.Provider>
        
    );
}