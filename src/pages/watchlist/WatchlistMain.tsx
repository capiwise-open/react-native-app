import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  
  Dimensions,
} from "react-native";
import { useNavigation, useFocusEffect, NavigationProp } from "@react-navigation/native";
import { globalStyle } from "../../assets/css/globalStyle"
import AsyncStorage from "@react-native-async-storage/async-storage";
import Api from "../../api/api";
import { EditPencilCircle, Filter, AddCircle, Close, XLetter, AddWatchImage, Notfind } from "../../assets/img/Constant"
import Loading from "../../components/loading/Loading"
import Modal from 'react-native-modal';
import Toast from "react-native-toast-message";
import SymbolList from "./SymbolList"
import { useGetMyWatchListQuery } from "../../api/watchlist";
import { RootStackParams } from "../../navigation/props";
import { BottomTabParams } from "../../components/bottombar/params";
import { useSelector } from "react-redux";
import { useGetProfileQuery } from "../../api";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { ScrollView } from "react-native";

export default function WatchlistMain({ route }) {
  const navigation = useNavigation<NavigationProp<RootStackParams>>();
  const bottomNavigation = useNavigation<NavigationProp<BottomTabParams>>();
  const { data: userProfile } = useGetProfileQuery({});

  const [skip, setSkip] = React.useState(false);
  const { data: watchList, isFetching: isWatchlistFetching, isLoading: isWatchlistLoading, isError: isWatchlistError } = useGetMyWatchListQuery({ email: userProfile?.email, token: "" }, { skip });
  const [filteredWatchList, setFilteredWatchList] = useState(watchList);

  const defaultFilter = {
    'type': [
      { 'status': false, 'label': 'Alphabetically', 'value': 'Alphabetically', 'width': 155 },
      { 'status': false, 'label': 'Stock', 'value': 'Common Stock', 'width': 85 },
      { 'status': false, 'label': 'ETF', 'value': 'ETF', 'width': 75 }
    ],
    'performance': [
      { 'status': false, 'label': 'Gainers today', 'width': 150 },
      { 'status': false, 'label': 'Losers today', 'width': 135 },
      { 'status': false, 'label': 'Trend', 'width': 85 },
    ]
  }

  const [showFilter, setShowFilter] = useState(false)
  const [filterValues, setFilterValues] = useState(defaultFilter)
  const [filterCount, setFilterCount] = useState(0)

  const handleEdit = () => {
    navigation.navigate("WatchListEdit", {
      data: {
        watchList: filteredWatchList,
      },
    });
  }
  const handleSearchSymbol = () => {
    navigation.navigate("ExploreSearch")
  }
  const handleClearFilter = () => {
    setFilterValues(defaultFilter)
    setFilterCount(0)
    setFilteredWatchList([...watchList]);
    setShowFilter(false)
  }

  const handleShowResult = async () => {
    let tValue = []
    let temp = watchList
    let alphaSort = false

    filterValues?.type.forEach((item) => {
      if (item.status == true) {
        if (item.value == "Alphabetically")
          alphaSort = true
        else
          tValue.push(item.value)
      }
    })

    if (tValue.length > 0)
      temp = temp.filter(item => tValue.includes(item.type))

    if (filterValues.performance[2].status)
      temp = temp.filter(item => item.isTrending == true)

    if (filterValues.performance[0].status)
      temp = temp.filter(item => item.isGained == true)

    if (filterValues.performance[1].status)
      temp = temp.filter(item => item.isLost == true)

    if (alphaSort) {
      await temp.sort((a, b) => {
        const nameA = a.symbol.toUpperCase();
        const nameB = b.symbol.toUpperCase();
        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }
        return 0;
      });
    }

    setFilteredWatchList([...temp]);
  }
  useEffect(() => {
    handleShowResult();
  }, [watchList]);

  const handleSearch = (type, index, value) => {
    let previous = { ...filterValues }
    if (type == "type") {
      previous.type[index].status = !value
      setFilterValues(prevState => ({
        ...prevState,
        type: previous.type,
      }));
    } else {
      if (index != 2) {
        previous.performance[0].status = false
        previous.performance[1].status = false
      }

      previous.performance[index].status = !value
      setFilterValues(prevState => ({
        ...prevState,
        performance: previous.performance,
      }));
    }

    let typeFilter = previous.type.filter((item) => item.status == true)
    let performanceFilter = previous.performance.filter((item) => item.status == true)
    setFilterCount(typeFilter.length + performanceFilter.length)
    handleShowResult()
  }

  const getRemoveCount = async () => {
    const rc = await AsyncStorage.getItem("rc")
    const count = parseInt(rc)
    if (count > 0) {
      let msg = ""
      if (count > 1)
        msg = `You have successfully removed ${count} items${"\n"}from your watchlist.`
      else
        msg = `You have successfully removed ${count} items${"\n"}from your watchlist.`
      Toast.show({
        type: 'Capiwise_Success',
        position: "top",
        text1: msg,
      })

      await AsyncStorage.setItem("rc", "0")
    }
  }

  useFocusEffect(
    useCallback(() => {
      setSkip(false);
      getRemoveCount()
    }, [])
  )

  return (
    <SafeAreaView style={{ backgroundColor: "#040B11", minHeight: '100%' }}>
      <StatusBar backgroundColor={'#0B1620'} style="light" />
      {(isWatchlistLoading || isWatchlistError) ? <Loading /> :
        <>
          <View style={{ ...globalStyle.container, paddingVertical: 0 }}>
            <View style={[globalStyle.header, { alignItems: 'baseline', height: 60, }]}>
              <Text style={globalStyle.heading}>My watchlist</Text>
              <Text style={[globalStyle.heading, { fontWeight: '400', fontSize: 14 }]}>{watchList?.length} Symbols</Text>
            </View>
            <View style={[globalStyle.justifyBetween, { marginTop: 16 }]}>
              <TouchableOpacity onPress={() => setShowFilter(true)}>
                <View style={[globalStyle.alignItemsCenter, { gap: 10 }]}>
                  <Filter />
                  <Text style={[globalStyle.h4, { fontSize: 14 }]}>Filters</Text>
                </View>
              </TouchableOpacity>
              <View style={[globalStyle.justifyBetween, { width: 140 }]}>
                <TouchableOpacity onPress={() => handleEdit()}>
                  <View style={[globalStyle.alignItemsCenter, { gap: 10 }]}>
                    <EditPencilCircle />
                    <Text style={[globalStyle.h4, { fontSize: 14 }]}>Edit</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleSearchSymbol()}>
                  <View style={[globalStyle.alignItemsCenter, { gap: 10 }]}>
                    <AddCircle />
                    <Text style={[globalStyle.h4, { fontSize: 14 }]}>Add</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
            <View style={[styles.filterLayout, { marginTop: 16, gap: 5 }]}>
              {filterValues?.type?.map((item, index) => {
                return (
                  item.status &&
                  <TouchableOpacity
                    key={'filter' + index}
                    style={[styles.filterItemActive, { height: 25, marginBottom: 5, width: item.width }]}
                    onPress={() => handleSearch("type", index, item.status)}
                  >
                    {item.status ? <XLetter /> : <></>}
                    <Text style={[globalStyle.h5, { fontSize: 16, fontWeight: '400' }]}>{item.label}</Text>
                  </TouchableOpacity>
                )
              })}
              {filterValues?.performance?.map((item, index) => {
                return (
                  item.status &&
                  <TouchableOpacity
                    key={'filterper' + index}
                    style={[styles.filterItemActive, { height: 25, marginBottom: 5, width: item.width }]}
                    onPress={() => handleSearch("performance", index, item.status)}
                  >
                    {item.status ? <XLetter /> : <></>}
                    <Text style={[globalStyle.h5, { fontSize: 16, fontWeight: '400' }]}>{item.label}</Text>
                  </TouchableOpacity>
                )
              })}
              {filterCount > 0 ? <TouchableOpacity
                style={[styles.filterItemInActive, { height: 25, marginBottom: 5 }]}
                onPress={() => handleClearFilter()}
              >
                <Text style={[globalStyle.h5, { fontWeight: '400', fontSize: 16, paddingHorizontal: 15 }]}>Clear all</Text>
              </TouchableOpacity> : <></>}
            </View>
            <View style={[globalStyle.justifyBetween, { marginTop: 16, display: watchList?.length > 0 ? "flex" : 'none' }]}>
              <Text style={[globalStyle.h2, { fontSize: 10, letterSpacing: 0.2, width: 130 }]}>Symbol</Text>
              <Text style={[globalStyle.h2, { fontSize: 10, letterSpacing: 0.2 }]}>Price chart</Text>
              <Text style={[globalStyle.h2, { fontSize: 10, letterSpacing: 0.2 }]}>Market price</Text>
            </View>
          </View>
          {/* <View style={[styles.divider, { marginTop: 0.1, display: filteredWatchList?.length > 0 ? "flex" : 'none' }]} /> */}
          <ScrollView contentContainerStyle={{ backgroundColor: "#040B11", paddingBottom: 70 }}>
            {
              filteredWatchList?.length > 0 ?
                <SymbolList data={filteredWatchList} />
                : watchList?.length > 0 ?
                  <><View style={{ height: '70%', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                    <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 20, height: 200 }}>
                      <Notfind />
                      <Text style={{ color: '#FFF', fontSize: 24, width: 300, textAlign: 'center' }}>We couldn’t find any results for this search</Text>
                    </View></View>
                  </> : <></>
            }
          </ScrollView>
          {
            watchList?.length == 0 ?
              <>
                <View style={globalStyle.container}>
                  <View style={styles.layout}>
                    <View>
                      <Text style={styles.title}>Add symbols to your watchlist</Text>
                      <Text style={styles.title}>for quick access to your</Text>
                      <Text style={styles.title}>favourite companies</Text>
                    </View>
                    <View style={{ marginTop: 5 }}>
                      <AddWatchImage />
                    </View>
                    <TouchableOpacity onPress={() => handleSearchSymbol()} style={[styles.confirmBtn, { backgroundColor: '#2EBD85' }]}>
                      <Text style={{ color: '#FFF' }}>+Add symbols</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </> : <></>
          }
        </>
      }
      <Modal
        isVisible={showFilter}
        animationIn="slideInLeft"
        animationOut="slideOutLeft"
      >
        <View style={styles.filterModal}>
          <View style={[globalStyle.header, { alignItems: 'center', paddingHorizontal: 15 }]}>
            <Text style={globalStyle.heading}>Filters</Text>
            <TouchableOpacity onPress={() => setShowFilter(false)}><Close /></TouchableOpacity>
          </View>
          <View style={[styles.divider, { marginTop: 20 }]} />
          <Text style={[globalStyle.h5, { paddingHorizontal: 15, marginTop: 16, letterSpacing: 1 }]}>Type</Text>
          <View style={[styles.filterLayout, { marginTop: 16, paddingHorizontal: 15 }]}>
            {filterValues?.type?.map((item, index) => {
              return (
                <TouchableOpacity
                  key={'filter' + index}
                  style={[item.status ? styles.filterItemActive : styles.filterItemInActive, { width: item.width }]}
                  onPress={() => handleSearch("type", index, item.status)}
                >
                  {item.status ? <XLetter /> : <></>}
                  <Text style={[globalStyle.h5, { fontSize: 16, fontWeight: item.status ? "bold" : 'normal' }]}>{item.label}</Text>
                </TouchableOpacity>
              )
            })}
          </View>
          <View style={[styles.divider, { marginTop: 20 }]} />
          <View style={[globalStyle.justifyBetween, { paddingHorizontal: 15, marginTop: 16, alignItems: 'baseline' }]}>
            <Text style={[globalStyle.h5, { letterSpacing: 1 }]}>Performance</Text>
          </View>
          <View style={[styles.filterLayout, { marginTop: 16, paddingHorizontal: 15 }]}>
            {filterValues?.performance?.map((item, index) => {
              return (
                <TouchableOpacity
                  key={'filter' + index}
                  style={[item.status ? styles.filterItemActive : styles.filterItemInActive, { width: item.width }]}
                  onPress={() => handleSearch("performance", index, item.status)}
                >
                  {item.status ? <XLetter /> : <></>}
                  <Text style={[globalStyle.h5, { fontSize: 16, fontWeight: item.status ? "bold" : 'normal' }]}>{item.label}</Text>
                </TouchableOpacity>
              )
            })}
          </View>
          <Text style={[globalStyle.h2, { letterSpacing: 0.1, paddingHorizontal: 15, marginTop: 10 }]}>*Please select one item only</Text>
          <View style={[globalStyle.justifyBetween, { paddingHorizontal: 15, marginTop: 50 }]}>
            <TouchableOpacity
              style={[styles.filterItemInActive, { paddingHorizontal: 25, height: 48 }]}
              onPress={() => handleClearFilter()}
            >
              <Text style={[globalStyle.h5, { fontWeight: 'normal', fontSize: 16 }]}>Clear filters</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterItemInActive, { backgroundColor: '#2EBD85', borderColor: '#2EBD85', paddingHorizontal: 25, height: 48 }]}
              onPress={() => setShowFilter(false)}
            >
              <Text style={[globalStyle.h5, { fontSize: 16, fontWeight: 'normal' }]}>Show results</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: "#464646",
    width: "100%",
    marginTop: 13
  },
  filterModal: {
    backgroundColor: '#0B1620',
    width: Dimensions.get("window").width - 30,
    borderRadius: 10,
    paddingBottom: 16,
  },
  filterLayout: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    gap: 16
  },
  filterItemActive: {
    borderRadius: 50,
    height: 40,
    justifyContent: 'center',
    backgroundColor: '#0F69FE',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 5
  },
  filterItemInActive: {
    borderRadius: 50,
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#FFF',
    marginBottom: 16
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
  }
});
