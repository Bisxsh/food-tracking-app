import {
  Alert,
  AlertButton,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { COLOURS, ICON_SIZES, SPACING } from "../../../../util/GlobalStyles";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { getRecipes, getSaved, getCustom } from "../../../../util/GetRecipe";
import { Dimensions } from "react-native";

import {
  Ingredient,
  IngredientBuilder,
  weightUnit,
} from "../../../../classes/IngredientClass";
import ChipsSelectors from "../../../../components/ChipsSelectors";
import NameAndImage from "../../../../components/NameAndImage";
import { Category } from "../../../../classes/Categories";
import { UserDataContext } from "../../../../classes/UserData";
import DateField from "../../../../components/DateField";
import InputFieldWithUnits from "../../../../components/InputFieldWithUnits";
import InputField from "../../../../components/InputField";
import NumberInputRow from "./NumberInputRow";
import PrimaryButton from "../../../../components/PrimaryButton";
import { HomeContext } from "../HomeContextProvider";
import { useNavigation } from "@react-navigation/native";
import { User, UserContext } from "../../../../backends/User";
import { SafeAreaView } from "react-native-safe-area-context";
import * as DB from "../../../../backends/Database"

type alertProp = {
  title: string
  desc: string
  buttons: AlertButton[],
  user: User
}

function createAlert(prop: alertProp){
  Alert.alert(
      prop.title,
      prop.desc,
      prop.buttons,
      {userInterfaceStyle:(prop.user.setting.isDark())?"dark":"light"}
  )
}



type Props = {};

const ManualIngredient = (props: Props) => {
  const { homeContext, setHomeContext } = useContext(HomeContext);
  const { userData, setUserData } = useContext(UserDataContext);
  const [showNutrition, setShowNutrition] = useState(false);
  const { user, setUser } = useContext(UserContext);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(user.setting.isDark());
  

  const navigation = useNavigation<any>();
  const ingredientBuilder =
    homeContext.ingredientBeingEdited || new IngredientBuilder();
  const [categories, setCategories] = useState<Category[]>(
    userData.ingredientCategories.map((cat) => {
      return {
        ...cat,
        active:
          ingredientBuilder
            .getCategories()
            .filter(
              (ingCat) =>
                ingCat.name === cat.name && ingCat.colour === cat.colour
            ).length > 0,
      };
    })
  );

  function getSeperator() {
    return <View style={{ height: SPACING.medium }} />;
  }

  async function saveIngredient() {
    if (!ingredientBuilder.allRequiredFieldsSet()) {
      alert("All required fields must be set");
      return;
    }
    ingredientBuilder.setCategories(categories.filter((cat) => cat.active));

    if (
      userData.storedIngredients.find(
        (ing) => ing.id === ingredientBuilder.getId()
      )
    ) {
      const newStoredIngredients: Ingredient[] = []
      for (const ing of userData.storedIngredients) {
        if (ing.getId == ingredientBuilder.getId()){
          newStoredIngredients.push(ingredientBuilder.build())
        }else{
          newStoredIngredients.push(ing)
        }
      }
      setUserData({
        ...userData,
        storedIngredients: newStoredIngredients, 
      });
    } else userData.storedIngredients.push(ingredientBuilder.build());
    setUserData({ ...userData, refreshExplore: true });
    closeManual();
  }

  function closeManual() {
    setHomeContext({ ...homeContext, ingredientBeingEdited: null });
    navigation.popToTop()
  }

  navigation.setOptions({
    title: "Add an ingredient",
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
      <View style={{flexDirection: "row"}}>
        <TouchableOpacity 
          onPress={()=>{
            createAlert({
              title:"Delete this ingredient", 
              desc:"Do you want to delete this ingredient?\n\nThis action cannot be undone.", 
              buttons:[
                {
                  text: "Cancel",
                  style: "cancel"
                },
                {
                  text: "Delete",
                  style: "destructive",
                  onPress: async ()=>{
                    if (
                      userData.storedIngredients.find(
                        (ing) => ing.id === ingredientBuilder.getId()
                      )
                    ) {
                      setUserData({
                        ...userData,
                        storedIngredients: userData.storedIngredients.filter((ing) =>
                          ing.id == ingredientBuilder.getId()
                        ), 
                      });
                      DB.deleteIngredient(ingredientBuilder.getId())
                    }
                    setUserData({ ...userData, refreshExplore: true });
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
        <TouchableOpacity
            onPress={saveIngredient}
        >
            <MaterialCommunityIcons
                name="check"
                size={ICON_SIZES.medium}
                color={isDarkMode ? COLOURS.white : COLOURS.black}
            />
        </TouchableOpacity>
      </View>
    )
  })

  return (
    <SafeAreaView
      style={[
        styles.container,
        {
          backgroundColor: isDarkMode ? COLOURS.darker : COLOURS.white,
        },
      ]}
      edges={['left', 'right']}
    >
      <KeyboardAwareScrollView>
        <NameAndImage
          onImgChange={(str) => ingredientBuilder.setImgSrc(str)}
          onNameChange={(str) => ingredientBuilder.setName(str)}
          imgStr={ingredientBuilder.getImgSrc()}
          nameStr={ingredientBuilder.getName()}
        />
        {getSeperator()}
        <DateField
          fieldName="Expiry Date"
          required
          width={useWindowDimensions().width - 2 * SPACING.medium}
          setValue={(date: Date) => ingredientBuilder.setExpiryDate(date)}
          defaultValue={ingredientBuilder.getExpiryDate()}
        />
        {getSeperator()}
        {/* <DateField
          fieldName="Use-by Date"
          width={useWindowDimensions().width - 2 * SPACING.medium}
          setValue={(date: Date) => ingredientBuilder.setUseDate(date)}
          defaultValue={ingredientBuilder.getUseDate()}
        /> */}
        {/* {getSeperator()} */}
        <ChipsSelectors
          fieldName="Categories"
          categories={categories}
          setCategories={(categories: Category[]) => setCategories(categories)}
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
        <View style={styles.inputRow}>
          <InputFieldWithUnits
            fieldName="Total weight"
            onTextChange={(weight) => {
              ingredientBuilder.setWeight(weight);
            }}
            units={Object.values(weightUnit)}
            onUnitChange={(unit) => ingredientBuilder.setWeightType(unit)}
            required
            textWidth={104}
            maxWidth={180}
            defaultText={ingredientBuilder.getWeight()?.toString() || undefined}
            defaultUnit={ingredientBuilder.getWeightType()}
          />
          <View style={{ width: SPACING.medium }} />
          <InputField
            fieldName="Quantity"
            onTextChange={(quantity) => ingredientBuilder.setQuantity(quantity)}
            numberInput
            textHint="Quantity"
            defaultValue={
              ingredientBuilder.getQuantity() == 0
                ? undefined
                : ingredientBuilder.getQuantity().toString()
            }
          />
        </View>
        {getSeperator()}
        <TouchableOpacity
          style={{ flexDirection: "row", alignItems: "center" }}
          onPress={() => setShowNutrition((p) => !p)}
        >
          <MaterialCommunityIcons
            name={showNutrition ? "chevron-down" : "chevron-right"}
            size={24}
            color={isDarkMode ? "white" : "black"}
          />
          <Text style={{ color: isDarkMode ? COLOURS.white : COLOURS.darker }}>
            Nutritional information
          </Text>
        </TouchableOpacity>
        {getSeperator()}
        {showNutrition && (
          <View>
            <InputFieldWithUnits
              fieldName="Serving size"
              onTextChange={(weight) => {
                ingredientBuilder.setServingSize(weight);
              }}
              units={Object.values(weightUnit)}
              onUnitChange={(unit) =>
                ingredientBuilder.setServingSizeType(unit)
              }
              textWidth={104}
              maxWidth={180}
              defaultText={
                ingredientBuilder.getServingSize()?.toString() || undefined
              }
              defaultUnit={ingredientBuilder.getServingSizeType()}
            />
            {getSeperator()}
            <NumberInputRow
              fieldNameLeft="Energy"
              fieldNameRight="Protein"
              onTextChangeLeft={(val) =>
                ingredientBuilder.getNutritionBuilder().setEnergy(val)
              }
              onTextChangeRight={(val) =>
                ingredientBuilder.getNutritionBuilder().setProtein(val)
              }
              textHintLeft="kcal"
              textHintRight="g"
              defaultValueLeft={
                ingredientBuilder.getNutritionBuilder().getEnergy() == 0
                  ? undefined
                  : ingredientBuilder
                      .getNutritionBuilder()
                      .getEnergy()
                      ?.toString() || undefined
              }
              defaultValueRight={
                ingredientBuilder.getNutritionBuilder().getProtein() == 0
                  ? undefined
                  : ingredientBuilder
                      .getNutritionBuilder()
                      .getProtein()
                      ?.toString() || undefined
              }
            />
            {getSeperator()}
            <NumberInputRow
              fieldNameLeft="Fat"
              fieldNameRight="Saturated Fat"
              onTextChangeLeft={(val) =>
                ingredientBuilder.getNutritionBuilder().setEnergy(val)
              }
              onTextChangeRight={(val) =>
                ingredientBuilder.getNutritionBuilder().setSaturatedFat(val)
              }
              textHintLeft="g"
              textHintRight="g"
              defaultValueLeft={
                ingredientBuilder.getNutritionBuilder().getFat() == 0
                  ? undefined
                  : ingredientBuilder
                      .getNutritionBuilder()
                      .getFat()
                      ?.toString() || undefined
              }
              defaultValueRight={
                ingredientBuilder.getNutritionBuilder().getSaturatedFat() == 0
                  ? undefined
                  : ingredientBuilder
                      .getNutritionBuilder()
                      .getSaturatedFat()
                      ?.toString() || undefined
              }
            />
            {getSeperator()}
            <NumberInputRow
              fieldNameLeft="Carbohydrates"
              fieldNameRight="Sugar"
              onTextChangeLeft={(val) =>
                ingredientBuilder.getNutritionBuilder().setCarbs(val)
              }
              onTextChangeRight={(val) =>
                ingredientBuilder.getNutritionBuilder().setSugar(val)
              }
              textHintLeft="g"
              textHintRight="g"
              defaultValueLeft={
                ingredientBuilder.getNutritionBuilder().getCarbs() == 0
                  ? undefined
                  : ingredientBuilder
                      .getNutritionBuilder()
                      .getCarbs()
                      ?.toString() || undefined
              }
              defaultValueRight={
                ingredientBuilder.getNutritionBuilder().getSugar() == 0
                  ? undefined
                  : ingredientBuilder
                      .getNutritionBuilder()
                      .getSugar()
                      ?.toString() || undefined
              }
            />
            {getSeperator()}
            <NumberInputRow
              fieldNameLeft="Fiber"
              fieldNameRight="Salt"
              onTextChangeLeft={(val) =>
                ingredientBuilder.getNutritionBuilder().setFibre(val)
              }
              onTextChangeRight={(val) =>
                ingredientBuilder.getNutritionBuilder().setSalt(val)
              }
              textHintLeft="g"
              textHintRight="g"
              defaultValueLeft={
                ingredientBuilder.getNutritionBuilder().getFibre() == 0
                  ? undefined
                  : ingredientBuilder
                      .getNutritionBuilder()
                      .getFibre()
                      ?.toString() || undefined
              }
              defaultValueRight={
                ingredientBuilder.getNutritionBuilder().getSalt() == 0
                  ? undefined
                  : ingredientBuilder
                      .getNutritionBuilder()
                      .getSalt()
                      ?.toString() || undefined
              }
            />
            {getSeperator()}
          </View>
        )}
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default ManualIngredient;

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    paddingLeft: SPACING.medium,
    paddingRight: SPACING.medium,
    bottom: 0,
    backgroundColor: COLOURS.white,
    height: "100%",
    width: "100%",
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
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
});
