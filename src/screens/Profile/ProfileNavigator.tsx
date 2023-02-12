import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";


import { Profile } from "./Screens/Profile";
import { Colors } from "react-native/Libraries/NewAppScreen";
import { Setting } from "./Screens/Setting";
import { Debug } from "./Screens/Debug";
import { About } from "./Screens/About";
import { Help } from "./Screens/Help";
import { Theme } from "./Screens/Theme";

const stack = createNativeStackNavigator();

export function ProfileNavigator(): JSX.Element{
    const isDarkMode = false;
    return (
        <stack.Navigator
            initialRouteName="Profile"
            screenOptions={({ route, navigation })=>({
                headerStyle: {
                    backgroundColor: isDarkMode ? Colors.darker : Colors.white,
                },
                headerTintColor: isDarkMode ? Colors.white : Colors.black,
                headerShadowVisible: false,
            })}
        >
            <stack.Screen name="Profile" component={Profile} options={{headerShown: false}}/>
            <stack.Screen name="Setting" component={Setting}/>
            <stack.Screen name="Account" component={Setting}/>
            <stack.Screen name="Theme" component={Theme}/>
            <stack.Screen name="Debug" component={Debug}/>
            <stack.Screen name="Help" component={Help}/>
            <stack.Screen name="About" component={About}/>
        </stack.Navigator>
    );
}