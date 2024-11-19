import React, { memo, useCallback, useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity, Animated, SafeAreaView, ScrollView, TouchableHighlight } from "react-native";
import { FontAwesome, FontAwesome5, Ionicons } from "@expo/vector-icons";
import { StyleSheet } from "react-native";
import {
  Amazon,
} from "../../assets/img/Constant";
import { colors, globalStyle } from "../../assets/css/globalStyle";
import { useGetAlertsQuery, useGetProfileQuery } from "../../api";
import { StatusBar } from "react-native";
import EmptyScreen from "../inbox/EmptyScreen";
import { ListItem } from "react-native-elements";
import Loading from "../../components/loading/Loading";
import { Button, TouchableRipple } from "react-native-paper";
import SelectDropdown from "react-native-select-dropdown";
import InboxClosedItem from "../../components/alerts/InboxClosedItem";
import InboxOpenItem from "../../components/alerts/InboxOpenItem";
import { NavigationProp, useFocusEffect, useIsFocused, useNavigation } from "@react-navigation/native";
import { RootStackParams } from "../../navigation/props";
import { AlertData } from "../../api/types";
import { useGetNotificationQuery } from "../../api/notifications";
import { userApi } from "../../api/profile";
import { useDispatch } from "react-redux";
import SwipeableFlatList from 'react-native-swipeable-list';



const ManageAlerts = () => {
  const navigation = useNavigation<NavigationProp<RootStackParams>>();
  const { data: user } = useGetProfileQuery({});
  const { data: alertsData } = useGetAlertsQuery({ status: true });
  const { data: inactiveAlertsData } = useGetAlertsQuery({ status: false });
  const { data: notifications } = useGetNotificationQuery({ email: user?.email });
  const dispatch = useDispatch();

  useFocusEffect(
    useCallback(() => {
      dispatch(userApi.util.invalidateTags(["Profile"]));
    }, [])
  )

  const expiredDateRange = [
    { label: "Past 10 days", day: 10 },
    { label: "Past 30 days", day: 30 },
    { label: "Past 60 days", day: 60 },
    { label: "Past 90 days", day: 90 },
    { label: "Year to date", day: 1000 },
  ];

  const [expDateRange, setExpDateRange] = useState<number>(1000);

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerBackVisible: false,
      headerTitle: () => (
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ ...globalStyle.alignItemsCenter, gap: 15 }}>
          <FontAwesome name="angle-left" size={28} color="white" />
          <Text style={{ color: "#FFF", fontSize: 24 }}>
            Alerts
          </Text>
        </TouchableOpacity>
      ),
      headerStyle: {
        backgroundColor: "#040B11",
      },
      headerTintColor: "#FFF",
    });
  }, [navigation]);

  return <SafeAreaView style={styles.body}>
    <StatusBar backgroundColor={'#0B1620'} />
    {
      ((!!alertsData && alertsData.length > 0) || (!!inactiveAlertsData && inactiveAlertsData.length > 0))
        ? <ScrollView style={styles.container}>
          {/* Active Alerts */}
          <View style={styles.sectionHeader} >
            <Text style={styles.sectionText}>Active alerts</Text>
            <Text style={styles.captionText}>
              Status •
              <Text style={{ color: "#2EBD85" }}>&nbsp;Open</Text>
            </Text>
          </View>
          {
            alertsData?.map((alert: AlertData, index: number) => {
              return <InboxOpenItem alert={alert} key={index} />
            })
          }
          {/* <View style={styles.horizontalLine} /> */}
          {/* Inactive Alerts */}
          <View style={[styles.sectionHeader, { marginVertical: 15 }]} >

            <SelectDropdown
              data={expiredDateRange}
              onSelect={(selectedItem) => setExpDateRange(selectedItem.day)}
              renderButton={(selectedItem, isOpened) => {
                return (
                  <View style={{}}>
                    <Text style={[styles.sectionText, { marginTop: 0 }]}>
                      {selectedItem?.label || "Year to date"} <FontAwesome style={{ paddingTop: 5 }} name="angle-down" size={16} color="white" />
                    </Text>
                  </View>
                );
              }}
              renderItem={(item, index, isSelected) => {
                return (
                  <View key={index} style={{ ...styles.dropdownItemStyle, ...(isSelected && { backgroundColor: '#D2D9DF' }) }}>
                    <Text style={styles.dropdownItemTxtStyle}>{item.label}</Text>
                  </View>
                );
              }}
              dropdownStyle={styles.dropdownMenuStyle}
            />

            <Text style={[styles.captionText, , { marginTop: 0 }]}>
              Status •
              <Text style={{ color: "#E2433B" }}>&nbsp;Closed</Text>
            </Text>
          </View>
          {
            inactiveAlertsData?.filter((alert: AlertData) => ((new Date().getTime() - new Date(alert.createdAt).getTime()) < (expDateRange * 24 * 3600 * 1000))).map((alert: AlertData, index: number) => {
              return <InboxClosedItem alert={alert} key={index} />
            })
          }
        </ScrollView>
        : <EmptyScreen>
          <Text style={styles.title}>You don't have any alert</Text>
          <Text style={styles.subText}>Click the button below to create your first alert and never miss an opportunity.</Text>
          <View style={styles.space}></View>
          <TouchableOpacity style={globalStyle.button} onPress={() => {
            navigation.navigate("ExploreSearch");
          }}>
            <Text style={globalStyle.buttonText}><FontAwesome5 name="plus" color={'white'} size={12} />{"  "}Create alert</Text>
          </TouchableOpacity>
        </EmptyScreen>
    }
  </SafeAreaView>
};

const styles = StyleSheet.create({
  body: {
    flex: 1,
    backgroundColor: "#040B11",
    width: "100%",
  },
  container: {
    flex: 1,
    paddingHorizontal: 15, // Set consistent padding for left and right
    width: "100%",
  },
  profilePictureContainer: {
    flexDirection: "row", // Change to row to align items horizontally
    alignItems: "center", // Center the items vertically
    marginBottom: 20,
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
  sectionHeader: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 5,
  },
  dropdownButtonStyle: {
    width: 200,
    height: 50,
    backgroundColor: '#E9ECEF',
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  dropdownButtonTxtStyle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '500',
    color: '#151E26',
  },
  dropdownButtonArrowStyle: {
    fontSize: 28,
  },
  dropdownButtonIconStyle: {
    fontSize: 28,
    marginRight: 8,
  },
  dropdownMenuStyle: {
    paddingTop: 0,
    marginTop: -20,
    backgroundColor: '#E9ECEF',
    width: 120,
    borderRadius: 8,
  },
  dropdownItemStyle: {
    width: '100%',
    flexDirection: 'row',
    paddingHorizontal: 12,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
  },
  dropdownItemTxtStyle: {
    flex: 1,
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '500',
    color: '#151E26',
  },
  dropdownItemIconStyle: {
    fontSize: 28,
    marginRight: 8,
  },
  // empty
  space: { height: 24 },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white'
  },
  subText: {
    fontSize: 16,
    color: '#FFFa',
    textAlign: 'center',
  },
  btn: {
    backgroundColor: colors.secondary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
  },
  contentContainerStyle: {
    width: '100%',
    height: 50,
    backgroundColor: '#faa8'
  }
});

export default memo(ManageAlerts);
