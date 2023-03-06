import {
  Alert,
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useContext, useState } from "react";
import { RecipeContext } from "./RecipeContextProvider";
import { COLOURS, FONT_SIZES, RADIUS, SPACING } from "../../util/GlobalStyles";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Meal } from "../../backends/Meal";
import { UserDataContext } from "../../classes/UserData";
import { getSaved } from "../../util/GetRecipe";
import * as DB from "../../backends/Database";
import { DUMMY_MEALS } from "../../classes/DummyData";

type Props = {};

const RecipeInfo = (props: Props) => {
  const { recipeContext, setRecipeContext } = useContext(RecipeContext);
  const { userData, setUserData } = useContext(UserDataContext);
  const [isFavourite, setIsFavourite] = useState(false);
  const navigation = useNavigation<any>();
  const meal = recipeContext.recipeBeingViewed || DUMMY_MEALS[0];
  const [servings, setServings] = useState(recipeContext.viewedRecipeServings);
  console.log("INFO");
  console.log(recipeContext.recipeBeingViewed);

  async function updateFavorite() {
    //TODO add to favorites
    // console.log(isFavourite)
    setIsFavourite(!isFavourite);
    // console.log(isFavourite)
    if (isFavourite) {
      // console.log(await readAllMeal())
      await DB.deleteMeal(meal.name);
      setUserData({ ...userData, savedRecipes: await getSaved() });
    } else {
      console.log("its favourited");
      let newMeal = new Meal(
        meal.name,
        [],
        [],
        [],
        Math.floor(Math.random() * 1000),
        meal.url,
        meal.imgSrc
      );
      await DB.create(newMeal);
      // console.log(await readAllMeal())
      setUserData({ ...userData, savedRecipes: await getSaved() });
      // await DB.deleteMeal(props.recipeName)
    }

    // _id: "int primary key not null",
    // name: "ntext not null",
    // url: "ntext",
    // imgSrc: "ntext",
    // categoryId: "text",
    // instruction: "ntext",
    // ingredient: "ntext",
  }

  function getSeperator() {
    return <View style={{ height: SPACING.medium }} />;
  }

  const openURI = async () => {
    const url = meal.url || ""; //URL to be opened.
    const supported = await Linking.canOpenURL(url); //To check if URL is supported or not.
    if (supported) {
      await Linking.openURL(url); // It will open the URL on browser.
    } else {
      Alert.alert(`Don't know how to open this URL: ${url}`);
    }
  };

  function calculateServingValue(num: number) {
    return Math.round((num / recipeContext.viewedRecipeServings) * servings);
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.menu}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.goBack()}
        >
          <MaterialCommunityIcons name="arrow-left" size={24} color="black" />
        </TouchableOpacity>
        <Text
          numberOfLines={1}
          lineBreakMode={"clip"}
          style={{ maxWidth: "80%" }}
        >
          {meal.name}
        </Text>
        <TouchableOpacity
          onPress={() => {
            updateFavorite();
          }}
        >
          <MaterialCommunityIcons
            name={isFavourite ? "star" : "star-outline"}
            size={24}
            color={isFavourite ? COLOURS.primary : "black"}
            style={{ marginLeft: SPACING.small }}
          />
        </TouchableOpacity>
      </View>

      <Image source={{ uri: meal.imgSrc }} style={styles.foodImage} />

      <View style={styles.contentContainer}>
        <View style={styles.sourceContainer}>
          <Text style={{ fontSize: FONT_SIZES.medium }}>
            Source:{" "}
            {recipeContext?.viewedRecipeSource?.replace(".com", "") || ""}
          </Text>
          {meal.url && (
            <TouchableOpacity
              onPress={openURI}
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  color: COLOURS.primary,
                  fontSize: FONT_SIZES.medium,
                  marginRight: SPACING.tiny,
                }}
              >
                Instructions
              </Text>
              <MaterialCommunityIcons
                name="open-in-new"
                size={20}
                color={COLOURS.primary}
              />
            </TouchableOpacity>
          )}
        </View>
        {getSeperator()}
        <View style={[styles.sourceContainer, { marginTop: SPACING.medium }]}>
          <Text style={{ fontSize: FONT_SIZES.medium }}>
            Calories per serving:{" "}
            {Math.round(
              recipeContext.viewedRecipeNutrients[0].quantity /
                recipeContext.viewedRecipeServings
            )}
          </Text>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={{ marginRight: SPACING.small }}>Serving Size:</Text>
            <TouchableOpacity
              onPress={() => setServings((i) => i - 1)}
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <MaterialCommunityIcons
                name="minus-box"
                size={20}
                color={COLOURS.primary}
              />
            </TouchableOpacity>
            <Text style={{ marginHorizontal: SPACING.tiny }}>{servings}</Text>
            <TouchableOpacity
              onPress={() => setServings((i) => i + 1)}
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <MaterialCommunityIcons
                name="plus-box"
                size={20}
                color={COLOURS.primary}
              />
            </TouchableOpacity>
          </View>
        </View>
        <Text
          style={{
            textAlign: "center",
            fontStyle: "italic",
            color: COLOURS.darkGrey,
            marginTop: SPACING.small,
          }}
        >
          Note: Values provided are estimates only and may not be accurate
        </Text>

        {getSeperator()}
        {recipeContext.viewedRecipeIngredients.map((ingredient, index) => {
          if (ingredient == "" || ingredient == " " || !ingredient) return null;
          const split = ingredient.split(" ");
          console.log(split);

          return (
            <View key={index} style={styles.ingredient}>
              <Text
                style={{
                  color: COLOURS.primary,
                  fontWeight: "600",
                  fontSize: FONT_SIZES.medium,
                }}
              >
                {calculateServingValue(Number.parseInt(split[0])) || split[0]}{" "}
                {split[1]}{" "}
              </Text>
              <Text
                style={{
                  fontSize: FONT_SIZES.medium,
                }}
              >
                {split.slice(2).join(" ")}
              </Text>
            </View>
          );
        })}
        <View style={styles.nutrientContainer}>
          {recipeContext.viewedRecipeNutrients.map((nutrient, index) => (
            <View
              key={index}
              style={[
                styles.nutrientRow,
                index % 2 == 1 ? { backgroundColor: COLOURS.grey } : {},
                index == recipeContext.viewedRecipeNutrients.length - 1
                  ? styles.bottomRow
                  : {},
              ]}
            >
              <Text>{nutrient.label}</Text>
              <Text>
                {calculateServingValue(nutrient.quantity)} {nutrient.unit}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

export default RecipeInfo;

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    paddingBottom: SPACING.medium,
    bottom: 0,
    backgroundColor: COLOURS.white,
    height: "100%",
    width: "100%",
    paddingTop: SPACING.large + 16,
    flex: 1,
  },

  menu: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    paddingLeft: SPACING.medium,
    paddingRight: SPACING.medium,
    paddingBottom: SPACING.small,
  },

  button: {
    padding: SPACING.small,
  },

  foodImage: {
    width: "100%",
    aspectRatio: 1,
  },

  contentContainer: {
    flex: 1,
    width: "100%",
    paddingHorizontal: SPACING.medium,
    marginTop: SPACING.medium,
  },

  sourceContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },

  ingredient: {
    flexDirection: "row",
    paddingVertical: SPACING.medium,
    borderBottomColor: COLOURS.darkGrey,
    borderBottomWidth: 1,
  },

  nutrientContainer: {
    borderColor: COLOURS.darkGrey,
    borderWidth: 1,
    borderRadius: RADIUS.standard,
    marginVertical: SPACING.medium,
    marginBottom: SPACING.extraLarge,
  },

  nutrientRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: SPACING.medium,
    paddingHorizontal: SPACING.medium,
  },

  topRow: {
    borderTopLeftRadius: RADIUS.standard,
    borderTopRightRadius: RADIUS.standard,
  },

  bottomRow: {
    borderBottomLeftRadius: RADIUS.standard,
    borderBottomRightRadius: RADIUS.standard,
  },
});
