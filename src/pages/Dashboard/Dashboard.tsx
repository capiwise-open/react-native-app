import React, { useEffect, useState, useCallback, useMemo, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  Dimensions,
  Animated,
  Linking,
} from "react-native";
import { Image } from "react-native";
import { useNavigation, useFocusEffect, NavigationProp, RouteProp, useRoute } from "@react-navigation/native";
import { LineChart } from "react-native-gifted-charts";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import { StatusBar } from "expo-status-bar";
import { ActivityIndicator, Badge, Button } from "react-native-paper";
import { Octicons } from "@expo/vector-icons";

import { useGetTrendingMarketExchangeListQuery } from "../../api/stock";
import { useGetMyWatchListQuery } from "../../api/watchlist";
import { useGetNewsByCategoryQuery } from "../../api/news";

import FlatNews from "../../components/news/FlatNews";
import { ExchangeRate, Stock, SymbolChange, } from "../../api/types";
import { getRoundOffValue, getTimeDifference } from "../../utils/utils";
import { globalStyle } from "../../assets/css/globalStyle";
import { SearchIcon, AddWatchImage, MenuInbox, MenuInboxActive } from "../../assets/img/Constant"
import Loading from "../../components/loading/Loading"
import Api from "../../api/api";
import { useGetTopNewsQuery } from "../../api/marketaux";
import Greed from "../../components/greed";
import CCSymbolList from "../../components/cryptocurrency/CCSymbolList";
import { useGetExchangesQuery } from "../../api/twelvedata";
import { useGetAssetsLogoQuery } from "../../api/coinapi";
import SymbolList from "../../components/dashboard/SymbolList";
import CExchanger from "../../components/dashboard/CExchanger";
import { selectCommodities, selectCryptoCurrencies, selectFiatCurrencies } from "../../api/currencySlice";
import CommodityList from "../../components/commodity/CommodityList";
import { DrawStackParams, RootStackParams } from "../../navigation/props";
import { BottomTabParams } from "../../components/bottombar/params";

import { generateClient } from "aws-amplify/data";
import type { Schema } from "../../../amplify/data/resource";
import { GraphQLError } from "graphql";
import { UserAttribute, UserProfile } from "../../api/types";
import { useAuthenticator } from '@aws-amplify/ui-react-native';
import Carousel, { ICarouselInstance, Pagination, TAnimationStyle } from 'react-native-reanimated-carousel';
import { useGetAlertsQuery, useGetProfileQuery } from "../../api";
import { interpolate, useSharedValue } from "react-native-reanimated";
import { useGetNotificationQuery } from "../../api/notifications";
import CarouselItem from "../../components/dashboard/CarouselItem";
import { articles, newsCategories } from "./data";
import { useGetCarouselsQuery } from "../../api/strapi/dashboard";


const client = generateClient<Schema>();

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

// type Route = RouteProp<RootStackParams, "First">;
type Route = RouteProp<BottomTabParams, "T_Home">;

