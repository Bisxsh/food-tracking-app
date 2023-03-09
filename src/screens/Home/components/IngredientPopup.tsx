import { ScrollView, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from "react-native";
import React, { useContext } from "react";
import Modal from "react-native-modal/dist/modal";
import {
  Ingredient,
  IngredientBuilder,
  weightUnit,
} from "../../../classes/IngredientClass";
import IngredientTile from "./Main/IngredientCard";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  COLOURS,
  DROP_SHADOW,
  FONT_SIZES,
  RADIUS,
  SPACING,
} from "../../../util/GlobalStyles";
import { Nutrition } from "../../../classes/NutritionClass";
import PrimaryButton from "../../../components/PrimaryButton";
import SecondaryButton from "../../../components/SecondaryButton";
import { useNavigation } from "@react-navigation/native";
import { UserDataContext } from "../../../classes/UserData";
import { HomeContext } from "./HomeContextProvider";
import { UserContext } from "../../../backends/User";
import * as DB from "../../../backends/Database";
import { History } from "../../../backends/Histories";

type Props = {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  ingredient: Ingredient;
};

const IngredientPopup = (props: Props) => {
  const { userData, setUserData } = useContext(UserDataContext);
  const { homeContext, setHomeContext } = useContext(HomeContext);
  const { user, setUser } = useContext(UserContext);
  const isDarkMode = user.setting.isDark();
  const navigation = useNavigation<any>();
  const { height, width } = useWindowDimensions()

  function Header() {
    return (
      <View style={styles.header}>
        <IngredientTile ingredient={props.ingredient} />
        <View style={{ flexDirection: "column", flexShrink: 1, justifyContent: "center" }}>
          <Text
            style={{
              fontSize: FONT_SIZES.body,
              fontWeight: "500",
              color: isDarkMode ? COLOURS.white : COLOURS.black,
            }}
            ellipsizeMode={"tail"}
            numberOfLines={2}
          >
            {props.ingredient.name}
          </Text>
          <View style={styles.detailRow}>
            <MaterialCommunityIcons
              name="scale-balance"
              size={24}
              color={isDarkMode ? COLOURS.white : COLOURS.black}
            />
            <Text
              style={{
                marginLeft: SPACING.tiny,
                fontSize: FONT_SIZES.small,
                color: isDarkMode ? COLOURS.white : COLOURS.black,
              }}
            >
              {props.ingredient.weight} {props.ingredient.weightType}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <MaterialCommunityIcons
              name="calendar-outline"
              size={24}
              color={isDarkMode ? COLOURS.white : COLOURS.black}
            />
            <Text
              style={{
                marginLeft: SPACING.tiny,
                fontSize: FONT_SIZES.small,
                color: isDarkMode ? COLOURS.white : COLOURS.black,
              }}
            >{`Use by: ${props.ingredient.expiryDate.toLocaleDateString()}`}</Text>
          </View>
        </View>
      </View>
    );
  }

  function Nutrition(ingredient: Ingredient) {
    const nutrition = ingredient.getNutrition;
    return (
      <View style={styles.nutritionContainer}>
        <Text
          style={{
            alignSelf: "center",
            marginLeft: SPACING.medium,
            marginTop: SPACING.medium,
            fontSize: FONT_SIZES.small,
          }}
        >
          Per {ingredient.servingSize} {ingredient.servingSizeType}
        </Text>
        <View style={{ flexDirection: "row" }}>
          <View style={{ flex: 1 }} />
          <View style={styles.nutritionColumn}>
            <Text style={styles.nutrition}>Energy: </Text>
            <Text style={styles.nutrition}>Fat: </Text>
            <Text style={styles.nutrition}>Carbs: </Text>
            <Text style={styles.nutrition}>Fiber: </Text>
          </View>
          <View style={styles.nutritionColumn}>
            <Text style={styles.nutrition}>{nutrition.getEnergy}g</Text>
            <Text style={styles.nutrition}>{nutrition.getFat}g</Text>
            <Text style={styles.nutrition}>{nutrition.getCarbs}g</Text>
            <Text style={styles.nutrition}>{nutrition.getFibre}g</Text>
          </View>
          <View style={{ flex: 1 }} />
          <View style={styles.nutritionColumn}>
            <Text style={styles.nutrition}>Protein: </Text>
            <Text style={styles.nutrition}>Salt: </Text>
            <Text style={styles.nutrition}>Sugar: </Text>
            <Text style={styles.nutrition}>Sat. Fat:</Text>
          </View>
          <View style={styles.nutritionColumn}>
            <Text style={styles.nutrition}>{nutrition.getProtein}g</Text>
            <Text style={styles.nutrition}>{nutrition.getSalt}g</Text>
            <Text style={styles.nutrition}>{nutrition.getSugar}g</Text>
            <Text style={styles.nutrition}>{nutrition.getSaturatedFat}g</Text>
          </View>
          <View style={{ flex: 1 }} />
        </View>
      </View>
    );
  }

  return (
    <Modal
      isVisible={props.showModal}
      onBackdropPress={() => props.setShowModal(false)}
      backdropOpacity={0}
      animationIn="zoomIn"
      style={{
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <View
        style={[
          styles.container,
          {
            backgroundColor: isDarkMode ? COLOURS.darker : COLOURS.white,
            borderColor: isDarkMode ? COLOURS.darkGrey : COLOURS.white,
            borderWidth: 0.5,
            maxWidth: width - SPACING.small*2,
            maxHeight: height - SPACING.medium*2,
            flexShrink: 1
          },
        ]}
      >
        <ScrollView style={{flexGrow: 0}}>
          <Header />
          {props.ingredient.categories.length > 0 && <View style={styles.categories}>
            {props.ingredient.categories.map((category) => {
              return (
                <View
                  style={[
                    styles.category,
                    {
                      backgroundColor: category.colour,
                    },
                  ]}
                  key={category.name}
                >
                  <Text>{category.name}</Text>
                </View>
              );
            })}
          </View>}
          {Nutrition(props.ingredient)}
          <View style={{ flexDirection: "row", marginTop: SPACING.medium }}>
            <SecondaryButton
              colour={COLOURS.red}
              text="Wasted all"
              onPress={() => {
                setUserData({
                  ...userData,
                  storedIngredients: userData.storedIngredients.map((p) => {
                    if (p.id === props.ingredient.id) {
                      return IngredientBuilder.fromIngredient(props.ingredient)
                        .setQuantity(0, true)
                        .build();
                    }
                    return p;
                  }),
                });
                props.setShowModal(false);
                //TODO add to wasted tally
                {
                  /*
                _id: number
      userId: number
      date: Date
      mass: number
      cost: number
              */
                }
                const weight =
                  props.ingredient.weight *
                  (props.ingredient.weightType === weightUnit.grams ? 1 : 1000);
                DB.create(new History(0, new Date(), weight, 0));
              }}
            />
            <View style={{ width: SPACING.medium }} />
            <PrimaryButton
              colour={COLOURS.red}
              text="Wasted one"
              onPress={() => {
                setUserData({
                  ...userData,
                  storedIngredients: userData.storedIngredients.map((p) => {
                    if (p.id === props.ingredient.id) {
                      return IngredientBuilder.fromIngredient(props.ingredient)
                        .setQuantity(p.quantity - 1, false)
                        .build();
                    }
                    return p;
                  }),
                });
                
                const weight =
                  props.ingredient.weight *
                  (props.ingredient.weightType === weightUnit.grams ? 1 : 1000);
                DB.create(
                  new History(
                    0,
                    new Date(),
                    props.ingredient.quantity * weight,
                    0
                  )
                );
              }}
            />
          </View>
          <View style={{ flexDirection: "row", marginTop: SPACING.medium }}>
            <SecondaryButton
              text="Used all"
              onPress={() => {
                setUserData({
                  ...userData,
                  storedIngredients: userData.storedIngredients.map((p) => {
                    if (p.id === props.ingredient.id) {
                      return IngredientBuilder.fromIngredient(props.ingredient)
                        .setQuantity(0, true)
                        .build();
                    }
                    return p;
                  }),
                });
                props.setShowModal(false);
              }}
            />
            <View style={{ width: SPACING.medium }} />
            <PrimaryButton
              text="Used one"
              onPress={() => {
                setUserData({
                  ...userData,
                  storedIngredients: userData.storedIngredients.map((p) => {
                    if (p.id === props.ingredient.id) {
                      return IngredientBuilder.fromIngredient(props.ingredient)
                        .setQuantity(p.quantity - 1, true)
                        .build();
                    }
                    return p;
                  }),
                });
              }}
            />
          </View>
        </ScrollView>
        <TouchableOpacity
          style={styles.edit}
          onPress={() => {
            setHomeContext({
              ...homeContext,
              ingredientBeingEdited: IngredientBuilder.fromIngredient(
                props.ingredient
              ),
            });
            navigation.navigate("ManualIngredient");
            props.setShowModal(false);
          }}
        >
          <MaterialCommunityIcons name="pencil" size={24} color="black" />
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

export default IngredientPopup;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    padding: SPACING.medium,
    borderRadius: RADIUS.standard,
    ...DROP_SHADOW,
  },

  header: { flexDirection: "row", alignItems: "center" },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: SPACING.small,
  },

  categories: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: SPACING.medium,
  },

  category: {
    padding: SPACING.small,
    paddingLeft: SPACING.medium + 4,
    paddingRight: SPACING.medium + 4,
    borderRadius: RADIUS.circle,
    marginRight: SPACING.small,
  },

  nutritionContainer: {
    marginTop: SPACING.medium,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FAFAFA",
    borderRadius: RADIUS.standard,
  },

  nutritionColumn: {
    margin: SPACING.medium,
    marginTop: SPACING.small,
    alignItems: "flex-start",
    justifyContent: "center",
  },

  nutrition: {
    fontSize: FONT_SIZES.small,
    marginTop: SPACING.small,
  },

  edit: {
    position: "absolute",
    top: 0,
    right: 0,
    margin: SPACING.medium,
    padding: SPACING.small,
    backgroundColor: COLOURS.grey,
    borderRadius: RADIUS.circle,
  },
});
