import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text, TouchableOpacity, ScrollView } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import Toast from "react-native-toast-message";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { globalStyle } from "../../../assets/css/globalStyle";
import Api from "../../../api/api";

export default function LannguageRegion({ navigation }) {
  const [openLanguage, setOpenLanguage] = useState(false);
  const [valueLanguage, setValueLanguage] = useState('English (UK)');
  const [openTime, setOpenTime] = useState(false);
  const [valueTime, setValueTime] = useState('PT (Pacific Time)');
  const [openCountry, setOpenCountry] = useState(false);
  const [valueCountry, setValueCountry] = useState('United States Dollar (US)');
  const [languages, setLanguage] = useState([
    { label: 'English (UK)', value: 'English (UK)' },
    { label: 'Arabic', value: 'Arabic' },
    { label: 'French', value: 'French' },
    { label: 'Spanish', value: 'Spanish' },
    { label: 'English (US)', value: 'English (US)' },
    { label: 'Portuguese', value: 'Portuguese' },
    { label: 'Chinese', value: 'Chinese' },
  ]);
  const [times, setTimes] = useState([
    { label: 'PT (Pacific Time)', value: 'PT (Pacific Time)' },
    { label: '(MT) Mountain Time', value: '(MT) Mountain Time' },
    { label: '(CT) Central Time', value: '(CT) Central Time' },
    { label: '(ET) Eastern Time', value: '(ET) Eastern Time' },
  ]);
  const [country, setCountry] = useState([
    { label: 'United States Dollar (US)', value: 'United States Dollar (US)' },
    { label: 'Euro (EUR)', value: 'Euro (EUR)' },
    { label: 'Japanese yen (JYP)', value: 'Japanese yen (JYP)' },
    { label: 'Australian Dollar (AUD)', value: 'Australian Dollar (AUD)' },
    { label: 'Canadian Dollar (CAD)', value: 'Canadian Dollar (CAD)' },
    { label: 'Sterling (GBP)', value: 'Sterling (GBP)' },
    { label: 'Hong Kong Dollar (HKD)', value: 'Hong Kong Dollar (HKD)' },
  ]);

  const getInformation = async () => {
    try {
      const settings = await AsyncStorage.getItem("SETTING_LOCATION");
      const { language, time_zone, currency } = JSON.parse(settings);
      setValueLanguage(language);
      setValueTime(time_zone);
      setValueCountry(currency);
    } catch (e) { }
  }

  const handleConfirmationPress = async () => {
    try {
      let data = {
        "language": valueLanguage,
        "time_zone": valueTime,
        "currency": valueCountry
      }
      await AsyncStorage.setItem("SETTING_LOCATION", JSON.stringify(data));
      
      Toast.show({
        type: 'Capiwise_Success',
        position: "top",
        text1: "Successfully saved!",
      });
    } catch (e) { } finally { }
  }

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerBackVisible: false,
      headerTitle: () => (
        <TouchableOpacity onPress={() => navigation.goBack()} style={{...globalStyle.alignItemsCenter, gap: 15}}>
          <FontAwesome name="angle-left" size={28} color="white" />
          <Text style={{ color: "#FFF", fontSize: 24 }}>
            Language and region
          </Text>
        </TouchableOpacity>
      ),
      headerStyle: {
        backgroundColor: "#040B11",
      },
      headerTintColor: "#FFF",
    });

    getInformation()
  }, [navigation]);

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: 'column', gap: 27, paddingHorizontal: 15 }}>
        <View style={{ height: 70 }}>
          <Text style={{ color: '#2EBD85' }}>Language</Text>
          <DropDownPicker
            open={openLanguage}
            value={valueLanguage}
            items={languages}
            setOpen={setOpenLanguage}
            setValue={setValueLanguage}
            setItems={setLanguage}
            style={styles.dropdown}
            dropDownContainerStyle={styles.dropdownContainer}
            textStyle={styles.dropdownText}
          />
        </View>
        <View style={{ height: 70 }}>
          <Text style={{ color: '#2EBD85' }}>Time zone</Text>
          <DropDownPicker
            open={openTime}
            value={valueTime}
            items={times}
            setOpen={setOpenTime}
            setValue={setValueTime}
            setItems={setTimes}
            style={styles.dropdown}
            dropDownContainerStyle={styles.dropdownContainer}
            textStyle={styles.dropdownText}
          />
        </View>
        <View style={{ height: 70 }}>
          <Text style={{ color: '#2EBD85' }}>Currency</Text>
          <DropDownPicker
            open={openCountry}
            value={valueCountry}
            items={country}
            setOpen={setOpenCountry}
            setValue={setValueCountry}
            setItems={setCountry}
            style={styles.dropdown}
            dropDownContainerStyle={styles.dropdownContainer}
            textStyle={styles.dropdownText}
          />
        </View>
      </View>
      <TouchableOpacity
        onPress={handleConfirmationPress}
        style={{
          height: 48,
          marginHorizontal: 15,
          backgroundColor: "#2EBD85",
          marginTop: 80,
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 50,
          borderWidth: 1,
        }}
      >
        <Text style={{ color: "#FFF", fontSize: 16 }}>
          Save
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#040B11",
  },
  dropdownContainer: {
    backgroundColor: "#0B1620",
    borderWidth: 1,
    borderColor: "#979797",
    borderRadius: 8,
    marginTop: 10,
    zIndex: 3
  },
  dropdown: {
    marginTop: 10,
    backgroundColor: "#0B1620",
    borderWidth: 1,
    borderColor: "#979797",
    borderRadius: 8,
    zIndex: 0
  },
  dropdownText: {
    color: "white",
  },
});






