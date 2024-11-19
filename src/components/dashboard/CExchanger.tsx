import { memo, useEffect, useMemo, useState } from "react"
import { LayoutChangeEvent, Text } from "react-native";
import { StyleSheet, TextInput, View } from "react-native"
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import SelectDropdown from "react-native-select-dropdown";
import { useSelector } from "react-redux";
import { selectFiatCurrencies } from "../../api/currencySlice";
import { useGetAssetsLogoQuery } from "../../api/coinapi";
import Ionicons from '@expo/vector-icons/Ionicons';
import { Image } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useGetCurrencyConversionQuery, useGetExchangeRateQuery } from "../../api/twelvedata";
import { Float } from "react-native/Libraries/Types/CodegenTypes";
import Api from "../../api/api";

const CExchanger = () => {
    const currencies = useSelector(selectFiatCurrencies);
    const data = useMemo(() => {
        return currencies.slice(0, 20).map(c => {
            return {
                icon: `https://logo.twelvedata.com/forex/${c.toLocaleLowerCase()}.png`,
                symbol: c
            }
        })
    }, [currencies]);


    const [firstCurrencyIndex, setFirstCurrencyIndex] = useState(0);
    const [secondCurrencyIndex, setSecondCurrencyIndex] = useState(1);
    const [firstCurrencyAmount, setFirstCurrencyAmount] = useState<string>("1");
    const [secondCurrencyAmount, setSecondCurrencyAmount] = useState<string>();
    const [dropdownWidth, setDropdownwidth] = useState(100);

    // const { data: conversion } = useGetCurrencyConversionQuery({ symbol: `${currencies?.at(firstCurrencyIndex)}/${currencies?.at(secondCurrencyIndex)}`, amount: firstCurrencyAmount });

    useEffect(() => {
        Api.getCurrencyConversion({ symbol: `${currencies?.at(firstCurrencyIndex)}/${currencies?.at(secondCurrencyIndex)}`, amount: firstCurrencyAmount }).then(value => {
            if (value && value.amount) {
                setSecondCurrencyAmount(`${value.amount}`);
            }
        }).catch(console.log)
    }, [])

    const onLayout = (e: LayoutChangeEvent) => setDropdownwidth(e?.nativeEvent?.layout?.width)

    return <View style={styles.container}>
        <View style={styles.pair}>
            <View style={styles.input} onLayout={onLayout}>
                <TextInput
                    style={styles.textinput}
                    value={firstCurrencyAmount ?? "0"}
                    onChangeText={(text) => {
                        const newAmount: number = !text ? 0 : parseFloat(text);
                        setFirstCurrencyAmount(newAmount.toString());

                        Api.getCurrencyConversion({ symbol: `${currencies?.at(firstCurrencyIndex)}/${currencies?.at(secondCurrencyIndex)}`, amount: newAmount }).then(value => {
                            if (value && value.amount) {
                                setSecondCurrencyAmount(`${value.amount}`);
                            }
                        }).catch(console.log)
                    }} />
                <View style={styles.dropdown}>
                    <SelectDropdown
                        data={data}
                        dropdownStyle={{ ...styles.dropdownMenuStyle, width: dropdownWidth }}
                        defaultValueByIndex={firstCurrencyIndex}
                        onSelect={(selectedItem, index) => {
                            setFirstCurrencyIndex(index);
                            Api.getCurrencyConversion({ symbol: `${currencies?.at(secondCurrencyIndex)}/${currencies?.at(index)}`, amount: secondCurrencyAmount! }).then(value => {
                                console.log(value.amount)
                                if (value && value.amount) {
                                    setFirstCurrencyAmount(`${value.amount}`);
                                }
                            }).catch(console.log)
                        }}
                        renderButton={(selectedItem, isOpened) => {
                            return (
                                <View style={styles.dropdownButtonStyle}>
                                    {selectedItem && (
                                        <Image source={{ uri: selectedItem.icon }} style={styles.dropdownButtonIconStyle} />
                                    )}
                                    <Text style={styles.dropdownButtonTxtStyle}>
                                        {(selectedItem && selectedItem.symbol) || 'Select Currency'}
                                    </Text>
                                    <Icon name={isOpened ? 'chevron-up' : 'chevron-down'} style={styles.dropdownButtonArrowStyle} />
                                </View>
                            );
                        }}
                        renderItem={(item, index, isSelected) => {
                            return (
                                <View style={{ ...styles.dropdownItemStyle, ...(isSelected && { backgroundColor: '#040B11' }) }}>
                                    <Image source={{ uri: item.icon }} style={styles.dropdownItemIconStyle} />
                                    <Text style={{ ...styles.dropdownItemTxtStyle, color: isSelected ? '#2EBD85' : 'white' }}>{item.symbol}</Text>
                                </View>
                            );
                        }}
                        showsVerticalScrollIndicator={false}
                    />
                </View>
            </View>
            <View style={styles.input}>
                <TextInput
                    style={styles.textinput}
                    value={secondCurrencyAmount ?? "0"}
                    onChange={(e) => {
                        console.log("secondCurrencyAmount")
                        const text = e.nativeEvent.text
                        const newAmount: number = !text ? 0 : parseFloat(text);
                        setSecondCurrencyAmount(newAmount.toString())

                        Api.getCurrencyConversion({ symbol: `${currencies?.at(secondCurrencyIndex)}/${currencies?.at(firstCurrencyIndex)}`, amount: newAmount }).then(value => {
                            if (value && value.amount) {
                                setFirstCurrencyAmount(`${value.amount}`);
                            }
                        }).catch(console.log)
                    }} />
                <View style={styles.dropdown}>
                    <SelectDropdown
                        data={data}
                        defaultValueByIndex={secondCurrencyIndex}
                        dropdownStyle={{ ...styles.dropdownMenuStyle, width: dropdownWidth }}
                        onSelect={(selectedItem, index) => {
                            setSecondCurrencyIndex(index)
                            Api.getCurrencyConversion({ symbol: `${currencies?.at(firstCurrencyIndex)}/${currencies?.at(index)}`, amount: firstCurrencyAmount }).then(value => {
                                if (value) {
                                    setSecondCurrencyAmount(`${value.amount}`);
                                }
                            }).catch(console.log)
                        }}
                        renderButton={(selectedItem, isOpened) => {
                            return (
                                <View style={styles.dropdownButtonStyle}>
                                    {selectedItem && (
                                        <Image source={{ uri: selectedItem.icon }} style={styles.dropdownButtonIconStyle} />
                                    )}
                                    <Text style={styles.dropdownButtonTxtStyle}>
                                        {(selectedItem && selectedItem.symbol) || 'Select Currency'}
                                    </Text>
                                    <Icon name={isOpened ? 'chevron-up' : 'chevron-down'} style={styles.dropdownButtonArrowStyle} />
                                </View>
                            );
                        }}
                        renderItem={(item, index, isSelected) => {
                            return (
                                <View style={{ ...styles.dropdownItemStyle, ...(isSelected && { backgroundColor: '#040B11' }) }}>
                                    <Image source={{ uri: item.icon }} style={styles.dropdownItemIconStyle} />
                                    <Text style={{ ...styles.dropdownItemTxtStyle, color: isSelected ? '#2EBD85' : 'white' }}>{item.symbol}</Text>
                                </View>
                            );
                        }}
                        showsVerticalScrollIndicator={false}
                    />
                </View>
            </View>
            <View style={styles.swapContainer}>
                <TouchableOpacity style={styles.swap} activeOpacity={0.8} onPress={() => {
                    setFirstCurrencyIndex(secondCurrencyIndex);
                    setSecondCurrencyIndex(firstCurrencyIndex);
                    setFirstCurrencyAmount(secondCurrencyAmount!);
                    setSecondCurrencyAmount(firstCurrencyAmount);
                }}>
                    <Ionicons name="swap-vertical" size={24} color="#2EBD85" />
                </TouchableOpacity>
            </View>
        </View>
        <View style={styles.info}>
            <Text style={{
                color: 'white'
            }}>{firstCurrencyAmount + " " + currencies?.at(firstCurrencyIndex)} = {secondCurrencyAmount + " " + currencies?.at(secondCurrencyIndex)} at the mid-market rate</Text>
        </View>
        <TouchableOpacity style={styles.btnSendMoney} onPress={() => { }}>
            <Text style={styles.btnText}>Send money</Text>
        </TouchableOpacity>
    </View>
}

