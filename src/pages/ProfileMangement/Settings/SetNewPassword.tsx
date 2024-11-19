import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Alert,
  TouchableOpacity,
  Image,
} from "react-native";

import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { globalStyle } from "../../../assets/css/globalStyle";
import { useNavigation } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import Api from "../../../api/api";
import { resetPassword, updatePassword } from "aws-amplify/auth";

export default function SetNewPassword({ route }) {
  const [showPassword1, setShowPassword1] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [showPassword3, setShowPassword3] = useState(false);
  const [newpassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [currentPassword, setcurrentPassword] = useState("");
  const navigation = useNavigation();
  const [passwordIcon1, setPasswordIcon1] = useState(
    require("../../../assets/img/show_pwd.png")
  );

  const [passwordIcon2, setPasswordIcon2] = useState(
    require("../../../assets/img/show_pwd.png")
  );

  const [passwordIcon3, setPasswordIcon3] = useState(
    require("../../../assets/img/show_pwd.png")
  );
  const toggleShowPassword1 = () => {
    setShowPassword1(!showPassword1);
    const newIcon = showPassword1
      ? require("../../../assets/img/show_pwd.png")
      : require("../../../assets/img/close_eye.png");

    setPasswordIcon1(newIcon);
  };
  const toggleShowPassword2 = () => {
    setShowPassword2(!showPassword2);
    const newIcon = showPassword2
      ? require("../../../assets/img/show_pwd.png")
      : require("../../../assets/img/close_eye.png");

    setPasswordIcon2(newIcon);
  };
  const toggleShowPassword3 = () => {
    setShowPassword3(!showPassword3);
    const newIcon = showPassword3
      ? require("../../../assets/img/show_pwd.png")
      : require("../../../assets/img/close_eye.png");

    setPasswordIcon3(newIcon);
  };

  const validatePassword = (str) => {
    if (str.length < 10) {
      return 0;
    }
    if (!/[a-z]/.test(str)) {
      return 0;
    }
    if (!/[A-Z]/.test(str)) {
      return 1;
    }
    if (!/\d/.test(str)) {
      return 1;
    }
    if (!/[!@#$%^&*()\-_=+{};:,<.>]/.test(str)) {
      return 2;
    }

    return 2;
  }

  const handleConfirmationPress = async () => {
    if (newpassword != confirmPassword) {
      Toast.show({
        type: 'Capiwise_Error',
        position: "top",
        text1: "",
        text2: `The password doesn't match.`
      });

      return
    }

    if (validatePassword(newpassword) != 2) {
      Toast.show({
        type: 'Capiwise_Error',
        position: "top",
        text1: "",
        text2: `To have a strong password it must contain${"\n"}a capital letter, a number and be minimum${"\n"}of 9 characters.`
      });

      return
    }

    updatePassword({
      oldPassword: currentPassword,
      newPassword: newpassword,
    }).then(() => {
      Toast.show({
        type: "Capiwise_Success",
        position: "top",
        text1: "",
        text2: "Password changed successfully."
      });
      navigation.goBack();
    }).catch(() => {
      Toast.show({
        type: 'Capiwise_Error',
        position: "top",
        text1: "",
        text2: "Current password is wrong."
      });
    });
  }

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerBackVisible: false,
      headerTitle: () => (
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ ...globalStyle.alignItemsCenter, gap: 15 }}>
          <FontAwesome name="angle-left" size={28} color="white" />
          <Text style={{ color: "#FFF", fontSize: 24 }}>
            Change password
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
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Current password</Text>
        <View style={styles.passwordInputContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Enter your current password"
            placeholderTextColor="#979797"
            secureTextEntry={!showPassword1}
            value={currentPassword}
            onChangeText={(text) => setcurrentPassword(text)}
          />
          <TouchableOpacity
            onPress={toggleShowPassword1}
          >
            <Image
              source={passwordIcon1}
              style={styles.passwordIcon}
            />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>New password</Text>
        <View style={styles.passwordInputContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Enter a new password"
            placeholderTextColor="#979797"
            secureTextEntry={!showPassword2}
            value={newpassword}
            onChangeText={(text) => setNewPassword(text)}
          />
          <TouchableOpacity
            onPress={toggleShowPassword2}
          >
            <Image
              source={passwordIcon2}
              style={styles.passwordIcon}
            />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Confirm new password</Text>
        <View style={styles.passwordInputContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Enter the new password"
            placeholderTextColor="#979797"
            secureTextEntry={!showPassword3}
            value={confirmPassword}
            onChangeText={(text) => setConfirmPassword(text)}
          />
          <TouchableOpacity
            onPress={toggleShowPassword3}
          >
            <Image
              source={passwordIcon3}
              style={styles.passwordIcon}
            />
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity
        onPress={handleConfirmationPress}
        disabled={currentPassword.length == 0 || newpassword.length == 0 || confirmPassword.length == 0}
        style={{
          height: 48,
          backgroundColor: currentPassword.length != 0 && newpassword.length != 0 && confirmPassword.length != 0 ? "#2EBD85" : '#979797',
          marginTop: 80,
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 50,
          borderWidth: 1,
        }}
      >
        <Text style={{ color: "#FFF", fontSize: 16 }}>
          Save
        </Text>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#040B11",
    paddingHorizontal: 15,
  },
  inputContainer: {
    marginTop: 0,
    marginBottom: 20,
  },
  label: {
    color: "#2EBD85",
    fontSize: 16,
  },
  passwordInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    height: 48,
    borderColor: "#979797",
    borderWidth: 1,
    borderRadius: 8,
    marginTop: 16,
    paddingHorizontal: 10,
    color: "#FFF",
  },
  passwordInput: {
    flex: 1,
    color: "#FFF",
    fontSize: 16
  },
  passwordIcon: {
    width: 18,
    height: 8,
    marginLeft: 8,
  },
});


