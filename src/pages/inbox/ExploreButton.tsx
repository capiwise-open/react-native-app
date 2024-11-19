import { memo, useState } from "react"
import { StyleSheet } from "react-native";
import { Text } from "react-native"
import { TouchableHighlight } from "react-native"

const Button = () => {
    const [BtnColor, setBtnColor] = useState("#2EBD85");
    return <TouchableHighlight
        style={styles.btnExplore}
        underlayColor={'#2EBD85'}
        onPressIn={() => setBtnColor("#FFF")}
        onPressOut={() => setBtnColor("#2EBD85")}
        onPress={() => { }}>
        <Text style={[styles.btnText, { color: BtnColor }]}>Explore feature</Text>
    </TouchableHighlight>
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#040B11',
        padding: 15
    },
    titleBox: {
        marginVertical: 10,
    },
    title: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
    },
    cardList: {
        flexDirection: 'column',
        gap: 15,
    },
    card: {
        width: '100%',
        flexDirection: 'row',
        gap: 10,
    },
    cardBody: {
        flexBasis: '90%',
        flexDirection: 'column',
        justifyContent: 'space-between',
        gap: 10,
    },
    cardAction: {
        marginLeft: 'auto',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        gap: 10,
    },
    cardTitle: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    cardSubTitle: {
        color: '#fff',
        fontSize: 14,
    },
    cardDate: {
        color: '#fff',
        fontSize: 12,
    },
    btnText: {
        fontSize: 16,
        color: '#2EBD85',
    },
    btnExplore: {
        borderColor: '#2EBD85',
        borderWidth: 1,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 10
    }
})

export default memo(Button);