export default memo(CExchanger);

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        backgroundColor: '#0B1620',
        padding: 16,
        borderRadius: 20,
        justifyContent: 'space-between',
        gap: 20
    },
    pair: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        gap: 15,
        position: 'relative'
    },
    swapContainer: {
        position: 'absolute',
        right: 20,
        top: '50%',
        height: 50,
        width: 50,
        transform: [
            {
                translateY: -25
            }
        ],
    },
    swap: {
        borderColor: '#464646',
        padding: 8,
        height: 45,
        width: 45,
        borderRadius: 30,
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#040B11',
    },
    info: {
        backgroundColor: '#040B11',
        borderRadius: 8,
        padding: 12,
        flexDirection: 'row',
    },
    btnSendMoney: {
        paddingVertical: 16,
        borderRadius: 30,
        backgroundColor: '#2EBD85',
        color: 'white',
        justifyContent: 'center',
        alignItems: 'center',
    },
    btnText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
    input: {
        position: 'relative',
        flex: 1,
    },
    dropdown: {
        position: 'absolute',
        height: '100%',
        width: '40%',
        justifyContent: 'center',
        alignItems: 'flex-start',
        left: 0
    },
    textinput: {
        borderColor: 'white',
        borderRadius: 10,
        borderWidth: 1,
        fontSize: 32,
        paddingHorizontal: 10,
        paddingVertical: 10,
        fontWeight: '500',
        color: 'white',
        textAlign: 'right',
    },
    dropdownButtonStyle: {
        width: 'auto',
        height: 50,
        backgroundColor: '#0000',
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        paddingHorizontal: 12,
    },
    dropdownButtonTxtStyle: {
        fontSize: 18,
        fontWeight: '500',
        color: '#2EBD85',
    },
    dropdownButtonArrowStyle: {
        fontSize: 28,
        color: '#2EBD85'
    },
    dropdownButtonIconStyle: {
        width: 30,
        height: 30,
        marginRight: 8,
    },
    dropdownMenuStyle: {
        backgroundColor: '#0B1620',
        width: '80%',
        marginHorizontal: 0,
        paddingHorizontal: 0,
        paddingVertical: 1,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: 'white',
    },
    dropdownItemStyle: {
        width: '100%',
        flexDirection: 'row',
        paddingHorizontal: 12,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 8,
        borderBottomWidth: 0.5,
        borderBottomColor: '#323232'
    },
    dropdownItemTxtStyle: {
        flex: 1,
        fontSize: 18,
        fontWeight: '500',
        color: '#2EBD85',
    },
    dropdownItemIconStyle: {
        width: 30,
        height: 30,
        marginRight: 8,
    },
})