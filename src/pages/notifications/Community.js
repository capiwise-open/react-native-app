import React, { useEffect, useState } from "react";
import {
  View,
  useWindowDimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  Animated,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TextInput } from "react-native-paper";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import { Image } from "react-native";
import {
  SettingBellicon,
  SettingLanguage,
  SettingChangePassword,
  ArrowIcon,
  Amazon,
  Apple,
  Meta,
  Microsoft,
  Tesla,
} from "../../assets/img/Constant";
export default function Community() {
  const [timeZoneAPi, settimeZoneAPi] = useState([]);
  const [openLanguage, setOpenLanguage] = useState(false);
  const [valueLanguage, setValueLanguage] = useState("english"); // Set default value
  const [language, setLanguage] = useState([
    { label: "English (UK)", value: "english" },
  ]);
  const [isFollowed, setIsFollowed] = useState(false);
  const [isSlid, setIsSlid] = useState(false);
  const slideAnimation = new Animated.Value(0);
  const [text, setText] = useState("");

  const handleHome = () => {
    navigation.navigate("Dashboard");
  };
  const handlePassword = () => {
    console.log("....");
    navigation.navigate("SetNewPassword");
  };
  const handleFollowToggle = () => {
    setIsFollowed(!isFollowed);
  };
  const handleLanguage = () => {
    setIsArrowVisible(!isArrowVisible);
    // Toggle the slide state
    setIsSlid(!isSlid);

    // Perform slide animation
    Animated.timing(slideAnimation, {
      toValue: isSlid ? 0 : 10, // Slide left if not already slid, else slide right
      duration: 300,
      useNativeDriver: true,
    }).start();
  };
  const [openSignal, setOpenSignal] = useState(false);
  const [valueSignal, setValueSignal] = useState("");
  const [signal, setSignal] = useState([
    { label: "Price", value: "Price" },
    { label: "Price % Change (Daily)", value: "percent" },
  ]);
  const [openCondition, setOpenCondition] = useState(false);
  const [valueCondition, setValueCondition] = useState("");
  const [condition, setCondition] = useState([
    { label: "Is above", value: "above" },
    { label: "Is below", value: "below" },
  ]);
  const [isArrowVisible, setIsArrowVisible] = useState(true); // State to manage arrow visibility

  const fetchCitiesData = async () => {
    try {
      const response = await fetch("https://worldtimeapi.org/api/timezone");
      const data = await response.json();
      //   const mappedData = data.map((timezone) => ({ label: timezone, value: timezone }));
      //  console.log("....dtaa...",data)
      settimeZoneAPi(data);
    } catch (error) {
      console.error("Error fetching cities data:", error);
    }
  };

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      // title: "Watchlist",

      headerTitle: () => (
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={{ color: "#FFF", fontSize: 24, marginLeft: -25 }}>
            Notification
          </Text>
        </TouchableOpacity>
      ),
      headerStyle: {
        backgroundColor: "#040B11",
      },
      headerTintColor: "#FFF",
      // headerLeft: () => (
      //   <Ionicons
      //     name="chevron-back-outline"
      //     size={24}
      //     color="#FFF"
      //     onPress={() => navigation.goBack()}
      //   />
      // ),
    });
  }, [navigation]);
  // console.log("....dtaa...",timeZoneAPi)

  const mappedTimeZones = timeZoneAPi.map((timezone) => ({
    label: timezone,
    value: timezone,
  }));
  const route = useRoute();

  // Access the data passed from ScreenA
  const layout = useWindowDimensions();
  const navigation = useNavigation();

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: "first", title: "During one day" },
    { key: "second", title: "GTC" },
    // { key: 'fourth', title: 'Dividend' },
    // { key: 'fifth', title: 'Technical Analysis' },
  ]);
  const handleNotification = () => {
    console.log("....");
    navigation.navigate("SettingNotifications");
  };
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleLanguage}>
        <Animated.View
          style={{
            transform: [
              {
                translateX: slideAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, -100], // Slide left by 100 units
                }),
              },
            ],
            flexDirection: "row",
            justifyContent: "space-around",
            alignItems: "center",
            padding: 10,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 10,
            }}
          >
            {/* Add your logo here */}
            <Image
              source={require("../../assets/img/user_photo.png")}
              style={styles.icon}
            />
            <View style={styles.textContainer}>
              <Text
                style={[
                  styles.captionText,
                  { color: "#FFF", fontWeight: "bold" },
                ]}
              >
                Robert Jin{" "}
                <Text style={{ fontWeight: "300" }}>@robertinvest</Text>
              </Text>
              <Text style={[styles.sectionText, { marginTop: 5 }]}>
                is now following you
              </Text>
              <View
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  flexDirection: "row",
                  //   paddingTop: 10,
                }}
              >
                <Text style={{ color: "#FFF", fontSize: 12, marginTop: 5 }}>
                  15/11/23, 11:20 AM
                </Text>
                <TouchableOpacity
                  style={{
                    width: 100,
                    height: 25,
                    backgroundColor: isFollowed ? "#2EBD85" : "#0F69FE", // Change color based on isFollowed state
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 50,
                    borderWidth: 1,
                  }}
                  onPress={handleFollowToggle}
                >
                  <Text style={{ color: "#FFF", fontSize: 15 }}>
                    {isFollowed ? "Unfollow" : "Follow"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <TouchableOpacity
              onPress={handleNotification}
              style={{ marginBottom: 30 }}
            >
              {isArrowVisible && <ArrowIcon />}
            </TouchableOpacity>
          </View>

          {isSlid && (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <TouchableOpacity
                style={{
                  backgroundColor: "#E2433B",
                  height: 100,
                  width: 80,
                  alignItems: "center",
                  marginHorizontal: 20,
                }}
                onPress={() => console.log("Delete pressed")}
              >
                <Text
                  style={{
                    color: "#FFF",
                    textAlign: "center",
                    textAlignVertical: "center",
                    paddingVertical: "50%",
                  }}
                >
                  Delete
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </Animated.View>
      </TouchableOpacity>

      <View style={styles.horizontalLine} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#040B11",
    justifyContent: "flex-start",
  },
  containerBar: {
    container: {
      width: "100%",
      backgroundColor: "#040B11",
      paddingHorizontal: 20,
      justifyContent: "flex-start",
    },
  },
  tabBar: {
    // paddinLeft:20,
    backgroundColor: "#0B1620", // Set background color to transparent
    elevation: 0, // Remove shadow on Android
    shadowOpacity: 0, // Remove shadow on iOS
    borderRadius: 40,
  },
  indicator: {
    backgroundColor: "#2EBD85", // Set indicator color
    height: 50,
    width: 150,
    borderRadius: 40,
  },
  label: {
    textTransform: "none",
    fontWeight: "normal",
    color: "#FFF", // Default text color
    fontSize: 15,
    width: 180, // Set the width of the label
    textAlign: "center", // Center the text within the label
  },
  bottomContainer: {
    position: "absolute",
    height: 70,
    width: "100%",
    padding: 10,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#0B1620",
    paddingHorizontal: 20,
    paddingBottom: 10, // Add padding if necessary
  },
  navigation: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  navigationText: {
    color: "white",
    fontSize: 12,
    fontWeight: "regular",
  },
  navigationItem: {
    alignItems: "center",
  },
  icon: {
    width: 30,
    height: 30,
    marginTop: 2,
    marginBottom: 5, // Adjust the spacing between icon and text
  },
  heading: {
    color: "#FFF",
    fontFamily: "Roboto",
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 20,
  },
  flex: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  inputContainer: {
    // paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: "#040B11",
    color: "#FFF",
    marginTop: 16,
    borderBottomColor: "#000000",
  },
  input: {
    height: 40,
    borderColor: "gray",
    color: "white",
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 5,
    backgroundColor: "#040B11",
    borderBottomColor: "#000000",
  },
  dropdownContainer: {
    borderWidth: 1,
    borderColor: "#979797",
    borderRadius: 8,
    marginVertical: 10,
    zIndex: 2000,
    backgroundColor: "#FFF",
  },
  dropdown: {
    backgroundColor: "#040B11",
  },
  fixedContainer: {
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#979797",
    borderRadius: 8,
    paddingVertical: 15,
    paddingHorizontal: 15,
    zIndex: 6000,
    backgroundColor: "#0B1620",
  },
  dropdownText: {
    color: "black",
  },
  sectionContainer: {
    width: "100%",
    flexDirection: "row-reverse", // Changed to 'row' to align items horizontally
    alignItems: "center",
    marginTop: 20,
  },
  textContainer: {
    flexDirection: "column", // Set flexDirection to 'column'
    // marginLeft: 10, // Add some margin for space between the icon and text
    flex: 1, // Allow text to take the remaining space
  },
  sectionText: {
    marginBottom: 5,
    color: "#FFF",
    fontSize: 14,
  },
  captionText: {
    color: "#686868",
    fontSize: 12,
  },
  horizontalLine: {
    marginTop: 10,
    borderBottomColor: "#464646",
    borderBottomWidth: 1,
    width: "100%",
  },
});
