import { memo, useEffect, useState } from "react";
import { colors, globalStyle } from "../../assets/css/globalStyle";
import { Image, ScrollView, StatusBar, StyleSheet, Text, TouchableHighlight, TouchableOpacity, View } from "react-native";
import { FontAwesome, FontAwesome5, Ionicons } from "@expo/vector-icons";
import { SystemNotificationIcon } from "../../assets/img/Constant";
import { Badge } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import ExploreButton from "./ExploreButton";
import EmptyScreen from "./EmptyScreen";


const SystemNotification = ({ navigation, route }) => {
    useEffect(() => {
        navigation.setOptions({
            headerShown: true,
            headerBackVisible: false,
            headerTitle: () => (
                <TouchableOpacity onPress={() => navigation.goBack()} style={{ ...globalStyle.alignItemsCenter, gap: 15 }}>
                    <FontAwesome name="angle-left" size={28} color="white" />
                    <Text style={{ color: "#FFF", fontSize: 24 }}>
                        System notifications
                    </Text>
                </TouchableOpacity>
            ),
            headerStyle: {
                backgroundColor: "#040B11",
            },
            headerTintColor: "#FFF",
        });
    }, [navigation]);

    const systemNotifications = [];
    const feed = [
        {
            id: 1,
            title: "News Sentiment Analysis",
            description: "We're excited to announce the release of our latest feature! Now, with our News Sentiment Analysis segment, you can easily gauge the sentiment of each article. Whether it's positive, neutral, or negative, you'll have insights at your fingertips. Dive deeper into the details and stay informed with real-time sentiment percentages for each article.",
            date: "15/05/2024, 09:34 AM"
        },
        {
            id: 2,
            title: "New Section: Technical Analysis Summary",
            description: " Introducing our new Technical Analysis Summary section! Explore and gain deeper insights into stocks and ETFs with ease. Whether you're looking to buy, sell, or stay neutral, this section has you covered. Get comprehensive details for each stock and make informed decisions effortlessly.",
            date: "15/05/2024, 09:34 AM"
        },
        {
            id: 3,
            title: "Introducing Fox Now: Stay Updated on Currency and Commodity Exchange Rates",
            description: "Exciting news! Fox Now is here, offering real-time updates on currency and commodity exchange rates. Keep track of fluctuations in the US Dollar, Euro, Bitcoin, Ethereum, Gold, Silver, Copper, and more—all in one place. Stay ahead of the game and make informed decisions with up-to-date exchange rate information.",
            date: "15/05/2024, 09:34 AM"
        },
    ]

    return <View style={styles.container}>
        {
            (!systemNotifications || systemNotifications.length === 0)
                ? <EmptyScreen>
                    <Text style={styles.title}>You are up to date!</Text>
                    <Text style={styles.subText}>By now you already know our latest {"\n"}improvements, stay tuned</Text>
                </EmptyScreen>
                : <ScrollView>
                    <View style={styles.cardList}>
                        {
                            systemNotifications?.map((notify, index) => (
                                <View style={{ flexDirection: 'column', gap: 15 }}>
                                    <View style={styles.card}>
                                        <Image source={require("../../assets/img/logo_capiwise.png")} width={40} height={40} style={{ width: 35, height: 35, flex: 0 }} />
                                        {/* <Ionicons name="notifications-outline" size={20} color="white" /> */}
                                        <View style={styles.cardBody}>
                                            <Text style={styles.cardTitle}>News Sentiment Analysis</Text>
                                            <Text style={styles.cardSubTitle}>We're excited to announce the release of our latest feature! Now, with our News Sentiment Analysis segment, you can easily gauge the sentiment of each article. Whether it's positive, neutral, or negative, you'll have insights at your fingertips. Dive deeper into the details and stay informed with real-time sentiment percentages for each article.</Text>
                                            <Text style={styles.cardDate}>15/05/2024, 09:34 AM</Text>
                                        </View>
                                    </View>
                                    <ExploreButton />
                                    <View style={{
                                        height: 1, backgroundColor: '#5555',
                                    }} />
                                </View>
                            ))
                        }
                    </View>
                </ScrollView>
        }
    </View>
}

export default memo(SystemNotification);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#040B11',
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
        paddingHorizontal: 15,
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
    },
    // empty
    space: { height: 24 },
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
})