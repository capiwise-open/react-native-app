import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,

  Modal,
  Dimensions
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useRoute } from "@react-navigation/native";
import { globalStyle } from "../../assets/css/globalStyle"
import CheckComponent from "../../components/checkbox/CheckComponent";
import { Close, DeleteWhite, Confirm_delete_icon } from "../../assets/img/Constant"
import Api from "../../api/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Loading from "../../components/loading/Loading"
import { LineChart } from "react-native-gifted-charts";
import { getRoundOffValue } from "../../utils/utils";
import { useGetProfileQuery, useUpdateWatchlistMutation } from "../../api";
import { watchlistApi } from "../../api/watchlist";
import { useDispatch } from "react-redux";

export default function WatchListMainEdit({ navigation, route }) {
  const { watchList } = route.params?.data;
  const { data: user } = useGetProfileQuery({});
  const dispatch = useDispatch();
  const [itemStatus, setItemStatus] = useState<any[]>([])
  const [selectCount, setSelectCount] = useState(0)
  const [showConfrim, setShowConfirm] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const [updateWatchlist] = useUpdateWatchlistMutation();

  const handleDelectConfirm = () => {
    if (selectCount > 0)
      setShowConfirm(true)
  }
  const handlePrev = () => {
    navigation.navigate("T_Watchlist")
  }
  const handleSave = async () => {
    if (selectCount > 0) {
      let temp = []

      itemStatus?.forEach((element: any) => {
        if (element.status == true)
          temp.push(element.symbol)
      });
      !!user && updateWatchlist({
        id: user?.id,
        watchlist: [...user?.watchlist?.filter(s => itemStatus?.findIndex(item => item.status === true && item.symbol === s) < 0)]
      }).then(async () => {
        await AsyncStorage.setItem("rc", selectCount.toString())
        navigation.navigate("T_Watchlist");
        dispatch(watchlistApi.util.invalidateTags(['Watchlist']));
      })
    } else {
      Alert.alert("Error", "Please select symbols");
    }
  }
  const handleCheckBox = (s: string) => {
    let updated = itemStatus?.map((item: any) => {
      if (item.symbol == s) {
        item.status = !item.status
        if (item.status == true)
          setSelectCount(selectCount + 1)
        else
          setSelectCount(selectCount - 1)
      }

      return item
    })

    !!updated && setItemStatus([...updated])
  }

  useEffect(() => {
    let itemStatusTemp: any[] = []
    watchList.map((item: any) => {
      itemStatusTemp.push({
        symbol: item.symbol,
        status: false
      })
    })

    !!itemStatusTemp && setItemStatus([...itemStatusTemp])
  }, []);

  return (
    <View style={{ backgroundColor: '#040B11', height: '100%' }}>
      <ScrollView contentContainerStyle={[globalStyle.scrollContainer, { marginTop: 30 }]}>
        {isLoading ? <Loading /> : <>
          <View style={globalStyle.container}>
            <Modal
              animationType="slide"
              transparent={true}
              visible={showConfrim}
            >
              <View style={[globalStyle.alignItemsCenter, styles.modalLayout]}>
                <View style={styles.modalBody}>
                  <Confirm_delete_icon />
                  <Text style={[globalStyle.h5, { fontSize: 22, letterSpacing: 0.8 }]}>Are you sure?</Text>
                  <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={[globalStyle.h5, { fontSize: 16, letterSpacing: 0.5, fontWeight: 'normal' }]}>
                      You want to remove these <Text style={{ color: '#E2433B', fontWeight: 'bold' }}>"{selectCount} {selectCount > 1 ? "symbols" : "symbol"}"</Text>
                    </Text>
                    <Text style={[globalStyle.h5, { fontSize: 16, letterSpacing: 0.5, fontWeight: 'normal' }]}>
                      from your watchlist.
                    </Text>
                  </View>
                  <View style={[globalStyle.justifyBetween, { marginHorizontal: 15, gap: 16 }]}>
                    <TouchableOpacity onPress={() => setShowConfirm(false)}>
                      <View style={[styles.confirmBtn, { borderColor: '#FFF' }]}><Text style={styles.confirmLabel}>Cancel</Text></View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleSave()}>
                      <View style={[styles.confirmBtn, { backgroundColor: '#E2433B' }]}><Text style={styles.confirmLabel}>Remove</Text></View>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Modal>
            <View style={[globalStyle.header, { alignItems: 'center' }]}>
              <Text style={globalStyle.heading}>Edit list</Text>
              <TouchableOpacity onPress={handlePrev}><Close /></TouchableOpacity>
            </View>
            <Text style={[globalStyle.heading, { fontWeight: '400', fontSize: 14, marginTop: 16 }]}>{watchList?.length} Symbols</Text>
            <View style={[globalStyle.justifyBetween, { marginTop: 16, marginBottom: 0 }]}>
              <Text style={[globalStyle.h2, { fontSize: 10, letterSpacing: 0.2, width: 130 }]}>Symbol</Text>
              <Text style={[globalStyle.h2, { fontSize: 10, letterSpacing: 0.2 }]}>Price chart</Text>
              <Text style={[globalStyle.h2, { fontSize: 10, letterSpacing: 0.2 }]}>Market price</Text>
            </View>
          </View>
          {watchList?.map((item: any, index: number) => {
            return (
              <View key={'watch' + index}>
                <View style={[globalStyle.container]}>
                  <View style={[globalStyle.justifyBetween, { marginTop: 13, alignItems: 'center' }]}>
                    <View style={{ flexDirection: 'row', gap: 6, alignItems: 'center', width: 130 }}>
                      <CheckComponent
                        checked={itemStatus[index]?.status}
                        onPress={() => handleCheckBox(itemStatus[index]?.symbol)}
                      />
                      <Image style={{ width: 20, height: 20, borderRadius: 20 }}
                        source={item.logo == "" ? require("../../assets/img/no_symbol_logo.png") : { uri: `${item.logo}` }}
                      />
                      <View style={{ flexDirection: 'column', gap: 5 }}>
                        <Text style={[globalStyle.h5, { fontSize: 12, letterSpacing: -0.07 }]}>
                          {item.symbol}
                        </Text>
                        <Text style={[globalStyle.h4, { letterSpacing: -0.1, fontSize: 10 }]}>
                          {item.name?.length > 20 ? item.name.substring(0, 17) + '...' : item.name}
                        </Text>
                      </View>
                    </View>
                    <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                      <View style={{ height: 25 }}>
                        <LineChart
                          curved
                          data={[{ value: parseFloat(item.open) - parseFloat(item.low) }, { value: 0 }, { value: parseFloat(item.high) - parseFloat(item.low) }, { value: parseFloat(item.close) - parseFloat(item.low) }]}
                          height={25}
                          width={100}
                          maxValue={parseFloat(item.high) - parseFloat(item.low) === 0 ? 0.01 : parseFloat(item.high) - parseFloat(item.low)}
                          hideRules
                          thickness={2}
                          initialSpacing={0}
                          color1={item.change < 0 ? "#E2433B" : "#2EBD85"}
                          hideDataPoints
                          yAxisColor="transparent"
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
                    <View style={{ flexDirection: 'column', gap: 5 }}>
                      <Text style={[globalStyle.h5, { fontSize: 12, letterSpacing: -0.07, textAlign: 'right' }]}>
                        ${getRoundOffValue(item.close)}
                      </Text>
                      <Text
                        style={[globalStyle.h4, {
                          letterSpacing: -0.1, fontSize: 10, textAlign: 'right', fontWeight: '700',
                          color: item.change > 0 ? '#2EBD85' : '#E2433B'
                        }]}>
                        {item.change > 0 ? '+' : ''}{getRoundOffValue(item.change)} ({getRoundOffValue(item.percent_change)}%)
                      </Text>
                    </View>
                  </View>
                </View>
                <View style={[styles.divider]} />
              </View>)
          })}
        </>}
      </ScrollView>
      <TouchableOpacity onPress={() => handleDelectConfirm()}>
        <View style={[globalStyle.justifyCenter, styles.deleteBtn, { backgroundColor: selectCount > 0 ? '#2EBD85' : '#979797' }]}>
          <DeleteWhite />
          <Text style={{ fontSize: 16, color: '#FFF' }}>Delete {selectCount > 0 ? selectCount : ''} {selectCount > 1 ? "symbols" : "symbol"}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  modalLayout: {
    justifyContent: 'center',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  modalBody: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
    backgroundColor: '#0B1620',
    width: Dimensions.get("window").width - 30,
    borderRadius: 10,
    paddingVertical: 30
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: "#464646",
    width: "100%",
    marginTop: 13
  },
  checkBox: {
    backgroundColor: '#040B11', padding: 0, marginLeft: 0
  },
  deleteBtn: {
    borderRadius: 50,
    height: 50,
    gap: 5,
    alignItems: 'center',
    marginHorizontal: 15,
    marginBottom: 10
  },
  confirmBtn: {
    width: 150,
    height: 50,
    marginTop: 20,
    borderWidth: 1,
    borderRadius: 50,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center'
  },
  messageContainer: {
    position: 'absolute',
    top: 50,
    zIndex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    paddingHorizontal: 15,
    paddingVertical: 3
  },
  messageText: {
    color: "white",
    marginLeft: 10,
  },
  messageBody: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: "#007C4A",
    padding: 10,
    borderRadius: 5,
  },
  confirmLabel: {
    color: '#FFF',
    letterSpacing: 0.14,
    fontWeight: 'bold'
  }
});
