import React from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TouchableHighlight,
    Image,
} from "react-native";
import { globalStyle } from "../../assets/css/globalStyle"
import { Star, StarActive } from "../../assets/img/Constant"
import { getRoundOffValue } from "../../utils/utils";
import { useSelector } from "react-redux";
import { useGetProfileQuery } from "../../api";

const SymbolList = ({ data, callback, onHandleEtf }) => {
    const { data: user } = useGetProfileQuery({});

    return (
        data?.map((stock, index: number) => {
            return (
                <View key={'stock' + index}>
                    <TouchableHighlight underlayColor="#0B1620" onPress={() => onHandleEtf(stock)}>
                        <>
                            <View style={{ paddingHorizontal: 15 }}>
                                <View style={[globalStyle.justifyBetween, { marginTop: 13, alignItems: 'center' }]}>
                                    <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
                                        <Image style={{ width: 20, height: 20, borderRadius: 20 }}
                                            source={stock.logo == "" || stock.logo == undefined ? require("../../assets/img/no_symbol_logo.png") : { uri: `${stock.logo}` }}
                                        />
                                        <View style={{ flexDirection: 'column', gap: 5 }}>
                                            <Text style={[globalStyle.h5, { fontSize: 12, letterSpacing: -0.07 }]}>
                                                {stock.symbol}
                                            </Text>
                                            <Text style={[globalStyle.h4, { letterSpacing: -0.1, fontSize: 10 }]}>
                                                {stock.name?.length > 40 ? stock.name.substring(0, 40) + '...' : stock.name}
                                            </Text>
                                        </View>
                                    </View>
                                    <View style={[globalStyle.alignItemsCenter, { gap: 10 }]}>
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
                                        <TouchableOpacity onPress={() => callback(stock?.symbol, stock?.isWatchlisted)}>
                                            {user?.watchlist?.includes(stock?.symbol) ? <StarActive /> : <Star />}
                                        </TouchableOpacity>
                                    </View>
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