import { LogBox, StyleSheet, Text, View } from "react-native";
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Home } from "../Home";
import ManualIngredient from "./Add/ManualIngredient";
import BarcodeScanner from "./Add/BarcodeScanner";
import { DEFAULT_HOME_DATA, HomeContext } from "./HomeContextProvider";
import { COLOURS } from "../../../util/GlobalStyles";

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
        initialRouteName="Home"
        screenOptions={({ route, navigation }) => ({
          headerStyle: {
            backgroundColor: isDarkMode ? COLOURS.darker : COLOURS.white,
          },
          headerTintColor: isDarkMode ? COLOURS.white : COLOURS.black,
          headerShadowVisible: false,
          headerShown: false,
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
        <Stack.Screen name="BarcodeScanner" component={BarcodeScanner} />
      </Stack.Navigator>
    </HomeContext.Provider>
  );
};

export default HomeNavigator;

const styles = StyleSheet.create({});
