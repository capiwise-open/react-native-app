import { FontAwesome } from "@expo/vector-icons";
import React, { useEffect, useMemo } from "react";
import { Image, StyleSheet, Text, Touchable, View } from "react-native"
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, globalStyle, screenWidth } from "../../../assets/css/globalStyle";
import { NavigationProp, useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { InvestorStackParams } from "../../../navigation/props";
import { StatusBar } from "expo-status-bar";
import { WebView } from 'react-native-webview';

import { InvestorItem } from "../../../api/strapi/types";
import config from "../../../../app.config";
import { AirbnbRating, Button, Divider } from "@rneui/themed";
import { Linking } from "react-native";
import { BookInfoHori } from "../audiobooks/BookInfoHori";
import { InvestorbookInfoHori } from "./InvestorBookInfoHori";

type Route = RouteProp<InvestorStackParams, "InvestorInfo">;

const InvestorInfo = () => {
    const route = useRoute<Route>();
    const navigation = useNavigation<NavigationProp<InvestorStackParams>>();

    useEffect(() => {
        navigation.setOptions({
            headerShown: true,
            headerBackVisible: false,
            headerLeft: () => <></>,
            headerTitle: () => (
                <TouchableOpacity
                    onPress={() => navigation.navigate("Investors")}
                    style={{ ...globalStyle.alignItemsCenter, gap: 15, height: '100%' }}>
                    <FontAwesome name="angle-left" size={28} color="white" />
                    <Text style={{ color: "#FFF", fontSize: 24 }}>
                        Investor
                    </Text>
                </TouchableOpacity>
            ),
            headerStyle: {
                backgroundColor: "#040B11",
            },
            headerTintColor: "#FFF",
        });
    }, [navigation]);

    const bannerUrl = route.params.data.attributes?.picture?.data?.attributes?.url;
    const abouts = route.params.data.attributes.about?.split("\n");

    return <View style={{
        ...styles.container,
    }}>
        <StatusBar backgroundColor={colors.statusbar} style="light" />
        <ScrollView
            style={{
                marginBottom: 20,
                flex: 1,
            }}
        >
            <View style={{
                flexDirection: 'column',
                justifyContent: 'center',
                paddingHorizontal: 12,
                gap: 24
            }}>
                {/* Thumbnail */}
                <View style={{
                    alignItems: 'center',
                }}>
                    {
                        bannerUrl ? <Image source={{
                            uri: config.DEV_STRAPI_HOST + bannerUrl
                        }} style={{
                            width: screenWidth,
                            height: screenWidth * 0.6,
                        }} resizeMode="cover" />
                            : <View style={{
                                width: 160,
                                height: 240,
                                backgroundColor: '#ccc'
                            }} />
                    }
                </View>
                {/* title */}
                <View style={{ ...styles.section, flexDirection: 'row', justifyContent: 'space-between' }}>
                    <View style={{ flexDirection: 'column', gap: 8 }}>
                        <Text style={styles.name}>{route.params.data.attributes?.name}</Text>
                        <Text style={styles.title}>{route.params.data.attributes?.title}</Text>
                    </View>
                    <Divider orientation="vertical" />
                    <View style={{ flexDirection: 'column', gap: 8 }}>
                        <Text style={styles.name}>${route.params.data.attributes?.net_worth} B</Text>
                        <Text style={styles.title}>Net Worth</Text>
                    </View>
                </View>
                {/* about */}
                <View style={{
                    flexDirection: 'column'
                }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 20, color: 'white' }}>About{"\n"}</Text>
                    {
                        abouts?.map((data, index) => {
                            if (data.startsWith("\\b"))
                                return <Text style={{ fontWeight: 'bold', fontSize: 16, color: 'white' }}>{data.slice(2)}</Text>
                            else if (data.startsWith("\\h"))
                                return <Text style={{ fontWeight: 'bold', fontSize: 20, color: 'white' }}>{data.slice(2)}</Text>
                            return <Text style={{ fontSize: 16, lineHeight: 24, color: 'white' }}>{data.slice(2)}</Text>
                        })
                    }
                </View>
                <View style={styles.section}>
                    <Text style={styles.name}>Books</Text>
                    {/* related investors */}
                    <Divider style={{ marginVertical: 16 }} />
                    <View style={{
                        flexDirection: 'column',
                        gap: 16,
                    }}>
                        {
                            route.params.data.attributes?.books.data?.map((book, index) => {
                                return <InvestorbookInfoHori {...book} key={index} />
                            })
                        }
                    </View>
                </View>
            </View>
        </ScrollView>
    </View>
}

export default InvestorInfo;

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.background,
        flex: 1,
        paddingHorizontal: 8,
    },
    section: {
        width: "100%",
        paddingHorizontal: 0,
        display: 'flex',
        flexDirection: 'column',
        borderColor: 'white',
        gap: 8
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 16,
    },
    viewBtn: {
        width: 74,
        height: 24,
        backgroundColor: '#2EBD8500',
        borderRadius: 16,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    name: {
        fontSize: 24,
        color: 'white',
        fontWeight: '600'
    },
    title: {
        fontSize: 16,
        color: 'white',
        fontWeight: '600'
    },
    subtitle: {
        fontSize: 16,
        color: '#ccc',
    },
    rating: {
        fontSize: 18,
        color: 'white',
    },
    summary: {
        fontSize: 16,
        color: 'white',
        lineHeight: 24,
    }
})