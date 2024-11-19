import React, { useState } from "react";
import { StyleSheet } from "react-native";
import { Text } from "react-native";
import { TouchableOpacity } from "react-native";

const DrawerItem = (props: {
    onPressIn: () => void,
    onPressOut: () => void,
    onPress: () => void,
    label: string,
    icon: React.ReactElement
}) => {
    const [active, setActive] = useState(false);

    return <TouchableOpacity
        style={styles.item}
        activeOpacity={0.8}
        onPress={props.onPress}
        onPressIn={() => { props.onPressIn(), setActive(true) }}
        onPressOut={() => { props.onPressOut(), setActive(false) }}>
        {props.icon}
        <Text style={{ ...styles.itemLabel, color: active ? '#2EBD85' : 'white' }}>{props.label}</Text>
    </TouchableOpacity>
}

export default DrawerItem;

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#0B1620',
        flex: 1,
        flexDirection: 'column',
        paddingVertical: 40,
        paddingHorizontal: 15,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    title: {
        fontSize: 24,
        color: 'white'
    },
    section: {
        marginHorizontal: 5,
        marginTop: 40,
        flexDirection: 'column',
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingVertical: 15,
        borderBottomWidth: 0.5,
        borderColor: '#464646'
    },
    itemLabel: {
        color: 'white',
        fontSize: 16,
        paddingLeft: 15,
    }
})