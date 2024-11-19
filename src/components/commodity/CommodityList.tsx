import { memo } from "react"
import { Image, StyleSheet, Text } from "react-native";
import { View } from "react-native";

// import { LineChart } from "react-native-gifted-charts";
import { useGetAssetsLogoQuery } from "../../api/coinapi";
import { SymbolChange } from "../../api/types";
import { LineChart } from "react-native-chart-kit";

type prop = {
    data: SymbolChange[]
}

const logos = {
    'XAU': require('../../assets/img/XAU.png'),
    'XAG': require('../../assets/img/XAG.png'),
    'XG': require('../../assets/img/XG.png'),
    'URALS': require('../../assets/img/URALS.png'),
}

const CommodityList = ({ data }: prop) => {
    return <View style={styles.container}>
        {
            !!data && data?.map((cchange, index) => {
                const s = parseFloat(cchange.values[0].close);
                let maxValue = s;
                let minValue = s;
                const data = cchange.values.map(v => {
                    const d = parseFloat(v.close);
                    if (maxValue < d)
                        maxValue = d;
                    if (minValue > d)
                        minValue = d;
                    return { value: (d - s) }
                });
                // const logo_url = '../../assets/img/'+ cchange?.meta?.symbol?.replace("/USD", "") +'.png';
                const symbol = cchange?.meta?.symbol?.replace("/USD", "");
                // console.log(CommodityList.name, cchange, logo_url)
                return <View style={styles.item} key={index}>
                    <View style={{
                        flexDirection: 'row',
                        gap: 20,
                        flex: 1,
                    }}>
                        {
                            !!Object.keys(logos).includes(symbol) && !!logos[symbol] &&
                            <Image source={logos[symbol]} style={styles.icon} resizeMode="contain"/>
                        }
                        <View style={{
                            flexDirection: 'column',
                            flexShrink: 1,
                            maxWidth: 150,
                            minWidth: 120,
                            gap: 10
                        }}>
                            <Text numberOfLines={1} style={styles.title}>{cchange.meta.currency_base}</Text>
                            <Text style={styles.subTitle}>{s.toFixed(2)} USD</Text>
                        </View>
                    </View>
                    <View style={{
                        overflow: 'hidden',
                        flex: 1,
                    }}>
                        <LineChart
                            data={{
                                labels: [],
                                datasets: [
                                    {
                                        data: data.map(v => v.value),
                                        strokeWidth: 2,
                                        color: () => (data[0].value > data[data.length - 1].value) ? "#E2433B" : "#2EBD85",
                                    },
                                ],
                            }}
                            width={240}
                            height={80}
                            withInnerLines={false}
                            withScrollableDot={false}
                            chartConfig={{
                                backgroundColor: "#0B1620f00",
                                backgroundGradientFromOpacity: 0,
                                backgroundGradientToOpacity: 0,
                                barPercentage: 0.5,
                                useShadowColorFromDataset: false,
                                propsForBackgroundLines: {
                                    strokeDasharray: "",
                                    strokeOpacity: 0.0
                                },
                                stackedBar: false,
                                width: 240,
                                /* Adjusts the fill of the chart */
                                fillShadowGradient: 'transparent',
                                fillShadowGradientOpacity: 0,
                                fillShadowGradientFromOffset: 0,
                                fillShadowGradientTo: 'transparent',
                                fillShadowGradientToOpacity: 0,

                                // backgroundGradientFrom: "#0B1620",
                                // backgroundGradientTo: "#0B1620",                        
                                // backgroundColor: "#0B1620",
                                color: () => `rgba(255, 255, 255, 1)`, /* Avoid opacity */
                                propsForDots: {
                                    r: "0"
                                },
                                // horizontalOffset: -30
                            }}
                            withHorizontalLines={false}
                            withVerticalLabels={false}
                            withHorizontalLabels={false}
                            withVerticalLines={false}
                            withShadow={false}
                            // fromZero={false}
                            style={{
                                marginLeft: -60,
                            }}
                        // bezier
                        />
                    </View>
                </View>
            })
        }
    </View>
}

export default memo(CommodityList);

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#0B1620',
        flexDirection: 'column',
        alignItems: 'center',
        borderRadius: 16,
        padding: 20,
        width: '100%',
        gap: 20,
    },
    icon: {
        width: 30,
        height: 30
    },
    item: {
        flexDirection: 'row',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    title: {
        color: 'white',
        fontSize: 14
    },
    subTitle: {
        color: 'white',
        fontSize: 12
    },
})