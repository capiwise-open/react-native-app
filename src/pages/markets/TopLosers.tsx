import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";

import Loading from "../../components/loading/Loading"
import Api from "../../api/api";
import { globalStyle } from "../../assets/css/globalStyle"
import { SymbolListAction } from "./SymbolListAction"
import Toast from "react-native-toast-message";
import { useGetProfileQuery, useUpdateWatchlistMutation } from "../../api";

export default function TopLosers({ navigation, route }) {
  const { data: user } = useGetProfileQuery({});
  const [updateWatchlist] = useUpdateWatchlistMutation();

  const [isLoading, setIsLoading] = useState(true)
  const [topTrends, setTopTrends] = useState([]);

  const handleWatchlist = async (symbol: string, value: boolean) => {
    let temp = []
    let message = ""

    if (value) {
      message = " has been removed to your watchlist"
      temp = (user?.watchlist ?? []).filter(s => s != symbol);
    } else {
      message = " has been added to your watchlist"
      temp = [...(user?.watchlist ?? []), symbol];
    }

    !!user?.watchlist && updateWatchlist({
      ...user,
      watchlist: temp
    }).then(() => {
      Toast.show({
        type: 'Capiwise_Success',
        position: "top",
        text1: symbol,
        text2: message
      })
    })
  };

  const getMarketData = async () => {
    setIsLoading(true)
    !!user && await Api.getTopEarningStocks("", user.email, "looser")
      .then(async (response: any) => {
        setTopTrends(response);
      })
      .catch((error) => {
        console.log(error)
      });

    setIsLoading(false)
  };

  useFocusEffect(
    useCallback(() => {
      getMarketData()
    }, [])
  );

  return (
    <ScrollView contentContainerStyle={globalStyle.scrollContainer}>
      {isLoading ? <Loading /> : <>
        <View style={styles.header}>
          <Text style={{ color: '#FFF', fontSize: 10 }}>
            View the top symbols with the most new watchers in the last 24 hours. Check back every hour for updates.
          </Text>
        </View>
        <View style={[globalStyle.justifyBetween, { paddingHorizontal: 15, marginTop: 16 }]}>
          <View style={{ width: '45%', flexDirection: 'row', gap: 50 }}>
            <Text style={styles.gridHeader}>Rank</Text>
            <Text style={styles.gridHeader}>Symbol</Text>
          </View>
          <View style={[globalStyle.justifyBetween, { width: '55%' }]}>
            <Text style={[styles.gridHeader, { width: 70 }]}>Last price</Text>
            <Text style={styles.gridHeader}>% Change</Text>
            <Text style={styles.gridHeader}>Watch</Text>
          </View>
        </View>
        <View style={[styles.divider]} />
        <View>
          <SymbolListAction data={topTrends} callback={(symbol: string, value: boolean) => handleWatchlist(symbol, value)} />
        </View>
      </>}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: "#464646",
    width: "100%",
    marginTop: 13
  },
  header: {
    height: 50,
    borderRadius: 5,
    backgroundColor: '#0B1620',
    marginHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    marginTop: 5
  },
  gridHeader: {
    fontSize: 10,
    color: '#FFF'
  }
});
