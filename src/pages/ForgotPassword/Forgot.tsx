import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { globalStyle } from "../../assets/css/globalStyle"

export default function Forgot({ route, navigation }) {
  const handleResetPress = () => {
    navigation.navigate("ResetPassword");
  };

  return (
    <ScrollView contentContainerStyle={[globalStyle.scrollContainer, { paddingTop: 90 }]}>
      <View style={globalStyle.container}>
        <Text style={styles.title}>
          I‘ve forgotten my password
        </Text>
        <Text style={{ fontSize: 16, marginTop: 20, color: '#979797', textAlign: 'center' }}>
          If you‘re logged out and can‘t remember{"\n"}
          your password, we can send you an {"\n"}
          email with a link to reset it.
        </Text>
        <TouchableOpacity
          style={[styles.submitBtn]}
          onPress={handleResetPress}
        >
          <Text style={{ color: "#FFF", fontSize: 16, fontWeight: "500" }}>
            Reset password
          </Text>
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
    textAlign: 'center'
  },
  submitBtn: {
    width: "100%",
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 50,
    borderWidth: 1,
    backgroundColor: "#2EBD85",
    marginTop: 30
  },
});
