import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { UserDataContext } from "../../../../classes/UserData";
import IngredientCard from "./IngredientCard";
import { SPACING } from "../../../../util/GlobalStyles";
import { HomeContext } from "../HomeContextProvider";
import { useNavigation } from "@react-navigation/native";
import { IngredientBuilder } from "../../../../classes/IngredientClass";
import {getTimeLeft, getDaysUntilExpiry} from "../../../../util/ExpiryCalc"

type Props = {};

const IngredientViewExpiring = (props: Props) => {
  const { userData, setUserData } = useContext(UserDataContext);
  const { homeContext, setHomeContext } = useContext(HomeContext);
  const navigation = useNavigation<any>();

  // Filter the stored ingredients array based on getTimeLeft value
  const filteredIngredients = userData.storedIngredients.filter(
    (ingredient) => getDaysUntilExpiry(ingredient) <= 2
  );

  return (
    <View
      style={[
        styles.container,
        filteredIngredients.length > 2 ? { justifyContent: "center" } : {},
      ]}
    >
      {/* Map over the filtered ingredients array */}
      {filteredIngredients.map((ingredient) => (
        <TouchableOpacity
          onPress={() => {
            setHomeContext({
              ...homeContext,
              ingredientBeingEdited:
                IngredientBuilder.fromIngredient(ingredient),
            });
            navigation.navigate("ManualIngredient");
          }}
          key={`${ingredient.getId} - ${ingredient.getName}`}
        >
          <IngredientCard ingredient={ingredient} />
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default IngredientViewExpiring;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    marginTop: SPACING.small,
  },
});