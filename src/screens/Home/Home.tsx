import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import { Colors, Header } from "react-native/Libraries/NewAppScreen";
import Checkbox from "../../components/Checkbox";
import CustomSearchBar from "../../components/CustomSearchBar";
import SortButton from "../../components/SortButton";
import HomeMenu from "./HomeMenu";

export function Home(): JSX.Element {
  const isDarkMode = false;
  const [ingredientsSearch, setIngredientsSearch] = useState("");
  const [selectedFilter, setSelectedFilter] = useState(0);
  const [checked, setChecked] = useState(false);

  //TODO replace with obj
  const filters = [
    "Expiry Date: Low to High",
    "Expiry Date: High to Low",
    "Quantity: Low to High",
    "Quantity: High to Low",
  ];

  return (
    <View
      style={{
        backgroundColor: isDarkMode ? Colors.black : Colors.white,
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <HomeMenu
        filters={filters}
        ingredientsSearch={ingredientsSearch}
        selectedFilter={selectedFilter}
        setIngredientsSearch={setIngredientsSearch}
        setSelectedFilter={setSelectedFilter}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  menu: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
