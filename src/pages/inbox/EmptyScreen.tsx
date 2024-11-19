import { FontAwesome5 } from "@expo/vector-icons";
import { memo } from "react";
import { StatusBar, Text, TouchableOpacity } from "react-native";
import { StyleSheet } from "react-native";
import { View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, globalStyle } from "../../assets/css/globalStyle";

const EmptyScreen = (props) => {
    return <View style={styles.container}>
        {
            props.children
        }
    </View>
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 15,
        gap: 25,
        flex: 1,
        backgroundColor: '#040B11',
    },
    space: { height: 24 },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white'
    },
    subText: {
        fontSize: 16,
        color: '#FFFa',
        textAlign: 'center',
    },
    btn: {
        backgroundColor: colors.secondary,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 5,
    }
});

export default memo(EmptyScreen);