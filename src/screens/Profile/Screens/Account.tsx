import { MaterialIcons } from '@expo/vector-icons';
import React, { useContext, useState } from 'react';
import {StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView, Alert, AlertButton, Image} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';

import { User, UserContext } from '../../../backends/User';
import { COLOURS, FONT_SIZES, ICON_SIZES, RADIUS, SPACING} from '../../../util/GlobalStyles';
import * as DB from '../../../backends/Database'
import { getImageSrc } from '../../../util/ImageUtil';
import { ActionSheetOptions, useActionSheet } from '@expo/react-native-action-sheet';

type inputTextProp = {
    defaultText: string
    onChange: Function
    onDelete: Function
}

type alertProp = {
    title: string
    desc: string
    buttons: AlertButton[]
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

var InputTextRowCount = 0

function createAlert(prop: alertProp){
    Alert.alert(
        prop.title,
        prop.desc,
        prop.buttons
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

function InputTextRow(prop: inputTextProp): JSX.Element{
    const [value, setValue] = useState<string>(prop.defaultText)
    return (
        <View
            style={{
                flexDirection: "row",
                paddingVertical: SPACING.small,
                paddingHorizontal: SPACING.medium,
                justifyContent: "space-between",
            }}
        >
            <TextInput
                style={{
                    fontSize: FONT_SIZES.medium,
                    width: "75%"
                }}
                value={value}
                onChangeText={setValue}
                onSubmitEditing={(e)=>{
                    prop.onChange(e.nativeEvent.text, value)
                }}
            />
            <TouchableOpacity
                onPress={()=>{
                    prop.onDelete(value)
                }}
            >
                <MaterialIcons 
                    name="close" 
                    color={Colors.black} 
                    size={ICON_SIZES.medium} 
                    style={{
                        textAlign: 'center'
                    }}
                />
            </TouchableOpacity>
    </View>
    );
}

function inputTextRowOnChange(newValue:string, previousValue:string, user: User, setUser: React.Dispatch<React.SetStateAction<User>>){
    if (newValue != ""){
        if (user.dietReq.findIndex((v)=>v==previousValue) == -1){
            user.dietReq.push(newValue)
        }else{
            user.dietReq = user.dietReq.map((v,i,a)=>{
                if (v=previousValue){
                    return newValue
                }
                return v
            })
        }
        setUser(user)
        DB.updateUser(user)
    }else{
        createAlert({
            title: "Empty Error",
            desc: "Text cannot be empty",
            buttons: [{text: "OK"}]
        })
    }
}

export function Account(): JSX.Element{
    const { user, setUser } = useContext(UserContext);
    const [ name, setName ] = useState(user.name)
    const [ img, setImg] = useState(user.imgSrc)
    const [ dietReqRows, setDietReqRows] = useState<JSX.Element[]>(
        user.dietReq.map((value, index)=>{
            const key = index
            return <InputTextRow
                key={key}
                defaultText={value}
                onChange={(newValue:string, previousValue:string)=>inputTextRowOnChange(newValue,previousValue,user,setUser)}
                onDelete={(value: string)=>{
                    setDietReqRows((current)=>current.filter((value)=>value.key!=key))
                    user.dietReq = user.dietReq.filter((v)=>v!=value)
                    setUser(user)
                    DB.updateUser(user)
                }}
            />
        }
    ))
    const isDarkMode = user.setting.isDark()
    const { showActionSheetWithOptions } = useActionSheet();

    InputTextRowCount = user.dietReq.length

    return (
        <ScrollView
            style={{
                backgroundColor: isDarkMode ? Colors.darker : Colors.white,
                flex: 1,
            }}
        >
            {img != undefined && <TouchableOpacity onPress={()=>{getPhoto(showActionSheetWithOptions, user,setUser,setImg)}}>
                <Image
                    style={{
                        alignItems: "center",
                        aspectRatio: 1,
                        width: "30%",
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
                    width: "30%",
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
                    onSubmitEditing={(e)=>{
                        if (e.nativeEvent.text != ""){
                           user.name = e.nativeEvent.text
                            setUser(user)
                            DB.updateUser(user) 
                        }else{
                            createAlert({
                                title: "Empty Error",
                                desc: "Text cannot be empty",
                                buttons: [{text: "OK"}]
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
                            color: isDarkMode ? Colors.white : Colors.black,
                        }}
                    >Diet Requirements</Text>
                    <TouchableOpacity
                        onPress={()=>{
                            const key = InputTextRowCount
                            InputTextRowCount ++
                            setDietReqRows(
                                [
                                    <InputTextRow
                                        key={key}
                                        defaultText={""}
                                        onChange={(newValue:string, previousValue:string)=>inputTextRowOnChange(newValue,previousValue,user,setUser)}
                                        onDelete={(value: string)=>{
                                            setDietReqRows((current)=>current.filter((value)=>value.key!=key))
                                            user.dietReq = user.dietReq.filter((v)=>v!=value)
                                            setUser(user)
                                            DB.updateUser(user)
                                        }}
                                    />
                                ].concat(dietReqRows)
                            )
                        }}
                    >
                        <MaterialIcons 
                            name="add" 
                            color={isDarkMode ? Colors.white : Colors.black} 
                            size={ICON_SIZES.medium} 
                            style={{
                                textAlign: 'center'
                            }}
                        />
                    </TouchableOpacity>
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