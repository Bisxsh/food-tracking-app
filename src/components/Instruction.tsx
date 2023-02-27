import { StyleSheet, Text, TouchableOpacity, View, FlatList, Button, TextInput  } from "react-native";
import React, { useState, useRef, MutableRefObject } from "react";
import { COLOURS, FONT_SIZES, RADIUS, SPACING } from "../util/GlobalStyles";
import { MealBuilder } from "../classes/MealClass";


type Props = {
    instructionList: any;
    setInstructionList: React.Dispatch<any>;
    text: string;
};



const Instruction = (props: Props) => {

  function refreshList(){
    let temp: string[] = []
    props.instructionList.map((item: any) => {
      if(item !== props.text){
      temp.push(temp.length + 1 + ". " + item.slice(3))
      }
  })
  props.setInstructionList(temp)}


  return (
    <View style={styles.container}>
    <Text style={{color: COLOURS.black}}>{props.text}</Text>
    <TouchableOpacity style={styles.delButton} onPress={() => refreshList()}>
    <Text style={{color: COLOURS.primaryDark}}>Delete</Text>
    </TouchableOpacity>
    </View>
  );
};

export default Instruction;

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLOURS.grey,
    borderRadius: RADIUS.standard,
    padding: SPACING.medium,
    width: "100%",
    flexDirection: "row",
    marginBottom: SPACING.small,
  },

  delButton: {
    backgroundColor: COLOURS.grey,
    borderRadius: RADIUS.standard,
    width: "20%",
    marginLeft: "auto",
    fontSize: FONT_SIZES.small,
  }
});
