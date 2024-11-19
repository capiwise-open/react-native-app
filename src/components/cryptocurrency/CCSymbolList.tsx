import { memo } from "react"
import { Image, StyleSheet, Text } from "react-native";
import { View } from "react-native";

// import { LineChart } from "react-native-gifted-charts";
import { LineChart } from "react-native-chart-kit";
import { useGetAssetsLogoQuery } from "../../api/coinapi";
import { SymbolChange } from "../../api/types";

type prop = {
    cclist: SymbolChange[]
}
const CCSymbolList = ({ cclist }: prop) => {
    const { data: cryptoLogos } = useGetAssetsLogoQuery({});
    // console.log(CCSymbolList.name, cclist)

    return <View style={styles.container}>
        {
            !!cclist && cclist?.map((cchange, index) => {
                try {
                    const s = parseFloat(cchange?.values[0]?.close);
                    let maxValue = s;
                    let minValue = s;
                    const data = cchange?.values?.map(v => {
                        const d = parseFloat(v.close);
                        if (maxValue < d)
                            maxValue = d;
                        if (minValue > d)
                            minValue = d;
                        return { value: (d - s) }
                    });
                    // console.log(CCSymbolList.name, data, maxValue - s, minValue - s, s);
                    const logo_url = cryptoLogos?.find(a => a.asset_id === cchange.meta.symbol.replace("/USD", ""));
                    return <View style={styles.item} key={index}>
                        <View style={{
                            flexDirection: 'row', gap: 20,
                            flex: 1,
                        }}>
                            {
                                !logo_url
                                    ? <Image source={require('../../assets/img/logo.png')} style={styles.icon} />
                                    : <Image source={{ uri: logo_url.url }} style={styles.icon} />
                            }
                            <View style={{
                                flexDirection: 'column',
                                flexShrink: 1,
                                gap: 10
                            }}>
                                <Text style={styles.title}>{cchange.meta.symbol}</Text>
                                <Text style={styles.subTitle}>{s.toFixed(2)} USD</Text>
                            </View>
                        </View>
                        <View style={{
                            overflow: 'hidden',
                            flex: 1,
                        }}>
                            {
                                !!data && <LineChart
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
                                    chartConfig={{
                                        backgroundColor: "#0B1620",
                                        backgroundGradientFromOpacity: 0,
                                        backgroundGradientToOpacity: 0,
                                        barPercentage: 0.5,
                                        useShadowColorFromDataset: false,
                                        propsForBackgroundLines: {
                                            strokeDasharray: "",
                                            strokeOpacity: 0.0
                                        },

                                        /* Adjusts the fill of the chart */
                                        width: 240,
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
                                        marginLeft: -60
                                    }}
                                // bezier
                                />
                            }
                        </View>
                    </View>
                } catch (e) {
                    return <></>
                }
            })
        }
    </View>
}

export default memo(CCSymbolList);

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