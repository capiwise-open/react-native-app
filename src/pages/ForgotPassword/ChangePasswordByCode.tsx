import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { globalStyle } from "../../assets/css/globalStyle"
import Toast from 'react-native-toast-message';
import Api from "../../api/api";
import { Ionicons } from "@expo/vector-icons";
import { ResetPasswordOutput, confirmResetPassword, resetPassword } from "aws-amplify/auth";

export default function ChangePasswordByCode({ route, navigation }) {
  let totalSeconds = 116
  const [resendCode, setRecondCode] = useState(false)
  const email = route?.params?.email
  const [securityStatus, setSecurityStatus] = useState(0)
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordIcon, setPasswordIcon] = useState(
    require("../../assets/img/show_pwd.png")
  );
  const [currentSec, setCurrentSec] = useState('01:55');
  const [code, setCode] = useState("")
  const handleContinue = async () => {
    if (password != confirmPassword) {
      Toast.show({
        type: 'Capiwise_Error',
        position: "top",
        text1: "",
        text2: `The password doesn't match.`
      });
      return
    }

    let data = {
      "email": email,
      "confirmationCode": code,
      "newPassword": password
    }
    await confirmResetPassword({
      confirmationCode: code,
      newPassword: password,
      username: email
    }).then(() => {
      navigation.navigate("Confirmation");
    }).catch((e) => {
      Toast.show({
        type: 'Capiwise_Error',
        position: "top",
        text1: "",
        text2: JSON.stringify(e)
      });
    })
  }

  const handleResendCode = async () => {
    setRecondCode(false)
    resetPassword({
      username: email
    }).then((value: ResetPasswordOutput) => {
      totalSeconds = 116
      startDecrease()
    });
  }
  const validatePassword = (str: string) => {
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

  const handleChangePassword = (pwd: string) => {
    setSecurityStatus(validatePassword(pwd))
    setPassword(pwd)
  }

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
    const newIcon = showPassword
      ? require("../../assets/img/show_pwd.png")
      : require("../../assets/img/close_eye.png");

    setPasswordIcon(newIcon);
  };
  const startDecrease = () => {
    let timer = setInterval(function () {
      totalSeconds--;

      if (totalSeconds < 0) {
        clearInterval(timer);
        setRecondCode(true)
      } else {
        let minutes = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
        let seconds = String(totalSeconds % 60).padStart(2, '0')
        setCurrentSec(minutes + ':' + seconds)
      }
    }, 1000);
  }

  useEffect(() => {
    startDecrease()
  }, []);

  return (
    <ScrollView contentContainerStyle={[globalStyle.scrollContainer, { paddingTop: 30 }]}>
      <View style={globalStyle.container}>
        <Text style={styles.title}>
          Change password
        </Text>
        <View style={[globalStyle.flexRow, styles.subBackground, { gap: 5 }]}>
          <Ionicons
            name="alert-circle"
            size={24}
            color="#EDD375"
          />
          <Text style={styles.subTitle}>
            For security reasons, a verification PIN will be sent{"\n"}to
            <Text style={[styles.subTitle, { color: "#EDD375" }]}>{" "}{email}{" "}</Text>
            via email. Please use {"\n"}this PIN to complete the password change process.
          </Text>
        </View>
        <TextInput
          style={styles.input}
          placeholder="Verification code"
          placeholderTextColor="#979797"
          autoCapitalize="none"
          keyboardType="numeric"
          value={code}
          onChangeText={(text) => { setCode(text) }}
        />
        <Text style={{ color: securityStatus == 0 ? '#E2433B' : securityStatus == 1 ? '#FFA412' : '#2EBD85', textAlign: 'right', marginTop: 10 }}>
          {securityStatus == 0 ? 'Weak' : securityStatus == 1 ? 'Average' : 'Strong'}
        </Text>
        <View style={[globalStyle.alignItemsCenter, { marginTop: 5 }]}>
          <TextInput
            style={[styles.input, { marginTop: 0 }]}
            placeholder="Your password"
            placeholderTextColor="#979797"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={(text) => handleChangePassword(text)}
          />
          <TouchableOpacity onPress={toggleShowPassword}>
            <Image source={passwordIcon} style={{ width: 18, height: 9, marginLeft: -30 }} />
          </TouchableOpacity>
        </View>
        <View style={[globalStyle.justifyBetween, { marginTop: 10 }]}>
          <View style={{ height: 2, backgroundColor: securityStatus == 0 ? '#E2433B' : securityStatus == 1 ? '#FFA412' : '#2EBD85', width: '30%' }} />
          <View style={{ height: 2, backgroundColor: securityStatus == 1 ? '#FFA412' : securityStatus == 2 ? '#2EBD85' : '#979797', width: '30%' }} />
          <View style={{ height: 2, backgroundColor: securityStatus == 2 ? '#2EBD85' : '#979797', width: "30%" }} />
        </View>
        <Text style={{ color: '#979797', marginTop: 5 }}>
          To have a strong password it must contain a capital letter, a number and be minimum of 9 characters.
        </Text>
        <View style={[globalStyle.alignItemsCenter, { marginTop: 20 }]}>
          <TextInput
            style={[styles.input, { marginTop: 0 }]}
            placeholder="Confirm password"
            placeholderTextColor="#979797"
            secureTextEntry={!showPassword}
            value={confirmPassword}
            onChangeText={(text) => setConfirmPassword(text)}
          />
          <TouchableOpacity onPress={toggleShowPassword}>
            <Image source={passwordIcon} style={{ width: 18, height: 9, marginLeft: -30 }} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={handleContinue} style={[styles.continueBtn, { backgroundColor: securityStatus != 2 || code.length != 6 ? '#979797' : '#2EBD85' }]} disabled={securityStatus != 2 || code.length != 6}>
          <Text style={{ color: "#FFF", fontSize: 16 }}>Continue</Text>
        </TouchableOpacity>
        {!resendCode && (
          <Text style={{ color: "#979797", fontSize: 20, textAlign: 'center', marginTop: 20 }}>
            Resend code {currentSec}
          </Text>
        )}
        {resendCode && <Text
          style={styles.resendCode}
          onPress={handleResendCode}
        >
          I didn't receive a code
        </Text>}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  title: {
    color: "#FFF",
    fontWeight: 'bold',
    fontSize: 24,
    textAlign: 'center',
    marginTop: 30
  },
  subTitle: {
    color: '#FFF',
    fontSize: 12,
    textAlign: 'justify'
  },
  subBackground: {
    marginTop: 30,
    backgroundColor: '#2A2C29',
    borderRadius: 10,
    padding: 10
  },
  input: {
    height: 50,
    borderColor: "#979797",
    borderWidth: 1,
    borderRadius: 8,
    marginTop: 30,
    width: '100%',
    paddingHorizontal: 10,
    color: "#FFF",
  },
  continueBtn: {
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 50,
    marginTop: 60
  },
  resendCode: {
    textDecorationLine: "underline",
    textAlign: 'center',
    color: "#FFF",
    fontSize: 14,
    marginTop: 20
  }
});
