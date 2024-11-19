import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { RadioButton } from "react-native-paper";
import styles from "./ProfileCss/CloseAccountCss";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { globalStyle } from "../../assets/css/globalStyle";
import { deleteUser } from "aws-amplify/auth";

export default function CloseAccount({ navigation, route }) {
  const [selectedOption, setSelectedOption] = useState(null);
  const handleRadioButtonPress = (option) => {
    setSelectedOption(option);
  };

  const renderRadioButton = (option) => (
    <View style={[styles.radioButton, { borderColor: selectedOption === option ? "#2EBD85" : "#FFF" }]}>
      <RadioButton.Android
        color="#2EBD85"
        uncheckedColor="#FFF"
        status={selectedOption === option ? "checked" : "unchecked"}
        onPress={() => handleRadioButtonPress(option)} // Ensure onPress is handled here as well
      />
    </View>
  );

  const handleGetStartedPress = async () => {
    navigation.navigate("CloseAccStep2");
  };
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
      <View style={styles.profileDetails}>
        <Text style={styles.name}>
          Before you go, tell us why you're leaving
        </Text>
        <Text style={styles.profile}>Choose one of the options</Text>
      </View>
      <View style={styles.optionsContainer}>
        <Text style={styles.leftText}>Problems with my account</Text>
        <View style={styles.radioContainer}>
          {renderRadioButton("Option1")}
        </View>
      </View>

      <View style={styles.optionsContainer}>
        <Text style={styles.leftText}>Couldn‘t find the stocks I wanted</Text>
        <View style={styles.radioContainer}>
          {renderRadioButton("Option2")}
        </View>
      </View>

      <View style={styles.optionsContainer}>
        <Text style={styles.leftText}>I want to change my account details</Text>
        <View style={styles.radioContainer}>
          {renderRadioButton("Option3")}
        </View>
      </View>

      <View style={styles.optionsContainer}>
        <Text style={styles.leftText}>I‘m not using my account anymore</Text>
        <View style={styles.radioContainer}>
          {renderRadioButton("Option4")}
        </View>
      </View>

      <View style={styles.optionsContainer}>
        <Text style={styles.leftText}>Other reasons</Text>
        <View style={styles.radioContainer}>
          {renderRadioButton("Option5")}
        </View>
      </View>

      <TouchableOpacity
        style={[localStyles.closeBtn, { backgroundColor: selectedOption == null ? '#979797' : '#2EBD85' }]}
        onPress={handleGetStartedPress}
        disabled={selectedOption == null ? true : false}
      >
        <Text style={{ color: "#FFF", fontSize: 16 }}>Close Account</Text>
      </TouchableOpacity>
    </View>
  );
};

const localStyles = StyleSheet.create({
  closeBtn: {
    height: 50,
    backgroundColor: "#2EBD85",
    marginTop: 113,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 50,
    borderWidth: 0,
  }
})