import React, { useEffect, useState } from "react";

import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { Home } from "./src/screens/Home/Home";
import { Recipe } from "./src/screens/Recipe";
import { Profile } from "./src/screens/Profile/Profile";
import { COLOURS } from "./src/util/GlobalStyles";
import { DEFAULT_USER_DATA, UserDataContext } from "./src/classes/UserData";
import { ProfileNavigator } from "./src/screens/Profile/ProfileNavigator";

const Tab = createBottomTabNavigator();

function App(): JSX.Element {
  //TODO load user data from database and set it here
  const [userData, setUserData] = useState(DEFAULT_USER_DATA);

  return (
    <UserDataContext.Provider value={{ userData, setUserData }}>
      <NavigationContainer>
        <Tab.Navigator
          initialRouteName="Home"
          screenOptions={{
            tabBarActiveTintColor: COLOURS.primary,
            headerShown: false,
          }}
        >
          <Tab.Screen
            name="Home"
            component={Home}
            options={{
              tabBarShowLabel: false,
              tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons name="home" color={color} size={size} />
              ),
            }}
          />
          <Tab.Screen
            name="Recipe"
            component={Recipe}
            options={{
              tabBarShowLabel: false,
              tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons name="food" color={color} size={size} />
              ),
            }}
          />
          <Tab.Screen
            name="ProfileNavigator"
            component={ProfileNavigator}
            options={{
              tabBarShowLabel: false,
              tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons
                  name="account"
                  color={color}
                  size={size}
                />
              ),
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </UserDataContext.Provider>
  );
}

export default App;
