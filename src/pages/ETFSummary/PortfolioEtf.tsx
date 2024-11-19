import React, { useState, useEffect } from "react";
// import { PieChart } from 'react-native-svg-charts'
// import { PieChart } from "react-native-chart-kit";
// import { PieChart } from "react-native-svg-charts";
import { globalStyle } from "../../assets/css/globalStyle"
import { formatDateAnalysis } from "../../utils/utils";
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { useNavigation } from '@react-navigation/native';
import { getRoundOffValue } from "../../utils/utils";
import { EtfStockSummary } from "../../api/types";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

export default function PortfolioEtf({ summary }: { summary: EtfStockSummary }) {
  const navigation = useNavigation();
  const [weight, setWeight] = useState(0)
  const [holdingData, setHoldingData] = useState([])
  const [currentViewData, setCurrentViewData] = useState([])
  const [region, setRegion] = useState([])
  const [showAll, setShowAll] = useState(false)
  const [asOf, setAsOf] = useState()
  const colors = ["#E2433B", "#F1C40F", "#3E2EBD", "#FEA310", "#2EBD85", "#0053AA", "#009AFF", "#BD2E65", "#1B0CAB", "#19C567", "#009B92"]
  const [sectors, setSectors] = useState([])
  const [marketCapExposure, setMarketCapExposure] = useState<{
    Small: string,
    Big: string,
    Medium: string,
    Micro: string,
    Mega: string
  }>()

  const handleHoldingData = () => {
    showAll ? setCurrentViewData(holdingData?.slice(0, 10)) : setCurrentViewData(holdingData)
    setShowAll(!showAll)
  }
  const getETFStocks = async () => {
    let temp: any[] = []
    const randomColor = () => ('#' + ((Math.random() * 0xFFFF10) << 0).toString(16) + '000000').slice(0, 7)
    Object.keys(summary?.portfolio?.holdings).map((key, index) => {
      let currentColor = "#FFFFFF"
      if (index > 10)
        currentColor = randomColor()
      else
        currentColor = colors[index]
      temp.push({
        color: currentColor,
        legendFontColor: "#7F7F7F",
        legendFontSize: 15,

        value: parseFloat(summary?.portfolio?.holdings[key]["Assets_%"]),
        svg: {
          fill: currentColor
        },
        name: summary?.portfolio?.holdings[key]["Name"],
        key: `pie-eft-${index}`,
        arc: { cornerRadius: 3 },
        symbol: summary?.portfolio?.holdings[key]["Code"],
      })
    })

    setCurrentViewData(temp.slice(0, 10))
    setHoldingData(temp)
    temp = []
    summary?.portfolio?.portfolioComposition?.sectorExposure.map((sector, index) => {
      let currentColor = "#FFFFFF"
      if (index > 10)
        currentColor = randomColor()
      else
        currentColor = colors[index]
      temp.push({
        value: parseFloat(sector["Assets_%"]),
        svg: {
          fill: currentColor,
        },
        key: `pie-composition-${index}`,
        arc: { cornerRadius: 3 },
        symbol: sector.Sector,
      })
    })

    setSectors(temp)

    temp = []
    summary?.portfolio?.portfolioComposition?.regionExposure.map((region, index) => {
      let currentColor = "#FFFFFF"
      if (index > 10)
        currentColor = randomColor()
      else
        currentColor = colors[index]
      temp.push({
        value: parseFloat(region["Assets_%"]),
        svg: {
          fill: currentColor,
        },
        key: `pie-region-${index}`,
        arc: { cornerRadius: 3 },
        symbol: region.Region,
      })
    })

    setRegion(temp)

    setWeight(summary?.portfolio?.top10holdings?.weight)
    setAsOf(summary?.asof)
    setMarketCapExposure(summary?.portfolio?.portfolioComposition?.marketCapExposure)
  };

  useEffect(() => {
    getETFStocks()
  }, [navigation]);

  const chartConfig = {
    backgroundGradientFrom: "#1E2923",
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: "#08130D",
    backgroundGradientToOpacity: 0.5,
    color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
    strokeWidth: 2, // optional, default 3
    barPercentage: 1.5,
    useShadowColorFromDataset: false // optional
  };


  return (
    <ScrollView contentContainerStyle={globalStyle.scrollContainer}>
      <View style={globalStyle.container}>
        <Text style={[globalStyle.heading, { marginTop: 20 }]}>Top 10 holdings</Text>
        <Text style={[globalStyle.h2, { letterSpacing: 0.2 }]}>As of{" "}
          {formatDateAnalysis(asOf ? asOf : null)}
        </Text>
        <View>
          <View style={{ position: 'relative' }}>
            {/* <PieChart
              height={200}
              width={200}
              // accessor="1"
              // paddingLeft="1"
              // backgroundColor="white"
              style={{ height: 200 }}
              data={holdingData?.slice(0, 10)}
              // spacing={8}
              outerRadius={'95%'}
              innerRadius={'70%'}
              labelRadius={10}
            /> */}
            <View
              style={{
                flexDirection: 'column', position: 'absolute',
                // backgroundColor: '#FFF',
                top: 72,
                width: 120,
                left: Dimensions.get("window").width / 2 - 70,
                alignItems: 'center'
              }}
            >
              <Text style={globalStyle.h1}>{weight}%</Text>
              <Text style={globalStyle.h2}>of 102 total</Text>
            </View>
          </View>
        </View>
        <View style={[globalStyle.justifyBetween, { marginTop: 24 }]}>
          <Text style={[globalStyle.h2, { color: '#FFF', letterSpacing: -0.07 }]}>Equities</Text>
          <Text style={[globalStyle.h2, { color: '#FFF', letterSpacing: -0.07 }]}>Percentage</Text>
        </View>
        <View style={styles.divider} />
        {currentViewData.map((holding, index) => {
          return (
            <View key={index + `holding`}>
              <View style={[globalStyle.justifyBetween, { marginTop: 8, alignItems: 'center' }]}>
                <View style={{ flexDirection: 'row', gap: 5, alignItems: 'center' }}>
                  <View style={{ width: 20, height: 20, borderRadius: 20, backgroundColor: holding.svg.fill }} />
                  <View style={{ flexDirection: 'column', gap: 2 }}>
                    <Text style={[globalStyle.h3, { color: '#2EBD85', letterSpacing: -0.07 }]}>
                      {holding.symbol}
                    </Text>
                    <Text style={[globalStyle.h4, { letterSpacing: -0.1, fontSize: 8 }]}>
                      {holding.name}
                    </Text>
                  </View>
                </View>
                <Text style={[globalStyle.h5, { fontSize: 12, letterSpacing: -0.07 }]}>
                  {getRoundOffValue(holding.value)}%
                </Text>
              </View>
              <View style={styles.divider} />
            </View>
          )
        })
        }
        <TouchableOpacity onPress={() => handleHoldingData()}>
          <Text style={[globalStyle.h4, { color: '#0F69FE', fontSize: 12, marginTop: 24, textAlign: 'right' }]}>View 102 holdings </Text>
        </TouchableOpacity>
      </View>
      <View style={[globalStyle.divider, { marginTop: 26 }]}></View>
      <View style={globalStyle.container}>
        <Text style={[globalStyle.heading, { marginTop: 20 }]}>Region</Text>
        {/* <PieChart
          style={{ height: 200 }}
          data={region}
          spacing={8}
          outerRadius={'95%'}
          innerRadius={'70%'}
          labelRadius={10}
        /> */}
        <View style={[globalStyle.justifyBetween, { marginTop: 24 }]}>
          <Text style={[globalStyle.h2, { color: '#FFF', letterSpacing: -0.07 }]}>Region</Text>
          <Text style={[globalStyle.h2, { color: '#FFF', letterSpacing: -0.07 }]}>Percentage</Text>
        </View>
        <View style={styles.divider} />
        {region.map((regionItem, index) => {
          return (
            <View key={index + `region-item`}>
              <View style={[globalStyle.justifyBetween, { marginTop: 8, alignItems: 'center' }]}>
                <View style={{ flexDirection: 'row', gap: 5, alignItems: 'center' }}>
                  <View style={{ width: 20, height: 20, borderRadius: 20, backgroundColor: regionItem.svg.fill }} />
                  <Text style={[globalStyle.h5, { fontSize: 12, letterSpacing: -0.07 }]}>
                    {regionItem.symbol}
                  </Text>
                </View>
                <Text style={[globalStyle.h5, { fontSize: 12, letterSpacing: -0.07 }]}>
                  {getRoundOffValue(regionItem.value)}%
                </Text>
              </View>
              <View style={styles.divider} />
            </View>
          )
        })
        }
      </View>
      <View style={[globalStyle.divider, { marginTop: 26 }]}></View>
      <View style={globalStyle.container}>
        <Text style={[globalStyle.heading, { marginTop: 20 }]}>Sectors</Text>
        {/* <PieChart
          style={{ height: 200 }}
          data={sectors}
          // spacing={8}
          outerRadius={'95%'}
          innerRadius={'70%'}
          labelRadius={10}
        /> */}
        <View style={[globalStyle.justifyBetween, { marginTop: 24 }]}>
          <Text style={[globalStyle.h2, { color: '#FFF', letterSpacing: -0.07 }]}>Sector (s)</Text>
          <Text style={[globalStyle.h2, { color: '#FFF', letterSpacing: -0.07 }]}>Percentage</Text>
        </View>
        <View style={styles.divider} />
        {sectors.map((sector, index) => {
          return (
            <View key={index + `sector`}>
              <View style={[globalStyle.justifyBetween, { marginTop: 8, alignItems: 'center' }]}>
                <View style={{ flexDirection: 'row', gap: 5, alignItems: 'center' }}>
                  <View style={{ width: 20, height: 20, borderRadius: 20, backgroundColor: sector.svg.fill }} />
                  <Text style={[globalStyle.h5, { fontSize: 12, letterSpacing: -0.07 }]}>
                    {sector.symbol}
                  </Text>
                </View>
                <Text style={[globalStyle.h5, { fontSize: 12, letterSpacing: -0.07 }]}>
                  {getRoundOffValue(sector.value)}%
                </Text>
              </View>
              <View style={styles.divider} />
            </View>
          )
        })
        }
      </View>
      <View style={[globalStyle.divider, { marginTop: 26 }]}></View>
      <View style={globalStyle.container}>
        <Text style={[globalStyle.heading, { marginTop: 20 }]}>Market cap</Text>
        {/* <PieChart
          style={{ height: 200, }}
          data={[
            {
              value: parseFloat(marketCapExposure?.Mega),
              svg: {
                fill: "#FF5256",
              },
              key: `pie-market-0`,
              arc: { cornerRadius: 3 }
            },
            {
              value: parseFloat(marketCapExposure?.Big),
              svg: {
                fill: "#F1C40F",
              },
              key: `pie-market-1`,
              arc: { cornerRadius: 3 }
            },
            {
              value: parseFloat(marketCapExposure?.Small),
              svg: {
                fill: "#FEA310",
              },
              key: `pie-market-2`,
              arc: { cornerRadius: 3 }
            },
            {
              value: parseFloat(marketCapExposure?.Medium),
              svg: {
                fill: "#0F69FE",
              },
              key: `pie-market-3`,
              arc: { cornerRadius: 3 }
            },
            {
              value: parseFloat(marketCapExposure?.Micro),
              svg: {
                fill: "#19C567",
              },
              key: `pie-market-4`,
              arc: { cornerRadius: 3 }
            },
          ]}
          // spacing={8}
          outerRadius={'95%'}
          innerRadius={'70%'}
          labelRadius={10}
        /> */}
        <View style={{ flexDirection: 'column' }}>
          <View style={[globalStyle.justifyBetween, { marginTop: 25 }]}>
            <View style={[globalStyle.justifyBetween, styles.marketLayout]}>
              <View style={[globalStyle.alignItemsCenter, { gap: 10 }]}>
                <View style={[styles.marketCap, { backgroundColor: '#FF5256' }]} />
                <Text style={styles.marketCapText}>Mega cap</Text>
              </View>
              <Text style={styles.marketCapText}>{getRoundOffValue(marketCapExposure?.Mega)}%</Text>
            </View>
            <View style={[globalStyle.justifyBetween, styles.marketLayout]}>
              <View style={[globalStyle.alignItemsCenter, { gap: 10 }]}>
                <View style={[styles.marketCap, { backgroundColor: '#F1C40F' }]} />
                <Text style={styles.marketCapText}>Large cap</Text>
              </View>
              <Text style={styles.marketCapText}>{getRoundOffValue(marketCapExposure?.Big)}%</Text>
            </View>
          </View>
          <View style={[globalStyle.justifyBetween, { marginTop: 19 }]}>
            <View style={[globalStyle.justifyBetween, styles.marketLayout]}>
              <View style={[globalStyle.alignItemsCenter, { gap: 10 }]}>
                <View style={[styles.marketCap, { backgroundColor: '#0F69FE' }]} />
                <Text style={styles.marketCapText}>Mid cap</Text>
              </View>
              <Text style={styles.marketCapText}>{getRoundOffValue(marketCapExposure?.Medium)}%</Text>
            </View>
            <View style={[globalStyle.justifyBetween, styles.marketLayout]}>
              <View style={[globalStyle.alignItemsCenter, { gap: 10 }]}>
                <View style={[styles.marketCap, { backgroundColor: '#FEA310' }]} />
                <Text style={styles.marketCapText}>Small cap</Text>
              </View>
              <Text style={styles.marketCapText}>{getRoundOffValue(marketCapExposure?.Small)}%</Text>
            </View>
          </View>
          <View style={[globalStyle.justifyBetween, styles.marketLayout, { marginTop: 20 }]}>
            <View style={[globalStyle.alignItemsCenter, { gap: 10 }]}>
              <View style={[styles.marketCap, { backgroundColor: '#19C567' }]} />
              <Text style={styles.marketCapText}>Micro cap</Text>
            </View>
            <Text style={styles.marketCapText}>{getRoundOffValue(marketCapExposure?.Micro)}%</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  divider: {
    marginTop: 14,
    height: 0.5,
    backgroundColor: "#464646",
  },
  marketCap: {
    width: 12, height: 12, borderRadius: 12,
  },
  marketCapText: {
    fontSize: 12, color: '#FFF'
  },
  marketLayout: {
    alignItems: 'center', gap: 20, width: '40%'
  }
})