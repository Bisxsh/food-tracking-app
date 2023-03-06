import { LogBox, StyleSheet, Text, View } from "react-native";
import React, { useContext } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Home } from "../../screens/Home/Home";
import BarcodeScanner from "../Home/components/Add/BarcodeScanner";
import { DEFAULT_RECIPE_DATA, RecipeContext } from "./RecipeContextProvider";
import { Recipe } from "./Recipe";
import { COLOURS } from "../../util/GlobalStyles";
import RecipeInfo from "./RecipeInfo";
import { UserContext } from "../../backends/User";
import ManualMeal from "./ManualMeal";

type Props = {};

const Stack = createNativeStackNavigator();

const HomeNavigator = (props: Props) => {
  LogBox.ignoreLogs([
    "Non-serializable values were found in the navigation state",
  ]);
  const { user, setUser } = useContext(UserContext);
  const isDarkMode = user.setting.isDark();
  const [recipeContext, setRecipeContext] = React.useState(DEFAULT_RECIPE_DATA);
  return (
    <RecipeContext.Provider value={{ recipeContext, setRecipeContext }}>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={({ route, navigation }) => ({
          headerStyle: {
            backgroundColor: isDarkMode ? COLOURS.darker : COLOURS.white,
          },
          headerTintColor: isDarkMode ? COLOURS.white : COLOURS.black,
          headerShadowVisible: false,
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
          options={{ headerShown: false }}
        />
        <Stack.Screen name="BarcodeScanner" component={BarcodeScanner} />
      </Stack.Navigator>
    </RecipeContext.Provider>
  );
};

export default HomeNavigator;

const styles = StyleSheet.create({});
