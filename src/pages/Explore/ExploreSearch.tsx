import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Keyboard
} from "react-native";
import { globalStyle } from "../../assets/css/globalStyle"
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";
import Api from "../../api/api";
import { Notfind } from "../../assets/img/Constant"
import SymbolList from "./SymbolList"
import Loading from "../../components/loading/Loading"
import Toast from "react-native-toast-message";
import FlatNews from "../../components/news/FlatNews";
import { RootStackParams } from "../../navigation/props";
import { watchlistApi } from "../../api/watchlist";
import { useDispatch } from "react-redux";

import { generateClient } from "aws-amplify/data";
import type { Schema } from "../../../amplify/data/resource";
import { GraphQLError } from "graphql";
import { UserAttribute, UserProfile } from "../../api/types";
import { useAuthenticator } from '@aws-amplify/ui-react-native';
import { useGetProfileQuery } from "../../api";
const client = generateClient<Schema>();

const ExploreSearch = ({ navigation, route }) => {
  const { data: user } = useGetProfileQuery({});
  const dispatch = useDispatch();

  const [searchList, setSearchList] = useState([]);
  const [topTrends, setTopTrends] = useState([]);
  const [isLoading, setIsLoading] = useState(true)
  const [news, setNews] = useState([]);
  const [searchText, setSearchText] = useState("");

  const getNewsByCategory = async (s: string) => {
    await Api.getNewsBySymbol(s, "")
      .then(async (response: any) => {
        let res = JSON.parse(response)
        setNews(res?.data);
      })
      .catch((error) => {
        console.log(error)
      });
  };
  const getTrendingStockData = async () => {
    await Api.getTrendingStockData("", user?.email)
      .then(async (response: any) => {
        setTopTrends(response.data);
      })
      .catch((error) => {
        console.log("here", error)
      });
  };
  const getStockSearch = async (s: string) => {
    const limit = 4;
    await Api.getStockSearch(s, limit, "", user?.email)
      .then(async (response: any) => {
        setSearchList(response);
        if (response.length > 0) {
          await getNewsByCategory(response[0].symbol)
        }
      })
      .catch((error) => {
        console.error("Error fetching stock search:", error);
      });
  };

  const handleWatchlist = async (symbol: string, value, type) => {
    if (user?.watchlist?.includes(symbol)) {
      await client?.models?.Profile?.update({
        id: user?.id,
        watchlist: [...user?.watchlist?.filter((s: string) => s != symbol)]
      }).then((updatedData) => {
        Toast.show({
          type: 'Capiwise_Success',
          position: "top",
          text1: symbol,
          text2: " has been removed to your watchlist"
        });
        dispatch(watchlistApi.util.invalidateTags(['Watchlist']));
      });
    } else {
      !!user && await client?.models?.Profile?.update({
        id: user?.id,
        watchlist: [...user?.watchlist, symbol]
      }).then((updatedData) => {
        Toast.show({
          type: 'Capiwise_Success',
          position: "top",
          text1: symbol,
          text2: " has been added to your watchlist"
        });
        dispatch(watchlistApi.util.invalidateTags(['Watchlist']));
      });
    }
  };

  const onChangeSearchEvent = async (e) => {
    setSearchText(e.nativeEvent.text)
    if (e.nativeEvent.text != "") {
      await getStockSearch(e.nativeEvent.text)
    } else {
      setSearchList([])
    }
  }
  const onHandleEtf = async (region) => {
    Keyboard.dismiss();
    try {
      if (region.instrument_type == "ETF") {
        navigation.navigate("EtfTab", {
          symbol: region.symbol
        });
      } else {
        navigation.navigate("SummaryTab", {
          data: {
            key: region.symbol,
          },
        });
      }
    } catch (error) {
      console.error("Error storing region symbol:", error);
    }
  };

  useEffect(() => {
    try {
      navigation?.setOptions({
        headerShown: true,
        headerBackVisible: false,
        headerTitle: () => (
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ ...globalStyle.alignItemsCenter, gap: 15 }}>
            <FontAwesome name="angle-left" size={28} color="white" />
            <Text style={{ color: "#FFF", fontSize: 24 }}>
              Explore
            </Text>
          </TouchableOpacity>
        ),
        headerStyle: {
          backgroundColor: "#040B11",
        },
        headerTintColor: "#FFF",
      });

      getTrendingStockData()
      setIsLoading(false)
    } catch (e) { }
  }, [navigation]);

  return (
    <ScrollView contentContainerStyle={globalStyle.scrollContainer}>
      {isLoading ? <Loading /> : <>
        <View style={globalStyle.container}>
          <View style={[globalStyle.alignItemsCenter]}>
            <TextInput style={styles.searchInput}
              underlineColorAndroid="transparent"
              placeholder="Symbol, company name or user"
              placeholderTextColor="#979797"
              autoCapitalize="none"
              value={searchText}
              onChange={(e) => onChangeSearchEvent(e)} />
            <Image
              source={searchText != "" ? require("../../assets/img/Explore_Active_icon.png") : require("../../assets/img/Explore_icon.png")}
              style={{ width: 20, height: 20, marginLeft: -35 }}
            />
          </View>
        </View>
        {searchList?.length == 0 && searchText != "" ? <>
          <Text style={[globalStyle.heading, { color: '#0F69FE', marginTop: 20, paddingHorizontal: 15 }]}>Symbols</Text>
          <View style={[styles.divider]} />
          <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 20, height: 200 }}>
            <Notfind />
            <Text style={{ color: '#FFF', fontSize: 24, width: 300, textAlign: 'center' }}>We couldn’t find any results for this search</Text>
          </View>
          <View style={[styles.divider, { marginBottom: -10 }]} />
        </> : <></>
        }
        {searchList?.length == 0 ? <>
          <Text style={[globalStyle.heading, { color: '#0F69FE', marginTop: 20, paddingHorizontal: 15 }]}>Today's top trends</Text>
          <View style={[styles.divider]} />
          <SymbolList data={topTrends} callback={(symbol: string, value) => handleWatchlist(symbol, value, true)} onHandleEtf={onHandleEtf} /></>
          : <></>
        }
        {searchList?.length > 0 ? <>
          <Text style={[globalStyle.heading, { color: '#0F69FE', marginTop: 20, paddingHorizontal: 15 }]}>Symbols</Text>
          <View style={[styles.divider]} />
          <SymbolList data={searchList} callback={(symbol: string, value) => handleWatchlist(symbol, value, false)} onHandleEtf={onHandleEtf} /></> :
          <></>
        }
        {searchList?.length > 0 ? <>
          <View style={globalStyle.container}>
            <Text style={[globalStyle.heading, { color: '#0F69FE', marginTop: 20 }]}>News</Text>
          </View>
          <View style={[styles.divider, { marginTop: 20 }]} />
          <FlatNews news={news} />
        </> : <></>}
      </>
      }
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  TrendingStocks: {
    width: "100%",
    paddingTop: 25,
  },
  messageContainer: {
    position: 'absolute',
    top: 50,
    zIndex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%'
  },
  messageBody: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: "#007C4A",
    padding: 10,
    borderRadius: 5,
  },
  messageText: {
    color: "white",
    marginLeft: 10,
  },
  searchInput: {
    borderRadius: 50,
    backgroundColor: "#0B1620",
    paddingLeft: 15,
    paddingRight: 45,
    height: 48,
    color: "#FFF",
    letterSpacing: 1,
    fontSize: 16,
    width: '100%'
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: "#464646",
    width: "100%",
    marginTop: 13
  }
});

export default ExploreSearch;