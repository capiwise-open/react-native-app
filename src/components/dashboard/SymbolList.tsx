import React, { memo } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableHighlight,
    Image,
    Keyboard,
    PixelRatio
} from "react-native";
import { RouteProp, useRoute, NavigationProp } from '@react-navigation/native';
import { LineChart } from "react-native-gifted-charts";
import { useNavigation } from "@react-navigation/native";
import { globalStyle } from "../../assets/css/globalStyle"
import { getRoundOffValue } from "../../utils/utils";
import { Watchlist } from "../../api/types";
import { RootStackParams } from "../../navigation/props";
import { useSelector } from "react-redux";

// type DetailsScreenRouteProp = RouteProp<RootStackParamList, 'Details'>;
const pixelDensity = PixelRatio.get();

const SymbolList = ({ data }: { data: Watchlist[] }) => {
    const navigation = useNavigation<NavigationProp<RootStackParams>>();

    const onHandleEtf = async (stock: any) => {
        Keyboard.dismiss();
        try {
            if (stock.type == "ETF") {
                navigation.navigate("EtfTab", {
                    symbol: stock.symbol
                });
            } else {
                navigation.navigate("SummaryTab", {
                    data: {
                        key: stock.symbol,
                    },
                });
            }
        } catch (error) {
            console.error("Error storing region symbol:", error);
        }
    };

    return <View style={{
        backgroundColor: '#0B1620',
        borderRadius: 20,
        flexDirection: 'column',
        gap: 20,
        padding: pixelDensity >= 3 ? 8 : 16,
        paddingBottom: 26
    }}>
        {
            data?.map((stock, index) => {
                return stock && (
                    <View key={'stock' + index} style={{ justifyContent: 'center' }}>
                        <TouchableHighlight underlayColor="#0B1620" onPress={() => onHandleEtf(stock)}>
                            <View style={[globalStyle.alignItemsCenter, { justifyContent: 'space-between', marginTop: 13, paddingHorizontal: 10 }]}>
                                <View style={{ flexDirection: 'row', gap: pixelDensity >= 3 ? 8 : 15, alignItems: 'center', width: pixelDensity >= 3 ? 100 : 140 }}>
                                    <Image style={{ width: 30, height: 30, borderRadius: 20 }} resizeMode="cover"
                                        source={(!stock.logo || stock.logo === "") ? require("../../assets/img/no_symbol_logo.png") : { uri: `${stock.logo}` }}
                                    />
                                    <View style={{ flexDirection: 'column', gap: 5 }}>
                                        <Text style={[globalStyle.h5, { fontSize: pixelDensity >= 3 ? 10 : 12, letterSpacing: -0.07 }]}>
                                            {stock.symbol}
                                        </Text>
                                        <Text style={[globalStyle.h4, { letterSpacing: -0.1, fontSize: pixelDensity >= 3 ? 8 : 10 }]}>
                                            {stock.name?.length > 20 ? stock.name.substring(0, 20) + '...' : stock.name}
                                        </Text>
                                    </View>
                                </View>
                                <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: 25 }}>
                                    <LineChart
                                        curved
                                        data={[{ value: stock.open - stock.low }, { value: 0 }, { value: stock.high - stock.low }, { value: stock.close - stock.low }]}
                                        height={25}
                                        width={pixelDensity >= 3 ? 60 : 80}
                                        maxValue={stock.high - stock.low === 0 ? 0.01 : stock.high - stock.low}
                                        hideRules
                                        thickness={2}
                                        initialSpacing={0}
                                        color1={stock.change < 0 ? "#E2433B" : "#2EBD85"}
                                        hideDataPoints
                                        yAxisColor="transparent"
                                        xAxisColor="#979797"
                                        yAxisLabelWidth={0}
                                        adjustToWidth={true}
                                        endSpacing={0}
                                        xAxisType={"dotted"}
                                        dashGap={1}
                                        dashWidth={2}
                                    />
                                </View>
                                <View style={{ flexDirection: 'column', gap: 5 }}>
                                    <Text style={[globalStyle.h5, { fontSize: pixelDensity >= 3 ? 10 : 12, letterSpacing: -0.07, textAlign: 'right' }]}>
                                        ${getRoundOffValue(stock.close)}
                                    </Text>
                                    <Text
                                        style={[globalStyle.h4, {
                                            letterSpacing: -0.1, fontSize: pixelDensity >= 3 ? 8 : 10, textAlign: 'right', fontWeight: '700',
                                            color: stock.change > 0 ? '#2EBD85' : '#E2433B'
                                        }]}>
                                        {stock.change > 0 ? '+' : ''}{getRoundOffValue(stock.change)} ({getRoundOffValue(stock.percent_change)}%)
                                    </Text>
                                </View>
                            </View>
                        </TouchableHighlight>
                    </View>
                )
            })
        }
    </View>
}

const styles = StyleSheet.create({
    divider: {
        borderBottomWidth: 1,
        borderBottomColor: "#464646",
        width: "100%",
        marginTop: 13
    }
});

export default memo(SymbolList);