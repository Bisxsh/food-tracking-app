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
import { HomeSortingFilters } from "./components/Menu/HomeSortingFilters";

export function Home(): JSX.Element {
  const isDarkMode = false;
  const [ingredientsSearch, setIngredientsSearch] = useState("");
  const [selectedSort, setSelectedSort] = useState(0);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const navigation = useNavigation<any>();

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
          sort={selectedSort}
          setIngredientsSearch={setIngredientsSearch}
          setSort={setSelectedSort}
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
