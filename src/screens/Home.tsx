import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import { Colors, Header } from "react-native/Libraries/NewAppScreen";
import CustomSearchBar from "../components/CustomSearchBar";
import SortButton from "../components/SortButton";

export function Home(): JSX.Element {
  const isDarkMode = false;
  const [ingredientsSearch, setIngredientsSearch] = useState("");
  const [selectedFilter, setSelectedFilter] = useState(0);

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
      <View style={styles.menu}>
        <Text>{ingredientsSearch}</Text>
        <CustomSearchBar
          textHint="Search stored ingredients"
          text={ingredientsSearch}
          setText={setIngredientsSearch}
        />
        <SortButton
          options={filters}
          selectedOption={selectedFilter}
          setSelectedOption={setSelectedFilter}
          width={216}
        />
      </View>
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
