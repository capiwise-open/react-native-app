import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { globalStyle } from "../../assets/css/globalStyle"
import { KeyVector } from "../../assets/img/Constant"
import Toast from 'react-native-toast-message';
import Api from "../../api/api";
import { emailValidation } from "../../utils/utils";
import { ResetPasswordOutput, resetPassword } from "aws-amplify/auth";

export default function ResetPassword({ navigation, route }) {
  const [email, setEmail] = useState("");

  const handleResetPress = async () => {
    if (!emailValidation(email)) {
      Toast.show({
        type: 'Capiwise_Error',
        position: "top",
        text1: "",
        text2: "Please input email address correctly."
      });
      return
    }

    resetPassword({
      username: email
    }).then((value: ResetPasswordOutput) => {
      console.log(value);
      if (value.nextStep.resetPasswordStep === "CONFIRM_RESET_PASSWORD_WITH_CODE") {
        navigation.navigate("ChangePasswordByCode", { email });
      }
    })
  }

  return (
    <ScrollView contentContainerStyle={[globalStyle.scrollContainer, { paddingTop: 90 }]}>
      <View style={globalStyle.container}>
        <View style={globalStyle.justifyCenter}>
          <KeyVector />
        </View>
        <Text style={styles.title}>
          Reset password
        </Text>
        <Text style={{ fontSize: 16, marginTop: 20, color: '#979797', textAlign: 'center' }}>
          Just enter the email address you{"\n"}
          registered with and we‘ll send you a link{"\n"}
          to rest your password.
        </Text>
      </View>
      <TextInput
        style={styles.input}
        placeholder="Your email address"
        placeholderTextColor="#979797"
        autoCapitalize="none"
        value={email}
        onChangeText={(text) => setEmail(text)}
      />
      <TouchableOpacity
        style={[styles.submitBtn, { backgroundColor: email.length != 0 ? '#2EBD85' : '#979797' }]}
        onPress={handleResetPress}
        disabled={email.length == 0}
      >
        <Text style={{ color: "#FFF", fontSize: 16, fontWeight: "500" }}>
          Send password reset link
        </Text>
      </TouchableOpacity>
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
  input: {
    height: 50,
    borderColor: "#979797",
    borderWidth: 1,
    borderRadius: 8,
    marginTop: 30,
    paddingHorizontal: 10,
    marginHorizontal: 15,
    color: "#FFF",
    fontSize: 14
  },
  submitBtn: {
    marginHorizontal: 15,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 50,
    borderWidth: 1,
    backgroundColor: "#2EBD85",
    marginTop: 40
  },
});
