import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,

} from "react-native";

import { globalStyle } from "../../../assets/css/globalStyle"
import PhoneInput from 'react-native-international-phone-number';
import Toast from 'react-native-toast-message';
import { emailValidation } from "../../../utils/utils";

export default function NameEmailPhone({ navigation, route }) {
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [selectedCountry, setSelectedCountry] = useState(null)
    const [phoneNumber, setPhoneNumber] = useState("")

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

        if (fullName.length == 0 || phoneNumber.length == 0) {
            Toast.show({
                type: 'Capiwise_Error',
                position: "top",
                text1: "",
                text2: `To proceed with your account we required:${"\n"}first and last name, your mail and phone number.`
            })
            return
        }

        navigation.navigate("NEPPassword", {
            fullName: fullName,
            email: email,
            country: selectedCountry,
            phoneNumber: phoneNumber
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
    const handleInputValue = (p) => {
        setPhoneNumber(p)
    }
    const handleSelectedCountry = (c) => {
        setSelectedCountry(c)
    }

    useEffect(() => {
        setFullName(route?.params?.fullName)
        setEmail(route?.params?.email)
    }, [])

    return (
        <View style={[globalStyle.container, globalStyle.justifyBetween, { height: '100%', flexDirection: 'column' }]}>
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
                        value={fullName}
                        maxLength={25}
                        onChangeText={(text) => setFullName(text)}
                    />
                    <TextInput
                        style={[styles.input, { marginTop: 20 }]}
                        placeholder="Enter your email address"
                        placeholderTextColor="#979797"
                        autoCapitalize="none"
                        value={email}
                        onChangeText={(text) => setEmail(text)}
                    />
                    <View style={{ marginTop: 20 }}>
                        <PhoneInput
                            value={phoneNumber}
                            onChangePhoneNumber={(p) => handleInputValue(p)}
                            selectedCountry={selectedCountry}
                            onChangeSelectedCountry={(c) => handleSelectedCountry(c)}
                            placeholder={"Enter your phone"}
                            phoneInputStyles={{
                                container: styles.phoneContainer,
                                flagContainer: styles.phoneFlagContainer,
                                callingCode: styles.phoneCallingCode,
                                divider: styles.phoneDivider,
                                caret: styles.phoneCaret,
                                input: styles.phoneInput
                            }}
                            defaultCountry={'US'}
                            modalStyles={{
                                modal: styles.phoneModal,
                                divider: styles.phoneModalDivider,
                                searchInput: styles.phoneSearchInput,
                                countryButton: styles.phoneCountryButton,
                                flag: styles.phoneFlag,
                                callingCode: styles.phoneCallingCode,
                                countryName: styles.phoneCountryButton
                            }}
                        />
                    </View>
                </View>
                <TouchableOpacity onPress={handleContinue}
                    style={[styles.continueBtn, { backgroundColor: email?.length != 0 && fullName?.length != 0 && phoneNumber?.length != 0 ? '#2EBD85' : '#979797' }]} disabled={email.length == 0 || fullName.length == 0 || phoneNumber.length === 0}>
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
        marginTop: '20%'
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
    },
    phoneContainer: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: '#979797',
    },
    phoneFlagContainer: {
        borderTopLeftRadius: 7,
        borderBottomLeftRadius: 7,
        backgroundColor: 'transparent',
        justifyContent: 'center',
    },
    phoneCallingCode: {
        fontSize: 16,
        color: '#FFF',
    },
    phoneDivider: {
        backgroundColor: '#979797',
    },
    phoneCaret: {
        color: '#FFF',
        fontSize: 16,
    },
    phoneInput: {
        color: '#FFF',
        fontSize: 14
    },
    phoneModal: {
        backgroundColor: '#040B11',
        borderWidth: 1,
        borderColor: '#979797'
    },
    phoneBackdrop: {},
    phoneModalDivider: {
        backgroundColor: 'transparent',
    },
    phoneCountriesList: {},
    phoneSearchInput: {
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#FFF',
        color: '#FFF',
        backgroundColor: '#0B1620',
        paddingHorizontal: 12,
        height: 46,
    },
    phoneCountryButton: {
        borderWidth: 1,
        borderColor: '#979797',
        backgroundColor: '#0B1620',
        marginVertical: 4,
        paddingVertical: 0,
    },
    phoneNoCountryText: {},
    phoneNoCountryContainer: {},
    phoneFlag: {
        color: '#FFF',
        fontSize: 20,
    },
    phoneModalCallingCode: {
        color: '#FFF',
    },
    phoneCountryName: {
        color: '#FFF',
    },
});
