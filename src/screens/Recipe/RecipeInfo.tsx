import {
  Alert,
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import React, { useContext, useState } from "react";
import { RecipeContext } from "./RecipeContextProvider";
import {
  COLOURS,
  FONT_SIZES,
  ICON_SIZES,
  RADIUS,
  SPACING,
} from "../../util/GlobalStyles";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Meal } from "../../backends/Meal";
import { UserDataContext } from "../../classes/UserData";
import { getSaved } from "../../util/GetRecipe";
import * as DB from "../../backends/Database";
import { DUMMY_MEALS } from "../../classes/DummyData";
import { UserContext } from "../../backends/User";
import { SafeAreaView, useSafeAreaFrame, useSafeAreaInsets } from "react-native-safe-area-context";
import * as MealClass from "../../classes/MealClass"

type InstructionBoxProps={
  instructions: string[]
}

function instructionsBox(props: InstructionBoxProps): JSX.Element{
  return (
    <View
      style={{

      }}
    >

    </View>
  );
}


type Props = {};

const RecipeInfo = (props: Props) => {
  const { recipeContext, setRecipeContext } = useContext(RecipeContext);
  const { userData, setUserData } = useContext(UserDataContext);
  const [isFavourite, setIsFavourite] = useState(recipeContext.recipeBeingViewed?.favourite);
  const navigation = useNavigation<any>();
  const meal = recipeContext.recipeBeingViewed || DUMMY_MEALS[0];
  const [servings, setServings] = useState(
    recipeContext.recipeBeingViewed?.servings || 1
  );
  const { user, setUser } = useContext(UserContext);
  const { height, width } = useWindowDimensions();
  const insets = useSafeAreaInsets()
  const isDarkMode = user.setting.isDark();
  const recipe = recipeContext.recipeBeingViewed;

  async function updateFavorite() {
    //TODO add to favorites

    setIsFavourite(!isFavourite);

    if (isFavourite) {
      await DB.deleteMeal(meal.name);
      setUserData({ ...userData, savedRecipes: await getSaved() });
    } else {
      await DB.create(meal);

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
    return Math.round((num / (recipe?.servings || 1)) * servings);
  }

  navigation.setOptions({
    title: meal.name,
    headerRight: () => (
      <View style={{flexDirection: "row"}}>
        {(meal.url == undefined || meal.url == "" || meal.url == null) && <TouchableOpacity 
          onPress={()=>{
            setRecipeContext({
              ...recipeContext, 
              recipeBeingEdited: MealClass.MealBuilder.fromMeal(meal.toMealClass())
            })
            navigation.navigate("ManualMeal");
          }}
          style={{marginRight: SPACING.tiny}}
        >
          <MaterialCommunityIcons
            name={"pencil"}
            size={ICON_SIZES.medium}
            color={isDarkMode ? "white" : "black"}
          />
        </TouchableOpacity>}
        <TouchableOpacity onPress={updateFavorite}>
          <MaterialCommunityIcons
            name={isFavourite ? "star" : "star-outline"}
            size={ICON_SIZES.medium}
            color={isFavourite ? COLOURS.primary : isDarkMode ? "white" : "black"}
          />
        </TouchableOpacity>
      </View>
      
    ),
  });

  function getNutrientRow(
    index: number,
    total: number,
    label: string,
    quantity: number,
    unit: string
  ) {
    return (
      <View
        key={index}
        style={[
          styles.nutrientRow,
          {
            backgroundColor: index % 2 == 1 ? COLOURS.grey : COLOURS.white,
            borderTopLeftRadius: index == 0 ? RADIUS.standard : undefined,
            borderTopRightRadius: index == 0 ? RADIUS.standard : undefined,
            borderBottomLeftRadius:
              index == total ? RADIUS.standard : undefined,
            borderBottomRightRadius:
              index == total ? RADIUS.standard : undefined,
          },
        ]}
      >
        <Text>{label}</Text>
        <Text>
          {calculateServingValue(quantity)} {unit}
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: isDarkMode ? COLOURS.darker : COLOURS.white },
      ]}
      edges={["left", "right"]}
    >
      <ScrollView>
        {meal.imgSrc ? (
          <Image source={{ uri: meal.imgSrc }} style={styles.foodImage} />
        ) : (
          <MaterialCommunityIcons
            name="image-off"
            size={width - insets.left - insets.right}
            style={styles.foodImage}
            color={COLOURS.darkGrey}
          />
        )}

        <View style={styles.contentContainer}>
          <View style={styles.sourceContainer}>
            {meal.source && (
              <Text
                style={{
                  fontSize: FONT_SIZES.medium,
                  color: isDarkMode ? COLOURS.white : COLOURS.black,
                }}
              >
                Source:{" "}
                {(recipeContext?.recipeBeingViewed?.source || "").replace(
                  ".com",
                  ""
                ) || ""}
              </Text>
            )}
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
            {(meal.source || meal.url) && getSeperator()}
          </View>
          
          <View style={[styles.sourceContainer, { marginTop: SPACING.medium }]}>
            <Text
              style={{
                fontSize: FONT_SIZES.medium,
                color: isDarkMode ? COLOURS.white : COLOURS.black,
              }}
            >
              Calories per serving:{" "}
              {Math.round(
                (recipe?.nutrition.energy || 0) / (recipe?.servings || 1)
              )}
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: SPACING.medium,
            }}
          >
            <Text
              style={{
                marginRight: SPACING.small,
                color: isDarkMode ? COLOURS.white : COLOURS.black,
              }}
            >
              Serving Size:
            </Text>
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
            <Text
              style={{
                marginHorizontal: SPACING.tiny,
                color: isDarkMode ? COLOURS.white : COLOURS.black,
              }}
            >
              {servings}
            </Text>
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
          {servings != recipe?.servings && (
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
          )}
          {getSeperator()}
          {recipe?.mealIngredients.map((ingredient, index) => {
            if (ingredient == "" || ingredient == " " || !ingredient)
              return null;
            const split = ingredient.split(" ");

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
                    color: isDarkMode ? COLOURS.white : COLOURS.black,
                    flexShrink: 1,
                  }}
                >
                  {split.slice(2).join(" ")}
                </Text>
              </View>
            );
          })}
          {recipe?.instruction.length != 0 && 
            <>
              {getSeperator()}
              <Text
                style={{
                  fontSize: FONT_SIZES.small,
                  color: isDarkMode ? COLOURS.white : COLOURS.black,
                  flexShrink: 1,
                }}
              >
                Instructions
              </Text>
            </>
          }
          {recipe?.instruction.length != 0 && 
            recipe?.instruction.map((instr, index)=>
              <View key={index} style={styles.ingredient}>
                <Text
                  style={{
                    fontSize: FONT_SIZES.medium,
                    color: isDarkMode ? COLOURS.white : COLOURS.black,
                    flexShrink: 1,
                  }}
                >
                  {instr}
                </Text>
              </View>
            )
          }
          <View style={styles.nutrientContainer}>
            {getNutrientRow(
              0,
              7,
              "Calories",
              recipe?.nutrition.energy || 0,
              recipe?.nutrition.energyUnit || "kcal"
            )}
            {getNutrientRow(
              1,
              7,
              "Protein",
              recipe?.nutrition.protein || 0,
              recipe?.nutrition.proteinUnit || "g"
            )}
            {getNutrientRow(
              2,
              7,
              "Fat",
              recipe?.nutrition.fat || 0,
              recipe?.nutrition.fatUnit || "g"
            )}
            {getNutrientRow(
              3,
              7,
              "Sat. Fat",
              recipe?.nutrition.saturatedFat || 0,
              recipe?.nutrition.saturatedFatUnit || "g"
            )}
            {getNutrientRow(
              4,
              7,
              "Carbohydrates",
              recipe?.nutrition.carbs || 0,
              recipe?.nutrition.carbsUnit || "g"
            )}
            {getNutrientRow(
              5,
              7,
              "Sugar",
              recipe?.nutrition.sugar || 0,
              recipe?.nutrition.sugarUnit || "g"
            )}
            {getNutrientRow(
              6,
              7,
              "Fibre",
              recipe?.nutrition.fibre || 0,
              recipe?.nutrition.fibreUnit || "g"
            )}
            {getNutrientRow(
              7,
              7,
              "Salt",
              recipe?.nutrition.salt || 0,
              recipe?.nutrition.saltUnit || "g"
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default RecipeInfo;

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    height: "100%",
    width: "100%",
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
