import * as React from "react";
import {
  View,
  useWindowDimensions,
  StyleSheet,
  Text,
} from "react-native";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import Alerts from "./Alerts";
import Announcement from "./Announcement";
import Community from "./Community";

export default function NotificationsTab() {
  const layout = useWindowDimensions();
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: "first", title: "Community" },
    { key: 'second', title: 'Alerts' },
    { key: 'third', title: 'Announcement' },
    // { key: 'fourth', title: 'Dividend' },
    // { key: 'fifth', title: 'Technical Analysis' },
  ]);

  const renderScene = SceneMap({
    first: Community,
    second: Alerts,
    third: Announcement,
    // fourth: Dividend,
    // fifth: TechnicalAnalysis,
  });
  const renderTabBar = (props) => (
    <View style={styles.container}>
    <TabBar
      {...props}
      indicatorStyle={styles.indicator}
      style={styles.tabBar}
      labelStyle={styles.label}
      scrollEnabled={true}
      renderLabel={({ route, focused, color }) => (
        <Text
          style={[
            styles.label,
            focused && { fontWeight: "700", color: "#2EBD85" },
          ]}
        >
          {route.title}
        </Text>
      )}
    />
    </View>
  );

  return (
    // <View>
    //   <Text style={styles.heading}>Portfolio Composition</Text>
    //   </View>

    <>
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
        renderTabBar={renderTabBar}
      />
      <View style={styles.horizontalLine} />
      </>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: "#040B11",
    paddingHorizontal: 20,
    justifyContent: "flex-start",
  },
  tabBar: {
    backgroundColor: "#040B11", // Set background color to transparent
    elevation: 0, // Remove shadow on Android
    shadowOpacity: 0, // Remove shadow on iOS
  },
  indicator: {
    backgroundColor: "#2EBD85", // Set indicator color
    height: 3, // Set indicator height
  },
  label: {
    textTransform: "none",
    fontWeight: "normal",
    color: "#FFF",
    fontSize: 15,
    width: 180, // Set the width of the label
    textAlign: "center", // Center the text within the label
  },
  heading: {
    color: "#FFF",
    fontFamily: "Roboto",
    fontSize: 24,
    fontWeight: "bold",
    marginTop:20
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
});
