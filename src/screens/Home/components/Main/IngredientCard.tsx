import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Ingredient } from "../../../../classes/IngredientClass";
import { Dimensions, Image } from "react-native";
import {
  COLOURS,
  DROP_SHADOW,
  RADIUS,
  SPACING,
} from "../../../../util/GlobalStyles";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { getTimeLeft } from "../../../../util/ExpiryCalc";

type Props = {
  ingredient: Ingredient;
};

const IngredientTile = ({ ingredient }: Props) => {
  const expired = ingredient.expiryDate < new Date();
  function getCardContent(showText?: boolean) {
    return (
      <>
        {showText && (
          <Text style={{ textAlign: "center", marginBottom: SPACING.medium }}>
            {ingredient.name}
          </Text>
        )}
        <View style={[styles.timeContainer]}>
          <MaterialCommunityIcons
            name="clock-outline"
            size={16}
            color="black"
          />
          <Text style={{ marginLeft: SPACING.tiny }}>
            {getTimeLeft(ingredient)}
          </Text>
        </View>
        {ingredient.quantity > 1 && (
          <View style={[styles.bubble]}>
            <Text style={{ fontWeight: "600" }}>x{ingredient.quantity}</Text>
          </View>
        )}
      </>
    );
  }

  return ingredient.imgSrc == "" ? (
    <View style={styles.container}>{getCardContent(true)}</View>
  ) : (
    <View style={styles.container}>
      <Image source={{ uri: ingredient.imgSrc }} style={styles.image} />
      {getCardContent()}
    </View>
  );
};

export default IngredientTile;

const styles = StyleSheet.create({
  container: {
    position: "relative",
    aspectRatio: 1,
    width: Dimensions.get("screen").width / 3 - SPACING.medium * 2,
    height: Dimensions.get("screen").width / 3 - SPACING.medium * 2,
    backgroundColor: COLOURS.darkGrey,
    margin: SPACING.small,
    justifyContent: "center",
    borderRadius: RADIUS.standard,
  },

  timeContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    bottom: 0,
    alignSelf: "center",
    paddingTop: SPACING.small,
    paddingBottom: SPACING.small,
    width: "100%",
    backgroundColor: "rgba(238, 238, 238, 0.92)",
    borderBottomLeftRadius: RADIUS.standard,
    borderBottomRightRadius: RADIUS.standard,
  },

  image: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    borderRadius: RADIUS.standard,
  },

  bubble: {
    position: "absolute",
    left: -5,
    top: -5,
    padding: SPACING.small,
    borderRadius: RADIUS.standard,
    aspectRatio: 1,
    backgroundColor: COLOURS.grey,
    // ...DROP_SHADOW,
  },
});
