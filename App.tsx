import { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  View,
  Text,
  Image,
  useWindowDimensions,
  StatusBar,
} from "react-native";

import {
  COLOURS,
  FONT_SIZES,
  ICON_SIZES,
  SPACING,
} from "./src/util/GlobalStyles";
import { DEFAULT_USER_DATA, UserDataContext } from "./src/classes/UserData";
import { MenuProvider } from "react-native-popup-menu";
import { ProfileNavigator } from "./src/screens/Profile/ProfileNavigator";
import HomeNavigator from "./src/screens/Home/components/HomeNavigator";
import RecipeNavigator from "./src/screens/Recipe/RecipeNavigator";
import { DEFAULT_USER, UserContext } from "./src/backends/User";
import * as DB from "./src/backends/Database";
import { ActionSheetProvider } from "@expo/react-native-action-sheet";
import { UserSetting } from "./src/backends/UserSetting";
import { InitialEntry } from "./src/screens/InitialEntry";
import registerNNPushToken from "native-notify";
import * as Notifications from "expo-notifications";
import { getRecipes, getSaved, getCustom } from "./src/util/GetRecipe";
import * as IngredientClass from "./src/classes/IngredientClass";
import * as CategoryClass from "./src/classes/Categories";
import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

const Tab = createBottomTabNavigator();

var firstTime = true;

function App(): JSX.Element {
  registerNNPushToken(6535, "xdrqfHr09cuuEeUjH1MATl");
  const [loading, setLoading] = useState(true);
  const [consent, setConsent] = useState(true);
  const { height, width } = useWindowDimensions();

  //TODO load user data from database and set it here
  const [userData, setUserData] = useState(DEFAULT_USER_DATA);

  //TODO need to merge with above
  const [user, setUser] = useState(DEFAULT_USER);
  const init = async () => {
    const start = Date.now();
    await DB.init();
    const stored = await DB.readUser(0);
    if (stored == undefined) {
      await user.loadCategories();
      await DB.create(user);
      setConsent(false);
    } else {
      await stored.loadCategories();
      setUser(stored);
      setUserData({
        ...userData,
        ingredientCategories: stored.categories,
      });
      setConsent(stored.consent);
    }
    const ing: IngredientClass.Ingredient[] = [];
    for (const v of await DB.readAllIngredient()) {
      ing.push(await v.toIngredientClass());
    }
    setUserData({
      ...userData,
      ingredientCategories: (await DB.readAllCategory()).map((v) =>
        v.toCategoryClass()
      ),
      storedIngredients: ing,
      exploreRecipes: await getRecipes(),
      savedRecipes: await getSaved(),
      customRecipes: await getCustom(),
    });
    // while (Date.now() - start < 5000) {
    //   console.log("wait")
    // }
    setLoading(false);
  };

  UserSetting.reloadApp = async () => {
    setLoading(true);
    await DB.init();
    const stored = await DB.readUser(0);
    if (stored == undefined) {
      user.reset();
      DB.create(user);
      setConsent(false);
    } else {
      setUser(stored);
      setConsent(stored.consent);
    }
    setUserData({
      ...userData,
      ingredientCategories: [],
      storedIngredients: [],
      exploreRecipes: await getRecipes(),
      savedRecipes: await getSaved(),
      customRecipes: await getCustom(),
    });
    setLoading(false);
  };

  if (firstTime) {
    firstTime = false;
    init();
  }
  const [isDarkMode, setIsDarkMode] = useState(user.setting.isDark());

  useEffect(() => {
    Notifications.getAllScheduledNotificationsAsync().then((list) => {
      if (user.setting.notification && list.length == 0) {
        // Send push notification at 10pm GMT every day
        const trigger: Notifications.DailyTriggerInput = {
          hour: 22, // 10pm GMT
          minute: 0,
          //second: 0,
          repeats: true, // Send notification every day
        };

        Notifications.scheduleNotificationAsync({
          content: {
            title: "Check your food",
            body: "You need to check your food that are expiring soon!",
          },
          trigger,
        });
      }
    });

    Notifications.getAllScheduledNotificationsAsync().then((v) => {
      // console.log("Number of notications scheduled: " + v.length);
    });
  }, []);

  useEffect(
    () => setIsDarkMode(user.setting.isDark()),
    [user.setting.appearance]
  );

  return (
    <SafeAreaProvider>
      <ActionSheetProvider>
        <MenuProvider
          style={{
            backgroundColor: isDarkMode ? COLOURS.darker : COLOURS.white,
          }}
        >
          {loading && (
            <View
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Image
                style={{
                  height: Math.min(height, width) / 2,
                  width: Math.min(height, width) / 2,
                }}
                source={require("./src/assets/LauncherIcon_v4_1.png")}
              />
              <Text
                style={{
                  fontSize: FONT_SIZES.heading,
                  color: isDarkMode ? COLOURS.white : COLOURS.black,
                  textAlign: "center",
                }}
              >
                {"Welcome to\nWasteX"}
              </Text>
            </View>
          )}
          {!loading && (
            <UserContext.Provider value={{ user, setUser }}>
              <UserDataContext.Provider value={{ userData, setUserData }}>
                <StatusBar
                  backgroundColor={isDarkMode ? COLOURS.darker : COLOURS.white}
                  barStyle={isDarkMode ? "light-content" : "dark-content"}
                />
                {!consent && (
                  <InitialEntry
                    user={user}
                    setUser={setUser}
                    setConsent={setConsent}
                  />
                )}
                {consent && (
                  <NavigationContainer>
                    <Tab.Navigator
                      initialRouteName="HomeNavigator"
                      screenOptions={{
                        tabBarActiveTintColor: COLOURS.primary,
                        headerShown: false,
                        tabBarStyle: {
                          backgroundColor: isDarkMode
                            ? COLOURS.darker
                            : COLOURS.white,
                        },
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
                          unmountOnBlur: true,
                        }}
                      />
                      <Tab.Screen
                        name="Recipe"
                        component={RecipeNavigator}
                        options={{
                          tabBarShowLabel: false,
                          tabBarIcon: ({ color, size }) => (
                            <MaterialCommunityIcons
                              name="food"
                              color={color}
                              size={size}
                            />
                          ),
                          unmountOnBlur: true,
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
                          unmountOnBlur: true,
                        }}
                      />
                    </Tab.Navigator>
                  </NavigationContainer>
                )}
              </UserDataContext.Provider>
            </UserContext.Provider>
          )}
        </MenuProvider>
      </ActionSheetProvider>
    </SafeAreaProvider>
  );
}

export default App;
