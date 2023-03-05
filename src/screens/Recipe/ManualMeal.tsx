import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { COLOURS, SPACING } from "../../util/GlobalStyles";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { Dimensions } from "react-native";

import { IngredientBuilder, weightUnit } from "../../classes/IngredientClass";
import { MealBuilder } from "../../classes/MealClass";
import * as DB from "../../backends/Database";
import ChipsSelectors from "../../components/ChipsSelectors";
import NameAndImage from "../../components/NameAndImage";
import { Category } from "../../classes/Categories";
import { UserDataContext } from "../../classes/UserData";
import DateField from "../../components/DateField";
import InputFieldWithUnits from "../../components/InputFieldWithUnits";
import InputField from "../../components/InputField";
import NumberInputRow from "../Home/components/Add/NumberInputRow";
import RecipeBox from "./RecipeBox";
import RecipeIngredientList from "../../components/RecipeIngredientList";
import PrimaryButton from "../../components/PrimaryButton";
import { RecipeContext } from "./RecipeContextProvider";
import { useNavigation } from "@react-navigation/native";
import InstructionsList from "../../components/InstructionsList";
import { Meal } from "../../backends/Meal";
import { readAllMeal } from "../../backends/Database";
type Props = {
  setShowManual?: (showManual: boolean) => void;
  setMeal?: (meal: MealBuilder | null) => void;
  mealBuilder?: MealBuilder;
};

const ManualMeal = (props: Props) => {
  const { recipeContext, setRecipeContext } = useContext(RecipeContext);
  const { userData, setUserData } = useContext(UserDataContext);
  const [categories, setCategories] = useState<Category[]>(
    userData.ingredientCategories
  );
  const navigation = useNavigation<any>();
  const [mealBuilder, setMealBuilder] = useState(
    recipeContext.recipeBeingEdited || new MealBuilder()
  );


  function getSeperator() {
    return <View style={{ height: SPACING.medium }} />;
  }

  async function saveRecipe() {
    if (!mealBuilder.allRequiredFieldsSet()) {
      alert("All required fields must be set");
      return;
    }

    mealBuilder.setCategoryId([1]);
    if (mealBuilder.getId() == 0 && userData.savedRecipes.length > 0) {
      mealBuilder.setId(userData.savedRecipes.length); //change to meal id
    }
    console.log("ID: ", mealBuilder.getId());
    // if (
    //   userData.storedIngredients.find(
    //     (ing) => ing.id === mealBuilder.getId()
    //   )
    // ) {
    //   setUserData({
    //     ...userData,
    //     storedIngredients: userData.storedIngredients.map((ing) =>
    //       ing.id === ingredientBuilder.getId() ? ingredientBuilder.build() : ing
    //     ),
    //   });
    // } else
    // userData.storedIngredients.push(mealBuilder.build());
    let builtMeal = mealBuilder.build();
    userData.customRecipes.push(builtMeal);
    let meal = new Meal(
      builtMeal.getName,
      builtMeal.getCategoryId,
      builtMeal.getInstruction,
      builtMeal.getIngredients,
      builtMeal.getId,
      "",
      builtMeal.getImgSrc
    );
      await DB.create(meal);
    //constructor(name: string, categoryId: number[], instruction: string[], _id?:number, url?: string, imgSrc?: string){
    closeManual();
  }

  function closeManual() {
    // props.setIngredient && props.setIngredient(null);
    setRecipeContext({ ...recipeContext, recipeBeingEdited: null });
    navigation.reset({
      index: 0,
      routes: [{ name: "Recipe" }],
    });
  }

  return (
    <View style={styles.container}>
      <View style={styles.menu}>
        <TouchableOpacity style={styles.button} onPress={closeManual}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="black" />
        </TouchableOpacity>
        <Text>Add a meal</Text>
        <TouchableOpacity style={styles.button}>
          <MaterialCommunityIcons
            name="check"
            size={24}
            color="black"
            onPress={saveRecipe}
          />
        </TouchableOpacity>
      </View>
      <View style={{ flex: 1 }}>
        <ScrollView
          style={{ width: "100%", height: "100%" }}
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 60 }}
        >
          <NameAndImage
            onImgChange={(str) => mealBuilder.setImgSrc(str)}
            onNameChange={(str) => mealBuilder.setName(str)}
            imgStr={mealBuilder.getImgSrc()}
            nameStr={mealBuilder.getName()}
          />
          {getSeperator()}
          <ChipsSelectors
            fieldName="Categories"
            categories={categories}
            setCategories={(categories: Category[]) =>
              setCategories(categories)
            }
            center
            onAdd={(category: Category) => {
              setUserData({
                ...userData,
                ingredientCategories: [
                  ...userData.ingredientCategories,
                  category,
                ],
              });
            }}
          />
          {getSeperator()}
          <RecipeIngredientList />
          {getSeperator()}
          <Text style={{ marginBottom: SPACING.tiny }}>Instructions</Text>
          <InstructionsList mealBuilder={mealBuilder}></InstructionsList>
          {getSeperator()}
          <PrimaryButton text="Save" onPress={saveRecipe} />
          <View style={{ height: SPACING.medium }} />
        </ScrollView>
      </View>
    </View>
  );
};

export default ManualMeal;

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    paddingBottom: SPACING.medium,
    paddingLeft: SPACING.medium,
    paddingRight: SPACING.medium,
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

  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
