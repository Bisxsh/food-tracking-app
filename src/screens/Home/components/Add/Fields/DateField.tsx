import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import RNDateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { SPACING, COLOURS, RADIUS } from "../../../../../util/GlobalStyles";

type Props = {
  required?: boolean;
  textHint?: string;
  fieldName: string;
  width?: number;
  setValue: (date: Date) => void;
};

const DateField = (props: Props) => {
  const [showCalendar, setShowCalendar] = useState(false);
  const [dateString, setDateString] = useState(
    new Date().toString().substring(0, 15)
  );
  const setDateNew = (event: DateTimePickerEvent, date?: Date | undefined) => {
    const {
      type,
      nativeEvent: { timestamp },
    } = event;

    if (type === "set" && timestamp !== undefined) {
      props.setValue(new Date(timestamp));
      setDateString(new Date(timestamp).toString().substring(0, 15));
    }
  };
  return (
    <View style={{ position: "relative" }}>
      <Text>
        {props.fieldName}
        {props.required ? "*" : ""}
      </Text>
      <Text style={styles(props).container}>{dateString}</Text>

      <TouchableOpacity
        onPress={() => setShowCalendar(true)}
        style={styles(props).icon}
      >
        <MaterialCommunityIcons name="calendar" size={24} color="black" />
      </TouchableOpacity>
      {showCalendar && (
        <RNDateTimePicker
          value={new Date()}
          onChange={setDateNew}
          accentColor={COLOURS.primary}
          minimumDate={new Date()}
        />
      )}
    </View>
  );
};

export default DateField;

const styles = (props: Props) =>
  StyleSheet.create({
    container: {
      backgroundColor: "white",
      height: 40,
      borderRadius: RADIUS.tiny,
      padding: 10,
      borderColor: COLOURS.darkGrey,
      borderWidth: 1,
      marginTop: SPACING.small,
      width: props.width ? props.width : 200,
    },

    icon: {
      position: "absolute",
      right: SPACING.small,
      top: "50%",
    },
  });
