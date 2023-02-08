import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import { Colors } from "react-native/Libraries/NewAppScreen";
import { SPACING } from "../../util/GlobalStyles";
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
        padding: SPACING.extraLarge,
      }}
    >
      <HomeMenu
        filters={HomeFilters}
        ingredientsSearch={ingredientsSearch}
        selectedFilter={selectedFilter}
        setIngredientsSearch={setIngredientsSearch}
        setSelectedFilter={setSelectedFilter}
      />
      <View style={{ flex: 1 }} />
    </View>
  );
}

const styles = StyleSheet.create({});
