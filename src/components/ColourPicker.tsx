import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useEffect, useState } from "react";
import { RADIUS, SPACING, USER_COLOURS } from "../util/GlobalStyles";
import Modal from "react-native-modal/dist/modal";

type Props = {
  colour: string;
  setColour: (colour: string) => void;
};

const ColourPicker = (props: Props) => {
  const [showModal, setShowModal] = useState(false);
  const gridColours = USER_COLOURS.map((colour) => (
    <TouchableOpacity
      key={colour}
      style={[styles.colour, { backgroundColor: colour }]}
      onPress={() => {
        props.setColour(colour);
        setShowModal(false);
      }}
    />
  ));

  function getGrid() {
    let rowOne = <View style={styles.gridRow}>{gridColours.slice(0, 4)}</View>;
    let rowTwo = <View style={styles.gridRow}>{gridColours.slice(4, 8)}</View>;
    let rowThree = (
      <View style={styles.gridRow}>{gridColours.slice(8, 12)}</View>
    );
    return (
      <View style={styles.grid}>
        {rowOne}
        {rowTwo}
        {rowThree}
      </View>
    );
  }

  return (
    <View>
      <TouchableOpacity
        style={[styles.colour, { backgroundColor: props.colour }]}
        onPress={() => setShowModal(true)}
      />
      <Modal
        isVisible={showModal}
        onBackdropPress={() => setShowModal(false)}
        backdropOpacity={0}
        animationIn="zoomInLeft"
        animationOut="zoomOutLeft"
        style={StyleSheet.absoluteFill}
      >
        <View style={styles.modalContainer}>{getGrid()}</View>
      </Modal>
    </View>
  );
};

export default ColourPicker;

const styles = StyleSheet.create({
  colour: {
    borderRadius: RADIUS.circle,
    width: 20,
    height: 20,
  },

  modalContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "white",
    borderRadius: RADIUS.standard,
    padding: 10,
    width: 200,
    height: 200,
  },

  grid: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    height: "100%",
  },

  gridRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "90%",
    height: "33%",
  },
});
