import { useNavigation } from "@react-navigation/native";
import React, { useContext, useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import { Colors } from "react-native/Libraries/NewAppScreen";
import { Category } from "../../classes/Categories";
import { UserDataContext } from "../../classes/UserData";
import AddButton from "../../components/AddButton";
import { SPACING } from "../../util/GlobalStyles";
import AddMenu from "./components/Add/AddMenu";
import IndgredientView from "./components/Main/IndgredientView";
import HomeMenu from "./components/Menu/HomeMenu";
import {
  HomeSortingFilter,
  HomeSortingFilters,
} from "./components/Menu/HomeSortingFilters";

export function Home(): JSX.Element {
  const isDarkMode = false;
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
      <View
        style={{
          backgroundColor: isDarkMode ? Colors.black : Colors.white,
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          padding: SPACING.extraLarge,
          paddingLeft: SPACING.medium,
          paddingRight: SPACING.medium,
        }}
      >
        <HomeMenu
          sortFilters={HomeSortingFilters}
          ingredientsSearch={ingredientsSearch}
          sort={HomeSortingFilters.indexOf(selectedSort)}
          setIngredientsSearch={setIngredientsSearch}
          setSort={(i: number) => setSelectedSort(HomeSortingFilters[i])}
        />
        <IndgredientView />
        <View style={{ flex: 1 }} />
      </View>
      <AddButton onPress={() => setShowAddMenu(true)} />
      <AddMenu showModal={showAddMenu} setShowModal={setShowAddMenu} />
    </>
  );
}

const styles = StyleSheet.create({});
