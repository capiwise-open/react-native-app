import React, { useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
} from "react-native";
import { NavigationProp, useFocusEffect, useNavigation } from "@react-navigation/native";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import Earnings from "./Earnings";
import Trending from "./Trending";
import MostActive from "./MostActive";
import TopGainers from "./TopGainers";
import TopLosers from "./TopLosers";
import { globalStyle } from '../../assets/css/globalStyle';
import { useRoute } from "@react-navigation/native";
import { RootStackParams } from "../../navigation/props";
import { BottomTabParams } from "../../components/bottombar/params";

export default function MarketsMain({ route }) {
  const navigation = useNavigation<NavigationProp<RootStackParams>>();
  const bottomNavigation = useNavigation<NavigationProp<BottomTabParams>>();

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: "first", title: "Earnings" },
    { key: "second", title: "Trending" },
    { key: 'third', title: 'Most active' },
    { key: 'fourth', title: 'Top gainer' },
    { key: 'fifth', title: 'Top losers' },
  ]);

  const renderScene = SceneMap({
    first: Earnings,
    second: Trending,
    third: MostActive,
    fourth: TopGainers,
    fifth: TopLosers,
  });

  const renderTabBar = (props) => {
    return (
      <View style={[globalStyle.container, { paddingTop: 50 }]}>
        <Text style={globalStyle.h1}>Markets</Text>
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
                    paddingHorizontal: focused ? 0 : 2,
                    fontWeight: focused ? '700' : '400',
                    color: focused ? '#2EBD85' : '#FFF',
                    borderBottomWidth: focused ? 3 : 0,
                  },
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


  useFocusEffect(
    useCallback(() => {
      setIndex(route.params?.data.activeTab ? route.params?.data.activeTab : 0)
    }, [])
  )

  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{ width: Dimensions.get('window').width }}
      renderTabBar={renderTabBar}
    />
  );
}