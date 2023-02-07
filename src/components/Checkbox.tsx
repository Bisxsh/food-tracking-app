import React, { useState } from "react";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { COLOURS, RADIUS, SPACING } from "../util/GlobalStyles";

type Props = {
  size?: number;
  onPress: (arg: boolean) => void;
  initialVal?: boolean;
};

const Checkbox = ({ size, onPress, initialVal }: Props) => {
  const [checked, setChecked] = useState(initialVal || false);
  return (
    <BouncyCheckbox
      size={size || 24}
      fillColor={COLOURS.primary}
      unfillColor={COLOURS.white}
      iconStyle={{ borderColor: COLOURS.primary, borderRadius: RADIUS.tiny }}
      style={{ marginRight: SPACING.small }}
      innerIconStyle={{
        borderColor: checked ? COLOURS.primaryDark : COLOURS.darkGrey,
        borderRadius: RADIUS.tiny,
        borderWidth: 1,
      }}
      onPress={() => {
        onPress(!checked);
        setChecked(!checked);
      }}
      isChecked={checked}
      disableBuiltInState={true}
      disableText={true}
    />
  );
};

export default Checkbox;
