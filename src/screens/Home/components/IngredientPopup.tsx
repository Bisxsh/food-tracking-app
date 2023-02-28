import { StyleSheet, Text, View } from "react-native";
import React, { useContext } from "react";
import Modal from "react-native-modal/dist/modal";
import {
  Ingredient,
  IngredientBuilder,
} from "../../../classes/IngredientClass";
import IngredientTile from "./Main/IngredientCard";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
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

  function Nutrition(nutrition: Nutrition) {
    return (
      <View style={styles.nutritionContainer}>
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
        {Nutrition(props.ingredient.nutrition)}
        <View style={{ flexDirection: "row", marginTop: SPACING.medium }}>
          <SecondaryButton
            text="Edit"
            onPress={() => {
              setHomeContext({
                ...homeContext,
                ingredientBeingEdited: IngredientBuilder.fromIngredient(
                  props.ingredient
                ),
              });
              navigation.navigate("ManualIngredient");
            }}
          />
          <View style={{ width: SPACING.medium }} />
          <PrimaryButton
            text="Mark as used"
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
        </View>
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
    flexDirection: "row",
    marginTop: SPACING.medium,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FAFAFA",
    borderRadius: RADIUS.standard,
  },

  nutritionColumn: {
    margin: SPACING.medium,
    alignItems: "flex-start",
    justifyContent: "center",
  },

  nutrition: {
    fontSize: FONT_SIZES.small,
    marginTop: SPACING.small,
  },
});
