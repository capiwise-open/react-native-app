import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from "react-native";
import { globalStyle } from "../../assets/css/globalStyle"
import { LinearGradient } from "expo-linear-gradient";
import Loading from "../../components/loading/Loading"
import Api from "../../api/api";
import Toast from 'react-native-toast-message';
import { NavigationProp, RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { RootStackParams } from "../../navigation/props";

type Route = RouteProp<RootStackParams, "Second">;

export default function Second() {
  const navigation = useNavigation<NavigationProp<RootStackParams>>();
  const route = useRoute<Route>();

  const defaultFilter = [
    { 'status': false, 'label': 'Financials', 'width': 104 },
    { 'status': false, 'label': 'Banking', 'width': 104 },
    { 'status': false, 'label': 'Technology', 'width': 104 },
    { 'status': false, 'label': 'Healthcare', 'width': 104 },
    { 'status': false, 'label': 'Energy', 'width': 104 },
    { 'status': false, 'label': 'Education', 'width': 104 },
    { 'status': false, 'label': 'Retail', 'width': 104 },
    { 'status': false, 'label': 'Real State', 'width': 104 },
    { 'status': false, 'label': 'Entertainment', 'width': 132 },
  ]
  const [isLoading, setIsLoading] = useState(false)
  const leftValue = (Dimensions.get("window").width - 30) / 2 + 15
  const [filterValues, setFilterValues] = useState(defaultFilter)
  const [count, setCount] = useState(false)
  const handleOption = (index: number, value: boolean) => {
    let count = 0
    filterValues.forEach(element => {
      if (element.status)
        count++
    });

    if (count > 3 && value == false)
      return

    count = 0
    let previous = [...filterValues]
    previous[index].status = !value
    previous.forEach(element => {
      if (element.status)
        count++
    });
    if (count == 4)
      setCount(true)
    else
      setCount(false)
    setFilterValues(previous)
  }

  const handleNext = async () => {
    var temp = [...filterValues]
    let interestes: string[] = []

    temp?.forEach(item => {
      if (item.status) {
        interestes.push(item.label)
      }
    })

    if (interestes.length == 0) {
      Toast.show({
        type: 'Capiwise_Error',
        position: "top",
        text1: "",
        text2: 'Please select one option at least'
      });

      return
    }

    let data = {
      ...route?.params,
      interest: interestes
    }

    navigation.navigate("Third", data)
  }

  return (
    <View style={styles.layout}>
      {isLoading ? <Loading /> : <>
        <ScrollView contentContainerStyle={globalStyle.scrollContainer}>
          <View style={globalStyle.container}>
            <View style={styles.stepLine} />
            <View style={[styles.stepCircle, { left: leftValue - 4 }]} />
            <LinearGradient
              colors={['#FFF', '#2EBD85']}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
              style={{ top: 50, left: 15, width: leftValue - 15, height: 2, position: 'absolute' }}
            />
            <View style={[globalStyle.justifyBetween, { paddingHorizontal: 30, marginTop: 10 }]}>
              <Text style={styles.stepLabel}>Step 1</Text>
              <Text style={{ color: "#FFF", fontSize: 10, fontWeight: "bold" }}>Step 2</Text>
              <Text style={styles.stepLabel}>Step 3</Text>
            </View>
            <Text style={styles.title}>
              Interests
            </Text>
            <Text style={{ fontSize: 16, color: "#979797", marginTop: 10, textAlign: "center", }}>
              Tell us about which sectors are you more interested.
            </Text>
            <View style={{ flexDirection: 'column', gap: 5, marginTop: 40 }}>
              <View style={[globalStyle.justifyCenter, { gap: 16 }]}>
                {filterValues.slice(0, 3)?.map((item, index) => {
                  return (
                    <TouchableOpacity
                      key={'filter' + index}
                      style={[item.status ? styles.filterItemActive : styles.filterItemInActive, { width: item.width }]}
                      onPress={() => handleOption(index, item.status)}
                    >
                      <Text style={[globalStyle.h5, { fontSize: 16, fontWeight: item.status ? "bold" : 'normal' }]}>{item.label}</Text>
                    </TouchableOpacity>
                  )
                })}
              </View>
              <View style={[globalStyle.justifyCenter, { gap: 16 }]}>
                {filterValues.slice(3, 6)?.map((item, index) => {
                  return (
                    <TouchableOpacity
                      key={'filter' + index}
                      style={[item.status ? styles.filterItemActive : styles.filterItemInActive, { width: item.width }]}
                      onPress={() => handleOption(index + 3, item.status)}
                    >
                      <Text style={[globalStyle.h5, { fontSize: 16, fontWeight: item.status ? "bold" : 'normal' }]}>{item.label}</Text>
                    </TouchableOpacity>
                  )
                })}
              </View>
              <View style={[globalStyle.justifyCenter, { gap: 16 }]}>
                {filterValues.slice(6, 8)?.map((item, index) => {
                  return (
                    <TouchableOpacity
                      key={'filter' + index}
                      style={[item.status ? styles.filterItemActive : styles.filterItemInActive, { width: item.width }]}
                      onPress={() => handleOption(index + 6, item.status)}
                    >
                      <Text style={[globalStyle.h5, { fontSize: 16, fontWeight: item.status ? "bold" : 'normal' }]}>{item.label}</Text>
                    </TouchableOpacity>
                  )
                })}
              </View>
              <View style={[globalStyle.justifyCenter, { gap: 16 }]}>
                {filterValues.slice(8)?.map((item, index) => {
                  return (
                    <TouchableOpacity
                      key={'filter' + index}
                      style={[item.status ? styles.filterItemActive : styles.filterItemInActive, { width: item.width }]}
                      onPress={() => handleOption(index + 8, item.status)}
                    >
                      <Text style={[globalStyle.h5, { fontSize: 16, fontWeight: item.status ? "bold" : 'normal' }]}>{item.label}</Text>
                    </TouchableOpacity>
                  )
                })}
              </View>
            </View>
          </View>
        </ScrollView>
        <TouchableOpacity onPress={() => handleNext()} disabled={!count}>
          <View style={[globalStyle.justifyCenter, styles.nextBtn, { backgroundColor: count ? '#2EBD85' : '#979797' }]}>
            <Text style={{ fontSize: 16, color: '#FFF' }}>Next</Text>
          </View>
        </TouchableOpacity>
      </>}
    </View>
  );
}

const styles = StyleSheet.create({
  layout: {
    backgroundColor: '#040B11',
    height: '100%'
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
    marginBottom: 16,
  },
  nextBtn: {
    borderRadius: 50,
    height: 50,
    gap: 5,
    alignItems: 'center',
    marginHorizontal: 15,
    marginBottom: 10
  },
  stepLabel: {
    color: "#979797",
    fontSize: 10
  },
  stepCircle: {
    width: 8,
    height: 8,
    borderRadius: 8,
    backgroundColor: '#2EBD85',
    position: 'absolute',
    top: 47
  },
  stepLine: {
    height: 2,
    backgroundColor: '#D9D9D9',
    marginTop: 50,
    position: 'relative'
  },
  title: {
    color: "#FFF",
    fontWeight: '700',
    fontSize: 24,
    marginTop: 40,
    textAlign: 'center'
  },
  subTitle: {
    color: "#FFF",
    fontSize: 16,
    marginTop: 40,
    textAlign: 'center'
  }
});
