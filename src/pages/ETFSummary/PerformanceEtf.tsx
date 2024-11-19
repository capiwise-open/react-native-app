import React, { useState, useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  processColor
} from "react-native";
import { BarChart } from "react-native-gifted-charts";
import { LineChart } from 'react-native-chart-kit';
import { useNavigation } from "@react-navigation/native";
import { formatDateAnalysis } from "../../utils/utils";
import { globalStyle } from "../../assets/css/globalStyle"
import { ScatterChart } from 'react-native-charts-wrapper';
import { getRoundOffValue } from "../../utils/utils";
import { EtfStockSummary } from "../../api/types";

export default function PerformanceEtf({ summary }: { summary: EtfStockSummary }) {
  const [barData, setBarData] = useState([]);
  const [maxValue, setMaxValue] = useState(35);
  const [minValue, setMinValue] = useState(0)
  const [selectedRange, setSelectedRange] = useState("1y")
  const [priceData, setPriceData] = useState({
    labels: [],
    data: [],
    data2: []
  })
  const [selfIndexMax, setSelfIndexMax] = useState<{
    self: number,
    index: number
  }>({
    self: 0,
    index: 0
  })
  const [riskData, setRiskData] = useState([])
  const navigation = useNavigation();
  const [tooltipPos, setTooltipPos] = useState<{
    x: number,
    y: number,
    visible: boolean,
    value: string
  }>({ x: 0, y: 0, visible: false, value: null });
  const handleChartPress = (x, y, dataset, index) => {
    let centerPointX = Dimensions.get("window").width / 2
    if (x > centerPointX)
      x -= 30
    setTooltipPos({
      x: x - 20,
      y: y,
      visible: true,
      value: getRoundOffValue(dataset.data[index])
    });
  };

  const renderTooltip = ({ value }) => {
    return (
      <View>
        <Text style={{ color: '#FFF', fontSize: 10, marginBottom: 5, marginLeft: -15 }}>{value}%</Text>
      </View>
    );
  };

  const getStockHistoricalData = (original, period) => {
    let data = []
    let labels = []
    let prices1 = []
    let prices2 = []
    let selfMax = 0
    let indexMax = 0

    switch (period) {
      case '1y':
        data = original?.growth1yr
        break
      case '3y':
        data = original?.growth3yr
        break
      case '5y':
        data = original?.growth5yr
        break
      case '10y':
        data = original?.growth10yr
        break
    }

    data?.forEach(element => {
      if (selfMax < element.self)
        selfMax = element.self
      if (indexMax < element.index)
        indexMax = element.index

      labels.push(element.fiscal_date)
      prices1.push(element.self)
      prices2.push(element.index)
    });

    let temp = {
      labels: labels,
      data: prices1,
      data2: prices2
    }
    setSelfIndexMax({
      self: selfMax,
      index: indexMax
    })
    setPriceData(temp)
    setSelectedRange(period);
    setTooltipPos(null)
  }

  const getETFStocks = () => {
    let { max, min } = getMinMaxValueFromPerformance(summary?.performance?.avgAnnualReturns)
    setMaxValue(max)
    setMinValue(min)
    setBarData(summary?.performance?.avgAnnualReturns ? [
      {
        value: summary?.performance?.avgAnnualReturns?.self?.Returns_1Y || "NA",
        spacing: 1,
        labelWidth: 14,
        frontColor: "#B8B9BB",
      },
      {
        value: summary?.performance?.avgAnnualReturns?.index?.Returns_1Y || "NA",
        frontColor: "#0F69FE",
      },
      {
        value: summary?.performance?.avgAnnualReturns?.self?.Returns_3Y || "NA",
        spacing: 1,
        frontColor: "#B8B9BB",
      },
      {
        value: summary?.performance?.avgAnnualReturns?.index?.Returns_3Y || "NA",
        frontColor: "#0F69FE",
      },
      {
        value: summary?.performance?.avgAnnualReturns?.self?.Returns_5Y || "NA",
        spacing: 1,
        frontColor: "#B8B9BB",
      },
      {
        value: summary?.performance?.avgAnnualReturns?.index?.Returns_5Y || "NA",
        frontColor: "#0F69FE",
      },
      {
        value: summary?.performance?.avgAnnualReturns?.self?.Returns_10Y || "NA",
        frontColor: "#B8B9BB",
        spacing: 1,
      },
      {
        value: summary?.performance?.avgAnnualReturns?.index?.Returns_10Y || "NA",
        frontColor: "#0F69FE",
      },
      {
        value: summary?.performance?.avgAnnualReturns?.self?.Returns_YTD || "NA",
        frontColor: "#B8B9BB",
        spacing: 1,
      },
      {
        value: summary?.performance?.avgAnnualReturns?.index?.Returns_YTD || "NA",
        frontColor: "#0F69FE",
      },
    ] : []);

    getStockHistoricalData(summary?.performance?.hypotheticalGrowth, '1y')

    const riskreturns = summary?.performance?.riskreturnComparison

    if (riskreturns) {
      let riskreturn_data = [
        {
          values: [{ x: riskreturns?.self?.return ?? 0, y: Math.abs(riskreturns?.self?.risk ?? 0) }], // First data point
          label: '',
          config: {
            color: processColor('#2EBD85'),
            scatterShape: 'CIRCLE',
            scatterShapeSize: 50,
          },
        },
        {
          values: [{ x: riskreturns?.index?.return ?? 0, y: Math.abs(riskreturns?.index?.risk ?? 0) }], // Second data point
          label: '',
          config: {
            color: processColor('#E2433B'),
            scatterShape: 'CIRCLE',
            scatterShapeSize: 50,
          },
        },
      ];

      setRiskData(riskreturn_data)
    }
  };

  const getMinMaxValueFromPerformance = (performance) => {
    let max = 0;
    let min = 0;
    for (let category in performance) {
      for (let key in performance[category]) {
        const value = parseFloat(performance[category][key]);
        if (!isNaN(value) && value > max) {
          max = value;
        }
        if (!isNaN(value) && value < min) {
          min = value;
        }
      }
    }

    return { max: max, min: min };
  };

  useEffect(() => {
    getETFStocks();
  }, [navigation]);

  return (
    <ScrollView contentContainerStyle={globalStyle.scrollContainer}>
      <View style={globalStyle.container}>
        <Text style={[globalStyle.heading, { marginTop: 20 }]}>Performance</Text>
        <View style={[globalStyle.justifyBetween, globalStyle.alignItemsCenter]}>
          <Text style={globalStyle.h5}>Average annual returns</Text>
          <Text style={[globalStyle.h2, { letterSpacing: 0 }]}>As of{" "}
            {formatDateAnalysis(summary?.asof)}
          </Text>
        </View>
        {barData && <View style={{ paddingTop: 10 }}>
          <BarChart
            width={Dimensions.get("window").width - 80}
            data={barData}
            barWidth={21}
            yAxisLabelSuffix="%"
            spacing={10}
            initialSpacing={10}
            hideRules
            yAxisLabelWidth={45}
            roundToDigits={2}
            showFractionalValues={true}
            xAxisThickness={1}
            yAxisThickness={0}
            xAxisColor={"#F5F7F9"}
            yAxisColor={"#040B11"}
            yAxisTextStyle={globalStyle.h3}
            noOfSections={3}
            maxValue={maxValue + 5}
            mostNegativeValue={minValue < 0 ? minValue - 3 : 0}
            renderTooltip={renderTooltip}
          />
          <View style={{ flexDirection: 'row', paddingLeft: 55 }}>
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <Text style={[globalStyle.h3, { width: 43 }]}>1 Year</Text>
              <Text style={[globalStyle.h3, { width: 43 }]}>3 Year</Text>
              <Text style={[globalStyle.h3, { width: 43 }]}>5 Year</Text>
              <Text style={[globalStyle.h3, { width: 43 }]}>10 Year</Text>
              <View style={{ flexDirection: 'column', alignItems: 'center', width: 50 }}>
                <Text style={[globalStyle.h3, { fontSize: 11 }]}>Since</Text>
                <Text style={[globalStyle.h3, , { fontSize: 11 }]}>inception</Text>
                <Text style={[globalStyle.h2, { fontSize: 8, letterSpacing: 0.1 }]}>
                  {formatDateAnalysis(summary?.overview?.statistics?.inceptionDate)}
                </Text>
              </View>
            </View>
          </View>
          <View style={{ gap: 16, flexDirection: 'row', justifyContent: 'flex-end', marginTop: 18 }}>
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
                {summary?.overview?.details?.symbol}
              </Text>
            </View>
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
                {summary?.overview?.details?.exchange} 100 TR USD
              </Text>
            </View>
          </View>
        </View>}
        <Text style={[globalStyle.h5, { letterSpacing: 1, marginTop: 13 }]}>
          How is it performing?
        </Text>
        <View style={[globalStyle.justifyBetween, { marginTop: 20 }]}>
          <View style={[globalStyle.justifyBetween, { width: '60%' }]}>
            <Text style={[globalStyle.h2, { letterSpacing: 0.1 }]}>
              {summary?.overview?.details?.symbol} vs. Index</Text>
            <Text style={[globalStyle.h2, { letterSpacing: -0.07, color: '#FFF' }]}>
              {summary?.overview?.details?.symbol}
            </Text>
          </View>
          <View>
            <Text style={[globalStyle.h3, { letterSpacing: -0.07, color: '#FFF' }]}>
              {summary?.overview?.details?.exchange} 100 TR USD</Text>
          </View>
        </View>
        <View style={styles.dividerUpcome} />
        <View style={[globalStyle.justifyBetween, { marginTop: 13 }]}>
          <View style={[globalStyle.justifyBetween, { width: '60%' }]}>
            <Text style={[globalStyle.h3, { letterSpacing: -0.07, color: '#FFF' }]}>1 Year</Text>
            {summary?.performance?.avgAnnualReturns?.self?.Returns_1Y &&
              summary?.performance?.avgAnnualReturns?.self?.Returns_1Y > 0 ?
              <Text style={[styles.statisticsValue, { color: "#2EBD85" }]}>
                +{getRoundOffValue(summary?.performance?.avgAnnualReturns?.self?.Returns_1Y)}%
              </Text>
              : <Text style={[styles.statisticsValue, { color: "#F00" }]}>
                {getRoundOffValue(summary?.performance?.avgAnnualReturns?.self?.Returns_1Y)}%
              </Text>
            }
          </View>
          <View>
            {summary?.performance?.avgAnnualReturns?.index?.Returns_1Y &&
              summary?.performance?.avgAnnualReturns?.index?.Returns_1Y > 0 ?
              <Text style={[styles.statisticsValue, { color: "#2EBD85" }]}>
                +{getRoundOffValue(summary?.performance?.avgAnnualReturns?.index?.Returns_1Y)}%
              </Text>
              : <Text style={[styles.statisticsValue, { color: "#F00" }]}>
                {getRoundOffValue(summary?.performance?.avgAnnualReturns?.index?.Returns_1Y)}%
              </Text>
            }
          </View>
        </View>
        <View style={styles.dividerthick} />
        <View style={[globalStyle.justifyBetween, { marginTop: 13 }]}>
          <View style={[globalStyle.justifyBetween, { width: '60%' }]}>
            <Text style={[globalStyle.h3, { letterSpacing: -0.07, color: '#FFF' }]}>3 Year</Text>
            {summary?.performance?.avgAnnualReturns?.self?.Returns_3Y &&
              summary?.performance?.avgAnnualReturns?.self?.Returns_3Y > 0 ?
              <Text style={[styles.statisticsValue, { color: "#2EBD85" }]}>
                +{getRoundOffValue(summary?.performance?.avgAnnualReturns?.self?.Returns_3Y)}%
              </Text>
              : <Text style={[styles.statisticsValue, { color: "#F00" }]}>
                {getRoundOffValue(summary?.performance?.avgAnnualReturns?.self?.Returns_3Y)}%
              </Text>
            }
          </View>
          <View>
            {summary?.performance?.avgAnnualReturns?.index?.Returns_3Y &&
              summary?.performance?.avgAnnualReturns?.index?.Returns_3Y > 0 ?
              <Text style={[styles.statisticsValue, { color: "#2EBD85" }]}>
                +{getRoundOffValue(summary?.performance?.avgAnnualReturns?.index?.Returns_3Y)}%
              </Text>
              : <Text style={[styles.statisticsValue, { color: "#F00" }]}>
                {getRoundOffValue(summary?.performance?.avgAnnualReturns?.index?.Returns_3Y)}%
              </Text>
            }
          </View>
        </View>
        <View style={styles.dividerthick} />
        <View style={[globalStyle.justifyBetween, { marginTop: 13 }]}>
          <View style={[globalStyle.justifyBetween, { width: '60%' }]}>
            <Text style={[globalStyle.h3, { letterSpacing: -0.07, color: '#FFF' }]}>5 Year</Text>
            {summary?.performance?.avgAnnualReturns?.self?.Returns_5Y &&
              summary?.performance?.avgAnnualReturns?.self?.Returns_5Y > 0 ?
              <Text style={[styles.statisticsValue, { color: "#2EBD85" }]}>
                +{getRoundOffValue(summary?.performance?.avgAnnualReturns?.self?.Returns_5Y)}%
              </Text>
              : <Text style={[styles.statisticsValue, { color: "#F00" }]}>
                {getRoundOffValue(summary?.performance?.avgAnnualReturns?.self?.Returns_5Y)}%
              </Text>
            }
          </View>
          <View>
            {summary?.performance?.avgAnnualReturns?.index?.Returns_5Y &&
              summary?.performance?.avgAnnualReturns?.index?.Returns_5Y > 0 ?
              <Text style={[styles.statisticsValue, { color: "#2EBD85" }]}>
                +{getRoundOffValue(summary?.performance?.avgAnnualReturns?.index?.Returns_5Y)}%
              </Text>
              : <Text style={[styles.statisticsValue, { color: "#F00" }]}>
                {getRoundOffValue(summary?.performance?.avgAnnualReturns?.index?.Returns_5Y)}%
              </Text>
            }
          </View>
        </View>
        <View style={styles.dividerthick} />
        <View style={[globalStyle.justifyBetween, { marginTop: 13 }]}>
          <View style={[globalStyle.justifyBetween, { width: '60%' }]}>
            <Text style={[globalStyle.h3, { letterSpacing: -0.07, color: '#FFF' }]}>10 Year</Text>
            {summary?.performance?.avgAnnualReturns?.self?.Returns_10Y &&
              summary?.performance?.avgAnnualReturns?.self?.Returns_10Y > 0 ?
              <Text style={[styles.statisticsValue, { color: "#2EBD85" }]}>
                +{getRoundOffValue(summary?.performance?.avgAnnualReturns?.self?.Returns_10Y)}%
              </Text>
              : <Text style={[styles.statisticsValue, { color: "#F00" }]}>
                {getRoundOffValue(summary?.performance?.avgAnnualReturns?.self?.Returns_10Y)}%
              </Text>
            }
          </View>
          <View>
            {summary?.performance?.avgAnnualReturns?.index?.Returns_10Y &&
              summary?.performance?.avgAnnualReturns?.index?.Returns_10Y > 0 ?
              <Text style={[styles.statisticsValue, { color: "#2EBD85" }]}>
                +{getRoundOffValue(summary?.performance?.avgAnnualReturns?.index?.Returns_10Y)}%
              </Text>
              : <Text style={[styles.statisticsValue, { color: "#F00" }]}>
                {getRoundOffValue(summary?.performance?.avgAnnualReturns?.index?.Returns_10Y)}%
              </Text>
            }
          </View>
        </View>
        <View style={styles.dividerthick} />
        <View style={[globalStyle.justifyBetween, { marginTop: 13 }]}>
          <View style={[globalStyle.justifyBetween, { width: '60%' }]}>
            <Text style={[globalStyle.h3, { letterSpacing: -0.07, color: '#FFF' }]}>Life</Text>
            {summary?.performance?.avgAnnualReturns?.self?.Returns_YTD &&
              summary?.performance?.avgAnnualReturns?.self?.Returns_YTD > 0 ?
              <Text style={[styles.statisticsValue, { color: "#2EBD85" }]}>
                +{getRoundOffValue(summary?.performance?.avgAnnualReturns?.self?.Returns_YTD)}%
              </Text>
              : <Text style={[styles.statisticsValue, { color: "#F00" }]}>
                {getRoundOffValue(summary?.performance?.avgAnnualReturns?.self?.Returns_YTD)}%
              </Text>
            }
          </View>
          <View>
            {summary?.performance?.avgAnnualReturns?.index?.Returns_YTD &&
              summary?.performance?.avgAnnualReturns?.index?.Returns_YTD > 0 ?
              <Text style={[styles.statisticsValue, { color: "#2EBD85" }]}>
                +{getRoundOffValue(summary?.performance?.avgAnnualReturns?.index?.Returns_YTD)}%
              </Text>
              : <Text style={[styles.statisticsValue, { color: "#F00" }]}>
                {getRoundOffValue(summary?.performance?.avgAnnualReturns?.index?.Returns_YTD)}%
              </Text>
            }
          </View>
        </View>
        <View style={styles.dividerthick} />
        <Text
          style={{ ...globalStyle.h2, fontWeight: "300", letterSpacing: 0.2, marginTop: 15 }}
        >
          As of{" "}{formatDateAnalysis(summary?.asof)}
        </Text>
      </View>
      <View style={[globalStyle.divider, { marginTop: 26 }]}></View>
      <View style={globalStyle.container}>
        <Text style={[globalStyle.heading, { marginTop: 20 }]}>Risk-return comparison</Text>
        <View style={[globalStyle.justifyBetween, { alignItems: 'center', marginTop: 18 }]}>
          <Text style={[globalStyle.h4, { letterSpacing: 1 }]}>
            10 Years comparison
          </Text>
          <Text style={[globalStyle.h2, { letterSpacing: 0 }]}>As of{" "}
            {formatDateAnalysis(summary?.asof)}
          </Text>
        </View>
        <View style={[styles.container, { marginTop: 10 }]}>
          <Text style={styles.yAxisLabel}>High risk</Text>
          <View style={{ flex: 1, flexDirection: 'row' }}>
            <View style={{ flex: 1 }}>
              <ScatterChart
                style={styles.chart}
                data={{
                  dataSets: riskData
                }}

                autoScaleMinMaxEnabled={true}
                xAxis={{
                  drawGridLines: true,
                  drawLabels: true,
                  position: 'BOTTOM',
                  axisLineColor: processColor('white'),
                  textColor: processColor('white'),
                  granularityEnabled: true,
                  granularity: 10,
                }}
                yAxis={{
                  left: {
                    drawGridLines: true,
                    axisLineColor: processColor('white'),
                    textColor: processColor('white'),
                    granularityEnabled: true,
                    granularity: 10,
                  },
                  right: { enabled: false },
                }}
                chartDescription={{ text: '' }} // Disable description text
                legend={{ enabled: false }}
              />
              <Text style={styles.xAxisLabel}>High return</Text>
            </View>
          </View>
        </View>
        <View style={[globalStyle.justifyCenter, { gap: 30, alignItems: 'center' }]}>
          <View style={{ flexDirection: 'column', gap: 8 }}>
            <View style={[globalStyle.alignItemsCenter, { gap: 8 }]}>
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
                  fontWeight: '700'
                }}
              >
                {summary?.overview?.details?.symbol}
              </Text>
            </View>
            <Text style={{ color: '#FFF', fontSize: 12 }}>{summary?.performance?.riskreturnComparison?.self?.risk}%</Text>
            <Text style={{ color: '#FFF', fontSize: 12 }}>{summary?.performance?.riskreturnComparison?.self?.return}%</Text>
          </View>
          <View style={{ width: 1, height: 60, backgroundColor: '#979797' }}></View>
          <View style={{ flexDirection: 'column', gap: 8 }}>
            <View style={[globalStyle.alignItemsCenter, { gap: 8 }]}>
              <View
                style={{
                  backgroundColor: "#E2433B", // Set your desired color here
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
                  fontWeight: '700'
                }}
              >
                Index
              </Text>
            </View>
            <Text style={{ color: '#FFF', fontSize: 12 }}>{summary?.performance?.riskreturnComparison?.index?.risk}%</Text>
            <Text style={{ color: '#FFF', fontSize: 12 }}>{summary?.performance?.riskreturnComparison?.index?.return}%</Text>
          </View>
        </View>
      </View>
      <View style={[globalStyle.divider, { marginTop: 26 }]}></View>
      <View style={globalStyle.container}>
        <Text style={[globalStyle.heading, { marginTop: 20 }]}>Growth</Text>
        <Text style={[globalStyle.h4, { letterSpacing: 1, marginTop: 18 }]}>
          Hypothetical growth of $10.000
        </Text>
        <Text
          style={[globalStyle.h2, { fontWeight: "300", letterSpacing: 0.2, marginTop: 15 }]}
        >
          As of{" "}{formatDateAnalysis(summary?.asof)}
        </Text>
        <View>
          <LineChart
            data={{
              labels: priceData?.labels,
              datasets: [
                {
                  data: priceData?.data,
                  strokeWidth: 2,
                  color: () => `#2EBD85`,
                },
                {
                  data: priceData?.data2,
                  strokeWidth: 2,
                  color: () => `#F35530`,
                },
              ],
            }}
            width={Dimensions.get("window").width * 0.93}
            height={220}
            chartConfig={{
              backgroundColor: "#040B11",
              backgroundGradientFrom: "#040B11",
              backgroundGradientTo: "#040B11",
              decimalPlaces: 2,
              color: (opacity = 3) => `rgba(255, 255, 255, ${opacity})`,
              propsForDots: {
                r: ""
              },
              propsForLabels: {
                fontSize: 10,
                fontWeight: '700'
              }
            }}
            formatYLabel={(yValue) => parseInt(yValue) / 1000 + 'K'}
            onDataPointClick={({ x, y, dataset, index }) => handleChartPress(x, y, dataset, index)}
            withVerticalLines={false}
            withHorizontalLines={false}
            withShadow={false}

            fromZero={false}
            style={{
              marginVertical: 8,
              marginRight: -5,
              marginLeft: -5
            }}
            bezier
          />
          {tooltipPos?.visible && (
            <View style={[styles.tooltipChart, { left: tooltipPos.x, top: tooltipPos.y }]}>
              <Text style={{ fontSize: 8, color: '#FFF', fontWeight: '700' }}>${tooltipPos.value}</Text>
            </View>
          )}
        </View>
        <View style={[globalStyle.justifyCenter, { marginTop: 12, gap: 35 }]}>
          <TouchableOpacity onPress={() => getStockHistoricalData(summary?.performance?.hypotheticalGrowth, "1y")}>
            <Text
              style={{
                color: selectedRange === "1y" ? "#2EBD85" : "white",
                textDecorationLine:
                  selectedRange === "1y" ? "underline" : "none",
                textDecorationColor: "#2EBD85",
                borderBottomWidth: selectedRange === "1y" ? 1 : 0,
                fontWeight: "bold",
                fontSize: 12
              }}
            >
              1 Year
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => getStockHistoricalData(summary?.performance?.hypotheticalGrowth, "3y")}>
            <Text
              style={{
                color: selectedRange === "3y" ? "#2EBD85" : "white",
                textDecorationLine:
                  selectedRange === "3y" ? "underline" : "none",
                textDecorationColor: "#2EBD85",
                borderBottomWidth: selectedRange === "3y" ? 1 : 0,
                fontWeight: "bold",
                fontSize: 12
              }}
            >
              3 Year
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => getStockHistoricalData(summary?.performance?.hypotheticalGrowth, "5y")}>
            <Text
              style={{
                color: selectedRange === "5y" ? "#2EBD85" : "white",
                textDecorationLine:
                  selectedRange === "5y" ? "underline" : "none",
                textDecorationColor: "#2EBD85",
                borderBottomWidth: selectedRange === "5y" ? 1 : 0,
                fontWeight: "bold",
                fontSize: 12
              }}
            >
              5 Year
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => getStockHistoricalData(summary?.performance?.hypotheticalGrowth, "10y")}>
            <Text
              style={{
                color: selectedRange === "10y" ? "#2EBD85" : "white",
                textDecorationLine:
                  selectedRange === "10y" ? "underline" : "none",
                textDecorationColor: "#2EBD85",
                borderBottomWidth: selectedRange === "10y" ? 1 : 0,
                fontWeight: "bold",
                fontSize: 12
              }}
            >
              10 Year
            </Text>
          </TouchableOpacity>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 30, alignItems: 'center', marginTop: 30 }}>
          <View style={{ flexDirection: 'column', gap: 8 }}>
            <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
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
                  fontWeight: '700'
                }}
              >
                {summary?.overview?.details?.symbol}
              </Text>
            </View>
            <Text style={{ color: '#FFF', fontSize: 12 }}>{selfIndexMax.self.toLocaleString()}$</Text>
          </View>
          <View style={{ width: 1, height: 40, backgroundColor: '#979797' }}></View>
          <View style={{ flexDirection: 'column', gap: 8 }}>
            <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
              <View
                style={{
                  backgroundColor: "#E2433B", // Set your desired color here
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
                  fontWeight: '700'
                }}
              >
                Index
              </Text>
            </View>
            <Text style={{ color: '#FFF', fontSize: 12 }}>{selfIndexMax.index.toLocaleString()}$</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  statisticsValue: {
    fontSize: 12,
    textAlign: "right",
    color: "#FFF",
    fontWeight: '700',
  },
  dividerUpcome: {
    borderBottomWidth: 1,
    borderBottomColor: "#F5F7F9",
    width: "100%",
    paddingTop: 13,
  },
  dividerthick: {
    borderBottomWidth: 0.6,
    borderBottomColor: "#252A2D",
    width: "100%",
    paddingTop: 12,
  },
  tooltipChart: {
    position: 'absolute',
    backgroundColor: '#0B1620',
    borderRadius: 4,
    flexDirection: 'column',
    justifyContent: "space-evenly",
    padding: 3
  },
  container: {
    flex: 1,
    paddingTop: 16,
    height: 250
  },
  chart: {
    flex: 1,
    position: "relative"
  },
  xAxisLabel: {
    textAlign: 'right',
    marginVertical: 8,
    fontSize: 8,
    color: '#A1A9B6',
  },
  yAxisLabel: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    top: 0,
    textAlign: 'right',
    fontSize: 8,
    color: '#A1A9B6',
  },
});