export default function Dashboard() {
  const drawerNavigation = useNavigation<NavigationProp<DrawStackParams>>();
  const navigation = useNavigation<NavigationProp<RootStackParams>>();
  const bottomNavigation = useNavigation<NavigationProp<BottomTabParams>>();
  const route = useRoute<Route>();

  const { data: user } = useGetProfileQuery({});
  const { data: alertsData } = useGetAlertsQuery({});

  // fetch dashboard lists
  const [skip, setSkip] = React.useState(false);
  const { data: stockList, isFetching: isStocklistFetching, isLoading: isTrendingLoading, isError: isTrendingError } = useGetTrendingMarketExchangeListQuery({ email: user?.email, token: "" }, { skip });
  const { data: watchList, isFetching: isWatchlistFetching, isLoading: isWatchlistLoading, isError: isWatchlistError } = useGetMyWatchListQuery({ email: user?.email, token: "" }, { skip });
  const { data: news, isFetching: isNewsFetching, isLoading: isNewsLoading, isError: isNewsError } = useGetNewsByCategoryQuery({ category: "top", token: "" }, { skip });
  const { data: notifications } = useGetNotificationQuery({ email: user?.email });

  const { data: carousels } = useGetCarouselsQuery({});

  const fiatCurrencies = ['EUR/USD', 'GBP/USD', 'JPY/USD', 'AUD/USD', 'CAD/USD', 'CHF/USD', 'CNY/USD', 'HKD/USD', 'NZD/USD', 'SEK/USD', 'KRW/USD', 'SGD/USD', 'NOK/USD', 'MXN/USD', 'INR/USD', 'RUB/USD', 'ZAR/USD', 'TRY/USD', 'BRL/USD', 'TWD/USD'];
  const cryptoCurrencies = useSelector(selectCryptoCurrencies);
  const commodities = useSelector(selectCommodities);

  const { data: cChanges } = useGetExchangesQuery({ symbols: fiatCurrencies });
  const { data: ccChanges } = useGetExchangesQuery({ symbols: cryptoCurrencies.slice(0, 4).map(c => `${c}/USD`), outputsize: 24, interval: '1h' });
  const { data: cmChanges } = useGetExchangesQuery({ symbols: commodities.slice(0, 4).map(c => `${c}/USD`), outputsize: 24, interval: '1h' });

  // UI statese
  const [refreshing, setRefreshing] = useState(false);

  // interaction with UIs 
  const onStockSummary = (data: Stock) => {
    navigation.navigate("SummaryTab", {
      data: {
        key: data.symbol,
      },
    });
  };
  const handleMarkets = () => {
    bottomNavigation.navigate("T_Markets", {
      data: {
        activeTab: 1
      },
    });
  };
  const shortName = useMemo(() => {
    if (!!user && !!user.name)
      return user.name.split(",").map((s: string) => s.charAt(0)).join().toUpperCase()
  }, [user]);

  const animationStyle: TAnimationStyle = React.useCallback(
    (value: number) => {
      "worklet";

      const zIndex = interpolate(value, [-1, 0, 1], [-1000, 0, 1000]);
      const translateX = interpolate(
        value,
        [-1, 0, 1],
        [0, 0, screenWidth],
      );

      return {
        transform: [{ translateX }],
        zIndex,
      };
    },
    [],
  );
  const ref = React.useRef<ICarouselInstance>(null);
  const progress = useSharedValue<number>(0);
  const onPressPagination = (index: number) => {
    ref.current?.scrollTo({
      /**
       * Calculate the difference between the current index and the target index
       * to ensure that the carousel scrolls to the nearest index
       */
      count: index - progress.value,
      animated: true,
    });
  };

  return (
    <SafeAreaView style={{ backgroundColor: '#0B1620' }}>
      <StatusBar backgroundColor={'#0B1620'} style="light" />
      <View style={{ backgroundColor: '#040B11', flexDirection: 'column' }}>
        {/* Header - profile, searchbar */}
        <View style={{
          ...globalStyle.container,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingBottom: 10,
          height: 60,
          position: 'absolute',
          backgroundColor: '#0B1620',
          elevation: 6,
          top: 0,
          zIndex: 999
        }}>
          <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
            {user?.picture && user?.picture.charAt(0) == 'h' ?
              <Image source={{ uri: user?.picture }} style={{ width: 32, height: 32, borderRadius: 22 }} /> :
              <View style={[globalStyle.alignItemsCenter, { justifyContent: 'center', width: 32, height: 32, backgroundColor: user?.picture ? user?.picture : '#0F69FE', borderRadius: 22 }]}>
                <Text style={{ color: '#FFF' }}>
                  {shortName}
                </Text>
              </View>}
          </TouchableOpacity>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 30 }}>
            <TouchableOpacity
              onPress={() => navigation.navigate("ExploreSearch")}
              style={{ marginBottom: 5 }}>
              <SearchIcon />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.tabItem}
              onPress={() => navigation.navigate("InboxScreen")}>
              <MenuInbox width={28} height={28} />
              {
                notifications?.length > 0 && <Badge size={20} style={{ backgroundColor: '#E2433B', position: 'absolute', right: -10, top: -10 }}>{notifications?.length}</Badge>
              }
            </TouchableOpacity>
          </View>
        </View>
        {/* content */}
        <ScrollView
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => setSkip(false)} />}
          contentContainerStyle={{ ...globalStyle.scrollContainer, paddingVertical: 60, paddingHorizontal: 10, minHeight: screenHeight}} >
          {/* Exchange Rate */}
          {/* <ScrollView horizontal style={{
            marginVertical: 20,
            paddingHorizontal: 15,
          }}
          >
            {
              cChanges?.map((xchange, index) => {
                const change = (parseFloat(xchange?.values[0]?.close) - parseFloat(xchange?.values[0]?.open));
                const percentChange = (change * 100);
                return <View key={index} style={{ flexDirection: 'row', gap: 10, marginRight: 15 }}>
                  <Octicons name={percentChange > 0 ? "triangle-up" : "triangle-down"} size={20} color={percentChange > 0 ? '#2EBD85' : '#E2433B'} />
                  <Text style={{ color: '#0F69FE', fontSize: 14 }}>{xchange?.meta?.symbol}</Text>
                  <Text style={{ color: 'white', fontSize: 14 }}>{percentChange.toFixed(2)}%</Text>
                  <Text style={{ color: 'white', fontSize: 14 }}>({change.toFixed(4)})</Text>
                </View>
              })
            }
          </ScrollView> */}
          {/* Carousel */}
          {
            !!carousels && <View style={{
              justifyContent: 'center',
              alignItems: 'center',
            }}>
              <Carousel
                ref={ref}
                loop
                width={screenWidth}
                height={screenWidth * 0.9}
                autoPlay={true}
                autoPlayInterval={3000}
                onProgressChange={progress}
                data={Object.keys(carousels)}
                scrollAnimationDuration={1000}
                renderItem={
                  ({ index, animationValue }) => (<CarouselItem
                    onPrev={() => {
                      ref.current?.prev();
                    }}
                    onNext={() => {
                      ref.current?.next();
                      // progress.value = (progress.value + 1) % carouselData.length
                    }}
                    key={index}
                    index={index}
                    animationValue={animationValue} />)
                }
              />
              <Pagination.Basic<{ id: string | number }>
                progress={progress}
                data={carousels}
                size={12}
                dotStyle={{
                  borderRadius: 100,
                  backgroundColor: "#979797",
                }}
                activeDotStyle={{
                  borderRadius: 100,
                  backgroundColor: "#FFF",
                  overflow: "hidden",
                }}
                containerStyle={[,
                  {
                    gap: 12,
                    marginTop: 16,
                  },
                ]}
                horizontal={true}
                onPress={onPressPagination}
              />
            </View>}
          {/* Alerts */}
          {
            !!alertsData && alertsData?.length > 0 &&
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={globalStyle.h1}>
                  Alerts snapshot
                </Text>
                <TouchableOpacity onPress={() => navigation.navigate("ManageAlerts")}>
                  <View style={styles.viewBtn}>
                    <Text style={{ color: "#0F69FE", fontSize: 14 }}>
                      View all
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
              {
                !!alertsData && alertsData?.length > 0
                && <View style={{ paddingHorizontal: 0 }}>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <View style={[globalStyle.flexRow, { gap: 10 }]}>
                      {alertsData?.map((data: Schema["Alert"]["type"], index: number) => {
                        let logo = stockList?.find(stock => stock.symbol === data.identifier)?.logo;
                        !logo && (logo = watchList?.find(watch => watch.symbol === data.identifier)?.logo);
                        const title = `Alert of ${data.identifier} at a ${data.signal} of ${data.signal === 'price' ? ('$' + (data.value ?? 0)) : (data.value + '%')}`;
                        return <TouchableOpacity key={index} onPress={(e) => {
                          navigation.navigate('CreateAlert', {
                            update: true,
                            symbol: data.identifier
                          })
                        }}>
                          <View style={styles.alertCard}>
                            <View style={{
                              height: 40,
                              width: 40,
                              backgroundColor: '#fff8',
                              borderRadius: 30,
                              justifyContent: 'center',
                              alignItems: 'center',
                              overflow: 'hidden'
                            }}>
                              {!!logo && logo.length > 0 && <Image style={{ width: 40, height: 40 }} source={{ uri: logo }} />}
                            </View>
                            <View style={{
                              flexDirection: 'column',
                              gap: 5,
                            }}>
                              <Text numberOfLines={1} ellipsizeMode="tail" style={{ color: 'white', fontSize: 14, fontWeight: '500', maxWidth: 220 }}>{title}</Text>
                              <Text style={{ color: '#fffd', fontSize: 12 }}>Open at {new Date(data.createdAt!).toISOString().slice(0, 10)}</Text>
                            </View>
                          </View>
                        </TouchableOpacity>
                      })}
                    </View>
                  </ScrollView>
                </View>
              }
            </View>
          }
          {/* Watchlist */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={globalStyle.h1}>
                My watchlist
              </Text>
              {
                (!!watchList && watchList?.length > 0) ? <TouchableOpacity style={styles.viewBtn} onPress={() => bottomNavigation.navigate("T_Watchlist")}>
                  <Text style={{ color: "#0F69FE", fontSize: 14 }}>View all</Text>
                </TouchableOpacity> :
                  <TouchableOpacity onPress={() => navigation.navigate("ExploreSearch")}>
                    <View style={[styles.viewBtn, { width: 115 }]}>
                      <Text style={{ color: "#0F69FE", fontSize: 14 }}>
                        Search symbols
                      </Text>
                    </View>
                  </TouchableOpacity>
              }
            </View>
            {
              (!!watchList && watchList?.length > 0) ?
                <>
                  <SymbolList data={watchList?.slice(0, 5)} />
                </>
                : (
                  isWatchlistLoading !== true && isWatchlistFetching !== true && <View style={globalStyle.container}>
                    <View style={styles.layout}>
                      <View>
                        <Text style={styles.title}>Add symbols to your watchlist</Text>
                        <Text style={styles.title}>for quick access to your</Text>
                        <Text style={styles.title}>favourite companies</Text>
                      </View>
                      <View style={{ marginTop: 5 }}>
                        <AddWatchImage />
                      </View>
                      <TouchableOpacity onPress={() => navigation.navigate("ExploreSearch")} style={[styles.confirmBtn, { backgroundColor: '#2EBD85' }]}>
                        <Text style={{ color: '#FFF' }}>+Add symbols</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )
            }
          </View>
          {
            isWatchlistLoading === true && <ActivityIndicator size={50} color="#2EBD85" />
          }
          {/* Trending */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={globalStyle.h1}>
                Trending
              </Text>
              <TouchableOpacity style={styles.viewBtn} onPress={() => bottomNavigation.navigate("T_Markets")}>
                <Text style={{ color: "#0F69FE", fontSize: 14 }}>View all</Text>
              </TouchableOpacity>
            </View>
            {/* <View style={styles.divider} /> */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 5 }}>
              <View style={[globalStyle.flexRow, { gap: 10 }]}>
                {stockList?.filter(v => (!isNaN(v.close) && !isNaN(v.high) && !isNaN(v.low))).map((data: Stock, index) => (
                  <TouchableOpacity key={index} onPress={(e) => onStockSummary(data)}>
                    <View style={styles.symbolCard}>
                      <Text style={[styles.symbolTitle]}>{data.symbol}</Text>
                      <Text style={{ fontSize: 10, color: "#FFF" }} numberOfLines={1}>{data.name}</Text>
                      <Text style={styles.symbolTitle}>
                        ${getRoundOffValue(data.close)}
                      </Text>
                      <Text
                        style={{
                          color: data.change < 0 ? "#E2433B" : "#2EBD85",
                          fontSize: 10,
                          fontWeight: "bold",
                        }}
                      >
                        {getRoundOffValue(data.change)} ({getRoundOffValue(data.percent_change)}%)
                      </Text>
                      <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                        <LineChart
                          curved
                          data={[{ value: data.open - data.low }, { value: 0 }, { value: data.high - data.low }, { value: data.close - data.low }]}
                          height={25}
                          width={100}
                          maxValue={(data.high - data.low) === 0 ? 0.01 : (data.high - data.low)}
                          hideRules
                          thickness={2}
                          initialSpacing={0}
                          color1={data.change < 0 ? "#E2433B" : "#2EBD85"}
                          hideDataPoints
                          yAxisColor="#0B1620"
                          xAxisColor="#979797"
                          yAxisLabelWidth={0}
                          adjustToWidth={true}
                          endSpacing={0}
                          xAxisType={"dotted"}
                          dashGap={1}
                          dashWidth={2}
                        />
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
            {
              isTrendingLoading === true && <ActivityIndicator size={50} color="#2EBD85" />
            }
          </View>
          {/* News */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={globalStyle.h1}>
                Top news
              </Text>
              <TouchableOpacity style={styles.viewBtn} onPress={() => bottomNavigation.navigate("T_News")}>
                <Text style={{ color: "#0F69FE", fontSize: 14 }}>View all</Text>
              </TouchableOpacity>
            </View>
            {
              !!news && news.length > 0 && news[0] && <TouchableOpacity onPress={() => {
                Linking.openURL(news[0]?.url);
              }}>
                <View style={{
                  paddingVertical: 15,
                  flexDirection: 'column',
                  gap: 12,
                }}>
                  <View style={{
                    position: 'relative'
                  }}>
                    <Image
                      source={{ uri: news[0]?.image_url }}
                      style={{ width: '100%', height: screenWidth * 0.5, borderRadius: 20, }} />
                    <Text style={{
                      position: 'absolute',
                      top: 20,
                      left: 0,
                      fontSize: 20,
                      backgroundColor: '#FF0000BB',
                      color: 'white',
                      paddingVertical: 5,
                      paddingHorizontal: 20,
                      borderTopRightRadius: 20,
                      borderBottomRightRadius: 20,
                    }}>Breaking news</Text>
                  </View>
                  <Text numberOfLines={4} style={{
                    color: 'white',
                    fontSize: 18,
                  }}>{news[0]?.description}</Text>
                  <View style={{
                    flexDirection: 'row',
                    gap: 20,
                  }}>
                    <Text style={{
                      color: 'white',
                      fontSize: 14,
                    }}>{news[0].source}</Text>
                    <Text style={{
                      color: 'white',
                      fontSize: 12,
                    }}>{(getTimeDifference(news[0]?.published_at)).value + " " + (getTimeDifference(news[0]?.published_at)).unit + " ago"}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            }
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ paddingVertical: 12 }}>
              {
                newsCategories?.map((data, index) => {
                  return <TouchableOpacity key={index}
                    onPress={() => {
                      bottomNavigation.navigate("T_News", {
                        category: index + 1
                      });
                    }}
                    style={{
                      width: screenWidth / 3,
                      flexDirection: 'column',
                      marginRight: 30,
                      gap: 10,
                      // height: screenWidth / 3
                    }}>
                    <Image source={data.logo} style={{
                      width: '100%',
                      height: screenWidth / 3,
                      borderRadius: 16,
                    }} />
                    <Text style={{ color: '#2EBD85', fontSize: 16, fontWeight: 'bold' }}>{data.category}</Text>
                    <Text style={{ color: '#fff', fontSize: 12 }}>{data.description}</Text>
                  </TouchableOpacity>
                })
              }
            </ScrollView>
            {
              isNewsLoading === true && <ActivityIndicator size={50} color="#2EBD85" />
            }
          </View>
          {/* Fear & Greed Index */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={globalStyle.h1}>
                Fear & Greed Index
              </Text>
            </View>
            <Greed />
          </View>
          {/* Currency exchange */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={globalStyle.h1}>
                Currency exchange
              </Text>
              <TouchableOpacity style={styles.viewBtn} onPress={() => bottomNavigation.navigate("T_News")}>
                <Text style={{ color: "#0F69FE", fontSize: 14 }}>View all</Text>
              </TouchableOpacity>
            </View>
            <CExchanger />
          </View>
          {/* Top commodities */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={globalStyle.h1}>
                Top commodities
              </Text>
              <TouchableOpacity onPress={() => navigation.navigate("ManageAlerts")}>
                <View style={styles.viewBtn}>
                  <Text style={{ color: "#0F69FE", fontSize: 14 }}>
                    View all
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
            {
              cmChanges && <CommodityList data={cmChanges} />
            }
          </View>
          {/* Top cryptocurrency */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={globalStyle.h1}>
                Top cryptocurrency
              </Text>
              <TouchableOpacity onPress={() => navigation.navigate("ManageAlerts")}>
                <View style={styles.viewBtn}>
                  <Text style={{ color: "#0F69FE", fontSize: 14 }}>
                    View all
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
            {
              ccChanges && <CCSymbolList cclist={ccChanges} />
            }
          </View>
          {/* Build your investment skills */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={globalStyle.h1}>
                Build your investment skills
              </Text>
            </View>
            {
              articles.map((article, index) => {
                return <TouchableOpacity onPress={() => {
                  drawerNavigation.navigate(article.route)
                }} key={index}>
                  <View style={styles.articleCard}>
                    <Image source={article.logo} style={{ width: '100%', height: screenWidth * 0.5 }} />
                    <View style={styles.articlefooter}>
                      <Text style={styles.articleTitle}>{article.title}</Text>
                      <Text style={styles.articleDescription}>{article.description}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              })
            }
          </View>
        </ScrollView>
      </View >
      {/* {
        isWatchlistLoading === true && <View style={{
          width: '100%',
          height: '100%',
          position: 'absolute',
          top: 0,
        }}>
          <Loading />
        </View>
      } */}
    </SafeAreaView >
  );
}

const styles = StyleSheet.create({
  divider: {
    width: '100%',
    marginTop: 8,
    height: 0.5,
    backgroundColor: "#464646",
  },
  symbolCard: {
    width: 135,
    height: 160,
    backgroundColor: "#0B1620",
    flexDirection: "column",
    alignItems: "flex-start",
    borderRadius: 10,
    padding: 15,
    gap: 5
  },
  alertCard: {
    maxWidth: 300,
    height: 75,
    backgroundColor: "#0B1620",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: 'space-around',
    borderRadius: 15,
    padding: 15,
    gap: 15
  },
  symbolTitle: {
    fontSize: 16,
    color: "#FFF",
    fontWeight: "bold",
  },
  TrendingStocks: {
    width: "100%",
    paddingTop: 25,
  },
  layout: {
    flexDirection: 'column',
    backgroundColor: '#0B1620',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    marginTop: 20
  },
  title: {
    color: '#FFF',
    fontSize: 20,
    textAlign: 'center'
  },
  confirmBtn: {
    width: '100%',
    height: 50,
    marginTop: 25,
    borderWidth: 1,
    borderRadius: 50,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center'
  },
  viewBtn: {
    width: 74,
    height: 24,
    backgroundColor: '#2EBD8500',
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  tabItem: {
    position: 'relative',
  },
  tabLabel: {
    fontSize: 10,
    letterSpacing: 1,
    fontWeight: "700"
  },
  section: {
    width: "100%",
    paddingHorizontal: 15,
    paddingVertical: 4,
    display: 'flex',
    flexDirection: 'column',
    borderColor: 'white',
    // borderWidth: 1,
    gap: 20
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  articleCard: {
    borderRadius: 16,
    flexDirection: 'column',
    backgroundColor: '#0B1620',
    overflow: 'hidden'
  },
  articlefooter: {
    flexDirection: 'column',
    paddingHorizontal: 20,
    paddingVertical: 12,
    justifyContent: 'space-between',
    gap: 8
  },
  articleTitle: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 20,
  },
  articleDescription: {
    color: 'white',
    fontSize: 14,
  }
});
