import { MaterialIcons } from '@expo/vector-icons';
import React, { useContext, useState } from 'react';
import {StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView, Alert, AlertButton, Image, useWindowDimensions} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';

import { User, UserContext, DietReqs } from '../../../backends/User';
import { COLOURS, FONT_SIZES, ICON_SIZES, RADIUS, SPACING} from '../../../util/GlobalStyles';
import * as DB from '../../../backends/Database'
import { getImageSrc } from '../../../util/ImageUtil';
import { ActionSheetOptions, useActionSheet } from '@expo/react-native-action-sheet';
import Checkbox from '../../../components/Checkbox';
import { SafeAreaView } from 'react-native-safe-area-context';

type selectRowProp = {
    text: string
    initialVal: boolean
    onChange: Function
}

type alertProp = {
    title: string
    desc: string
    buttons: AlertButton[],
    user: User
}


const HorizontalLine = (
    <View
      style={{
        borderColor: COLOURS.darkGrey,
        borderBottomWidth: 1,
        alignSelf: "stretch",
      }}
    />
);


function createAlert(prop: alertProp){
    Alert.alert(
        prop.title,
        prop.desc,
        prop.buttons,
        {userInterfaceStyle:(prop.user.setting.isDark())?"dark":"light"}
    )
}

async function getPhoto(
    showActionSheetWithOptions:(options:ActionSheetOptions, callback:(i?: number | undefined) => void | Promise<void>)=>void,
    user: User,
    setUser: React.Dispatch<React.SetStateAction<User>>,
    setImg: React.Dispatch<React.SetStateAction<string | undefined>>
){
    getImageSrc(showActionSheetWithOptions, (uri:string)=>{
        setImg(uri)
        user.imgSrc = uri
        setUser(user)
        DB.updateUser(user)
    })
}

function SelectRow(prop: selectRowProp): JSX.Element{
    const [value, setValue] = useState<boolean>(prop.initialVal)
    return (
        <View
            style={{
                flexDirection: "row",
                paddingVertical: SPACING.small,
                paddingHorizontal: SPACING.medium,
                justifyContent: "flex-start",
            }}
        >
            <Checkbox
                onPress={(arg)=>{
                    setValue(arg)
                    prop.onChange(arg)
                }}
                initialVal={value}
                size={ICON_SIZES.medium}
            />
            <Text
            style={{
                paddingLeft: SPACING.tiny,
                fontSize: FONT_SIZES.medium,
                width: "75%"
            }}>
                {prop.text}
            </Text>
    </View>
    );
}


function selectRowOnChange(newValue:boolean, text:string, user: User, setUser: React.Dispatch<React.SetStateAction<User>>){
    const index = Object.values(DietReqs).findIndex((value)=>value==text)
    if (index != -1){
        user.dietReq[index][1] = newValue
    }
    setUser(user)
    DB.updateUser(user)
}

export function Account(): JSX.Element{
    const { user, setUser } = useContext(UserContext);
    const [ name, setName ] = useState(user.name)
    const [ img, setImg] = useState(user.imgSrc)
    const dietReqRows: JSX.Element[] = user.dietReq.map((value, index)=>{
            const key = index
            return <SelectRow
                key={key}
                text={value[0]}
                initialVal={value[1]}
                onChange={(newValue:boolean)=>selectRowOnChange(newValue, value[0], user, setUser)}
            />
        }
    )
    const isDarkMode = user.setting.isDark()
    const { showActionSheetWithOptions } = useActionSheet();
    const {height, width} = useWindowDimensions()

    return (
        <SafeAreaView
            style={{
                flex: 1,
                backgroundColor: isDarkMode ? COLOURS.darker : COLOURS.white,
            }}
            edges={['left', 'right']}
        >
            <ScrollView
                style={{
                    backgroundColor: isDarkMode ? COLOURS.darker : COLOURS.white,
                    flex: 1,
                }}
            >
                {img != undefined && <TouchableOpacity onPress={()=>{getPhoto(showActionSheetWithOptions, user,setUser,setImg)}}>
                    <Image
                        style={{
                            alignItems: "center",
                            aspectRatio: 1,
                            width: Math.min(height, width)*0.3,
                            justifyContent: "center",
                            alignSelf: "center",
                            borderRadius: 100
                        }}
                        source={{uri: img}}
                    />
                </TouchableOpacity>}
                {img == undefined && <View
                    style={{
                        alignItems: "center",
                        backgroundColor: COLOURS.darkGrey,
                        aspectRatio: 1,
                        width: Math.min(height, width)*0.3,
                        justifyContent: "center",
                        alignSelf: "center",
                        borderRadius: 100
                    }}
                >
                    <TouchableOpacity
                        onPress={()=>{
                            getImageSrc(showActionSheetWithOptions, (uri:string)=>{
                                setImg(uri)
                                user.imgSrc = uri
                                setUser(user)
                                DB.updateUser(user)
                            })
                        }}
                    >
                        <MaterialIcons 
                            name="photo-camera" 
                            color={COLOURS.white} 
                            size={ICON_SIZES.large} 
                            style={{
                                textAlign: 'center'
                            }}
                        />
                    </TouchableOpacity>
                    
                </View>}
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
                            color: isDarkMode ? COLOURS.white : COLOURS.black,
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
                        onSubmitEditing={(e)=>{
                            if (e.nativeEvent.text != ""){
                            user.name = e.nativeEvent.text
                                setUser(user)
                                DB.updateUser(user) 
                            }else{
                                createAlert({
                                    title: "Name missing",
                                    desc: "Name cannot be empty",
                                    buttons: [{text: "OK"}],
                                    user: user
                                })
                            }
                        }}
                    />
                </View>
                <View style={{
                    flexDirection: "column",
                    paddingHorizontal: SPACING.medium,
                }}>
                    <View
                        style={{
                            alignSelf: "stretch",
                            marginTop: SPACING.small,
                            marginHorizontal: SPACING.medium,
                            flexDirection: "row",
                            justifyContent: "space-between",
                        }}
                    >
                        <Text 
                            style={{
                                fontSize: FONT_SIZES.medium,
                                alignSelf: "flex-start",
                                color: isDarkMode ? COLOURS.white : COLOURS.black,
                            }}
                        >Dietary Requirements</Text>
                    </View>
                    <View
                        style={{
                            backgroundColor: COLOURS.grey,
                            flexDirection: "column",
                            borderRadius: RADIUS.standard,
                            marginVertical: SPACING.small,
                        }}
                    >
                        {dietReqRows}
                    </View>
                    
                </View>
            </ScrollView>
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
    text: {
        flex: 1,
        fontSize: FONT_SIZES.medium,
        alignSelf: "center",
        marginVertical: SPACING.small,
    }
});