import React from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
} from "react-native";
import { globalStyle } from "../../assets/css/globalStyle"
import { Star, StarActive } from "../../assets/img/Constant"
import { miniSerializeError } from "@reduxjs/toolkit";

const SymbolList = ({ data, callback }: { data: any[], callback: Function }) => {
    return (
        data?.map((stock: any, index: number) => {
            return (
                <View key={'stock' + index}>
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
                            <TouchableOpacity onPress={() => !!callback && callback(stock?.symbol, stock?.isWatchlisted)}>
                                {stock.isWatchlisted ? <StarActive /> : <Star />}
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={[styles.divider]} />
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