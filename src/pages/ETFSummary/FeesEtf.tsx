import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  Image,
  Dimensions,
} from "react-native";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { BarChart } from "react-native-gifted-charts";

import { formatDateAnalysis, getRoundOffValue } from "../../utils/utils";
import { globalStyle } from "../../assets/css/globalStyle"
import { EtfStockSummary } from "../../api/types";
import { RootStackParams } from "../../navigation/props";

export default function FeesEtf({ summary }: { summary: EtfStockSummary }) {
  const symbol = summary?.overview.details.symbol;

  const navigation = useNavigation<NavigationProp<RootStackParams>>();
  const [ratio, setRatio] = useState(0)
  const [ratioIndex, setRatioIndex] = useState(0)
  const [asOf, setAsof] = useState('')
  const [feeData, setFeeData] = useState([])
  const [maxValue, setMaxValue] = useState(10000)
  const [netData, setNetData] = useState({
    direction: 0,
    left: 0
  })

  const getETFStocks = async () => {
    setRatio(summary?.fees?.expenses?.expenseRatio)
    setRatioIndex(summary?.fees?.expenses?.expenseRatioIndex)
    setAsof(summary?.asof)

    let temp = []
    if (summary?.fees?.fees?.feeindex > summary?.fees?.fees?.feeself) {
      let stacks = []
      stacks.push({
        value: parseFloat(getRoundOffValue(summary?.fees?.fees?.feeindex)),
        color: '#E2433B',
        gradientColor: '#E2433B'
      })
      stacks.push({
        value: summary?.fees?.fees?.feeindex / 3,
        color: 'transparent',
        gradientColor: 'transparent',
        marginBottom: 5,
        innerBarComponent: () => {
          return (
            <View style={[globalStyle.justifyCenter, { height: '10%', alignItems: 'flex-end' }]}>
              <Text style={{ color: '#A1A9B6' }}>${parseFloat(getRoundOffValue(summary?.fees?.fees?.feeindex))}</Text>
            </View>
          )
        }
      })
      temp.push({ stacks: stacks })

      stacks = []
      stacks.push({
        value: parseFloat(getRoundOffValue(summary?.fees?.fees?.feeself)),
        color: '#2EBD85',
        gradientColor: '#2EBD85',
        innerBarComponent: () => {
          return (
            <View style={globalStyle.justifyCenter}>
              <Text style={{ color: '#FFF' }}>${parseFloat(getRoundOffValue(summary?.fees?.fees?.feeself))}</Text>
            </View>
          )
        }
      })
      stacks.push({
        value: parseFloat(getRoundOffValue(summary?.fees?.fees?.feeindex - summary?.fees?.fees?.feeself)),
        color: '#b3ffb3',
        gradientColor: 'white'
      })
      stacks.push({
        value: summary?.fees?.fees?.feeindex / 3 + 5,
        color: 'transparent',
        gradientColor: 'transparent',
        innerBarComponent: () => {
          return (
            <View style={[globalStyle.justifyCenter, { height: '100%', alignItems: 'flex-start' }]}>
              <Text style={{ color: '#2EBD85' }}>You save ${parseFloat(getRoundOffValue(summary?.fees?.fees?.feeindex - summary?.fees?.fees?.feeself))}</Text>
            </View>
          )
        }
      })
      temp.push({ stacks: stacks })

      setMaxValue(summary?.fees?.fees?.feeindex + summary?.fees?.fees?.feeindex / 3)
    } else {
      let stacks = []
      stacks.push({
        value: parseFloat(getRoundOffValue(summary?.fees?.fees?.feeindex)),
        color: '#E2433B',
        gradientColor: '#E2433B',
        innerBarComponent: () => {
          return (
            <View style={globalStyle.justifyCenter}>
              <Text style={{ color: '#FFF' }}>${getRoundOffValue(summary?.fees?.fees?.feeindex)}</Text>
            </View>
          )
        }
      })
      stacks.push({
        value: parseFloat(getRoundOffValue(summary?.fees?.fees?.feeself - summary?.fees?.fees?.feeindex)),
        color: '#ff704d',
        gradientColor: 'white'
      })
      stacks.push({
        value: summary?.fees?.fees?.feeself / 3 + 5,
        color: 'transparent',
        gradientColor: 'transparent',
        innerBarComponent: () => {
          return (
            <View style={[globalStyle.justifyCenter, { alignItems: 'flex-start', height: '100%' }]}>
              <Text style={{ color: '#E2433B' }}>You pay an extra ${getRoundOffValue(summary?.fees?.fees?.feeself - summary?.fees?.fees?.feeindex)}</Text>
            </View>
          )
        }
      })
      temp.push({ stacks: stacks })

      stacks = []
      stacks.push({
        value: parseFloat(getRoundOffValue(summary?.fees?.fees?.feeself)),
        color: '#E2433B',
        gradientColor: '#E2433B'
      })
      stacks.push({
        value: summary?.fees?.fees?.feeself / 3,
        color: 'transparent',
        gradientColor: 'transparent',
        marginBottom: 5,
        innerBarComponent: () => {
          return (
            <View style={[globalStyle.justifyCenter, { height: '100%', alignItems: 'flex-end' }]}>
              <Text style={{ color: '#A1A9B6' }}>${getRoundOffValue(summary?.fees?.fees?.feeself)}</Text>
            </View>
          )
        }
      })
      temp.push({ stacks: stacks })

      setMaxValue(summary?.fees?.fees?.feeself + summary?.fees?.fees?.feeself / 3)
    }

    setFeeData(temp)

    let netDataTemp = {
      direction: 0,
      left: 0
    }

    let step = (Dimensions.get("window").width - 30)
    let ratioTemp = parseFloat(getRoundOffValue(summary?.fees?.expenses?.expenseRatio))

    if (ratioTemp < 0.5) {
      if (ratioTemp <= 0)
        ratioTemp = 0

      netDataTemp = {
        direction: 0,
        left: step * ratioTemp
      }
    } else {
      if (ratioTemp >= 1)
        ratioTemp = 1
      netDataTemp = {
        direction: 1,
        left: step * ratioTemp
      }
    }

    setNetData(netDataTemp)
  };

  useEffect(() => {
    getETFStocks()
  }, [navigation]);

  return (
    <ScrollView contentContainerStyle={globalStyle.scrollContainer}>
      <View style={globalStyle.container}>
        <Text style={[globalStyle.heading, { marginTop: 20 }]}>Expenses</Text>
        <Text style={[globalStyle.h2, { color: '#FFF', letterSpacing: -0.07, marginTop: 24, textAlign: 'right' }]}>Expense ratio</Text>
        <View style={[globalStyle.justifyBetween, { marginTop: 14 }]}>
          <Text style={[globalStyle.h4, { fontSize: 12, color: '#979797' }]}>
            {symbol}
          </Text>
          <Text style={[globalStyle.h5, { fontSize: 12, letterSpacing: -0.07 }]}>
            {getRoundOffValue(ratio)}%
          </Text>
        </View>
        <View style={styles.divider} />
        <View style={[globalStyle.justifyBetween, { marginTop: 14 }]}>
          <Text style={[globalStyle.h4, { fontSize: 12, color: '#979797' }]}>
            Average expense ratio of similar funds
          </Text>
          <Text style={[globalStyle.h5, { fontSize: 12, letterSpacing: -0.07 }]}>
            {getRoundOffValue(ratioIndex)}%
          </Text>
        </View>
        <View style={styles.divider} />
        <Text style={{ ...globalStyle.h6, marginTop: 29, fontWeight: "400", letterSpacing: 0.1 }}>
          Fees on $10,000 invested over 10 years
        </Text>
        <Text style={{ color: "#979797", fontSize: 10 }}>
          As of {formatDateAnalysis(asOf)}
        </Text>
        <View style={{ marginTop: 15 }}>
          <BarChart
            stackData={feeData}
            showGradient
            hideRules
            yAxisTextStyle={globalStyle.h3}
            noOfSections={3}
            height={200}
            barWidth={70}
            spacing={70}
            yAxisLabelPrefix="$"
            xAxisColor={'#FFF'}
            maxValue={maxValue}
            disablePress={true}
          />
          <View style={[globalStyle.justifyCenter, { gap: 20, paddingLeft: 40 }]}>
            <Text style={[globalStyle.h3, { width: 120, textAlign: 'center' }]}>Category average</Text>
            <Text style={[globalStyle.h3, , { width: 120, textAlign: 'center' }]}>{symbol}</Text>
          </View>
        </View>
        <Text style={[globalStyle.h4, { fontSize: 12, color: '#979797', lineHeight: 20 }]}>
          See how costs can impact a hypothetical $10,000 investment with an annual rate of return of 9.00% over a period of 10 years, assuming no additional investments in the fund. This hypothetical illustration does not represent the return on any particular investment and does not include brokerage commissions or bid-ask spreads
        </Text>
      </View>
      <View style={[globalStyle.divider, { marginTop: 26 }]}></View>
      <View style={globalStyle.container}>
        <Text style={[globalStyle.heading, { marginTop: 20, marginBottom: 20 }]}>Net expenses ratio</Text>
        <View style={{ marginBottom: -10, zIndex: 1, marginLeft: netData?.direction == 0 ? netData?.left - 12 : netData?.left - 102 }}>
          <Image
            source={netData?.direction == 0 ?
              require("../../assets/img/left-net.png") : require("../../assets/img/right-net.png")}
            style={{ position: 'relative', width: 115, resizeMode: 'contain' }}
          />
          <View style={[globalStyle.justifyCenter, { width: 115, position: 'absolute' }]}>
            <Text style={{ color: '#FFF', width: 'auto', marginTop: 3 }}>{symbol} {getRoundOffValue(ratio)}%</Text>
          </View>
        </View>
        <View>
          <LinearGradient
            colors={['#079325', '#BB9D13', '#C36816', '#D1041B', '#990313']}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
            style={[styles.colorProgress]}
          >
            <View style={styles.colorProgressStick}>
              {[...Array(11)].map((x, i) =>
                <View key={i + `progress`} style={{ width: i == 0 || i == 10 ? 2 : 1, height: i == 0 || i == 10 ? 30 : 10, backgroundColor: i == 0 || i == 10 ? '#252A2D' : '#4B4D4C', opacity: i == 0 || i == 10 ? 1 : 0.5 }}></View>
              )}
            </View>
          </LinearGradient>
          <View style={[globalStyle.justifyCenter, { width: '100%', gap: (Dimensions.get("window").width - 210) / 10 }]}>
            {[...Array(9)].map((x, i) =>
              <Text key={i + `stick`} style={styles.stickText}>0.{i + 1}</Text>
            )}
          </View>
          <View style={styles.iconTextRow}>
            <Image
              source={ratio < 0.5 ? require("../../assets/img/check.png") : require("../../assets/img/closeaccount.png")} // Path to your local icon
              style={styles.iconSize}
            />
            <Text style={ratio < 0.5 ? styles.greenBold : styles.redBold}>
              NE Ratio:&nbsp;
              <Text style={styles.performanceSubText}>
                {symbol} it have a fair expenses rate based on NER ({getRoundOffValue(ratio)}%)
              </Text>
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  divider: {
    marginTop: 14,
    height: 0.5,
    backgroundColor: "#464646",
  },
  colorProgress: {
    width: '100%',
    height: 10,
    flexDirection: "row",
    alignItems: 'center'
  },
  colorProgressStick: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'absolute',
    alignItems: 'center'
  },
  stickText: {
    fontSize: 12,
    letterSpacing: 0.1,
    color: '#A1A9B6'
  },
  performanceSubText: {
    fontSize: 12,
    color: "#FFF",
    fontWeight: '400',
  },
  greenBold: {
    fontSize: 12,
    color: "#2EBD85",
    fontWeight: '700',
  },
  redBold: {
    fontSize: 12,
    color: "#E2433B",
    fontWeight: '700',
  },
  iconTextRow: {
    width: "100%",
    flexDirection: "row",
    paddingRight: 40,
    paddingTop: 20
  },
  iconSize: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
});
