import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  Button,
  TextInput,
} from "react-native";
import React, { useState, useRef, MutableRefObject } from "react";
import { COLOURS, FONT_SIZES, RADIUS, SPACING } from "../util/GlobalStyles";
import { MealBuilder } from "../classes/MealClass";
import { MaterialCommunityIcons } from "@expo/vector-icons";

type Props = {
  instructionList: any;
  setInstructionList: React.Dispatch<any>;
  text: string;
};

const Instruction = (props: Props) => {
  function deleteInstruction() {
    let temp: string[] = [];
    props.instructionList.map((item: any) => {
      if (item !== props.text) {
        temp.push(temp.length + 1 + ". " + item.slice(3));
      }
    });
    props.setInstructionList(temp);
  }

  function updateInstruction() {
    let temp: string[] = [];
    props.instructionList.map((item: any) => {
      if (item === props.text) {
        temp.push(temp.length + 1 + ". " + text);
      }
    });
    props.setInstructionList(temp);
  }

  const inputRef = useRef(null) as MutableRefObject<any>;
  const [text, setText] = useState(props.text.slice(3));
  const number = props.text.slice(0, 3);

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Text>{number}</Text>
        <TextInput
          placeholderTextColor="grey"
          style={{ color: COLOURS.black }}
          onChangeText={(text) => setText(text)}
          value={text}
          ref={inputRef}
          onSubmitEditing={() => updateInstruction()}
          onEndEditing={() => updateInstruction()}
          // editable={false}
        />
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.delButton}
          onPress={() => inputRef.current.focus()}
        >
          <MaterialCommunityIcons
            name="pencil-outline"
            size={24}
            color={COLOURS.black}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.delButton}
          onPress={() => deleteInstruction()}
        >
          <MaterialCommunityIcons
            name="delete-outline"
            size={24}
            color={COLOURS.black}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Instruction;

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLOURS.grey,
    borderRadius: RADIUS.standard,
    paddingHorizontal: SPACING.medium,
    paddingVertical: SPACING.small,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.small,
  },

  delButton: {
    backgroundColor: COLOURS.grey,
    borderRadius: RADIUS.standard,
    fontSize: FONT_SIZES.small,
    marginLeft: SPACING.small,
  },

  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
