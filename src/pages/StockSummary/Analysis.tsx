import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  Image,
  Dimensions
} from "react-native";
import { LineChart, BarChart } from "react-native-gifted-charts";
import { getRoundOffValue, convertLargeNumber, formatDateAnalysis, getLargeNumberPatten } from "../../utils/utils";
import { useNavigation } from "@react-navigation/native";
import { globalStyle } from "../../assets/css/globalStyle"

export default function Analysis(props: { summary: any }) {
  const [barData, setBarData] = useState<any[]>([]);
  const [performanceData, setPerformanceData] = useState<any[]>([]);
  const [earningData, setEarningData] = useState<any[]>([]);
  const [statusData, setStatusData] = useState<any[]>([]);
  const [statusLabelData, setStatusLabelData] = useState<any[]>([])
  const [metricsData, setMetricsData] = useState<{} & any>({});
  const [minEpsValue, setMinEPSValue] = useState<number>(0);
  const [maxPerformanceValue, setMaxPerformanceValue] = useState<number>(0);
  const [minValue, setMinValue] = useState(0)
  const [suffix, setSuffix] = useState("")

  const doThis = (e: any) => {
    // Do something if index is divisible by 2
    return {
      value: e.eps_actual,
      frontColor: "#0F69FE",
    };
  };
  const doThat = (e: any) => {
    return {
      value: e.eps_estimate,
      spacing: 1,
      frontColor: "#B8B9BB",
    };
  };

  function getMaxOfTwoProperties(arr, property1, property2) {
    if (arr) {
      if (arr.length === 0) return null; // Return null for empty array
      let max = -Infinity; // Initialize max with negative infinity
      for (let i = 0; i < arr.length; i++) {
        if (arr[i][property1] !== null && arr[i][property1] > max) {
          max = arr[i][property1]; // Update max if a higher value for property1 is found
        }
        if (arr[i][property2] !== null && arr[i][property2] > max) {
          max = arr[i][property2]; // Update max if a higher value for property2 is found
        }
      }
      if (max === -Infinity) {
        return null; // Return null if no valid value found
      }
      return max;
    }
  }

  function getMinOfTwoProperties(arr, property1, property2) {
    try {
      if (arr) {
        if (arr.length === 0) return null; // Return null for empty array
        let min = Infinity; // Initialize min with positive infinity
        for (let i = 0; i < arr.length; i++) {
          if (arr[i][property1] !== null && arr[i][property1] < min) {
            min = arr[i][property1]; // Update max if a higher value for property1 is found
          }
          if (arr[i][property2] !== null && arr[i][property2] < min) {
            min = arr[i][property2]; // Update max if a higher value for property2 is found
          }
        }
        if (min === Infinity) {
          return null; // Return null if no valid value found
        }
        return min;
      }
    } catch (e) { console.log(e) }
  }

  const getEarningMetricsData = () => {
    try {
      let response = props.summary
      const minEps = getMinOfTwoProperties(
        response?.earnings?.earningsHisCurrYr,
        "eps_estimate",
        "eps_actual"
      );

      setMinEPSValue(minEps);

      const newArray: any[] = [];
      const newArrayAxis: any[] = [];
      const statuslabel: any[] = [];

      response?.earnings?.earningsHisCurrYr.forEach((value: any) => {

        if (value.difference > 0) {
          newArrayAxis.push({
            status: "Beat",
            value: `by $` + parseFloat(value.difference),
          });
        } else if (value.difference < 0) {
          newArrayAxis.push({
            status: "Missed",
            value: `by $` + parseFloat(value.difference),
          });
        } else if (value.difference == 0) {
          newArrayAxis.push({ status: "Met", value: '', });
        }

        newArray.push(doThis(value));
        newArray.push(doThat(value));
        statuslabel.push(value.quarter)
      });

      setStatusData(newArrayAxis.reverse());
      setMetricsData(response);
      let earningsData: any[] = [];
      let performanceData: any[] = [];

      response?.performance?.earningsHistory.slice(0, 5).reverse().forEach((value: any, i: number) => {
        earningsData.push({
          value: parseFloat(value.earnings),
          label: value.year,
          index: i,
          topLabelComponent: () => (
            <Text style={{ color: "#FFF", fontSize: 18, marginBottom: 6 }}>
              value
            </Text>
          ),
          width: 20,
          labelTextStyle: { color: "gray", width: "100%" },
        });
      });

      response?.performance?.revenue_history.slice(0, 5).reverse().forEach((value: any, i: number) => {
        performanceData.push({
          value: parseFloat(value.revenue),
          label: value.year,
          index: i,
          topLabelComponent: () => (
            <Text style={{ color: "#FFF", fontSize: 18, marginBottom: 6 }}>
              value
            </Text>
          ),
          width: 20,
          labelTextStyle: { color: "gray", width: "100%" },
        });
      });
      let defaultSize = 0
      const suffixes = ['', 'K', 'M', 'B', 'T'];
      const combinedArray = [...earningsData, ...performanceData];
      combinedArray.forEach(item => {
        let unit = getLargeNumberPatten(item.value)
        if (unit > defaultSize)
          defaultSize = unit
      })

      setSuffix(suffixes[defaultSize])

      if (defaultSize > 0) {
        earningsData.map(item => {
          item.value = item.value / (1000 ** defaultSize)
        })
        performanceData.map(item => {
          item.value = item.value / (1000 ** defaultSize)
        })
      }

      const maxValue = combinedArray.reduce(
        (max, obj) => (obj.value > max ? obj.value : max),
        combinedArray[0].value
      );
      const minValue = combinedArray.reduce(
        (min, obj) => (obj.value < min ? obj.value : min),
        combinedArray[0].value
      );
      newArray.reverse();
      statuslabel.reverse();

      setMinValue(minValue)
      setEarningData(earningsData);
      setPerformanceData(performanceData);
      setStatusLabelData(statuslabel);
      setMaxPerformanceValue(maxValue);
      setBarData(newArray);
    } catch (e) { console.log(e) }
  };

  const navigation = useNavigation();

  useEffect(() => {
    getEarningMetricsData();
  }, [navigation]);

  const getBackgroundColor = (status: string) => {
    return {
      backgroundColor:
        status === "Beat"
          ? "#2EBD85"
          : status === "Missed"
            ? "#E2433B"
            : status === "Met"
              ? "#464F56"
              : "transparent"
    };
  };

  const renderTooltip = ({ value }: { value: number }) => {
    return (
      <View>
        <Text style={{ color: '#FFF', fontSize: 8, marginBottom: 1 }}>${value}</Text>
      </View>
    );
  };

  return (
    <ScrollView contentContainerStyle={globalStyle.scrollContainer}>
      <View style={globalStyle.container}>
        <View>
          <View style={globalStyle.header}>
            <Text style={globalStyle.heading}>Earnings</Text>
          </View>
          <Text style={globalStyle.h6}>Earnings per share</Text>
          <Text
            style={[globalStyle.h2, { paddingTop: 4, letterSpacing: 0.14 }]}
          >
            I/B/E/S Consensus estimates vs adjusted actuals
          </Text>
        </View>
        <View style={{ paddingTop: 10 }}>
          <BarChart
            width={Dimensions.get("window").width * 0.75}
            data={barData}
            yAxisLabelPrefix="$"
            hideRules
            xAxisThickness={1}
            yAxisLabelWidth={50}
            barWidth={25}
            initialSpacing={20}
            spacing={20}
            roundToDigits={2}
            showFractionalValues={true}
            xAxisColor={"#F5F7F9"}
            yAxisColor={"#040B11"}
            yAxisTextStyle={{ color: "gray" }}
            noOfSections={3}
            noOfSectionsBelowXAxis={minEpsValue < 0 ? 1 : 0}
            mostNegativeValue={minEpsValue}
            renderTooltip={renderTooltip}
          />
        </View>
        <View style={[styles.containerBox, { marginTop: minEpsValue < 0 ? 40 : 0 }]}>
          {statusLabelData?.map((labels, index) => {
            return (
              <View key={index} style={{ flexDirection: 'column', gap: 13, alignItems: 'center', width: 50 }}>
                <Text style={{ color: "#979797", fontSize: 12, fontWeight: '700' }}>
                  {labels}
                </Text>
                <View style={[styles.box, getBackgroundColor(statusData[index]?.status)]}>
                  <Text style={styles.textBox}>{statusData[index]?.status}</Text>
                </View>
                <Text style={{ color: "#979797", fontSize: 10, letterSpacing: 0.1 }}>
                  {statusData[index]?.value}
                </Text>
              </View>
            )
          })}
        </View>
        <View style={[globalStyle.justifyBetween, { marginTop: 14 }]}>
          <Text
            style={[globalStyle.h2, { color: "#FFFFFF", letterSpacing: 0.1 }]}
          >
            Expected report date{" "}
            {formatDateAnalysis(
              metricsData?.earnings?.earningsHisCurrYr[0]?.date
            )}
          </Text>
          <View style={[globalStyle.justifyEvenly, { gap: 8 }]}>
            <View style={[globalStyle.alignItemsCenter, { gap: 4 }]}>
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
                Estimation
              </Text>
            </View>
            <View style={{ flexDirection: "row", gap: 4, alignItems: 'center' }}>
              <View
                style={{
                  backgroundColor: "#0F69FE", // Set your desired color here
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
                Actual
              </Text>
            </View>
          </View>
        </View>
        <View style={[styles.divider]}></View>
        <View style={[globalStyle.header, { justifyContent: 'flex-start', gap: 8, alignItems: 'baseline' }]}>
          <Text style={globalStyle.h6}>Earnings metrics</Text>
          <Text
            style={{
              color: "#979797",
              fontFamily: "Roboto",
              fontSize: 12,
              fontWeight: "400"
            }}
          >
            GAAP
          </Text>
        </View>
        <Text
          style={[globalStyle.h2, { letterSpacing: 0.14, marginTop: 10 }]}
        >
          vs. Industry: Technology Hardware, Storage & Periphera
        </Text>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "flex-end",
            marginTop: 16,
          }}
        >
          <Text style={{ color: "#FFF", fontSize: 12, fontWeight: "700" }}>
            {metricsData?.profile?.symbol}
          </Text>
        </View>
        <View style={[styles.divider, { marginTop: 12, backgroundColor: '#F5F7F9' }]}></View>
        <View style={[styles.TrendingStocks]}>
          <Text style={styles.TrendingText}>
            EPS{" "}
            <Text style={styles.TrendingSubText}>
              (TTM)
            </Text>
          </Text>
          <Text style={styles.TrendingText}>
            ${getRoundOffValue(metricsData?.earnings?.eps)}
          </Text>
        </View>
        <View style={[styles.divider, { marginTop: 14 }]}></View>
        <View style={[styles.TrendingStocks]}>
          <Text style={styles.TrendingText}>
            P/E{" "}
            <Text style={styles.TrendingSubText}>
              (TTM)
            </Text>
          </Text>
          <Text style={styles.TrendingText}>
            {getRoundOffValue(metricsData?.earnings?.peRatio)}
          </Text>
        </View>
        <View style={[styles.divider, { marginTop: 14 }]}></View>
        <View style={[styles.TrendingStocks]}>
          <Text style={styles.TrendingText}>
            P/E{" "}
            <Text style={styles.TrendingSubText}>
              (5-Year Avg)
            </Text>
          </Text>
          <Text style={styles.TrendingText}>
            {getRoundOffValue(metricsData?.earnings?.pegRatio)}
          </Text>
        </View>
        <View style={[styles.divider, { marginTop: 14 }]}></View>
        <View style={[styles.TrendingStocks]}>
          <Text style={styles.TrendingText}>
            EPS Growth{"\n"}
            <Text style={styles.TrendingSubText}>
              (TTM vs Prior TTM)
            </Text>
          </Text>
          {metricsData?.earnings?.epsGrowthTTM > 0 ?
            <Text style={[styles.TrendingText, { color: "#2EBD85" }]}>
              +{metricsData?.earnings?.epsGrowthTTM}%
            </Text> :
            <Text style={[styles.TrendingText, { color: "#F00" }]}>
              {metricsData?.earnings?.epsGrowthTTM}%
            </Text>
          }
        </View>
        <View style={[styles.divider, { marginTop: 14 }]}></View>
        <View style={[styles.TrendingStocks]}>
          <Text style={styles.TrendingText}>
            EPS Growth{"\n"}
            <Text style={styles.TrendingSubText}>
              (Last Qtr vs Same Qtr Prior Year)
            </Text>
          </Text>
          {metricsData?.earnings?.epsGrowthQrt > 0 ?
            <Text style={[styles.TrendingText, { color: "#2EBD85" }]}>
              +{metricsData?.earnings?.epsGrowthQrt}%
            </Text> :
            <Text style={[styles.TrendingText, { color: "#F00" }]}>
              {metricsData?.earnings?.epsGrowthQrt}%
            </Text>
          }
        </View>
        <View style={[styles.divider, { marginTop: 14 }]}></View>
        <Text
          style={[globalStyle.h2, { paddingTop: 16, }]}
        >
          As of{" "}
          {metricsData?.earnings?.earningsHisCurrYr[0]?.date &&
            formatDateAnalysis(
              metricsData?.earnings?.earningsHisCurrYr[0]?.date
            )}
        </Text>
      </View>
      <View style={globalStyle.divider} />
      <View style={globalStyle.container}>
        <View style={[globalStyle.header]}>
          <Text style={globalStyle.heading}>Performance</Text>
        </View>
        <Text style={globalStyle.h6}>Earnings and revenue history</Text>
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
            data={performanceData.filter(d => !isNaN(d.value))}
            data2={earningData}
            hideDataPoints
            initialSpacing={20}
            spacing={(Dimensions.get('window').width - 55) / 5}
            width={Dimensions.get('window').width - 80}
            maxValue={maxPerformanceValue + 10}
            color1="#2EBD85"
            color2="#0F69FE"
            startFillColor1="#2EBD85"
            startFillColor2="#0F69FE"
            endFillColor1="#8a56ce"
            endFillColor2="#56acce"
            startOpacity={0.5}
            endOpacity={0.1}
            noOfSections={3}
            adjustToWidth={true}
            noOfSectionsBelowXAxis={minValue < 0 ? 1 : 0}
            yAxisColor="white"
            yAxisThickness={0}
            rulesType="solid"
            rulesColor="gray"
            yAxisTextStyle={{ color: "gray" }}
            yAxisLabelSuffix={suffix}
            xAxisColor="lightgray"
            pointerConfig={{
              showPointerStrip: true,
              pointerVanishDelay: 50000,
              pointer1Color: "#2EBD85",
              pointerStripUptoDataPoint: true,
              pointerStripColor: "#0F69FE",
              pointerStripWidth: 2,
              pointer2Color: "#0F69FE",
              radius: 4,
              pointerLabelWidth: 100,
              pointerLabelHeight: 120,
              pointerLabelComponent: (items: any[]) => {
                let left = 10;
                if (items[0].index > 2)
                  left = -90
                return (
                  <View
                    style={{
                      left: left,
                      marginTop: 80,
                      backgroundColor: "#040B11",
                      opacity: 0.9,
                      padding: 10,
                      borderRadius: 4,
                    }}
                  >
                    <Text style={{ color: "lightgray", fontSize: 10 }}>
                      {items[0].label}
                    </Text>
                    <View
                      style={{
                        width: "100%",
                        height: 1,
                        backgroundColor: "lightgray",
                      }}
                    />
                    <Text style={{ color: "#2EBD85", fontSize: 10 }}>
                      <Text style={{ color: "#979797", fontSize: 10 }}>
                        Revenue{" "}
                      </Text>
                      ${(items[0]?.value)}{suffix}
                    </Text>
                    <View
                      style={{
                        width: "100%",
                        height: 1,
                        backgroundColor: "lightgray",
                      }}
                    />
                    <Text style={{ color: "#0F69FE", fontSize: 10 }}>
                      <Text style={{ color: "#979797", fontSize: 10 }}>
                        Earnings{" "}
                      </Text>
                      ${(items[1]?.value)}{suffix}
                    </Text>
                  </View>
                );
              },
            }}
          />
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 8, paddingTop: 24 }}>
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
              Revenue
            </Text>
          </View>
          <View style={{ flexDirection: "row", gap: 4, alignItems: 'center' }}>
            <View
              style={{
                backgroundColor: "#0F69FE", // Set your desired color here
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
              earnings
            </Text>
          </View>
        </View>
        {metricsData?.performance?.profitMargin -
          metricsData?.performance?.pastPerformanceEarningsGrowth <
          -20 && (
            <View style={styles.iconTextRow}>
              <Image
                source={require("../../assets/img/closeaccount.png")} // Path to your local icon
                style={styles.iconSize}
              />
              <Text style={styles.greenBold}>
                Quality earnings: &nbsp;
                <Text style={styles.performanceSubText}>
                  {metricsData?.profile?.symbol} has very poor quality earnings.
                </Text>
              </Text>
            </View>
          )}

        {/* Poor */}
        {metricsData?.performance?.profitMargin -
          metricsData?.performance?.pastPerformanceEarningsGrowth >
          -5 &&
          metricsData?.performance?.profitMargin -
          metricsData?.performance?.pastPerformanceEarningsGrowth <=
          -20 && (
            <View style={styles.iconTextRow}>
              <Image
                source={require("../../assets/img/closeaccount.png")} // Path to your local icon
                style={styles.iconSize}
              />
              <Text style={styles.greenBold}>
                Quality earnings: &nbsp;
                <Text style={styles.performanceSubText}>
                  {metricsData?.profile?.symbol} has poor quality earnings.
                </Text>
              </Text>
            </View>
          )}

        {/* Average */}
        {metricsData?.performance?.profitMargin -
          metricsData?.performance?.pastPerformanceEarningsGrowth <
          5 &&
          metricsData?.performance?.profitMargin -
          metricsData?.performance?.pastPerformanceEarningsGrowth <=
          -5 && (
            <View style={styles.iconTextRow}>
              <Image
                source={require("../../assets/img/check.png")} // Path to your local icon
                style={styles.iconSize}
              />
              <Text style={[styles.greenBold, { color: "#2EBD85" }]}>
                Quality earnings: &nbsp;
                <Text style={styles.performanceSubText}>
                  {metricsData?.profile?.symbol} has average quality earnings.
                </Text>
              </Text>
            </View>
          )}

        {/* Good */}
        {metricsData?.performance?.profitMargin -
          metricsData?.performance?.pastPerformanceEarningsGrowth <
          15 &&
          metricsData?.performance?.profitMargin -
          metricsData?.performance?.pastPerformanceEarningsGrowth <
          5 && (
            <View style={styles.iconTextRow}>
              <Image
                source={require("../../assets/img/check.png")} // Path to your local icon
                style={styles.iconSize}
              />
              <Text style={[styles.greenBold, { color: "#2EBD85" }]}>
                Quality earnings: &nbsp;
                <Text style={styles.performanceSubText}>
                  {metricsData?.profile?.symbol} has good quality earnings.
                </Text>
              </Text>
            </View>
          )}

        {/* Excellent */}
        {metricsData?.performance?.profitMargin -
          metricsData?.performance?.pastPerformanceEarningsGrowth >
          15 && (
            <View style={styles.iconTextRow}>
              <Image
                source={require("../../assets/img/check.png")} // Path to your local icon
                style={{ width: 20, height: 20, marginRight: 10 }}
              />
              <Text style={[styles.greenBold, { color: "#2EBD85" }]}>
                Quality earnings: &nbsp;
                <Text style={styles.performanceSubText}>
                  {metricsData?.profile?.symbol} has excellent quality earnings.
                </Text>
              </Text>
            </View>
          )}

        {/* Higher margins */}
        {metricsData?.performance?.profitMargin >
          metricsData?.performance?.pastPerformanceEarningsGrowth && (
            <View style={styles.iconTextRow}>
              <Image
                source={require("../../assets/img/check.png")} // Path to your local icon
                style={{ width: 20, height: 20, marginRight: 10 }}
              />
              <Text style={[styles.greenBold, { color: "#2EBD85" }]}>
                Growing profit margin: &nbsp;
                <Text style={styles.performanceSubText}>
                  {metricsData?.profile?.symbol}'s current net profit margins (
                  {getRoundOffValue(metricsData?.performance?.profitMargin)}%) are
                  higher than last year (
                  {getRoundOffValue(
                    metricsData?.performance?.pastPerformanceEarningsGrowth
                  )}
                  %).
                </Text>
              </Text>
            </View>
          )}

        {/* Lower margins */}
        {metricsData?.performance?.profitMargin <
          metricsData?.performance?.pastPerformanceEarningsGrowth && (
            <View style={styles.iconTextRow}>
              <Image
                source={require("../../assets/img/closeaccount.png")} // Path to your local icon
                style={{ width: 20, height: 20, marginRight: 10 }}
              />
              <Text style={[styles.greenBold]}>
                Growing profit margin: &nbsp;
                <Text style={styles.performanceSubText}>
                  {metricsData?.profile?.symbol}'s current net profit margins (
                  {getRoundOffValue(metricsData?.performance?.profitMargin)}%) are
                  lower than last year (
                  {getRoundOffValue(
                    metricsData?.performance?.pastPerformanceEarningsGrowth
                  )}
                  %).
                </Text>
              </Text>
            </View>
          )}

        <Text style={[globalStyle.h6, { marginTop: 20 }]}>
          Strength earning
        </Text>
        <Text style={{ color: "#FFF", marginTop: 15, fontSize: 12 }}>
          Past performance
        </Text>
        {
          !!metricsData?.performance?.pastPerformanceEarningsGrowth
          && < View style={[styles.barContainer]}>
            <View style={[styles.bar, { backgroundColor: '#0F69FE' }]} />
            <Text
              style={{
                color: "#FFF",
                fontSize: 24,
              }}
            >
              {getRoundOffValue(
                metricsData?.performance?.pastPerformanceEarningsGrowth
              )}
              %
            </Text>
          </View>
        }
        <Text style={[globalStyle.h2, { width: 150, letterSpacing: 0 }]}>
          Historical annual earnings growth
        </Text>
      </View>
    </ScrollView >
  );
}

const styles = StyleSheet.create({
  bar: {
    height: 26,
    width: 82,
    marginRight: 5,
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#000",
  },
  barContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginTop: 15,
    marginBottom: 20,
    alignItems: 'center'
  },
  containerBox: {
    flexDirection: "row",
    gap: 20,
    paddingLeft: 70
  },
  box: {
    width: 50,
    height: 14,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 2,
  },
  textBox: {
    fontSize: 10,
    color: "white",
    fontWeight: "700"
  },
  TrendingStocks: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 16,
  },
  TrendingText: {
    color: "#FFF", fontSize: 12, fontWeight: "bold"
  },
  TrendingSubText: {
    color: "#FFF", fontSize: 12, fontWeight: '400'
  },
  divider: {
    marginTop: 25,
    height: 2,
    backgroundColor: "#252A2D",
  },
  iconTextRow: {
    width: "100%",
    flexDirection: "row",
    marginTop: 11,
    alignItems: 'center',
    paddingRight: 30
  },
  iconSize: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  greenBold: {
    fontSize: 12,
    color: "#E2433B",
    fontWeight: '700',
  },
  performanceSubText: {
    fontSize: 12,
    color: "#FFF",
    fontWeight: '400',
  }
});
