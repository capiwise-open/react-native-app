import React, { useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { StyleSheet } from "react-native";
import { SettingBellicon, SettingLanguage, SettingChangePassword, ArrowIcon } from "../../../assets/img/Constant"
import { globalStyle } from "../../../assets/css/globalStyle";

const SettingMain = ({ navigation }) => {
  const handleNotification = () => {
    navigation.navigate("SettingNotifications")
  }

  const handleLanguage = () => {
    navigation.navigate("LannguageRegion")
  }

  const handlePassword = () => {
    navigation.navigate("SetNewPassword")
  }

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerBackVisible: false,
      headerTitle: () => (
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ ...globalStyle.alignItemsCenter, gap: 15 }}>
          <FontAwesome name="angle-left" size={28} color="white" />
          <Text style={{ color: "#FFF", fontSize: 24 }}>
            Settings
          </Text>
        </TouchableOpacity>
      ),
      headerStyle: {
        backgroundColor: "#040B11",
      },
      headerTintColor: "#FFF",
    });
  }, [navigation]);
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleNotification}>
        <View style={[globalStyle.justifyBetween, { paddingHorizontal: 15, alignItems: 'center' }]}>
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <View style={{ width: 15 }}>
              <SettingBellicon />
            </View>
            <Text style={styles.sectionText}>Notifications</Text>
          </View>
          <TouchableOpacity onPress={handleNotification}>
            <ArrowIcon />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
      <View style={styles.horizontalLine} />
      <TouchableOpacity onPress={handleLanguage}>
        <View style={[globalStyle.justifyBetween, { paddingHorizontal: 15, alignItems: 'center' }]}>
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <View style={{ width: 15 }}>
              <SettingLanguage />
            </View>
            <Text style={styles.sectionText}>Language and region</Text>
          </View>
          <TouchableOpacity onPress={handleLanguage}>
            <ArrowIcon />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
      <View style={styles.horizontalLine} />
      <TouchableOpacity onPress={handlePassword}>
        <View style={[globalStyle.justifyBetween, { paddingHorizontal: 15, alignItems: 'center' }]}>
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <View style={{ width: 15 }}>
              <SettingChangePassword />
            </View>
            <Text style={styles.sectionText}>Change password</Text>
          </View>
          <TouchableOpacity onPress={handlePassword}>
            <ArrowIcon />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
      <View style={styles.horizontalLine} />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    backgroundColor: "#040B11",
    paddingTop: 30, // Add padding to the top
    width: "100%",
    height: '100%',
    gap: 15
  },
  sectionText: {
    color: "#FFF",
    fontSize: 14,
  },
  horizontalLine: {
    borderBottomColor: "#464646",
    borderBottomWidth: 1,
    width: "100%",
  },
});
export default SettingMain;






