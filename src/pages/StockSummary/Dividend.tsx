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
import { PieChart } from "react-native-gifted-charts";
import { globalStyle } from "../../assets/css/globalStyle"

export default function Dividend(props) {
  const [dividendData, setDividendData] = useState<{
    dividends: any,
    profile: any,
    statistics: any
  }>();
  const [dividendDataArray, setDividendDataArray] = useState([]);
  const [marketData, setMarketData] = useState([])
  const [maxValue, setMaxValue] = useState(5);
  const [dividendYiendOfStrength, setDividendYiendOfStrength] = useState({ flag: true, percent: 100 })
  const [sustainability, setSustainability] = useState(
    {
      last: [{ value: 100, color: '#2EBD85' }, { value: 0, color: '#FFF' }],
      cur: [{ value: 100, color: '#2EBD85' }, { value: 0, color: '#FFF' }]
    }
  )

  const getDividendData = () => {
    try {
      const response = props.summary
      let dividendGraph = [];
      let dividendIndustryGraph = [];
      const da = response?.dividends?.divHistoryAnnual.slice(0, 5)

      response?.dividends_industry.slice(0, 5).forEach((value, index) => {
        dividendIndustryGraph.push({
          value: value.amount,
          label: value.year,
          width: 20,
          index: index,
          labelTextStyle: { color: "gray", width: "100%" },
        });

        if (da[index]) {
          dividendGraph.push({
            value: da[index].amount,
            label: da[index].year,
            index: index,
            width: 20,
            labelTextStyle: { color: "gray", width: "100%" },
          });
        } else {
          dividendGraph.push({
            value: 0,
            label: value.year,
            index: index,
            width: 20,
            labelTextStyle: { color: "gray", width: "100%" },
          });
        }
      });

      const combinedArray = [...dividendGraph.reverse(), ...dividendIndustryGraph.reverse()];
      const max = combinedArray.reduce(
        (max, obj) => (obj.value > max ? obj.value : max),
        combinedArray[0].value
      );

      setMaxValue(parseInt(max) + 1);
      setDividendDataArray(dividendGraph);
      setMarketData(dividendIndustryGraph)
      setDividendData(response);
      let susLast = response?.dividends?.divLastYr / response?.earnings?.earningsRetainedPastYr * 100;
      let susCur = response?.dividends?.divCurrYr / response?.earnings?.earningsRetainedCurrYr * 100;
      let sus = {
        last: [{ value: susLast, color: '#2EBD85' }, { value: 100 - susLast, color: '#FFF' }],
        cur: [{ value: susCur, color: '#2EBD85' }, { value: 100 - susCur, color: '#FFF' }]
      }

      setSustainability(sus)

      let symbolPercent = 0
      let marketLengthFlag = response?.dividends?.annDivYieldIndustry > response?.dividends?.annDivYield ? true : false

      if (marketLengthFlag) {
        if (response?.dividends?.annDivYieldIndustry == 0)
          symbolPercent = 100
        else
          symbolPercent = response?.dividends?.annDivYield / response?.dividends?.annDivYieldIndustry * 100
      } else {
        if (response?.dividends?.annDivYield == 0)
          symbolPercent = 100
        else
          symbolPercent = response?.dividends?.annDivYieldIndustry / response?.dividends?.annDivYield * 100
      }

      setDividendYiendOfStrength({ flag: marketLengthFlag, percent: symbolPercent })
    } catch (e) {
      console.log(e);
    }
  };

  const navigation = useNavigation();

  useEffect(() => {
    getDividendData();
  }, [navigation]);

  return (
    <ScrollView contentContainerStyle={globalStyle.scrollContainer}>
      <View style={globalStyle.container}>
        <View style={globalStyle.header}>
          <Text style={globalStyle.heading}>Dividend</Text>
        </View>
        <View style={[styles.TrendingStocks]}>
          <Text style={styles.TrendingSubText}>
            Dividend amount (Recent)
          </Text>
          <Text style={styles.TrendingText}>
            ${dividendData?.dividends?.amount}
          </Text>
        </View>
        <View style={[styles.divider, { marginTop: 12 }]}></View>
        <View style={[styles.TrendingStocks]}>
          <Text style={styles.TrendingSubText}>
            Pay date
          </Text>
          <Text style={styles.TrendingText}>
            {dividendData?.dividends?.payDate
              ? formatDateAnalysis(dividendData?.dividends?.payDate)
              : "NA"}
          </Text>
        </View>
        <View style={[styles.divider, { marginTop: 12 }]}></View>
        <View style={[styles.TrendingStocks]}>
          <Text style={styles.TrendingSubText}>
            Dividend frequency
          </Text>
          <Text style={styles.TrendingText}>
            {dividendData?.dividends?.frequency}
          </Text>
        </View>
        <View style={[styles.divider, { marginTop: 12 }]}></View>
        <Text
          style={[globalStyle.h6, { marginTop: 29 }]}
        >
          Strength dividend yield
        </Text>
        <View style={globalStyle.justifyBetween}>
          <View>
            <Text style={{ color: "#FFF", fontWeight: "400", fontSize: 12, letterSpacing: 0.4, marginTop: 16 }}>
              {dividendData?.profile?.symbol}
            </Text>
            <View style={styles.barContainer}>
              <View style={{ backgroundColor: '#0F69FE', height: 26, width: dividendYiendOfStrength.flag ? (dividendYiendOfStrength.percent) : 100 }} />
              <Text
                style={{
                  color: "#FFF",
                  fontSize: 24,
                }}
              >
                {getRoundOffValue(dividendData?.dividends?.annDivYield)}
                <Text
                  style={{
                    color: "#FFF",
                    fontSize: 20,
                  }}
                >%</Text>
              </Text>
            </View>
            <View
              style={{ flexDirection: "row", gap: 50, backgroundColor: "#FFF" }}
            >
              <Text style={{ color: "#979797", fontSize: 12, width: 150 }}>
                Ann. Div. / Yield
              </Text>
            </View>
          </View>
          <View>
            <Text style={{ color: "#FFF", fontWeight: "400", fontSize: 12, letterSpacing: 0.4, marginTop: 16 }}>
              Market average
            </Text>
            <View style={styles.barContainer}>
              <View style={{ backgroundColor: '#B8B9BB', height: 26, width: dividendYiendOfStrength.flag ? 100 : dividendYiendOfStrength.percent }} />
              <Text
                style={{
                  color: "#FFF",
                  fontSize: 24,
                }}
              >
                {getRoundOffValue(dividendData?.dividends?.annDivYieldIndustry)}
                <Text
                  style={{
                    color: "#FFF",
                    fontSize: 20,
                  }}
                >%</Text>
              </Text>
            </View>
            <View
              style={{ flexDirection: "row", gap: 50, backgroundColor: "#FFF" }}
            >
              <Text style={{ color: "#979797", fontSize: 12, width: 150 }}>
                Ann. Div. / Yield
              </Text>
            </View>
          </View>
        </View>
        <Text
          style={[globalStyle.h6, { marginTop: 29 }]}
        >
          Sustainability
        </Text>
        <Text style={{ color: "#979797", fontSize: 12, fontWeight: "400", marginTop: 10 }}>
          Dividend payout ratio
        </Text>
        <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', marginTop: 10 }}>
          <View style={{ flexDirection: 'column', gap: 8, alignItems: 'center' }}>
            {/* ### */}
            {/* {
              !!sustainability.last && <PieChart
                donut
                radius={50}
                innerRadius={30}
                innerCircleColor={'#0B1620'}
                data={sustainability.last}
                centerLabelComponent={() => {
                  return <Text style={{ fontSize: 24, color: '#FFF' }}>
                    {
                      sustainability?.last?.length > 0 && sustainability?.last[0]?.value
                    }
                    <Text style={{ fontSize: 20, color: '#FFF' }}>%</Text>
                  </Text>;
                }}
              />
            } */}
            <Text style={{ fontSize: 12, fontWeight: '500', color: '#FFF' }}>Last year payout</Text>
            <Text style={{ fontSize: 12, fontWeight: '400', color: '#979797' }}>(12 Months)</Text>
          </View>
          <View style={{ flexDirection: 'column', gap: 8, alignItems: 'center' }}>
            {/* ### */}
            {/* {
              !!sustainability.cur && <PieChart
                donut
                innerCircleColor={'#0B1620'}
                radius={50}
                innerRadius={30}
                data={sustainability.cur}
                centerLabelComponent={() => {
                  return <Text style={{ fontSize: 24, color: '#FFF' }}>
                    {
                      sustainability?.cur?.length > 0 && sustainability?.cur[0]?.value
                    }
                    <Text style={{ fontSize: 20, color: '#FFF' }}>%</Text>
                  </Text>;
                }}
              />
            } */}
            <Text style={{ fontSize: 12, fontWeight: '500', color: '#FFF' }}>Current payout</Text>
            <Text style={{ fontSize: 12, fontWeight: '400', color: '#979797' }}>(12 Months)</Text>
          </View>
        </View>
        <View style={{ flexDirection: 'row', gap: 8, marginTop: 16 }}>
          <View style={{ flexDirection: "row", gap: 4, alignItems: 'center' }}>
            <View
              style={{
                backgroundColor: "#2EBD85", // Set your desired color here
                width: 10,
                height: 10,
                borderRadius: 10, // To make it a circle
              }}
            />
            <Text
              style={{
                color: "#FFF",
                fontSize: 12,
                letterSpacing: -0.072,
                fontWeight: '400'
              }}
            >
              Paid as dividend
            </Text>
          </View>
          <View style={{ flexDirection: "row", gap: 4, alignItems: 'center' }}>
            <View
              style={{
                backgroundColor: "#B8B9BB", // Set your desired color here
                width: 10,
                height: 10,
                borderRadius: 10, // To make it a circle
              }}
            />
            <Text
              style={{
                color: "#FFF",
                fontSize: 12,
                letterSpacing: -0.072,
                fontWeight: '400'
              }}
            >
              Earnings retained
            </Text>
          </View>
        </View>
        <Text style={[globalStyle.h6, { marginTop: 32 }]}>Growth of dividend</Text>
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
            data={dividendDataArray}
            data2={marketData}
            maxValue={maxValue}
            hideDataPoints
            initialSpacing={20}
            spacing={(Dimensions.get('window').width - 55) / 5}
            width={Dimensions.get('window').width - 80}
            scrollToEnd
            color="#0F69FE"
            color2="#FFF"
            thickness1={3}
            thickness2={3}
            startFillColor1="#0F69FE"
            startFillColor2="#252A2D"
            endFillColor1="#8a56ce"
            endFillColor2="#56acce"
            startOpacity={0.9}
            endOpacity={0.2}
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
              pointer1Color: "#0F69FE",
              pointerStripUptoDataPoint: false,
              pointerStripColor: "#0F69FE",
              pointerStripWidth: 2,
              pointer2Color: "#FFF",
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
                      marginTop: 50,
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
                        {dividendData?.profile?.symbol}
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
                      <Text style={{ color: "#0F69FE", fontSize: 10 }}>
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
            justifyContent: "flex-start",
            gap: 20,
          }}
        >
          <View
            style={{ flexDirection: "row", gap: 5 }}
          >
            <View
              style={{
                top: 16,
                backgroundColor: "#0F69FE",
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
              {dividendData?.profile?.symbol}
            </Text>
          </View>
          <View
            style={{ flexDirection: "row", gap: 5 }}
          >
            <View
              style={{
                top: 16,
                backgroundColor: "#B8B9BB",
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
              Market average
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
          {dividendData?.statistics?.divExDate
            ? formatDateAnalysis(dividendData?.statistics?.divExDate)
            : "NA"}
          )
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  barContainer: {
    flexDirection: "row",
    width: "100%",
    marginTop: 15,
    marginBottom: 5,
    alignItems: 'center',
    gap: 7
  },
  TrendingStocks: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 12,
  },
  divider: {
    width: '100%',
    marginTop: 25,
    height: 2,
    backgroundColor: "#252A2D",
  },
  TrendingText: {
    color: "#FFF", fontSize: 12, fontWeight: "bold"
  },
  TrendingSubText: {
    color: "#979797", fontSize: 12, fontWeight: '400'
  },
});
