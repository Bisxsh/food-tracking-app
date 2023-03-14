import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  Button,
  TextInput,
} from "react-native";
import React, { useState, useRef, useEffect } from "react";
import { COLOURS, FONT_SIZES, RADIUS, SPACING } from "../util/GlobalStyles";
import { MealBuilder } from "../classes/MealClass";
import Instruction from "./Instruction";

type Props = {
  mealBuilder: MealBuilder;
  setMealBuilder: React.Dispatch<React.SetStateAction<MealBuilder>>;
};

const InstructionsList = (props: Props) => {
  const [text, onChangeText] = useState("");
  const [instructionList, setInstructionList] = useState<string[]>(props.mealBuilder.getInstruction());

  function addInstruction(instruction: string) {
    let num = instructionList.length + 1;
    // console.log(instruction)
    const newInstructionList: string[] = [...instructionList, num + ". " + instruction]
    setInstructionList(newInstructionList);
    props.setMealBuilder((p) => p.setInstruction(newInstructionList));
    onChangeText("");
  }

  return (
    <>
      <View style={styles.searchContainer}>
        <View style={styles.searchBox}>
          <TextInput
            onChangeText={(text) => onChangeText(text)}
            value={text}
            placeholder="Add instruction"
            placeholderTextColor={COLOURS.darkGrey}
          />
        </View>
        <View style={styles.addButton}>
          <TouchableOpacity onPress={() => addInstruction(text)}>
            <Text
              style={{
                color: COLOURS.white,
                textAlign: "center",
                justifyContent: "center",
              }}
            >
              Add
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.container}>
        {instructionList.map((item: string) => {
          return (
            <Instruction
              instructionList={instructionList}
              setInstructionList={setInstructionList}
              text={item}
            />
          );
        })}
      </View>
    </>
  );
};

export default InstructionsList;

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLOURS.white,
    padding: SPACING.small,
    borderColor: COLOURS.grey,
    borderRadius: 10,
    borderWidth: 2,
    width: "100%",
  },

  searchContainer: {
    flexDirection: "row",
    padding: SPACING.small,
  },

  searchBox: {
    backgroundColor: COLOURS.grey,
    borderBottomLeftRadius: RADIUS.standard,
    borderTopLeftRadius: RADIUS.standard,
    padding: SPACING.small,
    width: "85%",
  },

  addButton: {
    backgroundColor: COLOURS.primary,
    borderBottomRightRadius: RADIUS.standard,
    borderTopRightRadius: RADIUS.standard,
    flex: 1,
    color: COLOURS.white,
    alignSelf: "flex-end",
    height: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
});
