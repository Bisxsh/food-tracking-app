import { ActionSheetOptions } from '@expo/react-native-action-sheet'
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';

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
                        result = await ImagePicker.launchCameraAsync({
                            mediaTypes: ImagePicker.MediaTypeOptions.Images,
                            allowsEditing: true,
                            quality: 1,
                            aspect: aspect
                        })
                    }
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
                console.log(imgDirectory)
                await FileSystem.makeDirectoryAsync(imgDirectory)
                await FileSystem.copyAsync({
                    from: result.assets[0].uri,
                    to: imgDirectory + result.assets[0].fileName
                })
                func(imgDirectory + result.assets[0].fileName)
            }
        }
    )
    
}