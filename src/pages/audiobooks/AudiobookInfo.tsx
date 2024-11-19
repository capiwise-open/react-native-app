import { FontAwesome } from "@expo/vector-icons";
import React, { useEffect, useMemo } from "react";
import { Image, StyleSheet, Text, Touchable, View } from "react-native"
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { NavigationProp, useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import Carousel, { ICarouselInstance, Pagination } from "react-native-reanimated-carousel";
import { useSharedValue } from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { TextInput } from "react-native";
import { StatusBar } from "expo-status-bar";
import { AirbnbRating, Button, Divider } from "@rneui/themed";
import { Linking } from "react-native";
import { colors, globalStyle, screenWidth } from "../../assets/css/globalStyle";
import { AudioBookStackParams } from "../../navigation/props";
import config from "../../../app.config";
import { BookInfoHori } from "../../components/strapi/audiobooks/BookInfoHori";
import { selectAudiobooks } from "../../api/strapi/audiobookSlice";
import { useSelector } from "react-redux";

type Route = RouteProp<AudioBookStackParams, "AudiobookInfo">;

const AudiobookInfo = () => {
    const route = useRoute<Route>();
    const navigation = useNavigation<NavigationProp<AudioBookStackParams>>();

    useEffect(() => {
        navigation.setOptions({
            headerShown: true,
            headerBackVisible: false,
            headerLeft: () => <></>,
            headerTitle: () => (
                <TouchableOpacity
                    onPress={() => navigation.navigate("AudioBooks")}
                    style={{ ...globalStyle.alignItemsCenter, gap: 15, height: '100%' }}>
                    <FontAwesome name="angle-left" size={28} color="white" />
                    <Text style={{ color: "#FFF", fontSize: 24 }}>
                        Audio book
                    </Text>
                </TouchableOpacity>
            ),
            headerStyle: {
                backgroundColor: "#040B11",
            },
            headerTintColor: "#FFF",
        });
    }, [navigation]);

    const audiobookList = useSelector(selectAudiobooks);
    const bannerUrl = route.params.data.attributes?.thumb?.data?.attributes?.url ?? (audiobookList?.find(b => b.id === route.params.data.id)?.attributes.thumb?.data?.attributes?.url);

    const { num1, num2 } = useMemo(() => {
        const a = route.params.data.attributes.price.toString().split('.');
        return { num1: a[0], num2: a.length > 1 ? a[1] : 0 };
    }, [])

    return <SafeAreaView style={{
        ...styles.container
    }}>
        <StatusBar backgroundColor={colors.statusbar} style="light" />
        <ScrollView style={{
            marginBottom: 20,
            flex: 1,
        }}>
            <View style={{
                flexDirection: 'column',
                justifyContent: 'center',
                paddingHorizontal: 12,
                gap: 12
            }}>
                {/* Thubnail */}
                <View style={{
                    alignItems: 'center',
                }}>
                    {
                        bannerUrl ? <Image source={{
                            uri: config.DEV_STRAPI_HOST + bannerUrl
                        }} style={{
                            width: 160,
                            height: 240,
                        }} resizeMode="cover" />
                            : <View style={{
                                width: 160,
                                height: 240,
                                backgroundColor: '#ccc'
                            }} />
                    }
                </View>
                {/* title */}
                <Text style={styles.title}>{route.params.data.attributes?.title}</Text>
                {/* author */}
                <View style={{
                    alignItems: 'center',
                    flexDirection: 'row',
                    justifyContent: 'space-between'
                }}>
                    <Text style={styles.subtitle}>by {route.params.data.attributes?.author}</Text>
                    <Text style={styles.subtitle}>{route.params.data.attributes?.category}</Text>
                </View>
                {/* rating */}
                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                }}>
                    <Text style={styles.rating}>{route.params.data.attributes.rating}</Text>
                    <AirbnbRating
                        count={5}
                        reviews={[]}
                        defaultRating={route.params.data.attributes.rating}
                        size={24}
                        showRating={false}
                    />
                    <Text style={styles.rating}>({route.params.data.attributes.rating_count})</Text>
                </View>
                {/* price */}
                <View style={{
                    flexDirection: 'row'
                }}>
                    <Text style={{ fontSize: 24, fontWeight: 'bold', color: 'white' }}>
                        ${num1}
                    </Text>
                    <Text style={{ fontSize: 16, fontWeight: 'bold', color: 'white', }}>{num2}</Text>
                </View>
                {/* about */}
                <View style={{
                    flexDirection: 'row'
                }}>
                    <Text style={styles.summary}>
                        {
                            route.params.data.attributes.summary
                        }
                    </Text>
                </View>
                {/* affiliate */}
                {
                    !!route.params.data.attributes.url && <TouchableOpacity
                        style={{
                            backgroundColor: '#2EBD85',
                            borderRadius: 30,
                            height: 60,
                            width: '100%',
                            marginVertical: 10,
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}
                        onPress={() => route.params.data.attributes.url && Linking.openURL(route.params.data.attributes.url)}
                    >
                        <Text style={{
                            fontSize: 20,
                            color: 'white',
                            fontFamily: 'Roboto'
                        }}>{"Listen on Amazon"}</Text>
                    </TouchableOpacity>
                }
                {/* related books */}
                <Divider />
                <ScrollView horizontal>
                    <View style={{
                        flexDirection: 'row',
                        gap: 10,
                    }}>
                        {
                            route.params.data.attributes?.related_books.data?.map((book, index) => {
                                return <BookInfoHori {...book} key={index} />
                            })
                        }
                    </View>
                </ScrollView>
            </View>
        </ScrollView>
    </SafeAreaView>
}

export default AudiobookInfo;

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.background,
        flex: 1,
        paddingHorizontal: 8,
    },
    section: {
        width: "100%",
        paddingHorizontal: 15,
        paddingVertical: 4,
        display: 'flex',
        flexDirection: 'column',
        borderColor: 'white',
        // borderWidth: 1,
        gap: 20
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
    title: {
        fontSize: 22,
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