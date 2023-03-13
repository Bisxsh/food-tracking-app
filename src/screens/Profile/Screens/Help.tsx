import React, { useContext } from 'react';
import {StyleSheet, View, Text} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {Colors} from 'react-native/Libraries/NewAppScreen';

import { UserContext } from '../../../backends/User';
import { COLOURS, RADIUS, SPACING } from '../../../util/GlobalStyles';

export function Help(): JSX.Element{
    const { user, setUser } = useContext(UserContext);
    const isDarkMode = user.setting.isDark()

    return (
        <SafeAreaView
            style={{
                flex: 1,
                backgroundColor: isDarkMode ? COLOURS.darker : COLOURS.white,
            }}
            edges={['left', 'right']}
        >
            <View
                style={{
                    backgroundColor: isDarkMode ? COLOURS.darker : COLOURS.white,
                    flex: 1,
                    padding: SPACING.medium,
                }}
            >
                <Text 
                    style={{color: isDarkMode ? COLOURS.white : COLOURS.black,}}
                >
                    Please get in touch with our developer members if you need any helps.
                </Text>
            </View>
        </SafeAreaView>
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