import React, { memo } from "react";
import {
  View,
  useWindowDimensions,
  Text,
} from "react-native";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import { globalStyle } from '../../assets/css/globalStyle';
import Business from "./Business";
import TopNews from "./TopNews";
import Technology from "./Technology";
import Health from "./Health";
import EuropeNews from "./EuropeNews";
import UsNews from "./UsNews";

const NewsMain = ({ navigation, route }) => {
  const layout = useWindowDimensions();
  const [index, setIndex] = React.useState(route?.params?.category ?? 0);
  const [routes] = React.useState([
    { key: "first", title: "Top news" },
    { key: "second", title: "Business" },
    { key: "third", title: "Technology" },
    { key: "fourth", title: "Health" },
    { key: "fifth", title: "Europe news" },
    { key: "sixth", title: "US news" },
  ]);

  const renderScene = SceneMap({
    first: TopNews,
    second: Business,
    third: Technology,
    fourth: Health,
    fifth: EuropeNews,
    sixth: UsNews,
  });
  const renderTabBar = (props) => {
    return (
      <View style={[globalStyle.container, { paddingTop: 50 }]}>
        <Text style={globalStyle.h1}>News</Text>
        <TabBar
          {...props}
          scrollEnabled={true}
          gap={24}
          style={[globalStyle.tabHeader, { marginTop: 0, paddingHorizontal: 0 }]}
          tabStyle={{ width: 'auto', paddingHorizontal: 0 }}
          indicatorStyle={{ height: 0 }}
          renderLabel={({ route, focused }) => {
            return (
              <Text
                style={[
                  globalStyle.tabLabel,
                  {
                    paddingHorizontal: focused ? 0 : 1, fontWeight: focused ? '700' : '400', color: focused ? '#2EBD85' : '#FFF',
                    borderBottomWidth: focused ? 3 : 0
                  }
                ]}
              >
                {route.title}
              </Text>
            );
          }}
        />
      </View>
    );
  };

  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{ width: layout.width }}
      renderTabBar={renderTabBar}
    />
  );
}

export default memo(NewsMain);