import React, { useState, useEffect, memo } from "react";
import { Text, Dimensions, View, StyleSheet, TouchableOpacity } from 'react-native';
import { TabView, TabBar } from 'react-native-tab-view';
import Overview from './Overview';
import Analysis from './Analysis';
import FinancialHealth from './FinancialHealth';
import Dividend from './Dividend';
import { useRoute } from "@react-navigation/native";
import { globalStyle } from '../../assets/css/globalStyle';
import Api from "../../api/api";
import Loading from "../../components/loading/Loading"
import { Notfind } from "../../assets/img/Constant"
import { useNavigation } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useSelector } from "react-redux";
import { useGetStockSummaryQuery, useGetTrendingMarketExchangeListQuery } from "../../api/stock";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { RootStackParams } from "../../navigation/props";
import { useGetProfileQuery } from "../../api";

type Props = NativeStackScreenProps<RootStackParams, "SummaryTab">;

const SummaryTab = ({ route, navigation }: Props) => {
  // selectedSymbol = route.params?.data
  const { data: user } = useGetProfileQuery({});
  const selectedSymbol = route.params?.data || { activeTab: 0, key: "QQQ" };
  const [skip, setSkip] = useState(false);
  const { data: stockSummary, isLoading, isFetching, isError } = useGetStockSummaryQuery({ symbol: selectedSymbol.key, email: user?.email, token: "" }, { skip });

  const [index, setIndex] = useState(selectedSymbol.activeTab ? selectedSymbol.activeTab : 0);
  const [routes, setRoutes] = useState<{
    key: string,
    title: string,
    symbol: string,
    display: boolean,
  }[]>([
    { key: 'first', title: 'Overview', symbol: selectedSymbol.key, display: true },
    { key: 'second', title: 'Analysis', symbol: selectedSymbol.key, display: true },
    { key: 'third', title: 'Financial health', symbol: selectedSymbol.key, display: true },
    { key: 'fourth', title: 'Dividend', symbol: selectedSymbol.key, display: true },
  ]);
  useEffect(() => {
    if (!!stockSummary) {
      routes[1].display = stockSummary.isAnalysisEnabled
      routes[2].display = stockSummary.isFinHealthEnabled
      routes[3].display = stockSummary.isDividendEnabled
      setRoutes([...routes])
    }
  }, [stockSummary])

  const renderScene = ({ route }: { route: { key: string, title: string, symbol: string, display: boolean } }) => {
    if (!!stockSummary) {
      switch (route.key) {
        case 'first':
          return <Overview symbol={route.symbol} summary={stockSummary} navigation={navigation} />;
        case 'second':
          return <Analysis symbol={route.symbol} summary={stockSummary} />;
        case 'third':
          return <FinancialHealth symbol={route.symbol} summary={stockSummary} />;
        case 'fourth':
          return <Dividend symbol={route.symbol} summary={stockSummary} />;
        default:
          return null;
      }
    }
    return null;
  };
  const renderTabBar = (props: any) => {
    return (
      <TabBar
        {...props}
        scrollEnabled={true}
        gap={24}
        style={[globalStyle.tabHeader]}
        tabStyle={{ width: 'auto', paddingHorizontal: 0, }}
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
    );
  };

  useEffect(() => {
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
  }, [navigation]);

  return isLoading ? (
    <View style={styles.layout}>
      <Loading />
    </View>
  ) : (isError ? (
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
        <TouchableOpacity style={styles.reloadBtn} onPress={() => setSkip(false)}>
          <Text style={{ color: '#FFF' }}>Reload</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.goBtn} onPress={() => navigation.goBack()}>
          <Text style={{ color: '#2EBD85' }}>Back</Text>
        </TouchableOpacity>
      </View>
    </View>
  ) : <TabView
    navigationState={{ index, routes: routes.filter(route => route.display !== false) }}
    renderScene={renderScene}
    onIndexChange={setIndex}
    initialLayout={{ width: Dimensions.get('window').width }}
    renderTabBar={renderTabBar}
  />)
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

export default memo(SummaryTab);