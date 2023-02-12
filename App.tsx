import React, { useEffect, useState } from "react";

import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { Recipe } from "./src/screens/Recipe";
import { COLOURS } from "./src/util/GlobalStyles";
import { DEFAULT_USER_DATA, UserDataContext } from "./src/classes/UserData";
import { MenuProvider } from "react-native-popup-menu";
import { ProfileNavigator } from "./src/screens/Profile/ProfileNavigator";
import HomeNavigator from "./src/screens/Home/components/HomeNavigator";
import { DEFAULT_USER, UserContext } from "./src/backends/User";
import * as DB from './src/backends/Database';

const Tab = createBottomTabNavigator();

function App(): JSX.Element {
  //TODO load user data from database and set it here
  const [userData, setUserData] = useState(DEFAULT_USER_DATA);
  
  //TODO need to merge with above
  const [user, setUser] = useState(DEFAULT_USER)
  DB.init().then(()=>{
    DB.create(user)
  })
  

  return (
    <MenuProvider>
      <UserContext.Provider value={{user, setUser}}>
        <UserDataContext.Provider value={{ userData, setUserData }}>
          <NavigationContainer>
            <Tab.Navigator
              initialRouteName="HomeNavigator"
              screenOptions={{
                tabBarActiveTintColor: COLOURS.primary,
                headerShown: false,
              }}
            >
              <Tab.Screen
                name="HomeNavigator"
                component={HomeNavigator}
                options={{
                  tabBarShowLabel: false,
                  tabBarIcon: ({ color, size }) => (
                    <MaterialCommunityIcons
                      name="home"
                      color={color}
                      size={size}
                    />
                  ),
                }}
              />
              <Tab.Screen
                name="Recipe"
                component={Recipe}
                options={{
                  tabBarShowLabel: false,
                  tabBarIcon: ({ color, size }) => (
                    <MaterialCommunityIcons
                      name="food"
                      color={color}
                      size={size}
                    />
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
      </UserContext.Provider>
    </MenuProvider>
  );
}

export default App;
