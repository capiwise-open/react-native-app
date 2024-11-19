import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  Dimensions
} from "react-native";
import { LineChart } from "react-native-gifted-charts";
import { formatDateAnalysis, getRoundOffValue } from "../../utils/utils";
import { useNavigation } from "@react-navigation/native";
import { globalStyle } from "../../assets/css/globalStyle"
import { EtfStockSummary, StockSummary } from "../../api/types";

export default function DividendEtf({ summary }: { summary: EtfStockSummary }) {
  const symbol = summary?.overview.details.symbol;
  const [dividend, setDividend] = useState({
    amount: 0,
    frequency: '1999-01-01'
  })
  const [strength, setStrength] = useState({
    self: 0,
    index: 0
  })
  const [asOf, setAsOf] = useState()
  const [dividendYiendOfStrength, setDividendYiendOfStrength] = useState({ flag: true, percent: 100 })
  const [maxValue, setMaxValue] = useState(5);
  const [selfData, setSelfData] = useState([]);
  const [indexData, setIndexData] = useState([]);


  const getETFStocks = async () => {
    let dividendSelf = [];
    let dividendIndex = [];
    const da = summary?.dividends?.growthDividend?.selfDividends.slice(0, 5)

    await summary?.dividends?.growthDividend?.indexDividends.slice(0, 5).forEach((value, index) => {
      dividendIndex.push({
        value: value.amount,
        label: value.year,
        index: index,
        width: 20,
        labelTextStyle: { color: "gray", width: "100%" },
      });

      if (da[index]) {
        dividendSelf.push({
          value: da[index].amount,
          label: da[index].year,
          index: index,
          width: 20,
          labelTextStyle: { color: "gray", width: "100%" },
        });
      } else {
        dividendSelf.push({
          value: 0,
          label: value.year,
          index: index,
          width: 20,
          labelTextStyle: { color: "gray", width: "100%" },
        });
      }
    });

    const combinedArray = [...dividendSelf.reverse(), ...dividendIndex.reverse()];
    const max = await combinedArray.reduce(
      (max, obj) => (obj.value > max ? obj.value : max),
      combinedArray[0].value
    );
    setAsOf(summary?.asof)
    setMaxValue(parseInt(max) + 1);
    setSelfData(dividendSelf);
    setIndexData(dividendIndex)

    setDividend({
      amount: summary?.dividends?.dividend?.dividendAmount,
      frequency: summary?.dividends?.dividend?.frequency
    })

    setStrength({
      self: summary?.dividends?.strenthDividendYield?.self,
      index: summary?.dividends?.strenthDividendYield?.marketAverage
    })

    let symbolPercent = 0
    let marketLengthFlag = summary?.dividends?.strenthDividendYield?.self > summary?.dividends?.strenthDividendYield?.marketAverage ? true : false

    if (marketLengthFlag) {
      if (summary?.dividends?.strenthDividendYield?.marketAverage == 0)
        symbolPercent = 100
      else
        symbolPercent = summary?.dividends?.strenthDividendYield?.marketAverage / summary?.dividends?.strenthDividendYield?.self * 100;
    } else {
      if (summary?.dividends?.strenthDividendYield?.self == 0)
        symbolPercent = 100
      else
        symbolPercent = summary?.dividends?.strenthDividendYield?.self / summary?.dividends?.strenthDividendYield?.marketAverage * 100;
    }

    setDividendYiendOfStrength({ flag: marketLengthFlag, percent: symbolPercent })
  };

  useEffect(() => {
    getETFStocks();
  }, []);

  return (
    <ScrollView contentContainerStyle={globalStyle.scrollContainer}>
      <View style={globalStyle.container}>
        <Text style={[globalStyle.heading, { marginTop: 20 }]}>Dividend</Text>
        <View style={[globalStyle.justifyBetween]}>
          <Text style={[globalStyle.h2, { marginTop: 10, letterSpacing: 0.1 }]}>Dividend amount (Recent)</Text>
          <Text style={[globalStyle.h3, { marginTop: 10, color: '#FFF' }]}>${getRoundOffValue(dividend?.amount)}</Text>
        </View>
        <View style={styles.dividerUpcome} />
        <View style={[globalStyle.justifyBetween]}>
          <Text style={[globalStyle.h2, { marginTop: 10, letterSpacing: 0.1 }]}>Pay date</Text>
          <Text style={[globalStyle.h3, { marginTop: 10, color: '#FFF' }]}></Text>
        </View>
        <View style={styles.dividerUpcome} />
        <View style={[globalStyle.justifyBetween]}>
          <Text style={[globalStyle.h2, { marginTop: 10, letterSpacing: 0.1 }]}>Dividend frequency</Text>
          <Text style={[globalStyle.h3, { marginTop: 10, color: '#FFF' }]}>{dividend?.frequency}</Text>
        </View>
        <View style={styles.dividerthick} />
        <Text style={[globalStyle.h6, { marginTop: 29 }]}>
          Strength dividend yield
        </Text>
        <View style={globalStyle.justifyBetween}>
          <View>
            <Text style={{ color: "#FFF", fontWeight: "500", fontSize: 12, letterSpacing: 0.4, marginTop: 16 }}>
              {symbol}
            </Text>
            <View style={styles.barContainer}>
              <View style={{ backgroundColor: '#0F69FE', height: 26, width: dividendYiendOfStrength.flag ? 100 : dividendYiendOfStrength.percent }} />
              <Text style={{ color: "#FFF", fontSize: 24 }}>
                {getRoundOffValue(strength?.self)}
                <Text style={{ color: "#FFF", fontSize: 20, }}>%</Text>
              </Text>
            </View>
            <View style={{ flexDirection: "row", gap: 50, backgroundColor: "#FFF" }}>
              <Text style={{ color: "#979797", fontSize: 12, width: 150 }}>
                Ann. Div. / Yield
              </Text>
            </View>
          </View>
          <View>
            <Text style={{ color: "#FFF", fontWeight: "500", fontSize: 12, letterSpacing: 0.4, marginTop: 16 }}>
              Market average
            </Text>
            <View style={styles.barContainer}>
              <View style={{ backgroundColor: '#B8B9BB', height: 26, width: dividendYiendOfStrength.flag ? dividendYiendOfStrength.percent : 100 }} />
              <Text style={{ color: "#FFF", fontSize: 24, }}>
                {getRoundOffValue(strength?.index)}
                <Text style={{ color: "#FFF", fontSize: 20, }}>%</Text>
              </Text>
            </View>
            <View style={{ flexDirection: "row", gap: 50, backgroundColor: "#FFF" }}>
              <Text style={{ color: "#979797", fontSize: 12, width: 150 }}>
                Ann. Div. / Yield
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.dividerthick} />
        <Text style={[globalStyle.h6, { marginTop: 29 }]}>
          Growth of dividend
        </Text>
        <Text style={{ color: "#979797", fontSize: 12, fontWeight: "400", marginTop: 10 }}>
          Annualized dividend (YoY % chg.){" "}
        </Text>
        <View
          style={{
            paddingVertical: 10,
            paddingLeft: 0,
            backgroundColor: "transparent",
          }}
        >
          <LineChart
            areaChart
            curved
            hideRules
            adjustToWidth={true}
            data={selfData}
            data2={indexData}
            maxValue={maxValue}
            hideDataPoints
            initialSpacing={20}
            spacing={(Dimensions.get('window').width - 55) / 5}
            width={Dimensions.get('window').width - 80}
            scrollToEnd
            color="#2EBD85"
            color2="#ED8928"
            thickness1={3}
            thickness2={3}
            startFillColor1="#2EBD85"
            startFillColor2="#ED8928"
            endFillColor1="#2EBD85"
            endFillColor2="#ED8928"
            startOpacity={0.3}
            endOpacity={0.1}
            noOfSections={4}
            yAxisColor="white"
            yAxisThickness={0}
            rulesType="solid"
            rulesColor="gray"
            yAxisTextStyle={{ color: "gray" }}
            yAxisLabelSuffix="%"
            xAxisColor="lightgray"
            pointerConfig={{
              showPointerStrip: true,
              pointerVanishDelay: 50000,
              pointer1Color: "#2EBD85",
              pointerStripUptoDataPoint: false,
              pointerStripColor: "#0F69FE",
              pointerStripWidth: 2,
              pointer2Color: "#FFA412",
              radius: 4,
              pointerLabelWidth: 80,
              pointerLabelHeight: 120,
              pointerLabelComponent: (items) => {
                let left = 10
                if (items[0].index < 2)
                  left = -70
                return (
                  <View
                    style={{
                      left: left,
                      padding: 10,
                      backgroundColor: "#040B11",
                      opacity: 0.9,
                      borderRadius: 4,
                      marginTop: 70,
                    }}
                  >
                    <Text style={{ color: "#FFF", fontSize: 10 }}>
                      {items[0].label}
                    </Text>
                    <View
                      style={{
                        width: "100%",
                        height: 1,
                        backgroundColor: "lightgray",
                        marginTop: 4,
                        marginBottom: 4,
                      }}
                    />

                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <Text style={{ color: "#979797", fontSize: 10 }}>
                        {symbol}
                      </Text>
                      <Text style={{ color: "#2EBD85", fontSize: 10 }}>
                        %{getRoundOffValue(items[0].value)}
                      </Text>
                    </View>
                    <View
                      style={{
                        width: "100%",
                        height: 1,
                        backgroundColor: "lightgray",
                        marginTop: 4,
                        marginBottom: 4,
                      }}
                    />
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <Text style={{ color: "#979797", fontSize: 10 }}>
                        Market
                      </Text>
                      <Text style={{ color: "#FFA412", fontSize: 10 }}>
                        %{getRoundOffValue(items[1].value)}
                      </Text>
                    </View>
                  </View>
                );
              },
            }}
          />
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "flex-end",
            gap: 20,
          }}
        >
          <View
            style={{ flexDirection: "row", gap: 5 }}
          >
            <View
              style={{
                top: 16,
                backgroundColor: "#2EBD85",
                width: 12,
                height: 12,
                borderRadius: 10,
              }}
            />
            <Text
              style={{
                position: "relative",
                top: 12,
                textAlign: "right",
                color: "#FFF",
              }}
            >
              {symbol}
            </Text>
          </View>
          <View
            style={{ flexDirection: "row", gap: 5 }}
          >
            <View
              style={{
                top: 16,
                backgroundColor: "#FFA412",
                width: 12,
                height: 12,
                borderRadius: 10,
              }}
            />
            <Text
              style={{
                position: "relative",
                top: 12,
                textAlign: "right",
                color: "#FFF",
              }}
            >
              Index
            </Text>
          </View>
        </View>
        <Text
          style={{
            color: "#979797",
            paddingVertical: 20,
            fontWeight: "300",
            fontSize: 12
          }}
        >
          (Annualized as of last ex-date{" "}
          {formatDateAnalysis(asOf)}
          )
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  dividerUpcome: {
    borderBottomWidth: 1,
    borderBottomColor: "#A1A9B6",
    width: "100%",
    paddingTop: 11,
  },
  dividerthick: {
    borderBottomWidth: 2,
    borderBottomColor: "#252A2D",
    width: "100%",
    paddingTop: 29,
  },
  barContainer: {
    flexDirection: "row",
    width: "100%",
    marginTop: 15,
    marginBottom: 5,
    alignItems: 'center',
    gap: 7
  },
});
