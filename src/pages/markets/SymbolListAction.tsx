import React from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TouchableHighlight,
    Keyboard
} from "react-native";
import { globalStyle } from "../../assets/css/globalStyle"
import { Star, StarActive } from "../../assets/img/Constant";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { getRoundOffValue } from "../../utils/utils";
import { RootStackParams } from "../../navigation/props";
import { useGetProfileQuery } from "../../api";

const SymbolListAction = ({ data, callback }) => {
    const navigation = useNavigation<NavigationProp<RootStackParams>>();
    const { data: userProfile } = useGetProfileQuery({});

    const onHandleEtf = async (stock) => {
        Keyboard.dismiss();
        try {
            if (stock.instrument_type == "ETF") {
                navigation.navigate("EtfTab", {
                    symbol: stock?.symbol
                });
            } else {
                navigation.navigate("SummaryTab", {
                    data: {
                        key: stock?.symbol,
                    },
                });
            }
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
                                <View style={[globalStyle.justifyBetween, { gap: 20, width: '45%' }]}>
                                    <View style={{ flexDirection: 'row', gap: 30, alignItems: 'center', width: 150 }}>
                                        <View style={{ backgroundColor: '#0B1620', borderRadius: 16, width: 28, height: 28, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                            <Text style={{ color: '#FFF', fontSize: 16, fontWeight: 'bold' }}>{index + 1}</Text>
                                        </View>
                                        <View style={{ flexDirection: 'column', gap: 5 }}>
                                            <Text style={[globalStyle.h5, { fontSize: 12, letterSpacing: -0.07 }]}>
                                                {stock.symbol}
                                            </Text>
                                            <Text style={[globalStyle.h4, { letterSpacing: -0.1, fontSize: 10 }]}>
                                                {stock.name?.length > 15 ? stock.name.substring(0, 15) + '...' : stock.name}
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                                <View style={[globalStyle.justifyBetween, { width: '55%', alignItems: 'center' }]}>
                                    <Text style={{ color: '#FFF', fontSize: 12, fontWeight: 'bold', width: 70 }}>
                                        ${getRoundOffValue(stock.close)}
                                    </Text>
                                    <Text
                                        style={[globalStyle.h4, {
                                            letterSpacing: -0.1, fontSize: 10, textAlign: 'right', fontWeight: '700',
                                            color: stock.change > 0 ? '#2EBD85' : '#E2433B'
                                        }]}>
                                        ({stock.change > 0 ? '+' : ''}{getRoundOffValue(stock.percent_change)}%)
                                    </Text>
                                    <TouchableOpacity onPress={() => callback(stock?.symbol, stock?.isWatchlisted)}>
                                        {userProfile?.watchlist?.includes(stock?.symbol) ? <StarActive /> : <Star />}
                                    </TouchableOpacity>
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

export {
    SymbolListAction
}