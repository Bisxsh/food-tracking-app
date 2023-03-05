import { StyleSheet, Text, View, Image, TouchableOpacity, useWindowDimensions } from "react-native";
import React, { useState } from "react";

import InputField from "./InputField";
import { MaterialIcons } from "@expo/vector-icons";
import { COLOURS, RADIUS, SPACING } from "../util/GlobalStyles";
import * as ImagePicker from "expo-image-picker";
import { ActionSheetOptions, useActionSheet } from "@expo/react-native-action-sheet";
import { getImageSrc } from "../util/ImageUtil";

type Props = {
  onImgChange: (img: string) => void;
  onNameChange: (name: string) => void;
  imgStr?: string;
  nameStr?: string;
};

const NameAndImage = (props: Props) => {
  const [image, setImage] = useState<string>(props.imgStr || "");
  const [nameStr, setNameStr] = useState(props.nameStr || "");
  const { showActionSheetWithOptions } = useActionSheet();
  const {height, width} = useWindowDimensions()

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    // let result = await ImagePicker.launchImageLibraryAsync({
    //   mediaTypes: ImagePicker.MediaTypeOptions.All,
    //   allowsEditing: true,
    //   aspect: [1, 1],
    //   quality: 1,
    // });

    // if (!result.canceled) {
    //   setImage(result.assets[0].uri);
    //   props.onImgChange(result.assets[0].uri);
    // }
    getImageSrc(showActionSheetWithOptions, (uri:string)=>{
      setImage(uri);
      props.onImgChange(uri);
    })
  };


  return (
    <View style={styles.container}>
      {!image && (
        <TouchableOpacity style={{...styles.camera, ...{width: Math.min(height, width)/4}}} onPress={pickImage}>
          <MaterialIcons name="camera-alt" size={24} color="black" />
        </TouchableOpacity>
      )}
      {image && (
        <TouchableOpacity onPress={pickImage}>
          <Image source={{ uri: image }} style={{...styles.camera, ...{width: Math.min(height, width)/4}}} />
        </TouchableOpacity>
      )}
      <InputField
        fieldName="Name"
        required
        onTextChange={(str) => {
          props.onNameChange(str);
          setNameStr(str);
        }}
        defaultValue={nameStr}
      />
    </View>
  );
};

export default NameAndImage;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },

  camera: {
    aspectRatio: 1,
    backgroundColor: COLOURS.grey,
    marginRight: SPACING.small,
    borderRadius: RADIUS.standard,
    justifyContent: "center",
    alignItems: "center",
  },
});
