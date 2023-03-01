import { StyleSheet, Text, TouchableOpacity, View, FlatList, Button, TextInput  } from "react-native";
import React, { useState, useRef } from "react";
import { COLOURS, FONT_SIZES, RADIUS, SPACING } from "../util/GlobalStyles";
import { MealBuilder } from "../classes/MealClass";
import Instruction from "./Instruction";


type Props = {
    mealBuilder: MealBuilder;
};




const InstructionsList = (props: Props) => {

    const [text, onChangeText] = useState("");
    const [instructionList, setInstructionList] = useState<any>([])


    function addInstruction(instruction: any){
      let num = instructionList.length + 1
      // console.log(instruction)
      setInstructionList([...instructionList, num + ". " + instruction])
      // console.log(instructionList)
      props.mealBuilder.setInstruction(instruction)
      onChangeText("")

    }

  return (
    <>
    <View style={styles.searchContainer}>
    <View style={styles.searchBox}>
    <TextInput
        onChangeText={text => onChangeText(text)}
        value={text}
        placeholder="Add instruction"
        placeholderTextColor={COLOURS.darkGrey}
      />
      </View>
    <View style={styles.addButton}>
    <Button title="Add" color="grey" onPress={() => addInstruction(text)}/>
    </View>
    </View>
    <View style={styles.container}>
      {instructionList.map((item: string)=>{

        return <Instruction instructionList={instructionList} setInstructionList={setInstructionList} text={item}/>
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



  searchContainer:{
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
    backgroundColor: COLOURS.darkGrey,
    borderBottomRightRadius: RADIUS.standard,
    borderTopRightRadius: RADIUS.standard,
    width: "15%",
    color: COLOURS.white,
    alignSelf: "flex-end",

  }
});
