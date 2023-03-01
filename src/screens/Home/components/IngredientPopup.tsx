import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useContext } from "react";
import Modal from "react-native-modal/dist/modal";
import {
  Ingredient,
  IngredientBuilder,
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

type Props = {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  ingredient: Ingredient;
};

const IngredientPopup = (props: Props) => {
  const { userData, setUserData } = useContext(UserDataContext);
  const { homeContext, setHomeContext } = useContext(HomeContext);
  const navigation = useNavigation<any>();

  function Header() {
    return (
      <View style={styles.header}>
        <IngredientTile ingredient={props.ingredient} />
        <View style={{ flexDirection: "column", justifyContent: "center" }}>
          <Text style={{ fontSize: FONT_SIZES.body, fontWeight: "500" }}>
            {props.ingredient.name}
          </Text>
          <View style={styles.detailRow}>
            <MaterialCommunityIcons
              name="scale-balance"
              size={24}
              color="black"
            />
            <Text
              style={{
                marginLeft: SPACING.small,
                fontSize: FONT_SIZES.small,
              }}
            >
              {props.ingredient.weight} {props.ingredient.weightType}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <MaterialCommunityIcons
              name="calendar-outline"
              size={24}
              color="black"
            />
            <Text
              style={{
                marginLeft: SPACING.small,
                fontSize: FONT_SIZES.small,
              }}
            >{`Use by: ${props.ingredient.expiryDate.toDateString()}`}</Text>
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
      <View style={styles.container}>
        <Header />
        <View style={styles.categories}>
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
        </View>
        {Nutrition(props.ingredient)}
        <View style={{ flexDirection: "row", marginTop: SPACING.medium }}>
          <SecondaryButton
            text="Mark all as used"
            onPress={() => {
              setUserData({
                ...userData,
                storedIngredients: userData.storedIngredients.map((p) => {
                  if (p.id === props.ingredient.id) {
                    return IngredientBuilder.fromIngredient(props.ingredient)
                      .setQuantity(0)
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
            text="Mark one as used"
            onPress={() => {
              setUserData({
                ...userData,
                storedIngredients: userData.storedIngredients.map((p) => {
                  if (p.id === props.ingredient.id) {
                    return IngredientBuilder.fromIngredient(props.ingredient)
                      .setQuantity(p.quantity - 1)
                      .build();
                  }
                  return p;
                }),
              });
            }}
          />
        </View>

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
