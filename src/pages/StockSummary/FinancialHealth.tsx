import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions
} from "react-native";
import { LineChart } from "react-native-gifted-charts";
import { useNavigation } from "@react-navigation/native";
import { getLargeNumberPatten } from "../../utils/utils";
import Toast from 'react-native-toast-message';
import { globalStyle } from "../../assets/css/globalStyle"

export default function FinancialHealth(props) {
  const [healthData, setHealthData] = useState<any>();
  const [debtGraphData, setDebtGraphData] = useState([]);
  const [equityGraphData, setEquityGraphData] = useState([]);
  const [cashGraphData, setCashGraphData] = useState([]);
  const [maxGraphValue, setMaxGraphValue] = useState(0);
  const [minValue, setMinValue] = useState(0)
  const navigation = useNavigation();
  const [suffix, setSuffix] = useState("")

  const showMessage = (title, content) => {
    Toast.show({
      type: 'Capiwise_Info',
      position: 'bottom',
      text1: title,
      text2: content
    })
  }

  const getHealthData = () => {
    let response = props.summary
    setHealthData(response);
    let debtGraph = [];
    let equityGraph = [];
    let cashGraph = [];
    let maxDebt = -Infinity;
    let maxEquity = -Infinity;
    let maxCash = -Infinity;

    response.finHealth?.finHealthHistory?.slice(0, 5).reverse().forEach((element, index) => {
      if (element.debt > maxDebt) {
        maxDebt = element.debt;
      }
      if (element.equity > maxEquity) {
        maxEquity = element.equity;
      }
      if (element.cash_and_cash_equivalents > maxCash) {
        maxCash = element.cash_and_cash_equivalents;
      }

      let yearLabel = new Date(element.fiscal_date).getFullYear();
      if (index === 0) {
        debtGraph.push({ value: element.debt });
        equityGraph.push({ value: element.equity });
        cashGraph.push({ value: element.cash_and_cash_equivalents });
      } else {
        debtGraph.push({
          value: element.debt,
          label: yearLabel,
          width: 40,
          index: index,
          labelTextStyle: { color: "gray", width: 50 },
        });
        equityGraph.push({
          value: element.equity,
          label: yearLabel,
          width: 40,
          index: index,
          labelTextStyle: { color: "gray", width: 50 },
        });
        cashGraph.push({
          value: element.cash_and_cash_equivalents,
          label: yearLabel,
          width: 40,
          index: index,
          labelTextStyle: { color: "gray", width: 50 },
        });
      }
    });

    let defaultSize = 0
    const suffixes = ['', 'K', 'M', 'B', 'T'];
    const combinedArray = [...debtGraph, ...cashGraph, ...equityGraph];
    combinedArray.forEach(item => {
      let unit = getLargeNumberPatten(item.value)
      if (unit > defaultSize)
        defaultSize = unit
    })

    setSuffix(suffixes[defaultSize])

    if (defaultSize > 0) {
      debtGraph.map(item => {
        item.value = item.value / (1000 ** defaultSize)
      })
      cashGraph.map(item => {
        item.value = item.value / (1000 ** defaultSize)
      })
      equityGraph.map(item => {
        item.value = item.value / (1000 ** defaultSize)
      })
    }

    // Find the maximum value
    const maxValue = combinedArray.reduce(
      (max, obj) => (obj.value > max ? obj.value : max),
      combinedArray[0].value
    );
    const minValue = combinedArray.reduce(
      (min, obj) => (obj.value < min ? obj.value : min),
      combinedArray[0].value
    );

    setMinValue(minValue)
    setMaxGraphValue(maxValue);
    setDebtGraphData(debtGraph);
    setCashGraphData(cashGraph);
    setEquityGraphData(equityGraph);
  };
  useEffect(() => {
    getHealthData();
  }, [navigation]);

  return (
    <ScrollView contentContainerStyle={globalStyle.scrollContainer}>
      <View style={globalStyle.container}>
        <View>
          <View style={globalStyle.header}>
            <Text style={globalStyle.heading}>Financial health</Text>
          </View>
          <Text style={globalStyle.h6}>Debt to equity history and analysis</Text>
        </View>
        <View
          style={{
            paddingVertical: 10,
            backgroundColor: "transparent",
          }}
        >
          <LineChart
            areaChart
            curved
            height={200}
            hideRules
            adjustToWidth={true}
            data={debtGraphData}
            data2={equityGraphData}
            data3={cashGraphData}
            hideDataPoints
            scrollToEnd
            initialSpacing={10}
            spacing={(Dimensions.get('window').width - 55) / 5}
            width={Dimensions.get('window').width - 80}
            maxValue={maxGraphValue + 10}
            mostNegativeValue={minValue}
            color1="#E2433B"
            color2="#0F69FE"
            color3="#2EBD85"
            thickness1={3}
            thickness2={3}
            thickness3={3}
            startFillColor1="#E2433B"
            startFillColor2="#0F69FE"
            startFillColor3="#2EBD85"
            endFillColor1="#8a56ce"
            endFillColor2="#56acce"
            endFillColor3="#E2433B"
            startOpacity={0.9}
            endOpacity={0.2}
            showFractionalValues={true}
            noOfSections={3}
            noOfSectionsBelowXAxis={minValue < 0 ? 1 : 0}
            yAxisColor="white"
            yAxisThickness={0}
            rulesType="solid"
            rulesColor="gray"
            yAxisTextStyle={{ color: "gray", fontSize: 12 }}
            yAxisLabelSuffix={suffix}
            xAxisColor="lightgray"
            pointerConfig={{
              showPointerStrip: true,
              pointerVanishDelay: 50000,
              pointer1Color: "#E2433B",
              pointerStripUptoDataPoint: false,
              pointerStripColor: "#0F69FE",
              pointerStripWidth: 2,
              pointer2Color: "#0F69FE",
              pointer3Color: "#2EBD85",
              radius: 4,
              pointerLabelWidth: 150,
              pointerLabelHeight: 120,
              pointerLabelComponent: (items) => {
                let left = 10
                if (items[0].index > 2)
                  left = -140
                return (
                  <View
                    style={{
                      left: left,
                      padding: 10,
                      backgroundColor: "#040B11",
                      opacity: 0.9,
                      borderRadius: 4,
                      marginTop: 70
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
                        Debt{" "}
                      </Text>
                      <Text style={{ color: "#E2433B", fontSize: 10 }}>
                        ${(items[0].value)}{suffix}
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
                        Equity{" "}
                      </Text>
                      <Text style={{ color: "#0F69FE", fontSize: 10 }}>
                        ${(items[1].value)}{suffix}
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
                      <Text
                        style={{ color: "#979797", fontSize: 10, marginRight: 2 }}
                      >
                        Cash and equivalents
                      </Text>
                      <Text style={{ color: "#2EBD85", fontSize: 10 }}>
                        ${(items[2].value)}{suffix}
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
            marginTop: 14
          }}
        >
          <View style={[globalStyle.alignItemsCenter, { gap: 4 }]}>
            <View
              style={{
                backgroundColor: "#E2433B", // Set your desired color here
                width: 12,
                height: 12,
                borderRadius: 10, // To make it a circle
              }}
            />
            <Text
              style={{
                color: "#FFF",
                fontSize: 12,
                fontWeight: '400'
              }}
            >
              Debt
            </Text>
          </View>
          <View style={[globalStyle.alignItemsCenter, { gap: 4 }]}>
            <View
              style={{
                backgroundColor: "#0F69FE", // Set your desired color here
                width: 12,
                height: 12,
                borderRadius: 10, // To make it a circle
              }}
            />
            <Text
              style={{
                color: "#FFF",
                fontSize: 12,
                fontWeight: '400'
              }}
            >
              Equity
            </Text>
          </View>
          <View style={[globalStyle.alignItemsCenter, { gap: 4 }]}>
            <View
              style={{
                backgroundColor: "#2EBD85", // Set your desired color here
                width: 12,
                height: 12,
                borderRadius: 10, // To make it a circle
              }}
            />
            <Text
              style={{
                color: "#FFF",
                fontSize: 12,
                fontWeight: '400'
              }}
            >
              Cash and equivalents
            </Text>
          </View>
        </View>
        {healthData?.finHealth?.debtLevel > 40 && (
          <View style={styles.iconTextRow}>
            <Image
              source={require("../../assets/img/closeaccount.png")} // Path to your local icon
              style={styles.iconSize}
            />
            <Text style={styles.greenBold}>
              Debt Level: &nbsp;
              <Text style={styles.performanceSubText}>
                {healthData?.profile?.symbol}'s
                <TouchableOpacity onPress={() =>
                  showMessage("Net debt to equity ratio", "The total amount of the company‘s Net Debt (Total Debt minus Cash and Equivalents) divided by its Total Shareholders‘ Equity. Typically used as a measure of balance sheet risk")}>
                  <Text style={{ color: '#FFF', fontSize: 12, fontWeight: "400", textDecorationLine: 'underline', marginBottom: -3 }}>&nbsp;net debt to equity ratio</Text>
                </TouchableOpacity>&nbsp;
                ({healthData?.finHealth?.debtLevel}%) is considred &nbsp;
                <TouchableOpacity onPress={() =>
                  showMessage("High", "We consider a net debt to equity ratio above 40% to be high")}>
                  <Text style={{ color: '#FFF', fontSize: 12, fontWeight: "400", textDecorationLine: 'underline', marginBottom: -3 }}>&nbsp;high.</Text>
                </TouchableOpacity>
              </Text>
            </Text>
          </View>
        )}
        {healthData?.finHealth?.debtLevel < 40 && (
          <View style={styles.iconTextRow}>
            <Image
              source={require("../../assets/img/check.png")} // Path to your local icon
              style={styles.iconSize}
            />
            <Text style={[styles.greenBold, { color: "#2EBD85" }]}>
              Debt Level: &nbsp;
              <Text style={styles.performanceSubText}>
                {healthData?.profile?.symbol}'s &nbsp;
                <TouchableOpacity onPress={() =>
                  showMessage("Net debt to equity ratio", "The total amount of the company‘s Net Debt (Total Debt minus Cash and Equivalents) divided by its Total Shareholders‘ Equity. Typically used as a measure of balance sheet risk")}>
                  <Text style={{ color: '#FFF', fontSize: 12, fontWeight: "400", textDecorationLine: 'underline', marginBottom: -3 }}>net debt to equity ratio</Text>
                </TouchableOpacity>&nbsp;
                ({healthData?.finHealth?.debtLevel}%) is considered
                <TouchableOpacity onPress={() =>
                  showMessage("Satisfactory", "We consider a net debt to equity ratio below 40% to be satisfactory")}>
                  <Text style={{ color: '#FFF', fontSize: 12, fontWeight: "400", textDecorationLine: 'underline', marginBottom: -3 }}>&nbsp;satisfactory.</Text>
                </TouchableOpacity>&nbsp;
              </Text>
            </Text>
          </View>
        )}

        {/* Reducing Debt */}
        {healthData?.finHealth?.debtReducing?.latest <
          healthData?.finHealth?.debtReducing?.past5yrs && (
            <View style={styles.iconTextRow}>
              <Image
                source={require("../../assets/img/check.png")} // Path to your local icon
                style={styles.iconSize}
              />
              <Text style={[styles.greenBold, { color: "#2EBD85" }]}>
                Reducing Debt: &nbsp;
                <Text style={styles.performanceSubText}>
                  {healthData?.profile?.symbol}'s debt to equity ratio has reduced
                  from {healthData?.finHealth?.debtReducing?.latest}% to{" "}
                  {healthData?.finHealth?.debtReducing?.past5yrs}% over the past 5
                  years
                </Text>
              </Text>
            </View>
          )}
        {/* Incresed Debt */}
        {healthData?.finHealth?.debtReducing?.latest >
          healthData?.finHealth?.debtReducing?.past5yrs && (
            <View style={styles.iconTextRow}>
              <Image
                source={require("../../assets/img/closeaccount.png")} // Path to your local icon
                style={styles.iconSize}
              />
              <Text style={styles.greenBold}>
                Increasing Debt: &nbsp;
                <Text style={styles.performanceSubText}>
                  {healthData?.profile?.symbol}'s debt to equity ratio has increased
                  from {healthData?.finHealth?.debtReducing?.past5yrs}% to{" "}
                  {healthData?.finHealth?.debtReducing?.latest}% over the past 5
                  years
                </Text>
              </Text>
            </View>
          )}
        {/* Debt Coverage negative */}
        {healthData?.finHealth?.debtCoverage < 0 && (
          <View style={styles.iconTextRow}>
            <Image
              source={require("../../assets/img/closeaccount.png")} // Path to your local icon
              style={styles.iconSize}
            />
            <Text style={styles.greenBold}>
              Debt Coverage: &nbsp;
              <Text style={styles.performanceSubText}>
                {healthData?.profile?.symbol}'s
                <TouchableOpacity onPress={() =>
                  showMessage("Operating cash flow", "How much cash a company generates from its cost business activities in a given period. it indicates if a company generates enough cash to fun its operations or if it may require external financing.")}>
                  <Text style={{ color: '#FFF', fontSize: 12, fontWeight: "400", textDecorationLine: 'underline', marginBottom: -3 }}>operating cash flow</Text>
                </TouchableOpacity>&nbsp;
                is negative, therefore debt is not
                <TouchableOpacity onPress={() =>
                  showMessage("Well covered", "We look for operating cash flow to be at least 20% of debt")}>
                  <Text style={{ color: '#FFF', fontSize: 12, fontWeight: "400", textDecorationLine: 'underline', marginBottom: -3 }}>well covered.</Text>
                </TouchableOpacity>&nbsp;
              </Text>
            </Text>
          </View>
        )}
        {/* covered debt */}
        {healthData?.finHealth?.debtCoverage > 0 && (
          <View style={styles.iconTextRow}>
            <Image
              source={require("../../assets/img/check.png")} // Path to your local icon
              style={styles.iconSize}
            />
            <Text style={[styles.greenBold, { color: "#2EBD85" }]}>
              Debt Coverage: &nbsp;
              <Text style={styles.performanceSubText}>
                {healthData?.profile?.symbol}'s debt is &nbsp;
                <TouchableOpacity onPress={() =>
                  showMessage("Well covered", "We look for operating cash flow to be at least 20% of debt")}>
                  <Text style={{ color: '#FFF', fontSize: 12, fontWeight: "400", textDecorationLine: 'underline', marginBottom: -3 }}>well covered</Text>
                </TouchableOpacity>&nbsp; by
                <TouchableOpacity onPress={() =>
                  showMessage("Operating cash flow", "How much cash a company generates from its cost business activities in a given period. it indicates if a company generates enough cash to fun its operations or if it may require external financing.")}>
                  <Text style={{ color: '#FFF', fontSize: 12, fontWeight: "400", textDecorationLine: 'underline', marginBottom: -3 }}>&nbsp;operating cash flow</Text>
                </TouchableOpacity>&nbsp; ({healthData?.finHealth?.debtCoverage}%).
              </Text>
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  iconTextRow: {
    width: "100%",
    flexDirection: "row",
    marginTop: 11, // Adjust spacing between text and icon
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
