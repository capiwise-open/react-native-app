import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import DropDownPicker from "react-native-dropdown-picker";
import Api from "../../../api/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function AddLocation({route}) {
  const [openTime, setOpenTime] = useState(false);
  const [cityName, setCityName] = useState("");
  const [cities, setCities] = useState([]);
  const navigation = useNavigation();

  const handleCancel = () => {
    setCityName("");
    setOpenTime(false);
    navigation.navigate("AccountMain")
  };
  const handleSave = async() => {
    let data = {
      "email": route?.params?.email,
      "key": "location",
      "value": cityName
    }

    await Api.updateAttributes(data)
    .then(async(res) => {
      if(res.status == "success"){        
        await AsyncStorage.setItem("address", cityName);
        navigation.navigate("AccountMain")
      }
      else
        Toast.show({
          type: 'Capiwise_Error',
          position:"top",
          text1: "",
          text2: res.message
        });
    })
    .catch(e => console.log(e))
  };
  const fetchCitiesData = async () => {
    try {
      const response = await fetch(
        "https://countriesnow.space/api/v0.1/countries/states"
      );
      const data = await response.json();
      const combinedData = data.data.reduce((acc, country) => {
        const combinedNames = country.states.map((state) => `${state.name} , ${country.name}`);
        return [...acc, ...combinedNames];
      }, []);

      const uniqueNames = [...new Set(combinedData)];
      const formattedCities = uniqueNames.map((name) => ({
        label: name,
        value: name,
      }));
      setCities(formattedCities);
    } catch (error) {
      console.error("Error fetching cities data:", error);
    }
  };

  useEffect(() => {
    fetchCitiesData();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.button}>
        <TouchableOpacity onPress={handleCancel} style={styles.button}>
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleSave} style={styles.button}>
          <Text style={[styles.buttonText, { color: cityName.length == 0 ? '#FFF' : '#2EBD85' }]}>Done</Text>
        </TouchableOpacity>
      </View>
      <DropDownPicker
        open={openTime}
        value={cityName}
        items={cities}
        setOpen={setOpenTime}
        setValue={setCityName}
        placeholder={"Select your location"}
        containerStyle={{
          flex: 1,
          flexDirection: 'column',
          marginTop: 10,
          zIndex: 3000,
          width: "100%",
          padding: 10,
          paddingHorizontal:15,
        }}
        style={{
          width: "100%",
          padding: 10,
          backgroundColor: "#0B1620",
          borderWidth: 1,
          borderColor: "#979797",
          borderRadius: 8,
          paddingHorizontal:15,
        }}
        dropDownContainerStyle={{
          backgroundColor: "#0B1620",
          borderWidth: 1,
          borderColor: "#979797",
          borderRadius: 8,
          marginHorizontal:15,
          marginTop: 10
        }}
        zIndex={-2000}
        theme="DARK"
        listMode="FLATLIST"
        textStyle={styles.dropdownText}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#040B11",
    marginTop: 0,
  },
  button: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 20,
    paddingHorizontal:15
  },
  buttonText: {
    fontSize: 16,
    color: "#2EBD85",
    fontWeight: "400",
    letterSpacing: 1,
  },
  dropdownText: {
    color: "white",
  },
});