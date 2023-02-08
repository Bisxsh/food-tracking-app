import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import { Colors } from "react-native/Libraries/NewAppScreen";
import HomeMenu from "./components/HomeMenu";
import { HomeFilters } from "./components/HomeSortingFilters";

export function Home(): JSX.Element {
  const isDarkMode = false;
  const [ingredientsSearch, setIngredientsSearch] = useState("");
  const [selectedFilter, setSelectedFilter] = useState(0);

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
        filters={HomeFilters}
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
