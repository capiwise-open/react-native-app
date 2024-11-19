import React, { useState, useEffect, memo } from "react";
import { Text, Dimensions, View, StyleSheet, TouchableOpacity } from 'react-native';
import { TabView, TabBar } from 'react-native-tab-view';
import OverviewEtf from './OverviewEtf';
import PerformanceEtf from './PerformanceEtf';
import PortfolioEtf from './PortfolioEtf';
import DividendEtf from './DividendEtf';
import FeesEtf from './FeesEtf';
import { globalStyle } from '../../assets/css/globalStyle';
import Api from "../../api/api";
import Loading from "../../components/loading/Loading"
import { Notfind } from "../../assets/img/Constant"
import { NavigationProp, RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { RootStackParams } from "../../navigation/props";
import { useGetProfileQuery } from "../../api";
import { EtfStockSummary } from "../../api/types";
import { useGetEtfStockSummaryQuery } from "../../api/stock";

type EtfTabProp = RouteProp<RootStackParams, 'EtfTab'>;

const EtfTab = () => {
  const route = useRoute<EtfTabProp>();
  const navigation = useNavigation<NavigationProp<RootStackParams>>();

  const { data: user } = useGetProfileQuery({});
  const { data: etfSummary, isLoading, isFetching, isError } = useGetEtfStockSummaryQuery({ symbol: route?.params?.symbol, email: user?.email, token: "" });

  const [index, setIndex] = useState(0);
  const [routes, setRoutes] = useState([
    { key: 'first', title: 'Overview', display: true },
    { key: 'second', title: 'Performance', display: true },
    { key: 'third', title: 'Portfolio', display: true },
    { key: 'fourth', title: 'Dividend', display: true },
    { key: 'fifth', title: 'Fees', display: true },
  ]);

  useEffect(() => {
    try {
      navigation?.setOptions({
        headerShown: true,
        headerBackVisible: false,
        headerTitle: () => (
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ ...globalStyle.alignItemsCenter, gap: 15 }}>
            <FontAwesome name="angle-left" size={28} color="white" />
            <Text style={{ color: "#FFF", fontSize: 24 }}>
              Summary
            </Text>
          </TouchableOpacity>
        ),
        headerStyle: {
          backgroundColor: "#040B11",
        },
        headerTintColor: "#FFF",
      });
    } catch (e) { }
  }, [navigation]);

  const renderScene = ({ route }: {
    route: { key: string, title: string, display: boolean }
  }) => {
    switch (route.key) {
      case 'first':
        return <OverviewEtf summary={etfSummary} />;
      case 'second':
        return <PerformanceEtf summary={etfSummary} />;
      case 'third':
        return <PortfolioEtf summary={etfSummary} />;
      case 'fourth':
        return <DividendEtf summary={etfSummary} />;
      case 'fifth':
        return <FeesEtf summary={etfSummary} />;
      default:
        return null;
    }
  };

  const renderTabBar = (props) => {
    return (
      <TabBar
        {...props}
        scrollEnabled={true}
        indicatorStyle={{ height: 0 }}
        gap={24}
        style={globalStyle.tabHeader}
        tabStyle={{ width: 'auto', paddingHorizontal: 0 }}
        renderLabel={({ route, focused }) => {
          return (
            <Text
              style={[
                globalStyle.tabLabel,
                {
                  paddingHorizontal: focused ? 0 : 2, fontWeight: focused ? '700' : '400', color: focused ? '#2EBD85' : '#FFF',
                  borderBottomWidth: focused ? 3 : 0
                }
              ]}
            >
              {route.title}
            </Text>
          );
        }}
      />
    );
  };

  useEffect(() => {
    try {
      let temp = [...routes]
      temp[1].display = etfSummary?.isPerformanceEnabled
      temp[2].display = etfSummary?.isPortfolioEnabled
      temp[3].display = etfSummary?.isDividendEnabled
      temp[4].display = etfSummary?.isFeesEnabled
      setRoutes(temp)
    } catch (error) {
    }
  }, [etfSummary])


  if (isLoading) {
    return (
      <View style={styles.layout}>
        <Loading />
      </View>
    )
  } else if (isError) {
    return (
      <View style={[globalStyle.justifyCenter, styles.layout, { alignItems: 'center', flexDirection: 'column', gap: 50 }]}>
        <View style={[globalStyle.justifyCenter, globalStyle.alignItemsCenter, { flexDirection: 'column', gap: 20 }]}>
          <Notfind />
          <Text style={{ color: '#FFF', fontSize: 24, width: 350, textAlign: 'center', letterSpacing: 1 }}>
            We can not display information at this moment
          </Text>
          <Text style={{ color: '#FFF', fontSize: 16, width: 250, textAlign: 'center', letterSpacing: 1 }}>
            Please wait a couple of minutes and try again
          </Text>
        </View>
        <View style={[globalStyle.flexColumn, { gap: 20 }]}>
          <TouchableOpacity style={styles.reloadBtn} onPress={() => {
            // ### refesh
          }}>
            <Text style={{ color: '#FFF' }}>Reload</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.goBtn} onPress={navigation.goBack}>
            <Text style={{ color: '#2EBD85' }}>Back</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  } else {
    return (
      <TabView
        navigationState={{ index, routes: routes.filter(route => route.display !== false) }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: Dimensions.get('window').width }}
        renderTabBar={renderTabBar}
      />
    )
  }
}

const styles = StyleSheet.create({
  layout: {
    width: '100%',
    height: '100%',
    backgroundColor: '#040B11'
  },
  reloadBtn: {
    backgroundColor: '#2EBD85',
    height: 48,
    width: Dimensions.get("window").width - 30,
    borderRadius: 100,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  goBtn: {
    backgroundColor: 'transparent',
    height: 48,
    width: Dimensions.get("window").width - 30,
    borderRadius: 100,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: '#2EBD85',
    borderWidth: 2
  }
});

export default memo(EtfTab);