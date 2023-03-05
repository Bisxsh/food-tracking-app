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
            Source: {recipeContext.viewedRecipeSource.replace(".com", "")}
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
            Calories: {"1057 kcal"}
          </Text>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={{ marginRight: SPACING.small }}>Serving Size:</Text>
            <TouchableOpacity
              onPress={openURI}
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
            <Text style={{ marginHorizontal: SPACING.tiny }}>{"4"}</Text>
            <TouchableOpacity
              onPress={openURI}
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
          Note: Values provided are estimated and may differ from true values
        </Text>

        {getSeperator()}
        {recipeContext.viewedRecipeIngredients.map((ingredient, index) => {
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
                {split.slice(0, 2).join(" ")}{" "}
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
    paddingLeft: SPACING.medium,
    paddingRight: SPACING.medium,
  },

  ingredient: {
    flexDirection: "row",
    marginHorizontal: SPACING.medium,
    paddingVertical: SPACING.medium,
    borderBottomColor: COLOURS.darkGrey,
    borderBottomWidth: 1,
  },
});
