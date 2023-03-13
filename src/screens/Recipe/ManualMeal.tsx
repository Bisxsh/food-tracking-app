import {
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import React, { useContext, useEffect, useRef, useState } from "react";
import { COLOURS, ICON_SIZES, SPACING } from "../../util/GlobalStyles";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { Dimensions } from "react-native";

import { IngredientBuilder, weightUnit } from "../../classes/IngredientClass";
import * as MealClass from "../../classes/MealClass";
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
import { UserContext } from "../../backends/User";
import { SafeAreaView } from "react-native-safe-area-context";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
type Props = {
  setShowManual?: (showManual: boolean) => void;
  setMeal?: (meal: MealClass.MealBuilder | null) => void;
  mealBuilder?: MealClass.MealBuilder;
};

const ManualMeal = (props: Props) => {
  const { recipeContext, setRecipeContext } = useContext(RecipeContext);
  const { userData, setUserData } = useContext(UserDataContext);
  const resetOption = useRef(true)
  if (resetOption.current){
    userData.ingredientCategories.forEach((v)=>v.active=false)
    resetOption.current = false
  }
  const [categories, setCategories] = useState<Category[]>(
    userData.ingredientCategories
  );
  const navigation = useNavigation<any>();
  const [mealBuilder, setMealBuilder] = useState(
    recipeContext.recipeBeingEdited || new MealClass.MealBuilder()
  );
  const { user, setUser } = useContext(UserContext);
  const isDarkMode = user.setting.isDark();
  const {height, width} = useWindowDimensions()

  function getSeperator() {
    return <View style={{ height: SPACING.medium }} />;
  }

  async function saveRecipe() {
    if (!mealBuilder.allRequiredFieldsSet()) {
      alert("All required fields must be set");
      return;
    }

    mealBuilder.setCategoryId([1]);
    if (mealBuilder.getId() == 0 && userData.customRecipes.length > 0) {
      mealBuilder.setId(userData.customRecipes.length); //change to meal id
    }

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
    let builtMeal : MealClass.Meal = mealBuilder.build();
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
    navigation.popToTop();
  }

  navigation.setOptions({
    title: "Add a meal",
    headerTitleAlign: "center",
    headerLeft: ()=>(
      <TouchableOpacity
          onPress={closeManual}
      >
          <MaterialCommunityIcons
              name="arrow-left"
              size={ICON_SIZES.medium}
              color={isDarkMode ? COLOURS.white : COLOURS.black}
          />
      </TouchableOpacity>
    ),
    headerRight: ()=>(
        <TouchableOpacity
            onPress={saveRecipe}
        >
            <MaterialCommunityIcons
                name="check"
                size={ICON_SIZES.medium}
                color={isDarkMode ? COLOURS.white : COLOURS.black}
            />
        </TouchableOpacity>
    )
  })

  return (
    <SafeAreaView 
      style={[
        styles.container, 
        {backgroundColor: isDarkMode ? COLOURS.darker : COLOURS.white,}
      ]}
      edges={["left", "right"]}
    >
      <KeyboardAwareScrollView
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
        <Text 
          style={{ 
            marginBottom: SPACING.tiny, 
            color: isDarkMode ? COLOURS.white : COLOURS.black 
          }}
        >
          Instructions
        </Text>
        <InstructionsList mealBuilder={mealBuilder}></InstructionsList>
        {getSeperator()}
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default ManualMeal;

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    paddingLeft: SPACING.medium,
    paddingRight: SPACING.medium,
    bottom: 0,
    backgroundColor: COLOURS.white,
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

  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
