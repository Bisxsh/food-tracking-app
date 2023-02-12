import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";



import { Profile } from "./Profile";
import { Colors } from "react-native/Libraries/NewAppScreen";
import { Setting } from "./Setting";
import { Debug } from "./Debug";

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
            <stack.Screen name="Theme" component={Setting}/>
            <stack.Screen name="Debug" component={Debug}/>
            <stack.Screen name="Help" component={Setting}/>
            <stack.Screen name="About" component={Setting}/>
        </stack.Navigator>
    );
}