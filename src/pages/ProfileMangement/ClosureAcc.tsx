import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ClosureAcc({ navigation }) {
  const handleLoginScreen = () => {
    AsyncStorage.clear();
    navigation.navigate("Splash");
  };
  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/img/checkvector.png")}
        style={styles.passwordIcon}
      />
      <Text style={styles.title}>
        Your account is now closed
      </Text>
      <Text style={styles.subTitle}>
        If you‘d like to reopen your account in the future you‘d need to contact us.
      </Text>
      <TouchableOpacity
        onPress={handleLoginScreen}
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
    backgroundColor: "#23341B",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingHorizontal: 20,
    marginTop: 0,
  },
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
    marginTop: 113,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 50,
    borderWidth: 0,
    width: '100%'
  },
  passwordIcon: {
    width: 68,
    height: 51,
    marginTop: 130,
  }
});






