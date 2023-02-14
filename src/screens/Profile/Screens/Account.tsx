import { MaterialIcons } from '@expo/vector-icons';
import React, { useContext, useState } from 'react';
import {StyleSheet, View, Text, TextInput} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';

import { UserContext } from '../../../backends/User';
import { COLOURS, FONT_SIZES, ICON_SIZES, RADIUS, SPACING } from '../../../util/GlobalStyles';

export function Account(): JSX.Element{
    const { user, setUser } = useContext(UserContext);
    const [ name, setName ] = useState(user.name)
    const isDarkMode = user.setting.isDark()

    return (
        <View
            style={{
                backgroundColor: isDarkMode ? Colors.darker : Colors.white,
                flex: 1,
            }}
        >
            <View
                style={{
                    alignItems: "center",
                    backgroundColor: COLOURS.darkGrey,
                    aspectRatio: 1,
                    width: "30%",
                    justifyContent: "center",
                    alignSelf: "center",
                    borderRadius: 100
                }}
            >
                <MaterialIcons 
                    name="photo-camera" 
                    color={
                        (isDarkMode)?COLOURS.white: COLOURS.black
                    } 
                    size={ICON_SIZES.large} 
                    style={{
                        alignSelf: "center"
                    }}
                />
            </View>
            <View style={{
                flexDirection: "column",
                paddingHorizontal: SPACING.medium,
            }}>
                <Text 
                    style={{
                        fontSize: FONT_SIZES.medium,
                        alignSelf: "flex-start",
                        marginTop: SPACING.small,
                        marginHorizontal: SPACING.medium,
                        color: isDarkMode ? Colors.white : Colors.black,
                    }}
                >Name</Text>
                <TextInput
                    style={{
                        backgroundColor: COLOURS.grey,
                        fontSize: FONT_SIZES.medium,
                        marginVertical: SPACING.small,
                        paddingVertical: SPACING.small,
                        paddingHorizontal: SPACING.medium,
                        borderRadius: RADIUS.standard,
                        width: "100%"
                    }}
                    onChangeText={setName}
                    value={name}
                />
            </View>
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
    text: {
        flex: 1,
        fontSize: FONT_SIZES.medium,
        alignSelf: "center",
        marginVertical: SPACING.small,
    }
});