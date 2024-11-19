import React from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Image } from "react-native";
import { CheckVector } from "../../assets/img/Constant";
import { useNavigation } from "@react-navigation/native";
import { globalStyle } from "../../assets/css/globalStyle"

export default function Confirmation({ navigation }) {

  const handleLoginScreen = () => {
    navigation.navigate("Login");
  };

  return (
    <ScrollView contentContainerStyle={[globalStyle.scrollContainer, { paddingTop: 90 }]}>
      <View style={globalStyle.container}>
        <View style={globalStyle.justifyCenter}>
          <CheckVector />
        </View>
        <Text style={styles.title}>
          Confirm your password change
        </Text>
        <Text style={styles.subTitle}>
          Your password has been reset successfully!{"\n"} Now login with your new
          password.
        </Text>
        <TouchableOpacity
          onPress={handleLoginScreen}
          style={styles.continueBtn}
        >
          <Text style={{ color: "#FFF", fontSize: 16 }} >Login</Text>
        </TouchableOpacity>
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
    textAlign: 'center',
    marginTop: 30
  },
  continueBtn: {
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 50,
    marginTop: 60,
    backgroundColor: '#2EBD85'
  },
});
