import React, {} from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';

import { COLOURS, RADIUS, SPACING } from '../../../util/GlobalStyles';

export function Help(): JSX.Element{
    const isDarkMode = false;

    const backgroundStyle = {
        backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    };

    return (
        <View
            style={{
                backgroundColor: isDarkMode ? Colors.black : Colors.white,
                flex: 1,
            }}
        >
            <Text>This is Help page</Text>
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