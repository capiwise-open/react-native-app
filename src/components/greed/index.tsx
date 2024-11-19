import { memo, useEffect, useState } from "react"
import { Text } from "react-native"
import { StyleSheet, View } from "react-native"

import Api from "../../api/api"
import { FGI, FGI_Icon1 } from "../../assets/svg"

type FGI = {
    value: number,
    valueText: string
}

const Greed = () => {
    const [fgi, setFgi] = useState<FGI>();

    const expertTips = (value: number) => {
        return value < 25 ? 'With the market currently showing extreme fear, it could be a good time to buy at lower prices, potentially setting up for gains when the market recovers.'
            : (value < 45 ? 'With the market in a neutral state, it might be wise to hold your current positions and monitor for any emerging trends before making further investment decisions.'
                : (value < 55 ? 'With the market in a neutral state, it might be wise to hold your current positions and monitor for any emerging trends before making further investment decisions.'
                    : (value < 75 ? 'With the market in a neutral state, it might be wise to hold your current positions and monitor for any emerging trends before making further investment decisions.'
                        : 'With the market currently showing extreme greed, it\'s an excellent opportunity to sell at the highest price and secure some profits.')));
    }
    useEffect(() => {
        Api.getFearGreed().then(value => {
            if (!!value) {
                setFgi(value.fgi.now);
            }
        })
    }, []);

    return <View style={styles.container}>
        <Text style={styles.title}>Get to know what emotion is driven the market</Text>
        <FGI title={fgi?.valueText} value={fgi?.value} />
        <View style={{
            flexDirection: 'row',
            alignSelf: 'flex-start',
            gap: 12
        }}>
            <FGI_Icon1 />
            <Text style={{ color: 'white', fontSize: 16 }}>Expert tip</Text>
        </View>
        <Text style={styles.subTitle}>{expertTips(fgi?.value)}</Text>
    </View>
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#0B1620',
        flexDirection: 'column',
        alignItems: 'center',
        borderRadius: 16,
        padding: 20,
        gap: 20,
    },
    title: {
        color: 'white',
        fontSize: 16,
    },
    subTitle: {
        color: 'white',
        fontSize: 14
    }
})

export default memo(Greed)