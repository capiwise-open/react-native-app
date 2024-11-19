import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import Api from "../../api/api";
import Loading from "../../components/loading/Loading"
import { globalStyle } from "../../assets/css/globalStyle"
import SymbolList from "./SymbolList"
import { Calender } from "../../assets/img/Constant";
import moment from 'moment';
import ModalCalendar from "../../components/calendar/ModalCalendar";
import Noresult from "./Noresult";
import { useGetProfileQuery } from "../../api";

export default function Earnings({ route }) {
  const navigation = useNavigation();
  const [showCalendar, setShowCalendar] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [topTrends, setTopTrends] = useState([{
    date: "",
    count: 0,
    day: ""
  }]);
  const [stockList, setStockList] = useState([])
  const [activeIndex, setActiveIndex] = useState(0)
  const [currentDate, setCurrentDate] = useState('')
  const { data: user } = useGetProfileQuery({});

  const handleChoose = (day) => {
    if (day != '') {
      getMarketData(day)
    }

    setShowCalendar(false)
  }

  const getMarketData = async (c) => {
    setIsLoading(true)
    setCurrentDate(c)
    await Api.getTopGainerStocks("token", user?.email, c)
      .then(async (response: any) => {
        setStockList(response?.items)

        let temp = []
        Object.keys(response?.dateGroups).map((date, index) => {
          if (c == date) {
            setActiveIndex(index)
          }
          temp.push(
            {
              date: date,
              day: moment(date).format('ddd'),
              count: response?.dateGroups[date].length
            }
          )
        })

        setTopTrends(temp)
      })
      .catch((error) => {
        console.log(error)
      });

    setIsLoading(false)
  };

  useFocusEffect(
    useCallback(() => {
      getMarketData(moment().format('yyyy-MM-DD'))
    }, [])
  );

  return (
    <ScrollView contentContainerStyle={globalStyle.scrollContainer}>
      {isLoading ? <Loading /> : <>
        <View style={[globalStyle.justifyBetween, { paddingHorizontal: 15, marginTop: 5 }]}>
          <Text style={[globalStyle.h5]}>{moment(currentDate).format("MMMM yyyy")}</Text>
          <View style={[{ gap: 5 }, globalStyle.alignItemsCenter]}>
            <Calender />
            <TouchableOpacity onPress={() => setShowCalendar(true)}>
              <Text style={[globalStyle.h4]}>Choose date</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={[styles.divider]} />
        <View style={globalStyle.container}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 16 }}>
            <View style={[globalStyle.flexRow, { gap: 10 }]}>
              {topTrends?.map((data, index) => {
                return (
                  <TouchableOpacity key={index} onPress={() => { getMarketData(data.date) }}>
                    <View style={activeIndex == index ? styles.activeCard : styles.inactiveCard}>
                      <View style={[activeIndex == index ? styles.activeContent : styles.inactiveContent, globalStyle.flexColumn, { gap: 5, padding: 5 }]}>
                        <Text style={globalStyle.h5}>{data?.date?.substring(8)}</Text>
                        <Text style={[globalStyle.h5, { fontSize: 16 }]}>{data?.day}</Text>
                        <View>
                          <Text style={{ color: '#FFF', fontSize: 10 }}>{data?.count} stocks</Text>
                          <Text style={{ color: '#FFF', fontSize: 10 }}>reporting earnings today.</Text>
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                )
              })}
            </View>
          </ScrollView>
        </View>
        <View style={{ marginTop: 16 }}>
          {stockList?.length > 0 ? <SymbolList data={stockList} /> : <Noresult />}
        </View>
        <ModalCalendar
          onShow={showCalendar}
          onClose={() => setShowCalendar(false)}
          onConfirm={(day) => handleChoose(day)}
        />
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
  activeCard: {
    width: 100,
    height: 121,
    backgroundColor: '#0F69FE',
    borderRadius: 4,
    padding: 1
  },
  activeContent: {
    height: 108,
    backgroundColor: '#014ecb',
    borderTopEndRadius: 3,
    borderTopLeftRadius: 3
  },
  inactiveCard: {
    width: 100,
    height: 121,
    backgroundColor: '#FFF',
    borderRadius: 4,
    padding: 1
  },
  inactiveContent: {
    height: 108,
    backgroundColor: '#333333',
    borderTopEndRadius: 3,
    borderTopLeftRadius: 3
  }
});
