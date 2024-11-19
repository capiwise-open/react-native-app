import React, { useEffect, useState } from "react";
import { View, Text, Switch, StyleSheet, TouchableOpacity } from "react-native";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import { globalStyle } from "../../../assets/css/globalStyle";
import Api from "../../../api/api";
import { useGetProfileQuery, useUpdateSettingMutation } from "../../../api/profile";

const SettingNotifications = ({ navigation }) => {
  const [community, setCommunity] = useState(false);
  const [alerts, setAlerts] = useState(false);
  const [announcement, setAnnoucement] = useState(false);
  const [news, setNews] = useState(false);
  const [updateSettings] = useUpdateSettingMutation();
  const { data: user } = useGetProfileQuery({});

  const toggleSwitch = () => {
    setCommunity((previousState) => !previousState);
  };
  const toggleSwitch2 = () => {
    setAlerts((previousState) => !previousState);
  };
  const toggleSwitch3 = () => {
    setAnnoucement((previousState) => !previousState);
  };
  const toggleSwitch4 = () => {
    setNews((previousState) => !previousState);
  };

  useEffect(() => {
    try {
      if (!!user?.settings) {
        const { alerts = false, community = false, announcement = false, news = false } = JSON.parse(user?.settings).notifications;
        setAlerts(alerts);
        setAnnoucement(announcement);
        setNews(news);
        setCommunity(community);
      }
    } catch (e) { }
  }, [user?.settings]);

  const handleConfirmationPress = async () => {
    try {
      let data = {
        "community": community,
        "alerts": alerts,
        "announcement": announcement,
        "news": news
      }

      if (!!user) {
        const res = await updateSettings({
          id: user?.id,
          settings: JSON.stringify({
            ...JSON.parse(user?.settings ?? "{}"),
            notifications: data
          })
        })
        if (!res.error) {
          Toast.show({
            type: 'Capiwise_Success',
            position: "top",
            text1: "Successfully saved!",
          });
        } else {
          Toast.show({
            type: 'Capiwise_Error',
            position: "top",
            text2: "Network error",
          });
        }
      }
    } catch (e) { console.log(e)} finally { }
  }

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerBackVisible: false,
      headerTitle: () => (
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ ...globalStyle.alignItemsCenter, gap: 15 }}>
          <FontAwesome name="angle-left" size={28} color="white" />
          <Text style={{ color: "#FFF", fontSize: 24 }}>
            Notifications
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
      <View style={styles.notificationSetting}>
        <View style={{ width: 250 }}>
          <Text style={styles.title}>Alerts</Text>
          <Text style={styles.caption}>
            Receive notifications of the alerts you have placed for the
            companys.
          </Text>
        </View>
        <Switch
          trackColor={{ false: "#979797", true: "#2EBD85" }}
          thumbColor={alerts ? "#FFF" : "#F4F3F4"}
          ios_backgroundColor="#3E3E3E"
          onValueChange={toggleSwitch2}
          value={alerts}
          style={styles.switchContainer}
        />
      </View>
      <View style={styles.notificationSetting}>
        <View style={{ width: 250 }}>
          <Text style={styles.title}>Announcement</Text>
          <Text style={styles.caption}>
            Receive notifications about new features integrated in Capiwise.
          </Text>
        </View>
        <Switch
          trackColor={{ false: "#979797", true: "#2EBD85" }}
          thumbColor={announcement ? "#FFF" : "#F4F3F4"}
          ios_backgroundColor="#3E3E3E"
          onValueChange={toggleSwitch3}
          value={announcement}
        />
      </View>
      <View style={styles.notificationSetting}>
        <View style={{ width: 250 }}>
          <Text style={styles.title}>News</Text>
          <Text style={styles.caption}>
            Receive notifications about relevant news in the market.
          </Text>
        </View>
        <Switch
          trackColor={{ false: "#979797", true: "#2EBD85" }}
          thumbColor={news ? "#FFF" : "#F4F3F4"}
          ios_backgroundColor="#3E3E3E"
          onValueChange={toggleSwitch4}
          value={news}
        />
      </View>
      <View style={styles.notificationSetting}>
        <View style={{ width: 250 }}>
          <Text style={styles.title}>Community</Text>
          <Text style={styles.caption}>
            Receive notifications from the community, such as comments, likes,
            reposts, followers.
          </Text>
        </View>
        <Switch
          trackColor={{ false: "#979797", true: "#2EBD85" }}
          thumbColor={community ? "#FFF" : "#F4F3F4"}
          ios_backgroundColor="#3E3E3E"
          onValueChange={toggleSwitch}
          value={community}
          style={styles.switchContainer}
        />
      </View>
      <TouchableOpacity
        onPress={handleConfirmationPress}
        style={{
          height: 48,
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
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#040B11",
    paddingHorizontal: 10,
    flex: 1,
  },
  notificationSetting: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingTop: 22,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFF",
  },
  caption: {
    fontSize: 10,
    color: "#FFF",
    marginTop: 10,
  },
  switchContainer: {
    alignItems: "flex-end", // Align the switch to the end of the container
  },
});



export default SettingNotifications;







