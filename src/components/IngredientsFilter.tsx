import { StyleSheet, Text, TextInput, View } from "react-native";
import React, { useContext, useState } from "react";
import Modal from "react-native-modal/dist/modal";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { UserDataContext } from "../classes/UserData";
import {
  USER_COLOURS,
  SPACING,
  COLOURS,
  RADIUS,
  DROP_SHADOW,
} from "../util/GlobalStyles";
import ColourPicker from "./ColourPicker";
import FilterButton from "./FilterButton";
import { Category } from "../classes/Categories";

type Props = {
  options: Category[];
  setOptions: (options: Category[]) => void;
  onAdd?: (arg: Category) => void;
  plusSymbol?: boolean;
  center?: boolean;
};

const IngredientsFilter = (props: Props) => {
  const [showModal, setShowModal] = useState(false);
  const [colour, setColour] = useState(USER_COLOURS[0]);
  const [categoryName, setCategoryName] = useState("");

  return (
    <View>
      <FilterButton
        options={props.options}
        width={216}
        textHint="Search categories"
        onAdd={(text) => {
          setShowModal(true);
          setCategoryName(text);
        }}
        setOptions={props.setOptions}
        plusSymbol={props.plusSymbol}
        center={props.center || false}
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
              let newOptions = [
                ...props.options,
                { colour, name: categoryName, active: false },
              ];
              props.setOptions(newOptions);
              if (props.onAdd) props.onAdd(newOptions[newOptions.length - 1]);
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
