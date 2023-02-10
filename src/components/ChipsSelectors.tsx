import { StyleSheet, Text, View } from "react-native";
import React from "react";
import Chips from "./Chips";

type Props = {
  fieldName: string;
  required?: boolean;
  optionsList: string[];
  selectedList: string[];
  setSelectedList: (list: string[]) => void;
};

const ChipsSelectors = (props: Props) => {
  return (
    <View style={styles.container}>
      <Chips text="Dairy" />
    </View>
  );
};

export default ChipsSelectors;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
});
