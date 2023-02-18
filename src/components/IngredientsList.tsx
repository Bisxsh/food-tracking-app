import { StyleSheet, Text, TouchableOpacity, View, FlatList, Button, TextInput  } from "react-native";
import React, { useState } from "react";
import { COLOURS, FONT_SIZES, RADIUS, SPACING } from "../util/GlobalStyles";

type Props = {

};




const IngredientsList = (props: Props) => {

    const [text, onChangeText] = useState("Useless Text");

    const [ingredient, setIngredient] = useState<any>(["test", "test2", "test3"])


    function addInstruction(instruction: any){
        setIngredient([...ingredient, instruction])
    }

  return (
    <>
    <TextInput
        onChangeText={text => onChangeText(text)}
        value={text}
      />
    <Button title="Press me" onPress={() => addInstruction(text)}/>
    <TouchableOpacity style={styles.container}>
      <FlatList
        keyExtractor={(index) => index.toString()}
        data={ingredient}
        renderItem={({ item }) => ( <Text>{item}</Text>
        )}
      />
    </TouchableOpacity>
    </>
  );
};

export default IngredientsList;

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLOURS.primary,
    borderRadius: RADIUS.standard,
    padding: SPACING.medium,
  },
});
