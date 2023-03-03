import React, { useContext, useEffect, useState } from "react";
import { Dimensions, SafeAreaView, StyleSheet, Text, View } from "react-native";

import { Colors } from "react-native/Libraries/NewAppScreen";
import { UserContext } from "../../backends/User";
import { UserDataContext } from "../../classes/UserData";
import AddButton from "../../components/AddButton";
import { SPACING } from "../../util/GlobalStyles";
import AddMenu from "./components/Add/AddMenu";
import IndgredientView from "./components/Main/IndgredientView";
import HomeMenu from "./components/Menu/HomeMenu";
import ExpiringButton from "./components/Main/ExpiringButton";
import {
  HomeSortingFilter,
  HomeSortingFilters,
} from "./components/Menu/HomeSortingFilters";
import { differenceInDays, isSameDay } from "date-fns";

export function Home(): JSX.Element {
  const { user, setUser } = useContext(UserContext);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(user.setting.isDark());
  const [ingredientsSearch, setIngredientsSearch] = useState("");
  const [showAddMenu, setShowAddMenu] = useState(false);
  const { userData, setUserData } = useContext(UserDataContext);
  const [selectedSort, setSelectedSort] = useState(userData.homePageSort || 0);

  useEffect(() => {
    switch (selectedSort) {
      default:
      case HomeSortingFilter.ExpiryDateFirstToLast:
        setUserData({
          ...userData,
          storedIngredients: userData.storedIngredients.sort((a, b) => {
            return a.expiryDate.getTime() - b.expiryDate.getTime();
          }),
        });
        break;
      case HomeSortingFilter.ExpiryDateLastToFirst:
        setUserData({
          ...userData,
          storedIngredients: userData.storedIngredients.sort((a, b) => {
            return b.expiryDate.getTime() - a.expiryDate.getTime();
          }),
        });
        break;
      case HomeSortingFilter.QuantityLowToHigh:
        setUserData({
          ...userData,
          storedIngredients: userData.storedIngredients.sort((a, b) => {
            return a.quantity - b.quantity;
          }),
        });
        break;
      case HomeSortingFilter.QuantityHighToLow:
        setUserData({
          ...userData,
          storedIngredients: userData.storedIngredients.sort((a, b) => {
            return b.quantity - a.quantity;
          }),
        });
        break;
    }
    setUserData({
      ...userData,
      homePageSort: selectedSort,
    });
  }, [selectedSort]);

  return (
    <>
      <SafeAreaView
        style={{
          backgroundColor: isDarkMode ? Colors.darker : Colors.white,
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          paddingTop: SPACING.extraLarge,
        }}
      >
        <HomeMenu
          sortFilters={HomeSortingFilters}
          ingredientsSearch={ingredientsSearch}
          sort={HomeSortingFilters.indexOf(selectedSort)}
          setIngredientsSearch={setIngredientsSearch}
          setSort={(i: number) => setSelectedSort(HomeSortingFilters[i])}
          showExpiringButton={userData.storedIngredients.some(
            (i) =>
              differenceInDays(i.expiryDate, new Date()) <= 1 &&
              differenceInDays(i.expiryDate, new Date()) > 0 &&
              i.quantity > 0
          )}
        />
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "center",
            alignContent: "center",
          }}
        >
          <IndgredientView ingredientsSearch={ingredientsSearch} />
        </View>
      </SafeAreaView>
      <AddButton onPress={() => setShowAddMenu(true)} />
      <AddMenu showModal={showAddMenu} setShowModal={setShowAddMenu} />
    </>
  );
}

const styles = StyleSheet.create({});
