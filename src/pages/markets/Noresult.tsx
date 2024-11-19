import React, { memo } from "react";
import { View, StyleSheet, Text } from "react-native"
import { ExclamationWhiteBG } from "../../assets/img/Constant"

const Noresult = () => {
    return (
        <View style={[{ marginHorizontal: 15 }, styles.layout]}>
            <ExclamationWhiteBG />
            <View style={{}}>
                <Text style={{ fontSize: 14, fontWeight: '700', color: '#FFF' }}>No stock earnings were reported today!</Text>
                <Text style={{ fontSize: 14, fontWeight: '400', color: '#FFF' }}>Kindly check the calendar for updates on {"\n"}other days.</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    layout: {
        backgroundColor: '#FFA412',
        height: 64,
        borderRadius: 8,
        flexDirection: 'row',
        gap: 15,
        alignItems: 'center',
        padding: 10,
    }
})

export default memo(Noresult);