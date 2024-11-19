import { FontAwesome } from "@expo/vector-icons";
import React, { useEffect, useMemo } from "react";
import { Image, StyleSheet, Text, Touchable, View } from "react-native"
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, globalStyle, screenWidth } from "../../assets/css/globalStyle";
import { NavigationProp, useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { PodcastStackParams } from "../../navigation/props";
import Carousel, { ICarouselInstance, Pagination } from "react-native-reanimated-carousel";
import { useSharedValue } from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { TextInput } from "react-native";
import { StatusBar } from "expo-status-bar";
import { PodcastItem } from "../../api/strapi/types";
import config from "../../../app.config";
import { AirbnbRating, Button, Divider } from "@rneui/themed";
import { Linking } from "react-native";
import { PodcastInfoHori } from "../../components/strapi/podcasts/PodcastInfoHori";
import { selectPodcasts } from "../../api/strapi/podcastSlice";
import { useSelector } from "react-redux";

type Route = RouteProp<PodcastStackParams, "PodcastInfo">;

const PodcastInfo = () => {
    const route = useRoute<Route>();
    const navigation = useNavigation<NavigationProp<PodcastStackParams>>();

    useEffect(() => {
        navigation.setOptions({
            headerShown: true,
            headerBackVisible: false,
            headerLeft: () => <></>,
            headerTitle: () => (
                <TouchableOpacity
                    onPress={() => navigation.navigate("Podcasts")}
                    style={{ ...globalStyle.alignItemsCenter, gap: 15, height: '100%' }}>
                    <FontAwesome name="angle-left" size={28} color="white" />
                    <Text style={{ color: "#FFF", fontSize: 24 }}>
                        Podcast
                    </Text>
                </TouchableOpacity>
            ),
            headerStyle: {
                backgroundColor: "#040B11",
            },
            headerTintColor: "#FFF",
        });
    }, [navigation]);

    const podcastList = useSelector(selectPodcasts);
    const bannerUrl = route.params.data.attributes?.thumb?.data?.attributes?.url ?? (podcastList?.find(b => b.id === route.params.data.id)?.attributes.thumb?.data?.attributes?.url);

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
                    <Text style={styles.subtitle}>Podcast by {route.params.data.attributes?.author}</Text>
                </View>
                {/* rating */}
                {
                    route.params.data.attributes.rating_count > 0 && <View style={{
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
                }
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
                {/* related podcasts */}
                <Divider />
                <ScrollView horizontal>
                    <View style={{
                        flexDirection: 'row',
                        gap: 10,
                    }}>
                        {
                            route.params.data.attributes?.related_podcasts?.data?.map((podcast, index) => {
                                return <PodcastInfoHori {...podcast} key={index} />
                            })
                        }
                    </View>
                </ScrollView>
            </View>
        </ScrollView>
    </SafeAreaView>
}

export default PodcastInfo;

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