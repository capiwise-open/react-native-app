import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import { useNavigation } from "@react-navigation/native";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { CloseAccountGraph } from "../../assets/img/Constant"
import { globalStyle } from "../../assets/css/globalStyle";
import Api from "../../api/api";
import Toast from "react-native-toast-message";
import { deleteUser } from "aws-amplify/auth";

export default function CloseAccStep4({ navigation }) {
  const handleDeleteUser = async () => {
    deleteUser();
    navigation.navigate('ClosureAcc');
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
        <CloseAccountGraph />
      </View>
      <View style={{ height: 300 }}>
        <Text style={styles.title}>
          You‘ll lose access to your activities and stock portfolio history
        </Text>
        <Text style={styles.subTitle}>
          By law, we‘re obliged to delete your data, but you‘ll no longer have
          access to your Capiwise activity and transaction history.
        </Text>
      </View>
      <TouchableOpacity
        onPress={handleKeepAcc}
        style={styles.actionBtn}
      >
        <Text style={{ color: "#FFF", fontSize: 16 }}>Keep account open</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={handleDeleteUser}
        style={[styles.actionBtn, { backgroundColor: "transparent", borderWidth: 1, borderColor: '#E2433B', marginTop: 20 }]}
      >
        <Text style={{ color: "#E2433B", fontSize: 16 }}>
          Close Account
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