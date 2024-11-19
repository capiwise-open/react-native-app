import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Alert,
  TouchableOpacity,
  Image
} from "react-native";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { ToolVector } from "../../assets/img/Constant"
import { globalStyle } from "../../assets/css/globalStyle";

export default function CloseAccStep2({ navigation, route }) {
  const handleContactUs = () => {
    navigation.navigate("ContactUs")
  }
  const handleCloseAccount = () => {
    navigation.navigate("CloseAccStep3")
  }

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerBackVisible: false,
      headerTitle: () => (
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ ...globalStyle.alignItemsCenter, gap: 15 }}>
          <FontAwesome name="angle-left" size={28} color="white" />
          <Text style={{ color: "#FFF", fontSize: 24 }}>
            Close account
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
      <View style={styles.passwordIcon}>
        <ToolVector />
      </View>
      <View style={{ height: 300 }}>
        <Text style={styles.title}>
          Before you go
        </Text>
        <Text style={styles.subTitle}>
          If you‘re having issues with your account, or want to update your
          account information, you can edit your account details (simply use our
          Contact Us form for assistance).
        </Text>
        <Text style={styles.subTitle}>
          If you still want to leave, we need to explain what‘s going to happen
          after your delete your account.
        </Text>
      </View>
      <TouchableOpacity
        onPress={handleContactUs}
        style={styles.actionBtn}
      >
        <Text style={{ color: "#FFF", fontSize: 16 }}>Contact Us</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={handleCloseAccount}
        style={[styles.actionBtn, { backgroundColor: "transparent", borderWidth: 1, borderColor: '#FFF', marginTop: 20 }]}
      >
        <Text style={{ color: "#FFF", fontSize: 16 }}>Continue with account closure</Text>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  title: {
    color: "#FFF",
    fontWeight: '700',
    fontSize: 24,
    marginTop: 30,
    textAlign: "center",
  },
  subTitle: {
    color: "#FFF",
    fontSize: 16,
    marginTop: 20,
    fontWeight: 'normal',
    marginBottom: 10,
    textAlign: "center",
  },
  actionBtn: {
    height: 50,
    backgroundColor: "#2EBD85",
    marginTop: 50,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 50,
    borderWidth: 0,
    width: '100%'
  },
  container: {
    flex: 1,
    backgroundColor: "#040B11",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingHorizontal: 20,
    marginTop: 0,
  },
  passwordIcon: {
    width: 56,
    height: 56,
    marginTop: 60,
  }
});





















