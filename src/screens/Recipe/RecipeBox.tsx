import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  View,
  Button,
  Image,
} from "react-native";
import { Colors, Header } from "react-native/Libraries/NewAppScreen";
import { getRecipes } from "../../util/GetRecipe";
import {
  COLOURS,
  DROP_SHADOW,
  FONT_SIZES,
  RADIUS,
  SPACING,
} from "../../util/GlobalStyles";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { requestMicrophonePermissionsAsync } from "expo-camera";
import CardDetail, { RecipeCardIcon } from "./components/CardDetail";
import { Meal } from "../../classes/MealClass";


type Props = {
  recipeName: string;
  recipeImage: string;
  recipeCalories: string;
  recipeServings: string;
  recipeCautions: any;
  recipeIngredients: string;
};

const RecipeBox = (props: Props) => {
  const isDarkMode = false;

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <View style={{ flex: 1, width: "100%", paddingHorizontal: SPACING.medium }}>
      <View style={styles.container}>
        <View style={{ position: "relative" }}>
          <Image source={{ uri: props.recipeImage}} style={styles.foodImage} />
          <View style={styles.timeContainer}>
            <MaterialCommunityIcons
              name="clock-outline"
              size={16}
              color="black"
            />
            {/* TODO implement time here */}
            <Text style={{ marginLeft: SPACING.tiny }}>30 mins</Text>
          </View>
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.textHeading} numberOfLines={1}>
            {props.recipeName}
          </Text>
          <View
            style={{
              flexDirection: "column",
              justifyContent: "space-around",
              flex: 1,
              paddingTop: SPACING.small,
            }}
          >
            <CardDetail
              icon={RecipeCardIcon.CALORIES}
              text={`${Math.round(
                parseInt(props.recipeCalories) / parseInt(props.recipeServings) //need to add calorie to class
              )} Calories`}
            />
            <CardDetail
              icon={RecipeCardIcon.ALLERGENS}
              text={`Contains ${props.recipeCautions.join(", ")}`}
            />
            <CardDetail
              icon={RecipeCardIcon.INGREDIENTS}
              text={`${props.recipeIngredients.length} ingredients`}
            />
          </View>
        </View>
      </View>
    </View>
  );
};
export default RecipeBox;

const styles = StyleSheet.create({
  container: {
    marginTop: SPACING.small,
    height: 128,
    flexDirection: "row",
    backgroundColor: COLOURS.grey,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "flex-start",
  },

  foodImage: {
    borderRadius: RADIUS.small,
    width: 128,
    aspectRatio: 1,
  },

  textContainer: {
    padding: SPACING.medium,
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    height: "100%",
    flex: 1,
  },

  textHeading: {
    fontSize: FONT_SIZES.medium,
  },

  timeContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    bottom: 0,
    left: 0,
    alignSelf: "center",
    paddingVertical: SPACING.tiny,
    paddingHorizontal: SPACING.tiny,
    backgroundColor: "rgba(238, 238, 238, 0.9)",
    borderRadius: RADIUS.tiny,
    marginBottom: SPACING.tiny,
    marginLeft: SPACING.tiny,
  },
});
