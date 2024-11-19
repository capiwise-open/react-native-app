import React, { memo, useEffect, useMemo, useState } from "react";
import {
    View,
    useWindowDimensions,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Modal,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { useNavigation, useRoute } from "@react-navigation/native";
import { AntDesign, FontAwesome, FontAwesome5, Ionicons } from "@expo/vector-icons";
import { Button, Card, Snackbar, Switch, Text, TextInput } from "react-native-paper";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import { globalStyle } from "../../assets/css/globalStyle"
import { Tab, Tooltip } from "react-native-elements";
import Toast from "react-native-toast-message";
import { formatDateAnalysis, getRoundOffValue } from "../../utils/utils";
import { AlertData, StockSummary } from "../../api/types";
import { useCreateAlertMutation, useDeleteAlertMutation, useGetAlertsQuery, useUpdateAlertMutation } from "../../api/alert";
import { useGetProfileQuery, useGetStockSummaryQuery } from "../../api";
import { useGetEtfStockSummaryQuery } from "../../api/stock";

const DeleteAlert = ({ navigation, route }) => {
    const symbol = route.params?.symbol;
    const isEtf = route.params?.etf;
    const { data: user } = useGetProfileQuery({});
    const [deleteAlert] = useDeleteAlertMutation();
    const { data: alertsData, isError: isAlertsError, isLoading: isAlertsLoading, isFetching: isAlertsFetching } = useGetAlertsQuery({ status: false });

    const { data: summary, isLoading, isFetching, isError } = isEtf
        ? useGetEtfStockSummaryQuery({ symbol, email: user?.email, token: "" })
        : useGetStockSummaryQuery({ symbol, email: user?.email, token: "" });

    const alert = useMemo<AlertData>(() => {
        return alertsData?.find(a => a.identifier === route?.params?.symbol)
    }, [alertsData]);

    const [disclosureModalVisible, setDisclosureModalVisible] = useState(false);
    const formattedDate = (date) => date.toLocaleString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });

    useEffect(() => {
        navigation.setOptions({
            headerShown: true,
            headerBackVisible: false,
            headerTitle: () => (
                <TouchableOpacity onPress={() => navigation.goBack()} style={{ ...globalStyle.alignItemsCenter, gap: 15 }}>
                    <FontAwesome name="angle-left" size={28} color="white" />
                    <Text style={{ color: "#FFF", fontSize: 24 }}>
                        Delete Alert
                    </Text>
                </TouchableOpacity>
            ),
            headerStyle: {
                backgroundColor: "#040B11",
            },
            headerTintColor: "#FFF",
        });
    }, [navigation]);

    return (
        <View style={{
            width: "100%",
            backgroundColor: "#040B11",
            minHeight: '100%',
        }}>
            <View style={{
                height: '100%',
                paddingHorizontal: 15,
                justifyContent: 'space-between'
            }}>
                <View style={{ ...styles.section }}>
                    <Text
                        style={styles.sectionLabel}
                    >
                        Overview alert
                    </Text>
                    {/* Stock Summary */}
                    <Card style={{
                        marginVertical: 15,
                        backgroundColor: '#0B1620',
                    }}
                        mode="contained">
                        <Card.Content style={{
                            display: 'flex',
                            flexDirection: 'column',
                        }}>
                            <View style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                marginVertical: 10
                            }}>
                                <Text style={styles.cardText}>Symbol</Text>
                                <Text style={styles.cardText}>{isEtf ? summary?.overview.details.symbol : summary?.profile.symbol} ({isEtf ? summary?.overview.details.name : summary?.profile.name})</Text>
                            </View>
                            <View style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                marginVertical: 10
                            }}>
                                <Text style={styles.cardTextSmall}
                                    variant="titleLarge">Last price</Text>
                                <Text style={{
                                    ...styles.cardTextSmall,
                                    color: '#2EBD85'
                                }}
                                    variant="bodyMedium">
                                    {getRoundOffValue(isEtf ? alert?.value : summary?.day1Range?.change)} ({getRoundOffValue(isEtf ? summary?.overview.day1Range.percentChange : summary?.day1Range?.percentChange)})%
                                </Text>
                            </View>
                            <View style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}>
                                <Text style={styles.cardTextLarge}>${getRoundOffValue(isEtf ? summary?.overview.day1Range.close : summary?.day1Range?.close)}
                                    <Text
                                        style={{
                                            ...styles.cardText,
                                            fontWeight: 'bold',
                                        }}
                                    >
                                        {" "}USD
                                    </Text>
                                </Text>
                                <Text style={styles.cardTextSmall}
                                    variant="bodyMedium">Data as of {formatDateAnalysis(isEtf ? "" : summary?.date)}</Text>
                            </View>
                        </Card.Content>
                    </Card>
                    <View style={{
                        flexDirection: 'column',
                        margin: 15,
                        gap: 15,
                    }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text style={{ fontSize: 16, color: 'white' }}>Signal</Text>
                            <Text style={{ fontSize: 16, color: 'white', fontWeight: '700' }}>{alert?.signal === 'percent' ? "Price percent change" : "Price"}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text style={{ fontSize: 16, color: 'white' }}>Condition</Text>
                            <Text style={{ fontSize: 16, color: 'white', fontWeight: '700' }}>Is {alert?.condition}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text style={{ fontSize: 16, color: 'white' }}>Value</Text>
                            <Text style={{ fontSize: 16, color: 'white', fontWeight: '700' }}>{alert?.signal === "percent" ? (alert?.value + "%") : ('$' + alert?.value)}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text style={{ fontSize: 16, color: 'white' }}>Alert type</Text>
                            <Text style={{ fontSize: 16, color: 'white', fontWeight: '700' }}>{alert?.type === 'gtc' ? "Good til cancelled" : "During one day"}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text style={{ fontSize: 16, color: 'white' }}>Alert date</Text>
                            <Text style={{ fontSize: 16, color: 'white', fontWeight: '700' }}>{formattedDate(new Date(alert?.triggered_at || alert?.createdAt))}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            {/* <Text style={{ fontSize: 16, color: 'white' }}>Action</Text> */}
                            <Text style={{ fontSize: 16, color: '#979797', fontWeight: '700', textAlign: 'center' }}>
                                {
                                    !!alert?.triggered_at
                                        ? "Your alert criteria have been met. Stay informed about your stock's performance!"
                                        : "Your alert criteria haven't been met yet. We'll keep monitoring the situation for you."
                                }
                            </Text>
                        </View>
                    </View>
                </View>
                {/* Save button */}
                <View style={[styles.section, { gap: 15 }]}>
                    <TouchableOpacity
                        onPress={() => {
                            !!alert && deleteAlert({
                                id: alert.id,
                            }).then(data => {
                                if (!data.error) {
                                    Toast.show({
                                        type: 'Capiwise_Success',
                                        position: "top",
                                        text1: summary?.profile?.symbol + " is deleted",
                                    })
                                    navigation.goBack();
                                }
                            });
                        }}
                        style={styles.closeAlert}
                    >
                        <Text style={{ color: "#fff", fontSize: 16, fontWeight: 'bold' }}>Delete alert</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {
                            navigation.goBack();
                        }}
                        style={styles.cancelClose}
                    >
                        <Text style={{ color: "#2EBD85", fontSize: 16, fontWeight: 'bold' }}>Do not delete</Text>
                    </TouchableOpacity>
                </View>
            </View>
            {/* Disclosure modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={disclosureModalVisible}
                onRequestClose={() => {
                    setDisclosureModalVisible(false);
                }}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalBox}>
                        <Text
                            style={[styles.modalText, { fontWeight: "bold", fontSize: 20 }]}
                        >
                            Disclosure
                        </Text>
                        <Text style={styles.modalText}>
                            This information does not constitute any form of investment advice
                            and it should not be used to make any investment decision.
                        </Text>
                        <Text style={styles.modalText}>
                            Please read our{" "}
                            <Text style={{ color: "#2EBD85" }}>Terms of Service</Text>
                        </Text>
                        <TouchableOpacity
                            onPress={() => {
                                // setSnackbarVisible(true);
                                setDisclosureModalVisible(false);

                                Toast.show({
                                    type: 'Capiwise_Success',
                                    position: "top",
                                    text1: "You have set an alert for " + summary?.profile.symbol,
                                })
                            }}
                            style={styles.closeButton}
                        >
                            <Text style={styles.closeButtonText}>Got it</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    tabBar: {
        // marginBottom:50,
        borderRadius: 20,
        backgroundColor: "#0B1620",
    },
    tabItem: {
        paddingHorizontal: 40,
        paddingVertical: 10,
        marginRight: 10,
        // marginBottom:30,
        borderRadius: 20,
    },
    tabItemFocused: {
        width: "auto",
        backgroundColor: "#2EBD85",
    },
    tabItemText: {
        // width:100,
        color: "#FFF",
        fontSize: 15,
    },
    indicator: {
        backgroundColor: "#2EBD85", // Set indicator color
        height: 48,
        marginLeft: 25,
        width: 110,
        borderRadius: 40,
        // textAlign:"center"
    },
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)", // semi-transparent black background
    },
    modalBox: {
        alignItems: "center",
        backgroundColor: "#FFF",
        padding: 20,
        marginHorizontal: 15,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#000",
    },
    modalText: {
        textAlign: "center",
        fontSize: 16,
        marginVertical: 10,
    },
    closeButton: {
        width: 200,
        backgroundColor: "#2EBD85",
        paddingVertical: 10,
        borderRadius: 20,
        alignSelf: "center",
        marginVertical: 10,
    },
    closeButtonText: {
        color: "#FFF",
        fontSize: 16,
        textAlign: "center",
    },
    label: {
        alignItems: "center",
        textTransform: "none",
        fontWeight: "normal",
        color: "#FFF", // Default text color
        fontSize: 15,
        marginLeft: 150,
        width: 180, // Set the width of the label
        // textAlign: "right", // Center the text within the label
    },
    heading: {
        color: "#FFF",
        fontFamily: "Roboto",
        fontSize: 24,
        fontWeight: "bold",
        marginTop: 20,
        marginBottom: 20,
    },
    flex: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
    },
    inputContainer: {
        // paddingHorizontal: 10,
        paddingVertical: 5,
        backgroundColor: "#040B11",
        color: "#FFF",
        marginTop: 16,
        borderBottomColor: "#000000",
    },
    conditionValueInput: {
        height: 40,
        color: "white",
        borderWidth: 1,
        borderRadius: 5,
        borderColor: '#979797',
        fontSize: 16,
        backgroundColor: "#040B11",
        borderBottomColor: "white"
    },
    dropdownContainer: {
        borderWidth: 1,
        borderColor: "#979797",
        borderRadius: 8,
        marginVertical: 10,
        zIndex: 2000,
        backgroundColor: "#FFF",
    },
    dropdown: {
        backgroundColor: "#040B11",
        color: 'black'
    },
    dropdownText: {
        color: "black",
    },
    cardText: {
        color: 'white',
        fontSize: 16
    },
    cardTextSmall: {
        color: 'white',
        fontSize: 14
    },
    cardTextLarge: {
        color: 'white',
        fontSize: 24,
        fontWeight: "bold",
    },
    section: {
        display: 'flex',
        flexDirection: 'column',
        marginVertical: 7,
    },
    row: {
        display: 'flex',
        marginVertical: 5,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    text: {
        color: 'white',
        fontSize: 16,
    },
    textLarge: {
        color: 'white',
        fontSize: 24,
    },
    textSmall: {
        color: 'white',
        fontSize: 12,
    },
    sectionLabel: {
        color: "white",
        fontSize: 18,
        marginVertical: 12
    },
    tabTextLarge: {
        color: 'white',
        height: '100%',
        width: '50%',
        textAlign: 'center',
        textAlignVertical: 'center',
        fontSize: 16,
        paddingTop: 5,
        fontWeight: '500'
    },
    tabItemContainerStyle: {
        height: 35,
        backgroundColor: '#0000',
        borderRadius: 30,
    },
    bottombar: {
        position: 'absolute',
        width: '100%',
        bottom: 0,
        left: 15,
        paddingVertical: 15,
        backgroundColor: '#040B118'
    },
    closeAlert: {
        marginHorizontal: 0,
        paddingVertical: 15,
        backgroundColor: "#E2433B",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 50,
        borderWidth: 0,
    },
    cancelClose: {
        marginHorizontal: 0,
        paddingVertical: 13,
        backgroundColor: "#0000",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 50,
        borderWidth: 2,
        borderColor: '#2EBD85'
    }
});

export default memo(DeleteAlert);