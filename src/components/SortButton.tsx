import { Animated, StyleSheet, Text } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { Octicons, MaterialCommunityIcons } from "@expo/vector-icons";
import {
  COLOURS,
  DROP_SHADOW,
  FONT_SIZES,
  RADIUS,
  SPACING,
} from "../util/GlobalStyles";
import Modal from "react-native-modal/dist/modal";
import {
  Menu,
  MenuOption,
  MenuOptions,
  MenuTrigger,
} from "react-native-popup-menu";

type Props = {
  options: any[];
  selectedOption: number; // From useState
  setSelectedOption: (option: number) => void;
  width?: number;
  removeMargin?: boolean;
};

const SortButton = (props: Props) => {
  const [showModal, setShowModal] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const transitionAnim = useRef(new Animated.Value(-4)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: showModal ? 1 : 0,
      duration: 100,
      useNativeDriver: true,
    }).start();

    Animated.timing(transitionAnim, {
      toValue: showModal ? 0 : -4,
      duration: 100,
      useNativeDriver: true,
    }).start();
  }, [showModal]);

  const optionsStyles = {
    optionsContainer: {
      paddingTop: SPACING.medium,
      paddingBottom: SPACING.medium,
      backgroundColor: COLOURS.white,
      width: props.width ? props.width : "auto",
      borderRadius: RADIUS.standard,
      ...DROP_SHADOW,
    },
  };

  return (
    <Menu style={{ marginRight: props.removeMargin ? 0 : SPACING.small }}>
      <MenuTrigger style={styles(props).button}>
        <Octicons
          name="arrow-switch"
          size={24}
          color="black"
          style={{ transform: [{ rotate: "90deg" }] }}
        />
      </MenuTrigger>
      <MenuOptions customStyles={optionsStyles}>
        <Text style={styles(props).modalHeading}>Sort By</Text>
        {props.options?.map((option, index) => {
          return (
            <MenuOption
              key={`filter-${index}`}
              style={{
                ...styles(props).modalOption,
                backgroundColor:
                  props.selectedOption === index ? COLOURS.grey : COLOURS.white,
              }}
              onSelect={() => {
                props.setSelectedOption(index);
                setShowModal(false);
              }}
            >
              <MaterialCommunityIcons
                name={index % 2 == 0 ? "arrow-up-thin" : "arrow-down-thin"}
                size={24}
                color="black"
              />
              <Text>{option}</Text>
            </MenuOption>
          );
        })}
      </MenuOptions>
    </Menu>
  );
  //   <View
  //     style={{
  //       position: "relative",
  //       marginRight: props.removeMargin ? 0 : SPACING.small,
  //     }}
  //   >
  //     <TouchableOpacity
  //       style={styles(props).button}
  //       onPress={() => setShowModal(true)}
  //     >
  //       <Octicons
  //         name="arrow-switch"
  //         size={24}
  //         color="black"
  //         style={{ transform: [{ rotate: "90deg" }] }}
  //       />
  //     </TouchableOpacity>
  //     <Menu>
  //       <MenuTrigger>
  //       <Octicons
  //         name="arrow-switch"
  //         size={24}
  //         color="black"
  //         style={{ transform: [{ rotate: "90deg" }] }}
  //       />
  //       </MenuTrigger>
  //       <MenuOptions>
  //         <MenuOption onSelect={() => alert(`Save`)} text="Save" />
  //         <MenuOption onSelect={() => alert(`Delete`)}>
  //           <Text style={{ color: "red" }}>Delete</Text>
  //         </MenuOption>
  //         <MenuOption
  //           onSelect={() => alert(`Not called`)}
  //           disabled={true}
  //           text="Disabled"
  //         />
  //       </MenuOptions>
  //     </Menu>
  //     <Modal
  //       isVisible={showModal}
  //       onBackdropPress={() => setShowModal(false)}
  //       backdropOpacity={0}
  //       animationIn="fadeInDown"
  //       animationOut="fadeOutUp"
  //       style={{
  //         position: "absolute",
  //         //TODO change to work with device for presentation
  //         top: 50,
  //         right: 60,
  //       }}
  //     >
  //       <Animated.View
  //         style={[
  //           styles(props).modal,
  //           { opacity: fadeAnim, translateY: transitionAnim },
  //         ]}
  //       >
  //         <Text style={styles(props).modalHeading}>Sort By</Text>
  //         {props.options?.map((option, index) => {
  //           return (
  //             <TouchableOpacity
  //               key={`filter-${index}`}
  //               style={{
  //                 ...styles(props).modalOption,
  //                 backgroundColor:
  //                   props.selectedOption === index
  //                     ? COLOURS.grey
  //                     : COLOURS.white,
  //               }}
  //               onPress={() => {
  //                 props.setSelectedOption(index);
  //                 setShowModal(false);
  //               }}
  //             >
  //               <MaterialCommunityIcons
  //                 name={index % 2 == 0 ? "arrow-up-thin" : "arrow-down-thin"}
  //                 size={24}
  //                 color="black"
  //               />
  //               <Text>{option}</Text>
  //             </TouchableOpacity>
  //           );
  //         })}
  //       </Animated.View>
  //     </Modal>
  //   </View>
  // );
};

export default SortButton;

const styles = (props: Props) =>
  StyleSheet.create({
    button: {
      padding: SPACING.small,
      backgroundColor: COLOURS.grey,
      borderRadius: RADIUS.circle,
      aspectRatio: 1,
      justifyContent: "center",
      alignItems: "center",
      position: "relative",
    },

    modal: {
      position: "absolute",
      top: "85%",
      right: "85%",
      paddingTop: SPACING.medium,
      paddingBottom: SPACING.medium,
      alignSelf: "stretch",
      backgroundColor: COLOURS.white,
      width: props.width ? props.width : "auto",
      borderRadius: RADIUS.standard,
      ...DROP_SHADOW,
    },

    modalHeading: {
      fontSize: FONT_SIZES.medium,
      textAlign: "center",
      marginBottom: SPACING.medium,
    },

    modalOption: {
      padding: SPACING.small,
      paddingLeft: SPACING.medium,
      paddingRight: SPACING.medium,
      flexDirection: "row",
      justifyContent: "flex-start",
      alignItems: "center",
    },
  });
