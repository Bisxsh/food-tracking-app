import {
  Alert,
  AlertButton,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import React, { useContext, useRef, useState } from "react";
import { COLOURS, ICON_SIZES, SPACING } from "../../util/GlobalStyles";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import * as MealClass from "../../classes/MealClass";
import * as DB from "../../backends/Database";
import ChipsSelectors from "../../components/ChipsSelectors";
import NameAndImage from "../../components/NameAndImage";
import * as CategoryClass from "../../classes/Categories";
import { UserDataContext } from "../../classes/UserData";
import RecipeIngredientList from "../../components/RecipeIngredientList";
import { RecipeContext } from "./RecipeContextProvider";
import { useNavigation } from "@react-navigation/native";
import InstructionsList from "../../components/InstructionsList";
import { Meal } from "../../backends/Meal";
import { UserContext, User } from "../../backends/User";
import { SafeAreaView } from "react-native-safe-area-context";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { getSaved } from "../../util/GetRecipe";

type alertProp = {
  title: string
  desc: string
  buttons: AlertButton[]
  user: User
}

function createAlert(prop: alertProp){
  Alert.alert(
      prop.title,
      prop.desc,
      prop.buttons,
      {cancelable:true, userInterfaceStyle:(prop.user.setting.isDark())?"dark":"light"}
  )
}

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
  const navigation = useNavigation<any>();
  const [mealBuilder, setMealBuilder] = useState(
    recipeContext.recipeBeingEdited || new MealClass.MealBuilder()
  );
  const [categories, setCategories] = useState<CategoryClass.Category[]>(
    userData.ingredientCategories.map((cat)=>mealBuilder.getCategoryId().includes(cat.id!)? {...cat, active: true}: cat)
  );
  const { user, setUser } = useContext(UserContext);
  const isDarkMode = user.setting.isDark();
  const { height, width } = useWindowDimensions();

  function getSeperator() {
    return <View style={{ height: SPACING.medium }} />;
  }

  async function saveRecipe() {
    if (!mealBuilder.allRequiredFieldsSet()) {
      alert("All required fields must be set");
      return;
    }

    const catId: number[] = [];
    const catDB = await DB.readAllCategory();
    for (const cat of categories) {
      if (catDB.filter((c)=>c.name == cat.name).length == 0){
        const catBack = CategoryClass.toCategoryBack(cat)
        DB.create(catBack)
        cat.id = catBack._id
      }
      if (cat.active){
        catId.push(cat.id!)
      }
    }
    mealBuilder.setCategoryId(catId);
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
    const meal : Meal = Meal.fromBuilder(mealBuilder);

    if (mealBuilder.getId() == -1){
      await DB.create(meal);
      setUserData({
        ...userData,
        customRecipes: [...userData.customRecipes, meal],
      });
    }else{
      await DB.updateMeal(meal)
      setUserData({
        ...userData,
        customRecipes: userData.customRecipes.map((m)=>m._id == meal._id? meal: m)
      })
    }
    
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
    headerLeft: () => (
      <TouchableOpacity onPress={closeManual}>
        <MaterialCommunityIcons
          name="arrow-left"
          size={ICON_SIZES.medium}
          color={isDarkMode ? COLOURS.white : COLOURS.black}
        />
      </TouchableOpacity>
    ),
    headerRight: () => (
      <View style={{flexDirection: "row"}}>
        <TouchableOpacity 
          onPress={()=>{
            createAlert({
              title:"Delete this recipe", 
              desc:"Do you want to delete this recipe?\n\nThis action cannot be undone.", 
              buttons:[
                {
                  text: "Cancel",
                  style: "cancel"
                },
                {
                  text: "Delete",
                  style: "destructive",
                  onPress: async ()=>{
                    await DB.deleteMeal(mealBuilder.getName());
                    setUserData({ ...userData, savedRecipes: await getSaved() });
                    closeManual();
                  }
                }
              ],
              user: user
            })
          }}
          style={{marginRight: SPACING.small}}
        >
          <MaterialCommunityIcons
            name={"delete"}
            size={ICON_SIZES.medium}
            color={"red"}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={saveRecipe}>
          <MaterialCommunityIcons
            name="check"
            size={ICON_SIZES.medium}
            color={isDarkMode ? COLOURS.white : COLOURS.black}
          />
        </TouchableOpacity>
      </View>
    ),
  });

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: isDarkMode ? COLOURS.darker : COLOURS.white },
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
          setCategories={(categories: CategoryClass.Category[]) => setCategories(categories)}
          center
          onAdd={(category: CategoryClass.Category) => {
            category.active = false;
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
        <RecipeIngredientList
          mealBuilder={mealBuilder}
          setMealBuilder={setMealBuilder}
        />
        {getSeperator()}
        <Text
          style={{
            marginBottom: SPACING.tiny,
            color: isDarkMode ? COLOURS.white : COLOURS.black,
          }}
        >
          Instructions
        </Text>
        <InstructionsList
          mealBuilder={mealBuilder}
          setMealBuilder={setMealBuilder}
        ></InstructionsList>
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
