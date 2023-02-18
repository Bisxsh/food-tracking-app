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

import {
  IngredientBuilder,
  weightUnit,
} from "../../classes/IngredientClass";
import ChipsSelectors from "../../components/ChipsSelectors";
import NameAndImage from "../../components/NameAndImage";
import { Category } from "../../classes/Categories";
import { UserDataContext } from "../../classes/UserData";
import DateField from "../../components/DateField";
import InputFieldWithUnits from "../../components/InputFieldWithUnits";
import InputField from "../../components/InputField";
import NumberInputRow from "../Home/components/Add/NumberInputRow";
import RecipeBox from "../../components/RecipeBox";
import RecipeIngredientList from "../../components/RecipeIngredientList";
import PrimaryButton from "../../components/PrimaryButton";
import { HomeContext } from "../Home/components/HomeContextProvider";
import { useNavigation } from "@react-navigation/native";
import IngredientsList from "../../components/IngredientsList";

type Props = {
  setShowManual?: (showManual: boolean) => void;
  setIngredient?: (ingredient: IngredientBuilder | null) => void;
  ingredientBuilder?: IngredientBuilder;
};

const ManualIngredient = (props: Props) => {
  const { homeContext, setHomeContext } = useContext(HomeContext);
  const { userData, setUserData } = useContext(UserDataContext);
  const [categories, setCategories] = useState<Category[]>(
    userData.ingredientCategories
  );
  const navigation = useNavigation<any>();
  const ingredientBuilder =
    homeContext.ingredientBeingEdited || new IngredientBuilder();

  function getSeperator() {
    return <View style={{ height: SPACING.medium }} />;
  }

  function saveIngredient() {
    if (!ingredientBuilder.allRequiredFieldsSet()) {
      alert("All required fields must be set");
      return;
    }
    ingredientBuilder.setCategories(categories);
    if (
      ingredientBuilder.getId() == 0 &&
      userData.storedIngredients.length > 0
    ) {
      ingredientBuilder.setId(userData.storedIngredients.length);
    }
    console.log("ID: ", ingredientBuilder.getId());
    if (
      userData.storedIngredients.find(
        (ing) => ing.id === ingredientBuilder.getId()
      )
    ) {
      setUserData({
        ...userData,
        storedIngredients: userData.storedIngredients.map((ing) =>
          ing.id === ingredientBuilder.getId() ? ingredientBuilder.build() : ing
        ),
      });
    } else userData.storedIngredients.push(ingredientBuilder.build());
    closeManual();
  }

  function closeManual() {
    props.setIngredient && props.setIngredient(null);
    setHomeContext({ ...homeContext, ingredientBeingEdited: null });
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
        <Text>Add an ingredient</Text>
        <TouchableOpacity style={styles.button}>
          <MaterialCommunityIcons
            name="check"
            size={24}
            color="black"
            onPress={saveIngredient}
          />
        </TouchableOpacity>
      </View>

      <ScrollView >
        <NameAndImage
          onImgChange={(str) => ingredientBuilder.setImgSrc(str)}
          onNameChange={(str) => ingredientBuilder.setName(str)}
          imgStr={ingredientBuilder.getImgSrc()}
          nameStr={ingredientBuilder.getName()}
        />
        {getSeperator()}
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
        <RecipeIngredientList />
        <Text>Instructions</Text>
        {getSeperator()}
        <IngredientsList></IngredientsList>
        <PrimaryButton text="Save" onPress={saveIngredient} />
        <View style={{ height: SPACING.medium }} />
      </ScrollView>
    </View>
  );
};

export default ManualIngredient;

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
  },

  menu: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    paddingLeft: SPACING.medium,
    paddingRight: SPACING.medium,
    paddingBottom: SPACING.large,
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
