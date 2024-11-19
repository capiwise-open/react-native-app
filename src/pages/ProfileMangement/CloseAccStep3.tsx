import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { CloseAccountExclamation } from "../../assets/img/Constant"
import { globalStyle } from "../../assets/css/globalStyle";

export default function CloseAccStep3({ navigation }) {
  const handleClose = () => {
    navigation.navigate("CloseAccStep4");
  };
  const handleKeepAcc = () => {
    navigation.navigate("MainApp");
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
        <CloseAccountExclamation />
      </View>
      <View style={{ height: 300 }}>
        <Text style={styles.title}>
          You won‘t be able to open a new account
        </Text>
        <Text style={styles.subTitle}>
          For security, we let each customer have only one account, you‘ll need to
          reactivate your account to use us in the future.
        </Text>
      </View>
      <TouchableOpacity
        onPress={handleKeepAcc}
        style={styles.actionBtn}>
        <Text style={{ color: "#FFF", fontSize: 16 }}>Keep account open</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={handleClose}
        style={[styles.actionBtn, { backgroundColor: "transparent", borderWidth: 1, borderColor: '#FFF', marginTop: 20 }]}
      >
        <Text style={{ color: "#FFF", fontSize: 16 }}>
          Continue with account closure
        </Text>
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
  title: {
    color: "#FFF",
    fontWeight: '700',
    fontSize: 24,
    marginTop: 30,
    height: 60,
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
  passwordIcon: {
    width: 56,
    height: 56,
    marginTop: 60,
  }
});




