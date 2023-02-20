import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useContext, useState } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import RNDateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { COLOURS, RADIUS, SPACING } from "../util/GlobalStyles";
import { UserContext } from "../backends/User";
import { Colors } from "react-native/Libraries/NewAppScreen";

type Props = {
  required?: boolean;
  textHint?: string;
  fieldName: string;
  width?: number;
  setValue: (date: Date) => void;
  defaultValue?: Date;
};

const DateField = (props: Props) => {
  const [showCalendar, setShowCalendar] = useState(false);
  const [dateString, setDateString] = useState(
    props.defaultValue?.toString().substring(0, 15) ||
      new Date().toString().substring(0, 15)
  );
  const { user, setUser } = useContext(UserContext);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(user.setting.isDark());

  const setDateNew = (event: DateTimePickerEvent, date?: Date | undefined) => {
    const {
      type,
      nativeEvent: { timestamp },
    } = event;

    if (type === "set" && timestamp !== undefined) {
      props.setValue(new Date(timestamp));
      setDateString(new Date(timestamp).toString().substring(0, 15));
    }
    setShowCalendar(false);
  };
  return (
    <TouchableOpacity
      style={{ position: "relative" }}
      onPress={() => setShowCalendar(true)}
    >
      <Text style={{ color: isDarkMode ? Colors.white : Colors.darker }}>
        {props.fieldName}
        {props.required ? "*" : ""}
      </Text>
      <Text style={styles(props).container}>{dateString}</Text>

      <MaterialCommunityIcons
        name="calendar"
        size={24}
        color="black"
        style={styles(props).icon}
      />

      {showCalendar && (
        <RNDateTimePicker
          value={new Date()}
          onChange={setDateNew}
          accentColor={COLOURS.primary}
          minimumDate={new Date()}
        />
      )}
    </TouchableOpacity>
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
