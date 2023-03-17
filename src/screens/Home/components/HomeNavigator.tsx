import { AppState, LogBox, StyleSheet, Text, View } from "react-native";
import React, { useContext, useEffect, useRef, useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Home } from "../Home";
import ManualIngredient from "./Add/ManualIngredient";
import BarcodeScanner from "./Add/BarcodeScanner";
import { DEFAULT_HOME_DATA, HomeContext } from "./HomeContextProvider";
import { COLOURS } from "../../../util/GlobalStyles";
import { UserContext } from "../../../backends/User";
import * as DB from "../../../backends/Database"

type Props = {};

const Stack = createNativeStackNavigator();

const HomeNavigator = (props: Props) => {
  LogBox.ignoreLogs([
    "Non-serializable values were found in the navigation state",
  ]);
  const { user, setUser } = useContext(UserContext);
  const isDarkMode = user.setting.isDark();
  const [homeContext, setHomeContext] = React.useState(DEFAULT_HOME_DATA);
  const [appState, setAppState] = useState(AppState.currentState);
  const init = useRef(true);
  
  const handleAppStateChange = (newState: "active" | "background" | "inactive" | "unknown" | "extension")=>{
    setAppState(newState);
    DB.setTimeStamp(user, newState == "active"? "home": "inactive")
  }

  useEffect(()=>{
    const subscription = AppState.addEventListener("change", handleAppStateChange)
    return ()=>{
      subscription.remove();
    }
  }, [])

  if (init.current){
    DB.setTimeStamp(user, "home")
  }

  return (
    <HomeContext.Provider value={{ homeContext, setHomeContext }}>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={({ route, navigation }) => ({
          headerStyle: {
            backgroundColor: isDarkMode ? COLOURS.darker : COLOURS.white,
          },
          headerTintColor: isDarkMode ? COLOURS.white : COLOURS.black,
          headerShadowVisible: false,
          headerBackTitleVisible: false,
        })}
      >
        <Stack.Screen
          name="Home"
          component={Home}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ManualIngredient"
          component={ManualIngredient}
          options={{}}
        />
        <Stack.Screen
          name="BarcodeScanner"
          component={BarcodeScanner}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </HomeContext.Provider>
  );
};

export default HomeNavigator;

const styles = StyleSheet.create({});
