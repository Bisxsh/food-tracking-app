import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { FONT_SIZES, SPACING } from "../../../util/GlobalStyles";

export enum RecipeCardIcon {
  CALORIES = "flame-outline",
  ALLERGENS = "warning-outline",
  INGREDIENTS = "shopping-outline",
}

type Props = {
  icon: RecipeCardIcon;
  text: string;
};

const CardDetail = (props: Props) => {
  return (
    <View style={styles.container}>
      {props.icon == RecipeCardIcon.INGREDIENTS ? (
        <MaterialCommunityIcons
          name={props.icon}
          size={SPACING.medium}
          color="black"
        />
      ) : (
        <Ionicons name={props.icon} size={SPACING.medium} color="black" />
      )}

      <Text style={styles.text} numberOfLines={1}>
        {props.text}
      </Text>
    </View>
  );
};

export default CardDetail;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },

  text: {
    marginLeft: SPACING.tiny,
    fontSize: FONT_SIZES.small,
    maxWidth: "98%",
  },
});
