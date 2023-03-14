import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  useWindowDimensions,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import CustomSearchBar from "./CustomSearchBar";
import { COLOURS, DROP_SHADOW, RADIUS, SPACING } from "../util/GlobalStyles";
import { UserDataContext } from "../classes/UserData";
import {
  Ingredient,
  IngredientBuilder,
  weightUnit,
} from "../classes/IngredientClass";
import Checkbox from "./Checkbox";
import { getDaysUntilExpiry, getTimeLeft } from "../util/ExpiryCalc";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Modal from "react-native-modal/dist/modal";
import { UserContext } from "../backends/User";
import { MealBuilder } from "../classes/MealClass";

type RecipeIngredientListProps = {
  mealBuilder: MealBuilder;
  setMealBuilder: React.Dispatch<React.SetStateAction<MealBuilder>>;
};

function RecipeIngredientList(props: RecipeIngredientListProps) {
  const [ingredientsSearch, setIngredientsSearch] = useState("");
  const { userData, setUserData } = useContext(UserDataContext);
  const [ingredientList, setIngredientList] = useState<Ingredient[]>(
    userData.storedIngredients
  );
  const [usedIngredientsList, setUsedIngredientsList] = useState<Ingredient[]>(
    []
  );
  const [showModal, setShowModal] = useState(false);
  const [ingredientBeingEdited, setIngredientBeingEdited] =
    useState<IngredientBuilder | null>(null);
  const { height, width } = useWindowDimensions();
  const { user, setUser } = useContext(UserContext);
  const isDarkMode = user.setting.isDark();

  return (
    <>
      <Text
        style={{
          color: isDarkMode ? COLOURS.white : COLOURS.black,
          marginBottom: SPACING.small,
        }}
      >
        Ingredients
      </Text>

      <View style={styles.container}>
        <View style={{ paddingTop: 10 }}>
          <ScrollView>
            <CustomSearchBar
              textHint={"Search Ingredient"}
              text={ingredientsSearch}
              setText={setIngredientsSearch}
              width={width - SPACING.medium * 2 - SPACING.small * 2}
              height={40}
            />
            {ingredientList
              .filter((i) => i.quantity > 0)
              .filter((i) => i.expiryDate > new Date())
              .filter((i) => i.name.includes(ingredientsSearch))
              .map((ingredient) => {
                return (
                  <View>
                    <View
                      style={styles.ingredientContainer}
                      key={ingredient.name}
                    >
                      <Checkbox
                        initialVal={usedIngredientsList.includes(ingredient)}
                        onPress={(checked) => {
                          var newUsedIngList: Ingredient[] = []
                          if (checked) {
                            newUsedIngList = [
                              ...usedIngredientsList,
                              ingredient,
                            ]
                          } else {
                            newUsedIngList = usedIngredientsList.filter(
                                (i) => i.name != ingredient.name
                              )
                          }
                          setUsedIngredientsList(newUsedIngList)
                          props.setMealBuilder((p) =>
                            p.setIngredients(
                              newUsedIngList.map((i) =>
                                i.toIngredientBack()
                              )
                            )
                          );
                        }}
                      />
                      {ingredient.imgSrc && (
                        <Image
                          source={{
                            uri: ingredient.imgSrc,
                          }}
                          style={{
                            width: 50,
                            height: 50,
                            marginRight: SPACING.small,
                            borderRadius: RADIUS.tiny,
                          }}
                        />
                      )}
                      <View style={{ flexDirection: "column" }}>
                        <Text>{ingredient.name}</Text>
                        {getDaysUntilExpiry(ingredient) < 1 &&
                        getDaysUntilExpiry(ingredient) > 0 ? (
                          <View
                            style={{
                              flexDirection: "row",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            <MaterialCommunityIcons
                              name="alert-outline"
                              size={16}
                              color={"#A04444"}
                            />
                            <Text style={{ color: "#A04444" }}>
                              Expires in {getTimeLeft(ingredient)}
                            </Text>
                          </View>
                        ) : (
                          <></>
                        )}
                      </View>

                      <View style={{ flex: 1 }} />
                      <TouchableOpacity
                        style={styles.amountContainer}
                        onPress={() => {
                          setShowModal(true);
                          setIngredientBeingEdited(
                            IngredientBuilder.fromIngredient(ingredient)
                          );
                        }}
                      >
                        <Text>
                          {ingredient.servingSize}{" "}
                          {ingredient.servingSizeType == weightUnit.grams
                            ? "g"
                            : "kg"}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              })}
          </ScrollView>
        </View>
      </View>
      <Modal
        isVisible={showModal}
        onBackdropPress={() => setShowModal(false)}
        backdropOpacity={0.5}
        animationIn="zoomIn"
        animationOut="zoomOut"
        style={StyleSheet.absoluteFill}
      >
        <View style={styles.modalContainer}>
          <TextInput
            placeholderTextColor="grey"
            placeholder={"Quantity"}
            keyboardType={"numeric"}
            style={styles.textInput}
            onChangeText={(text) => {
              ingredientBeingEdited?.setServingSize(parseInt(text) || 0);
            }}
          />
          <MaterialCommunityIcons
            name="arrow-right-thin"
            style={styles.confirmButton}
            size={SPACING.medium}
            onPress={() => {
              setShowModal(false);
              setIngredientList(
                ingredientList.map((i) =>
                  i.name == ingredientBeingEdited?.getName()
                    ? ingredientBeingEdited.build()
                    : i
                )
              );
              setIngredientBeingEdited(null);
            }}
          />
        </View>
      </Modal>
    </>
  );
}
export default RecipeIngredientList;

const styles = StyleSheet.create({
  container: {
    height: 250,
    flexDirection: "column",
    backgroundColor: COLOURS.white,
    borderWidth: 2,
    borderColor: COLOURS.grey,
    borderRadius: 10,
    alignItems: "flex-start",
    justifyContent: "space-around",
  },

  foodImage: {
    borderRadius: RADIUS.small,
    width: 124,
    height: 124,
    marginRight: "auto",
    marginBottom: "auto",
  },

  textHeading: {
    left: "35%",
    bottom: "35%",
    fontSize: 16,
  },

  textSmall: {
    left: "40%",
    bottom: "40%",
    fontSize: 14,
    // position: 'absolute',
  },

  ingredientContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: SPACING.tiny,
    paddingHorizontal: SPACING.small,
  },

  amountContainer: {
    marginRight: SPACING.small,
    borderRadius: RADIUS.tiny,
    borderColor: COLOURS.black,
    borderWidth: 1,
    padding: SPACING.small,
    minWidth: 50,
    alignItems: "center",
    justifyContent: "center",
  },

  modalContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: COLOURS.white,
    padding: SPACING.medium,
    borderRadius: RADIUS.standard,
    ...DROP_SHADOW,
  },

  textInput: {
    minWidth: 200,
    marginLeft: SPACING.small,
  },

  confirmButton: {
    borderRadius: RADIUS.circle,
    backgroundColor: COLOURS.grey,
    padding: SPACING.small,
  },
});
