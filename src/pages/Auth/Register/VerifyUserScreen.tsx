import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
} from "react-native";

import { globalStyle } from "../../../assets/css/globalStyle"
import Api from "../../../api/api";
import Toast from 'react-native-toast-message';
import { ConfirmSignUpInput, ConfirmSignUpOutput, confirmSignUp, resendSignUpCode } from "aws-amplify/auth";

export default function VerifyUserScreen({ navigation, route }) {
  const { email } = route.params || {};
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);
  const [currentSec, setCurrentSec] = useState('01:55');
  const [resendCode, setRecondCode] = useState(false)
  const [fullFiled, setFullFiled] = useState(false)

  let totalSeconds = 116

  const focusInput = (index) => {
    inputRefs.current[index].focus();
  };
  const handleResendCode = async () => {
    setRecondCode(false)
    resendSignUpCode({
      username: email
    })
  }
  const handleInputChange = (index, value) => {
    const newOtp = [...otp];
    newOtp[index] = value;

    if (index < 5 && value !== "") {
      focusInput(index + 1);
    }

    setOtp(newOtp);
    let count = 0
    newOtp.forEach(item => {
      if (item != "")
        count++
    })

    if (count == 6)
      setFullFiled(true)
    else
      setFullFiled(false)
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
  const handleProfilePress = async () => {
    let code = ''
    otp.forEach(c => {
      code += c
    })

    let params = {
      "email": email,
      "verificationCode": code
    }

    confirmSignUp({
      username: email,
      confirmationCode: code
    }).then((value: ConfirmSignUpOutput) => {
      console.log(value)
      if (value.isSignUpComplete) {
        navigation.navigate("Login");
      }
    }).catch((reason: any) => {
      console.log(reason)
      Toast.show({
        type: 'Capiwise_Error',
        position: "top",
        text1: "",
        text2: `The code you entered is incorrect.${"\n"}please double-check the code sent to your email.`
      });
    });
  }

  const handleKeyPress = (index, e) => {
    if (e.key == "Backspace") {
      if (index > 0)
        focusInput(index - 1);
    }
  }
  useEffect(() => {
    startDecrease()
  }, []);

  return (
    <ScrollView contentContainerStyle={globalStyle.scrollContainer}>
      <View style={[globalStyle.justifyBetween, globalStyle.flexColumn, { height: '100%' }]}>
        <View style={globalStyle.container}>
          <Text style={styles.title}>Verify your email</Text>
          <Text style={{ fontSize: 16, marginTop: 20, color: '#FFF', textAlign: 'center' }}>
            You will receive an email containing a verification PIN at email{"\n"}{email}
          </Text>
          <View style={[globalStyle.justifyCenter, { gap: 5, marginTop: 20 }]}>
            {otp.map((digit, index) => (
              <View key={index}>
                <TextInput
                  ref={(ref) => (inputRefs.current[index] = ref)}
                  style={[styles.otpInput, { borderColor: digit != '' ? '#2EBD85' : 'transparent' }]}
                  placeholder=""
                  keyboardType="numeric"
                  maxLength={1}
                  value={digit}
                  onChangeText={(value) => handleInputChange(index, value)}
                  onKeyPress={({ nativeEvent }) => handleKeyPress(index, nativeEvent)}
                />
              </View>
            ))}
          </View>
          <View style={{ flexDirection: 'column', gap: 50, marginTop: 30, }}>
            {!resendCode && (
              <Text style={{ color: "#979797", fontSize: 20, textAlign: 'center' }}>
                Resend code {currentSec}
              </Text>
            )}
            <TouchableOpacity
              style={[styles.submitBtn, { backgroundColor: fullFiled ? "#2EBD85" : "#979797" }]}
              onPress={handleProfilePress}
              disabled={!fullFiled}
            >
              <Text style={{ color: "#FFF", fontSize: 16, fontWeight: "500" }}>
                Submit
              </Text>
            </TouchableOpacity>
            {resendCode && <Text
              style={styles.resendCode}
              onPress={handleResendCode}
            >
              I didn't receive a code
            </Text>}
          </View>
        </View>
        <Text
          style={{
            textAlign: 'center',
            fontWeight: "400",
            fontSize: 10,
            color: "#979797",
          }}>
          It helps us keep your account secure.&nbsp;
          <Text style={{
            fontWeight: "600",
            textDecorationLine: "underline",
            fontSize: 10,
            color: "#FFF"
          }}>
            Learn more
          </Text>
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  title: {
    color: "#FFF",
    fontWeight: 'bold',
    fontSize: 24,
    marginTop: '30%',
    textAlign: 'center'
  },
  otpInput: {
    width: 54,
    height: 78,
    fontSize: 48,
    color: "#FFF",
    textAlign: "center",
    backgroundColor: '#0B1620',
    borderRadius: 5,
    borderWidth: 1
  },
  submitBtn: {
    width: "100%",
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 50,
    borderWidth: 1,
  },
  resendCode: {
    textDecorationLine: "underline",
    textAlign: 'center',
    color: "#FFF",
    fontSize: 14,
  }
});
