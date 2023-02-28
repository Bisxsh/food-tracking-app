import React, { useState } from 'react';
import { Button, Modal, StyleSheet, Text, View, Animated } from 'react-native';
import IngredientViewExpiring from '../screens/Home/components/Main/IngredientViewExpiring';
import { Ingredient } from '../backends/Ingredient';
import {
  COLOURS,
  DROP_SHADOW,
  FONT_SIZES,
  RADIUS,
  SPACING,
} from "../util/GlobalStyles";
import { Colors } from "react-native/Libraries/NewAppScreen";

interface ExpiringButtonProps {
  label: string;
}

const ExpiringButton: React.FC<ExpiringButtonProps> = ({ label }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));

  const handleButtonPress = () => {
    setModalVisible(true);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  const handleClosePress = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start(() => setModalVisible(false));
  };

  return (
    <View style={styles.container}>
      <Button title={label} onPress={handleButtonPress} color="white" />
      <Modal visible={modalVisible} animationType="slide">
        <Animated.View
          style={[
            styles.modalContainer,
            {
              marginTop: SPACING.extraLarge,
              marginBottom: SPACING.large,
              opacity: fadeAnim,
              transform: [
                {
                  translateY: fadeAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [600, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <View style={styles.box}>
            <Text style={styles.boxText}>
              Food that are expiring within a day:{' '}
            </Text>
          </View>
          <IngredientViewExpiring />
          <Button title="Close" onPress={handleClosePress} />
        </Animated.View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: SPACING.medium,
    left: SPACING.medium,
    backgroundColor: 'red',
    paddingHorizontal: SPACING.medium,
    paddingVertical: SPACING.small,
    borderRadius: 30,
  },
  modalContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
  },
  box: {
    backgroundColor: 'red',
    paddingHorizontal: SPACING.medium,
    paddingVertical: SPACING.small,
    marginBottom: SPACING.medium,
    borderRadius: 10,
  },
  boxText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default ExpiringButton;