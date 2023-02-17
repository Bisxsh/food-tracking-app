import { LogBox, StyleSheet, Text, View } from "react-native";
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Colors } from "react-native/Libraries/NewAppScreen";
import { Home } from "../../screens/Home/Home";
import ManualIngredient from "./ManualIngredient";
import BarcodeScanner from "../Home/components/Add/BarcodeScanner";
import { DEFAULT_HOME_DATA, HomeContext } from "./RecipeContextProvider";
import { Recipe } from "./Recipe";

type Props = {};

const Stack = createNativeStackNavigator();

const HomeNavigator = (props: Props) => {
  LogBox.ignoreLogs([
    "Non-serializable values were found in the navigation state",
  ]);
  const isDarkMode = false;
  const [homeContext, setHomeContext] = React.useState(DEFAULT_HOME_DATA);
  return (
    <HomeContext.Provider value={{ homeContext, setHomeContext }}>
      <Stack.Navigator
        initialRouteName="Profile"
        screenOptions={({ route, navigation }) => ({
          headerStyle: {
            backgroundColor: isDarkMode ? Colors.darker : Colors.white,
          },
          headerTintColor: isDarkMode ? Colors.white : Colors.black,
          headerShadowVisible: false,
          headerShown: false,
        })}
      >
        <Stack.Screen
          name="Home"
          component={Recipe}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ManualIngredient"
          component={ManualIngredient}
          options={{}}
        />
        <Stack.Screen name="BarcodeScanner" component={BarcodeScanner} />
      </Stack.Navigator>
    </HomeContext.Provider>
  );
};

export default HomeNavigator;

const styles = StyleSheet.create({});
