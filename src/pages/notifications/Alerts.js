import React, { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity, Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet } from "react-native";
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

const Alerts = ({ navigation }) => {
  const [isSlid, setIsSlid] = useState(false);
  const [isSlidEdit, setIsSlidEdit] = useState(false);
  const slideAnimation = new Animated.Value(0);
  const slideAnimationEdit = new Animated.Value(0);
  //   const navigation = useNavigation();
  const [isArrowVisible, setIsArrowVisible] = useState(true); // State to manage arrow visibility

  const handleCloseAccount = () => {
    // navigation.navigate(CloseAccount)
  };

  const handleNotification = () => {
    console.log("....");
    navigation.navigate("SettingNotifications");
  };

  const handleLanguage = () => {
    // Toggle the slide state
    setIsSlid(!isSlid);

    // Perform slide animation
    Animated.timing(slideAnimation, {
      toValue: isSlid ? 0 : 10, // Slide left if not already slid, else slide right
      duration: 300,
      useNativeDriver: true,
    }).start();
  };
  const handleHome = () => {
    navigation.navigate("Dashboard");
  };
  const handleEdit = () => {
    setIsArrowVisible(!isArrowVisible);
   // Toggle the slide state
   setIsSlidEdit(!isSlidEdit);

   // Perform slide animation
   Animated.timing(slideAnimationEdit, {
     toValue: isSlidEdit ? 0 : 10, // Slide left if not already slid, else slide right
     duration: 300,
     useNativeDriver: true,
   }).start();
 };
  const handlePassword = () => {
    console.log("....");
    navigation.navigate("SetNewPassword");
  };

  return (
    <View style={styles.container}>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <Text style={styles.sectionText}>Active alerts</Text>
        <Text style={styles.captionText}>
          Status
          <Text style={{ color: "#2EBD85" }}>&nbsp;Open</Text>
        </Text>
      </View>
      <TouchableOpacity onPress={handleEdit}>
        <Animated.View
          style={{
            transform: [
              {
                translateX: slideAnimationEdit.interpolate({
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
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            {/* Add your logo here */}
            <Microsoft />
            <View style={styles.textContainer}>
              <Text style={styles.sectionText}>MSFT alert is now closed</Text>
              <Text style={styles.captionText}>
                You were looking for a price above $155.00
              </Text>
              <View
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  flexDirection: "row",
                  paddingTop: 10,
                }}
              >
                <Text style={{ color: "#FFF", fontSize: 12 }}>
                  15/11/23, 11:20 AM
                </Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={handleEdit}
              style={{ marginBottom: 30 }}
            >
              {isArrowVisible && <ArrowIcon />}
            </TouchableOpacity>
          </View>

          {isSlidEdit && (
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <TouchableOpacity
                style={{
                  backgroundColor: "#2EBD85",
                  height: 100,
                  width: 80,
                  alignItems: "center",
                  //   marginHorizontal: 20,
                }}
                onPress={() => console.log("Edit pressed")}
              >
                <Text
                  style={{
                    color: "#FFF",
                    textAlign: "center",
                    textAlignVertical: "center",
                    paddingVertical: "50%",
                  }}
                >
                  Edit
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  backgroundColor: "#E2433B",
                  height: 100,
                  width: 80,
                  alignItems: "center",
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
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <Text style={[styles.sectionText, { marginTop: 30 }]}>
          Past 30 days
        </Text>
        <Text style={[styles.captionText, , { marginTop: 30 }]}>
          Status
          <Text style={{ color: "#E2433B" }}>&nbsp;Closed</Text>
        </Text>
      </View>

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
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            {/* Add your logo here */}
            <Microsoft />
            <View style={styles.textContainer}>
              <Text style={styles.sectionText}>MSFT alert is now closed</Text>
              <Text style={styles.captionText}>
                You were looking for a price above $155.00
              </Text>
              <View
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  flexDirection: "row",
                  paddingTop: 10,
                }}
              >
                <Text style={{ color: "#FFF", fontSize: 12 }}>
                  15/11/23, 11:20 AM
                </Text>
              </View>
            </View>
          </View>

          {isSlid && (
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <TouchableOpacity
                style={{
                  backgroundColor: "#E2433B",
                  height: 100,
                  width: 80,
                  alignItems: "center",
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
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#040B11",
    paddingHorizontal: 10, // Set consistent padding for left and right
    paddingTop: 30, // Add padding to the top
    width: "100%",
  },
  profilePictureContainer: {
    flexDirection: "row", // Change to row to align items horizontally
    alignItems: "center", // Center the items vertically
    marginBottom: 20,
  },
  arrowIcon: {
    width: "100%",
    marginBottom: 10,
    width: 14,
    height: 14,
    paddingRight: 2, // Add some margin for space between the icon and text
  },
  profilePicture: {
    marginTop: 10,
    width: 60,
    height: 40,
    borderRadius: 35,
    marginRight: 10,
  },
  profileDetails: {
    width: 344,
  },
  name: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 10,
    color: "#FFF",
    textAlign: "center",
    // paddingRight:6
  },
  caption: {
    textAlign: "justify",
    fontSize: 10,
    fontWeight: "400",
    marginBottom: 20,
    color: "#FFF",
    width: 353,
    paddingRight: 18,
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
  profile: {
    fontSize: 16,
    color: "#2EBD85",
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
export default Alerts;
