import React, { useEffect, useState, useCallback } from "react";
import { View, Text, Image, TouchableOpacity, Linking } from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch } from "react-redux";
import * as Keychain from "react-native-keychain";
import * as Auth from "aws-amplify/auth";

import { globalStyle } from "../../assets/css/globalStyle"
import { reset, setCredentials } from "../../api/authSlice";
import styles from "./ProfileCss/ProfileScreenCss";
import CloseAccount from "./CloseAccount";
import { Account, Setting, Alert, HelpCenter, TermAndCondition, PrivacyPolicy, LogOut, Closeaccount } from "../../assets/img/Constant"
import { useGetProfileQuery } from "../../api";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { userApi } from "../../api/profile";
import { store, useAppDispatch } from "../../store";

const ProfileScreen = ({ navigation }) => {
  const dispatch = useAppDispatch()
  const { data: user } = useGetProfileQuery({});
  const [userAttributes, setUserAttributes] = useState<{
    given_name: string,
    family_name: string
  }>({ given_name: user?.name?.split(" ")[0] ?? "", family_name: user?.name?.includes(" ") ? user?.name?.split(" ")[1] : "" });
  console.log(userAttributes)

  const handleCloseAccount = () => {
    navigation.navigate(CloseAccount)
  }
  const handleSetting = () => {
    navigation.navigate("SettingMain")
  }
  const handleAlerts = () => {
    navigation.navigate("ManageAlerts")
  }
  const handleTermsConditions = () => {
    navigation.navigate("TermsAndConditions")
  }
  const handlePrivacy = () => {
    navigation.navigate("PrivacyPolicy")
  }
  const handleAccount = () => {
    navigation.navigate("AccountMain")
  }
  const handleLogout = () => {
    AsyncStorage.clear();
    Keychain.resetGenericPassword();
    dispatch(reset());
    Auth.signOut();
    dispatch(userApi.util.invalidateTags(['Profile']));
    navigation.navigate("Splash")
  }
  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerBackVisible: false,
      headerTitle: () => (
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ ...globalStyle.alignItemsCenter, gap: 15 }}>
          <FontAwesome name="angle-left" size={28} color="white" />
          <Text style={{ color: "#FFF", fontSize: 24 }}>
            Profile
          </Text>
        </TouchableOpacity>
      ),
      headerStyle: {
        backgroundColor: "#040B11",
      },
      headerTintColor: "#FFF",
    });
  }, [navigation]);

  const handleViewProfile = () => {
    navigation.navigate("AccountMain")
  }
  const handleeditphoto = () => {
    navigation.navigate("EditPhoto")
  }

  return (
    <View style={styles.container}>
      <View style={styles.profilePictureContainer}>
        {user?.picture && user?.picture?.charAt(0) === 'h' ? (
          <TouchableOpacity onPress={handleeditphoto}>
            <Image
              source={{ uri: user?.picture }}
              style={styles.profilePicture}
            />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={handleeditphoto} style={[styles.initialsContainer, { backgroundColor: user?.picture ? user?.picture : '#0F69FE' }]}>
            <Text style={styles.initials}>
              {userAttributes?.given_name ? userAttributes?.given_name.charAt(0).toUpperCase() : ''}
              {userAttributes?.family_name ? userAttributes?.family_name.charAt(0).toUpperCase() : ''}
            </Text>
          </TouchableOpacity>
        )}
        <View>
          <Text style={styles.name}>{userAttributes?.given_name} {userAttributes?.family_name}</Text>
          <Text onPress={handleViewProfile} style={styles.profile}>View profile</Text>
        </View>
      </View>
      <View style={styles.sectionContainer}>
        <View style={styles.sectionIcon}>
          <Account />
        </View>
        <Text style={styles.sectionText} onPress={handleAccount}>Account</Text>
      </View>
      <View style={styles.horizontalLine} />
      <View style={styles.sectionContainer}>
        <View style={styles.sectionIcon}>
          <Setting />
        </View>
        <Text style={styles.sectionText} onPress={handleSetting}>Settings</Text>
      </View>
      <View style={styles.horizontalLine} />
      <View style={styles.sectionContainer}>
        <View style={styles.sectionIcon}>
          <Alert />
        </View>
        <Text style={styles.sectionText} onPress={handleAlerts}>Alerts</Text>
      </View>
      <View style={styles.horizontalLine} />
      <View style={styles.sectionContainer}>
        <View style={styles.sectionIcon}>
          <HelpCenter />
        </View>
        <Text style={styles.sectionText} onPress={() => Linking.openURL('https://capiwise.com')}>
          Help center
        </Text>
      </View>
      <View style={styles.horizontalLine} />
      <View style={styles.sectionContainer}>
        <View style={styles.sectionIcon}>
          <TermAndCondition />
        </View>
        <Text style={styles.sectionText} onPress={handleTermsConditions}>Terms and conditions</Text>
      </View>
      <View style={styles.horizontalLine} />
      <View style={styles.sectionContainer}>
        <View style={styles.sectionIcon}>
          <PrivacyPolicy />
        </View>
        <Text style={styles.sectionText} onPress={handlePrivacy}>Privacy Policy</Text>
      </View>
      <View style={styles.horizontalLine} />
      <TouchableOpacity onPress={handleLogout} style={styles.sectionContainer}>
        <View style={styles.sectionIcon}>
          <LogOut />
        </View>
        <Text onPress={handleLogout} style={styles.sectionText}>Log out</Text>
      </TouchableOpacity>
      <View style={styles.horizontalLine} />
      <View style={styles.sectionContainer}>
        <View style={styles.sectionIcon}>
          <Closeaccount />
        </View>
        <Text style={{ fontSize: 16, color: "#E2433B" }} onPress={handleCloseAccount}>
          Close your account
        </Text>
      </View>
    </View>
  );
};

export default ProfileScreen;
