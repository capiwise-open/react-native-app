import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,

} from "react-native";

import { globalStyle } from "../../../assets/css/globalStyle"
import Toast from 'react-native-toast-message';
import { emailValidation } from "../../../utils/utils";

export default function NameEmail({ navigation, route }) {
    let nf = false, ef = false
    const [fullName, setFullName] = useState(route?.params?.fullName ?? "");
    const [email, setEmail] = useState("");
    const [background, setBackground] = useState('#979797')
    const handleContinue = () => {
        if (!emailValidation(email)) {
            Toast.show({
                type: 'Capiwise_Error',
                position: "top",
                text1: "",
                text2: `Please input email address correctly.`
            })

            return
        }

        if (fullName.length == 0) {
            Toast.show({
                type: 'Capiwise_Error',
                position: "top",
                text1: "",
                text2: `Please input full name.`
            })

            return
        }

        navigation.navigate("NameEmailPhone", {
            fullName: fullName,
            email: email
        });
    }
    const handleTerm = () => {
        navigation.navigate("TermsAndConditions");
    };
    const handlePrivacyPolicy = () => {
        navigation.navigate("PrivacyPolicy");
    };
    const handleLoginPress = () => {
        navigation.navigate("Login");
    };

    return (
        <View style={[globalStyle.container, { height: '100%', flexDirection: 'column', justifyContent: 'space-between' }]}>
            <View>
                <View style={styles.layout}>
                    <Text style={styles.title}>Create your account</Text>
                </View>
                <View style={styles.layout}>
                    <TextInput
                        style={styles.input}
                        placeholder="First and last name"
                        placeholderTextColor="#979797"
                        autoCapitalize="none"
                        maxLength={25}
                        value={fullName}
                        onChangeText={(text) => { setFullName(text) }}
                    />
                    <TextInput
                        style={[styles.input, { marginTop: 20 }]}
                        placeholder="Enter your email address"
                        placeholderTextColor="#979797"
                        autoCapitalize="none"
                        value={email}
                        onChangeText={(text) => { setEmail(text) }}
                    />
                </View>
                <TouchableOpacity onPress={handleContinue} style={[styles.continueBtn, { backgroundColor: fullName.length != 0 && email.length != 0 ? '#2EBD85' : '#979797' }]} disabled={fullName.length == 0 || email.length == 0}>
                    <Text style={{ color: "#FFF", fontSize: 16 }}>Continue</Text>
                </TouchableOpacity>
                <View style={[globalStyle.justifyCenter, { gap: 10, marginTop: 30 }]}>
                    <Text style={{ color: '#FFF' }}>Already have an account?</Text>
                    <TouchableOpacity onPress={handleLoginPress}>
                        <Text style={{ color: '#2EBD85' }}>Login</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={{ width: '100%' }}>
                <View style={[globalStyle.justifyCenter, { gap: 5 }]}>
                    <Text style={{ color: '#2EBD85', fontSize: 12 }} onPress={handleTerm}>Terms of use</Text>
                    <Text style={{ color: '#FFF', fontSize: 12 }}>|</Text>
                    <Text style={{ color: '#2EBD85', fontSize: 12 }} onPress={handlePrivacyPolicy}>Privacy policy</Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    layout: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10
    },
    title: {
        color: "#FFF",
        fontWeight: 'bold',
        fontSize: 24,
        marginTop: '40%'
    },
    input: {
        height: 50,
        borderColor: "#979797",
        borderWidth: 1,
        borderRadius: 8,
        marginTop: 30,
        width: '100%',
        paddingHorizontal: 10,
        color: "#FFF",
    },
    continueBtn: {
        height: 50,
        backgroundColor: "#2EBD85",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 50,
        marginTop: 30
    }
});
