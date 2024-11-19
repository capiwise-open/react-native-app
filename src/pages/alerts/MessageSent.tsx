import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { CheckVector } from '../../assets/img/Constant'

export default function MessegeSent({ navigation }) {
  const handleDashboard = () => {
    navigation.navigate("MainApp");
  };

  return (
    <View style={styles.container}>
      <View style={styles.passwordIcon}>
        <CheckVector />
      </View>
      <Text
        style={{
          textAlign: "center",
          color: "#FFF",
          fontWeight: "700",
          fontSize: 24,
          marginTop: 30,
        }}
      >
        Message sent
      </Text>
      <Text
        style={{
          color: "#FFF",
          fontSize: 16,
          marginTop: 20,
          marginBottom: 10,
          textAlign: "center",
        }}
      >
        We have received your message and one of our advisors will answer your question as soon as possible via email.
      </Text>
      <TouchableOpacity
        onPress={handleDashboard}
        style={styles.actionBtn}
      >
        <Text style={{ color: "#FFF", fontSize: 16 }} >Done</Text>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#040B11",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingHorizontal: 20,
    marginTop: 0,
  },
  svgWrapper: {
    marginBottom: 1,
    marginLeft: 1,
  },
  input: {
    height: 40,
    borderColor: "#979797",
    borderWidth: 1,
    borderRadius: 8,
    marginTop: 30,
    paddingHorizontal: 10,
    width: 338,
    color: "#FFF",
  },
  passwordInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    height: 40,
    borderColor: "#979797",
    borderWidth: 1,
    borderRadius: 8,
    marginTop: 25,
    paddingHorizontal: 10,
    width: 338,
    color: "#FFF",
  },
  passwordInput: {
    flex: 1,
    color: "#FFF",
  },
  passwordIcon: {
    marginTop: 170,
    width: 68,
    height: 51
  },
  actionBtn: {
    height: 50,
    backgroundColor: "#2EBD85",
    marginTop: 113,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 50,
    borderWidth: 0,
    width: '100%'
  },
});