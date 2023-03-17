import { AppState, LogBox, StyleSheet, Text, View } from "react-native";
import React, { createContext, Dispatch, SetStateAction, useContext, useEffect, useRef, useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Home } from "../../screens/Home/Home";
import BarcodeScanner from "../Home/components/Add/BarcodeScanner";
import { DEFAULT_RECIPE_DATA, RecipeContext } from "./RecipeContextProvider";
import { Recipe } from "./Recipe";
import { COLOURS } from "../../util/GlobalStyles";
import RecipeInfo from "./RecipeInfo";
import { UserContext } from "../../backends/User";
import ManualMeal from "./ManualMeal";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { useNavigation } from '@react-navigation/native';
import * as DB from "../../backends/Database"

type Props = {};

interface TabNaviContextInterface {
  tabNavi: BottomTabNavigationProp<any, any, any> | undefined;
  setTabNavi: Dispatch<SetStateAction<BottomTabNavigationProp<any, any, any>>>;
}

const DefaultTabNaviContext: TabNaviContextInterface = {
  tabNavi: undefined,
  setTabNavi: ()=>{},
}

export const TabNaviContext = createContext<TabNaviContextInterface>(DefaultTabNaviContext)


const Stack = createNativeStackNavigator();

const HomeNavigator = (props: Props) => {
  LogBox.ignoreLogs([
    "Non-serializable values were found in the navigation state",
  ]);
  const { user, setUser } = useContext(UserContext);
  const isDarkMode = user.setting.isDark();
  const [recipeContext, setRecipeContext] = React.useState(DEFAULT_RECIPE_DATA);
  const [ tabNavi, setTabNavi ] = useState<BottomTabNavigationProp<any, any, any>>(useNavigation())
  
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
    <TabNaviContext.Provider value={{tabNavi, setTabNavi}}>
    <RecipeContext.Provider value={{ recipeContext, setRecipeContext }}>
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
          component={Recipe}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ManualMeal"
          component={ManualMeal}
          options={{}}
        />
        <Stack.Screen 
          name="RecipeInfo" 
          component={RecipeInfo} 
          options={{}}
        />
        <Stack.Screen name="BarcodeScanner" component={BarcodeScanner} />
      </Stack.Navigator>
    </RecipeContext.Provider>
    </TabNaviContext.Provider>
  );
};

export default HomeNavigator;

const styles = StyleSheet.create({});

/////////////////////

