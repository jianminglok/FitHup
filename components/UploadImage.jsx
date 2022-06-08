import React, { useState, useEffect, useRef } from 'react';
import { Alert, Image, View, Platform, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { supabase } from '../lib/supabase'

export default function UploadImage() {
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const mounted = useRef(false);

    const checkForCameraRollPermission = async () => {
        const { status } = await ImagePicker.getMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            alert("Please grant camera roll permissions inside your system's settings");
        }
    }

    useEffect(() => {
        mounted.current = true;
        checkForCameraRollPermission()

        const getProfilePic = async () => {
            try {
                setLoading(true);
                const user = supabase.auth.user();
                if (!user) throw new Error("No user on the session!");

                let { data, error, status } = await supabase
                    .from("profiles")
                    .select(`profilePic`)
                    .eq("id", user.id)
                    .single();
                if (error && status !== 406) {
                    throw error;
                }

                if (data) {
                    if (data.profilePic) downloadImage(data.profilePic);
                }
            } catch (error) {
                Alert.alert((error).message);
            } finally {
                setLoading(false);
            }
        }

        if (mounted.current != false) {
            getProfilePic();
        }
        return () => { mounted.current = false; };
    }, []);

    const downloadImage = async (path) => {
        try {
            const { data, error } = await supabase.storage.from('avatars').download(path)
            if (error) {
                throw error
            }

            const fileReaderInstance = new FileReader();
            fileReaderInstance.readAsDataURL(data);
            fileReaderInstance.onload = () => {
                let base64data = fileReaderInstance.result;
                setImage(base64data)
            }
        } catch (error) {
            Alert.alert('Error retrieving image: ', error.message)
        }
    }

    const addImage = async () => {
        let _image = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!_image.cancelled) {
            setImage(_image.uri);

            try {
                setUploading(true)

                const user = supabase.auth.user();
                if (!user) throw new Error("No user on the session!");

                const file = _image.uri;
                const fileExt = file.split('.').pop()
                const fileName = `${Math.random()}.${fileExt}`
                const filePath = `${fileName}`

                var formData = new FormData();
                formData.append("files", {
                    uri: _image.uri,
                    name: fileName,
                    type: `image/${fileExt}`
                })

                let { data, error: uploadError } = await supabase.storage
                    .from('avatars')
                    .upload(filePath, formData);

                if (data) {

                    const updates = {
                        id: user.id,
                        profilePic: filePath
                    };

                    const { data, error } = await supabase
                        .from('profiles')
                        .upsert(updates, { onConflict: 'id' })

                    if (data) {
                        Alert.alert('Profile picture successfully updated')
                    }

                    if (error) {
                        throw error;
                    }
                }

                if (uploadError) {
                    throw uploadError
                }
            } catch (error) {
                Alert.alert(error.message)
            } finally {
                setUploading(false)
            }
        }
    };

    return (
        <View style={imageUploaderStyles.container}>
            {
                image && <Image source={{ uri: image }} style={{ width: 120, height: 120 }} />
            }

            <View style={imageUploaderStyles.uploadBtnContainer}>
                <TouchableOpacity onPress={addImage} style={imageUploaderStyles.uploadBtn} >
                    <Text style={{ fontSize: 12 }}>{image ? 'Edit' : 'Upload'} Image</Text>
                    <AntDesign name="camera" size={15} color="black" />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const imageUploaderStyles = StyleSheet.create({
    container: {
        elevation: 2,
        height: 120,
        width: 120,
        backgroundColor: '#efefef',
        position: 'relative',
        borderRadius: 999,
        overflow: 'hidden',
        marginTop: 25,
        alignSelf: 'center'
    },

    uploadBtnContainer: {
        opacity: 0.7,
        position: 'absolute',
        right: 0,
        bottom: 0,
        backgroundColor: 'lightgrey',
        width: '100%',
        height: '25%',
    },

    uploadBtn: {
        display: 'flex',
        alignItems: "center",
        justifyContent: 'center'
    }
})