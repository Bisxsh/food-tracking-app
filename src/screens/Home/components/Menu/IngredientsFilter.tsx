import { StyleSheet, Text, TextInput, View } from "react-native";
import React, { useState } from "react";
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
import { FiltersContext } from "../../Home";

type Props = {};

const IngredientsFilter = (props: Props) => {
  const [filters, setFilters] = React.useContext(FiltersContext);
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
              setFilters((prev) => [
                ...prev,
                { name: categoryName, colour: colour, active: false },
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
