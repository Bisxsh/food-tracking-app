import { StyleSheet, Text, TextInput, View } from "react-native";
import React, { useState } from "react";
import Modal from "react-native-modal/dist/modal";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import FilterButton from "../../../components/FilterButton";
import {
  SPACING,
  COLOURS,
  RADIUS,
  DROP_SHADOW,
  USER_COLOURS,
} from "../../../util/GlobalStyles";
import ColourPicker from "../../../components/ColourPicker";

type Props = {};

const IngredientsFilter = (props: Props) => {
  //TODO retreive filters from database here
  const [filters, setFilters] = useState<FilterCategory[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [colour, setColour] = useState(USER_COLOURS[0]);
  const [categoryName, setCategoryName] = useState("");

  return (
    <View>
      <FilterButton
        options={filters}
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
        backdropOpacity={0.1}
        animationIn="fadeInDown"
        animationOut="fadeOutUp"
        style={{
          position: "absolute",
          //TODO change to work with device for presentation
          top: 50,
          right: 30,
        }}
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
              setFilters((prev) => [
                ...prev,
                { name: categoryName, colour: colour },
              ]);
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
