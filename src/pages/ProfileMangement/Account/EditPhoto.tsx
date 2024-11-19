import React, { useRef, useState, useEffect, useCallback, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  ScrollView,
  Image,
  Dimensions,
} from "react-native";
import * as ImagePicker from 'expo-image-picker';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation, useFocusEffect, NavigationProp } from "@react-navigation/native";

import { generateClient } from "aws-amplify/data";
import { GraphQLError } from "graphql";
import { useAuthenticator } from '@aws-amplify/ui-react-native';
import { AnyIfEmpty } from "react-redux";
const client = generateClient<Schema>();

import { DeleteIcon, CameraIcon, GalleryIcon } from "../../../assets/img/Constant"
import { globalStyle } from "../../../assets/css/globalStyle";
import Api from "../../../api/api";
import Loading from "../../../components/loading/Loading";
import Toast from "react-native-toast-message";
import { useGetProfileQuery } from "../../../api";
import { RootStackParams } from "../../../navigation/props";
import { Schema } from "../../../../amplify/data/resource";

const EditPhoto = () => {
  const { data: user } = useGetProfileQuery({});
  const translateY = useRef(new Animated.Value(0)).current;
  const [selectedColor, setSelectedColor] = useState((user?.picture?.charAt(0) === 'h') ? '#0F69FE' : user?.picture);
  const [selectedImage, setSelectedImage] = useState((user?.picture?.charAt(0) === 'h') ? user?.picture : null);
  const navigation = useNavigation<NavigationProp<RootStackParams>>();
  const [isLoading, setIsLoading] = useState(false)
  const colors = [
    "#0F69FE",
    "#3F7F61",
    "#5044A4",
    "#FFA412",
    "#FF5630",
    "#1C2A4B",
  ];

  const shortName = useMemo(() => {
    if (!!user && !!user.name)
      return user.name.split(",").map((s: string) => s.charAt(0)).join().toUpperCase()
  }, [user]);

  const renderColorButton = (color: string, index: number) => {
    const isSelected = selectedColor === color;
    return (
      <TouchableOpacity
        key={index}
        onPress={() => {
          setSelectedColor(color);
        }}
        style={[
          styles.colorButton,
          { backgroundColor: color, borderColor: isSelected ? '#FFF' : 'transparent' },
        ]}
      />
    );
  };

  const pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (result.assets) {
        await uploadToServer(result.assets)
      }
    } catch (error) {
      console.log('Error picking image:', error);
    }
  };

  const pickCameraImage = async () => {
    try {
      let result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (result.assets) {
        await uploadToServer(result.assets)
      }
    } catch (error) {
      console.log('Error picking image:', error);
    }
  };

  const uploadToServer = async (params) => {
    const response = await fetch(params[0].uri);
    const blob = await response.blob();
    let data = {
      "email": user?.email,
      "fileName": Date.now() + ".jpeg",
      "fileType": "image/jpeg"
    }

    setIsLoading(true)
    await Api.getPresignedURI(data)
      .then(async (res: any) => {
        if (res.status == "success") {
          await fetch(res.preSignedUrl, {
            method: 'PUT',
            body: blob,
          })
            .then(async (r) => {
              setSelectedImage(res.permanentImageUrl);
            })
            .catch(e => console.log(e))
        } else {
          console.log("Network error")
        }
      })
      .catch(e => console.log(e))

    setIsLoading(false)
  }

  const handleDelete = async () => {
    !!user && client?.models?.Profile?.update({
      id: user?.id,
      picture: null
    }).then((value) => {
      setSelectedImage(null);
    });
    // Toast.show({
    //   type: 'Capiwise_Error',
    //   position: "top",
    //   text1: "",
    //   text2: res.message
    // });
  };

  const handleUpdate = async () => {
    let value;
    console.log(selectedImage, selectedColor)
    if (selectedImage) {
      value = selectedImage
    } else {
      value = selectedColor
    }

    !!user && client?.models?.Profile?.update({
      id: user?.id,
      picture: value
    });

    navigation.goBack()
  }

  return (
    <ScrollView contentContainerStyle={globalStyle.scrollContainer}>
      <View style={styles.actionBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.viewBtn}>
          <Text style={{ color: '#FFF' }}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleUpdate()} style={styles.viewBtn}>
          <Text style={{ color: '#FFF' }}>Done</Text>
        </TouchableOpacity>
      </View>
      {isLoading ?
        <View style={{ height: Dimensions.get("window").width - 30, width: '100%' }}>
          <Loading />
        </View>
        :
        <View style={[globalStyle.container]}>
          <View style={[styles.profileBox, { backgroundColor: selectedColor }]}>
            {(selectedImage?.charAt(0) === 'h') ? (
              <Image
                source={{ uri: selectedImage || '' }}
                style={{ width: "100%", height: "100%", borderRadius: 10 }}
              />
            ) : (
              <Text style={styles.initials}>
                {shortName}
              </Text>
            )}
          </View>
        </View>
      }
      <View style={[globalStyle.container, { marginTop: 10 }]}>
        <Text style={{ color: "#FFF", fontSize: 16, letterSpacing: 1 }}>
          Choose a background
        </Text>
        <View style={styles.colorRow}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {colors.map(renderColorButton)}
          </ScrollView>
        </View>
      </View>
      <Animated.View style={[styles.bottomSheet, { transform: [{ translateY }] }]}>
        <View style={globalStyle.justifyBetween}>
          <Text style={styles.titleText}>Profile photo</Text>
          <TouchableOpacity onPress={handleDelete}>
            <DeleteIcon />
          </TouchableOpacity>
        </View>
        <View style={styles.iconRow}>
          <TouchableOpacity style={styles.iconContainer} onPress={pickCameraImage}>
            <View style={styles.cameraBtn}>
              <CameraIcon />
            </View>
            <Text style={styles.caption}>Camera</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconContainer} onPress={pickImage}>
            <View style={styles.cameraBtn}>
              <GalleryIcon />
            </View>
            <Text style={styles.caption}>Gallery</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  titleText: {
    fontSize: 18,
    color: "#FFF",
    fontWeight: "500",
    marginRight: 10
  },
  colorRow: {
    marginTop: 10,
    width: Dimensions.get("window").width - 30,
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  colorButton: {
    width: 80,
    height: 80,
    borderRadius: 4,
    borderWidth: 2,
    marginRight: 10
  },
  profileBox: {
    width: Dimensions.get("window").width - 30,
    height: Dimensions.get("window").width - 30,
    borderRadius: 10,
    backgroundColor: "#2EBD85",
    justifyContent: "center",
    alignItems: 'center',
    flexDirection: 'row'
  },
  initials: {
    fontWeight: "700",
    fontSize: 150,
    color: "#FFF",
  },
  bottomSheet: {
    height: 200,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#0B1620",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    padding: 20,
  },
  iconRow: {
    marginTop: 30,
    flexDirection: "row",
    justifyContent: "flex-start",
    gap: 40,
    marginBottom: 20,
  },
  iconContainer: {
    alignItems: "center",
  },
  caption: {
    marginTop: 5,
    color: "#FFF",
    fontSize: 16
  },
  cameraBtn: {
    width: 60,
    height: 60,
    padding: 15,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: "#FFF",
    justifyContent: "center", // Center the content vertically
    alignItems: "center",
  },
  viewBtn: {
    width: 74,
    height: 24,
    backgroundColor: '#2EBD85',
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  actionBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 50,
    height: 30,
    paddingHorizontal: 15,
    marginBottom: 10
  }
});

export default EditPhoto;