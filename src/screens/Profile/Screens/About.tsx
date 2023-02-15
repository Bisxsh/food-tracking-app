import React, { useContext } from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import { UserContext } from '../../../backends/User';

import { COLOURS, RADIUS, SPACING } from '../../../util/GlobalStyles';

export function About(): JSX.Element{
    const { user, setUser } = useContext(UserContext);
    const isDarkMode = user.setting.isDark()

    return (
        <View
            style={{
                backgroundColor: isDarkMode ? Colors.darker : Colors.white,
                flex: 1,
            }}
        >
            <Text>This is About page</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: COLOURS.grey,
        flexDirection: "column",
        alignSelf: "flex-start",
        margin: SPACING.medium,
        paddingHorizontal: SPACING.medium,
        borderRadius: RADIUS.standard,
    },
});