import { StyleSheet, Text, TextInput, View } from "react-native";
import React, { useContext, useState } from "react";
import Modal from "react-native-modal/dist/modal";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import ColourPicker from "../../../../components/ColourPicker";
import FilterButton from "../../../../components/FilterButton";
import {
  USER_COLOURS,
  SPACING,
  COLOURS,
  RADIUS,
  DROP_SHADOW,
} from "../../../../util/GlobalStyles";
import { UserDataContext } from "../../../../classes/UserData";

type Props = {};

const IngredientsFilter = (props: Props) => {
  const [showModal, setShowModal] = useState(false);
  const [colour, setColour] = useState(USER_COLOURS[0]);
  const [categoryName, setCategoryName] = useState("");
  const { userData, setUserData } = useContext(UserDataContext);

  return (
    <View>
      <FilterButton
        options={userData.ingredientCategories}
        width={216}
        textHint="Search categories"
        onAdd={(text) => {
          setShowModal(true);
          setCategoryName(text);
        }}
      />

      <Modal
        isVisible={showModal}
        onBackdropPress={() => setShowModal(false)}
        backdropOpacity={0.5}
        animationIn="zoomIn"
        animationOut="zoomOut"
        style={StyleSheet.absoluteFill}
      >
        <View style={styles.modalContainer}>
          <ColourPicker colour={colour} setColour={setColour} />
          <TextInput
            placeholder={"Category name"}
            style={styles.textInput}
            value={categoryName}
            onChangeText={(text) => setCategoryName(text)}
          />
          <MaterialCommunityIcons
            name="arrow-right-thin"
            style={styles.confirmButton}
            size={SPACING.medium}
            onPress={() => {
              setShowModal(false);
              setUserData((prev) => ({
                ...prev,
                ingredientCategories: [
                  ...prev.ingredientCategories,
                  { name: categoryName, colour: colour },
                ],
              }));
            }}
          />
        </View>
      </Modal>
    </View>
  );
};

export default IngredientsFilter;

const styles = StyleSheet.create({
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
