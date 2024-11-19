import React from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableHighlight,
    Image,
    Keyboard
} from "react-native";
import { globalStyle } from "../../assets/css/globalStyle"
import { LineChart } from "react-native-gifted-charts";
import { useNavigation } from "@react-navigation/native";
import { getRoundOffValue } from "../../utils/utils";

const SymbolList = ({ data }) => {
    const navigation = useNavigation();
    const onHandleEtf = async (region) => {
        Keyboard.dismiss();
        try {
            navigation.navigate("SummaryTab", {
                data: {
                    key: region.symbol,
                },
            });
        } catch (error) {
            console.error("Error storing region symbol:", error);
        }
    };

    return (
        data?.map((stock, index) => {
            return stock && (
                <View key={'stock' + index}>
                    <TouchableHighlight underlayColor="#0B1620" onPress={() => onHandleEtf(stock)}>
                        <>
                            <View style={[globalStyle.alignItemsCenter, { justifyContent: 'space-between', marginTop: 13, paddingHorizontal: 15 }]}>
                                <View style={[globalStyle.justifyBetween, { gap: 20 }]}>
                                    <View style={{ flexDirection: 'row', gap: 5, alignItems: 'center', width: 140 }}>
                                        <Image style={{ width: 20, height: 20, borderRadius: 20 }}
                                            source={stock.logo == "" ? require("../../assets/img/no_symbol_logo.png") : { uri: `${stock.logo}` }}
                                        />
                                        <View style={{ flexDirection: 'column', gap: 5 }}>
                                            <Text style={[globalStyle.h5, { fontSize: 12, letterSpacing: -0.07 }]}>
                                                {stock.symbol}
                                            </Text>
                                            <Text style={[globalStyle.h4, { letterSpacing: -0.1, fontSize: 10 }]}>
                                                {stock.name?.length > 20 ? stock.name.substring(0, 20) + '...' : stock.name}
                                            </Text>
                                        </View>
                                    </View>
                                    <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                                        <View style={{ height: 25 }}>
                                            <LineChart
                                                curved
                                                data={[{ value: parseFloat(stock.open) - parseFloat(stock.low) }, { value: 0 }, { value: parseFloat(stock.high) - parseFloat(stock.low) }, { value: parseFloat(stock.close) - parseFloat(stock.low) }]}
                                                height={25}
                                                width={80}
                                                maxValue={parseFloat(stock.high) - parseFloat(stock.low) === 0 ? 0.01 : parseFloat(stock.high) - parseFloat(stock.low)}
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
                                    </View>
                                </View>
                                <View style={{ flexDirection: 'column', gap: 5 }}>
                                    <Text style={[globalStyle.h5, { fontSize: 12, letterSpacing: -0.07, textAlign: 'right' }]}>
                                        ${getRoundOffValue(stock.close)}
                                    </Text>
                                    <Text
                                        style={[globalStyle.h4, {
                                            letterSpacing: -0.1, fontSize: 10, textAlign: 'right', fontWeight: '700',
                                            color: stock.change > 0 ? '#2EBD85' : '#E2433B'
                                        }]}>
                                        {stock.change > 0 ? '+' : ''}{getRoundOffValue(stock.change)} ({getRoundOffValue(stock.percent_change)}%)
                                    </Text>
                                </View>
                            </View>
                            <View style={[styles.divider]} />
                        </>
                    </TouchableHighlight>
                </View>
            )
        })
    )
}

const styles = StyleSheet.create({
    divider: {
        borderBottomWidth: 1,
        borderBottomColor: "#464646",
        width: "100%",
        marginTop: 13
    }
});

export default SymbolList;