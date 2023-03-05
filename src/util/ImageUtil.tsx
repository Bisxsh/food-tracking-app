import { ActionSheetOptions } from '@expo/react-native-action-sheet'
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { useState } from 'react';

const imgDirectory = FileSystem.documentDirectory + "Image/"

export function getImageSrc(
    showActionSheetWithOptions:(options:ActionSheetOptions, callback:(i?: number | undefined) => void | Promise<void>)=>void, 
    func: (uri: string)=>void,
    aspect: [number, number] = [1,1]
){
    const options = ["Camera", "Library", "Cancel"]
    showActionSheetWithOptions(
        {
            options: options,
            cancelButtonIndex: 2,
            cancelButtonTintColor: "red"
        },
        async (index)=>{
            var result: ImagePicker.ImagePickerResult|undefined
            var response: ImagePicker.PermissionResponse
            switch(index){
                case 0: //Camera
                    response = await ImagePicker.getCameraPermissionsAsync()
                    if (!response.granted){
                        response = await ImagePicker.requestCameraPermissionsAsync()
                    }
                    if (response.granted){
                        response = await ImagePicker.getMediaLibraryPermissionsAsync()
                        if (!response.granted){
                            response = await ImagePicker.requestMediaLibraryPermissionsAsync()
                        }
                        if (response.granted){
                            result = await ImagePicker.launchCameraAsync({
                                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                                allowsEditing: true,
                                quality: 0.5,
                                exif: true,
                                aspect: aspect,
                                base64: true
                            })
                        }
                    }
                    break;
                case 1: //Library
                    response = await ImagePicker.getMediaLibraryPermissionsAsync()
                    if (!response.granted){
                        response = await ImagePicker.requestMediaLibraryPermissionsAsync()
                    }
                    if (response.granted){
                        result = await ImagePicker.launchImageLibraryAsync({
                            mediaTypes: ImagePicker.MediaTypeOptions.Images,
                            allowsEditing: true,
                            quality: 1,
                            aspect: aspect
                        })
                    }
                case 2: //Cancel
                    break;
            }
            if (result != undefined && !result.canceled){
                await FileSystem.getInfoAsync(imgDirectory).then(async (info)=>{
                    if (!info.exists){
                        await FileSystem.makeDirectoryAsync(imgDirectory)
                    }
                })
                await FileSystem.copyAsync({
                    from: result.assets[0].uri,
                    to: imgDirectory + result.assets[0].uri.split("/").pop()
                })
                func(imgDirectory + result.assets[0].uri.split("/").pop())
            }
        }
    )
    
}

export async function deleteImage(url: string, verbose: string){
    const dir:string[] = await FileSystem.readDirectoryAsync(imgDirectory)
    if ((await FileSystem.getInfoAsync(url)).exists){
        await FileSystem.deleteAsync(url)
        if (verbose){
            if (!(await FileSystem.getInfoAsync(url)).exists){
                console.log("SUCCESS: Delete image")
            }else{
                console.log("FAIL: Delete image")
            }
        }
    }else{
        if (verbose){
            console.log("FAIL: Delete file (No such file)")
        }
    }
}

export async function deleteAllImage(verbose=false){
    const dir:string[] = await FileSystem.readDirectoryAsync(imgDirectory)
    if (dir.filter((v)=>v != "").length != 0){
        for (const file of dir){
            await FileSystem.deleteAsync(imgDirectory+file)
        }
        if (verbose){
            if ((await FileSystem.readDirectoryAsync(imgDirectory)).length == 0){
                console.log("SUCCESS: Delete image")
            }else{
                console.log("FAIL: Delete image")
            }
        }
    }else{
        if (verbose){
            console.log("FAIL: Delete file (No such file)")
        }
    }
}
