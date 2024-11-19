import { FontAwesome } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { Image, StyleSheet, Text, Touchable, View } from "react-native"
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { NavigationProp, useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import Carousel, { ICarouselInstance, Pagination } from "react-native-reanimated-carousel";
import { useSharedValue } from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { TextInput } from "react-native";
import { useSelector } from "react-redux";
import { StatusBar } from "expo-status-bar";

import { colors, globalStyle, screenWidth } from "../../assets/css/globalStyle";
import { PodcastStackParams } from "../../navigation/props";
import { useGetPodcastsQuery, useGetCarouselsQuery, useGetCategoriesQuery, useGetLatestPodcastsQuery, useGetTopRatedPodcastsQuery, useSearchPodcastsQuery } from "../../api/strapi/podcast";
import config from "../../../app.config";
import Searchbar from "../../components/strapi/Searchbar";
import CarouselItem from "../../components/strapi/CarouselItem";
import { selectPodcasts } from "../../api/strapi/podcastSlice";
import { PodcastInfoHori } from "../../components/strapi/podcasts/PodcastInfoHori";
import { PodcastInfoVert } from "../../components/strapi/podcasts/PodcastInfoVert";

type Route = RouteProp<PodcastStackParams, "Podcasts">;

const Podcasts = () => {
    const route = useRoute<Route>();
    const navigation = useNavigation<NavigationProp<PodcastStackParams>>();
    const { data: topRatedPodcasts } = useGetTopRatedPodcastsQuery({});
    const { data: latestPodcasts } = useGetLatestPodcastsQuery({});
    const { data: carousels } = useGetCarouselsQuery({});
    const { data: categories } = useGetCategoriesQuery({});
    const [searchText, setSearchText] = useState("");
    const { data: searchList } = useSearchPodcastsQuery({ searchText: searchText });
    const booklist = useSelector(selectPodcasts);

    const ref = React.useRef<ICarouselInstance>(null);
    const progress = useSharedValue<number>(0);
    const onPressPagination = (index: number) => {
        ref.current?.scrollTo({
            count: index - progress.value,
            animated: true,
        });
    };

    useEffect(() => {
        navigation.setOptions({
            headerShown: true,
            headerBackVisible: false,
            headerLeft: () => <></>,
            headerTitle: () => (
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={{ ...globalStyle.alignItemsCenter, gap: 15, height: '100%' }}>
                    <FontAwesome name="angle-left" size={28} color="white" />
                    <Text style={{ color: "#FFF", fontSize: 24 }}>
                        {route.name}
                    </Text>
                </TouchableOpacity>
            ),
            headerStyle: {
                backgroundColor: "#040B11",
            },
            headerTintColor: "#FFF",
        });
    }, [navigation]);

    return <View style={{
        ...styles.container
    }}>
        <StatusBar backgroundColor={colors.statusbar} style="light" />
        {/* Searchbar */}
        <Searchbar onChange={setSearchText} />
        <ScrollView style={{
            marginBottom: 20,
            flex: 1,
        }}>
            {
                searchText.length > 0
                    ? <View style={{
                        flexDirection: 'row',
                        justifyContent: 'space-evenly',
                        flexWrap: 'wrap',
                        gap: 20,
                    }}>
                        {
                            searchList?.map((book, index) => {
                                return <PodcastInfoVert {...book} key={index} />
                            })
                        }
                    </View>
                    : <>
                        {/* Carousel */}
                        <View style={{
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                            {carousels && <Carousel
                                ref={ref}
                                loop
                                width={screenWidth}
                                height={screenWidth * 0.5}
                                autoPlay={true}
                                autoPlayInterval={3000}
                                onProgressChange={progress}
                                data={carousels}
                                scrollAnimationDuration={1000}
                                // customAnimation={animationStyle}
                                // onSnapToItem={(index) => console.log('current index:', index)}
                                renderItem={
                                    ({ item, index, animationValue }) => (<CarouselItem
                                        data={item}
                                        key={index}
                                        onPrev={() => ref.current?.prev()}
                                        onNext={() => ref.current?.next()}
                                        index={index}
                                        animationValue={animationValue} />)
                                }
                            />}
                            {carousels && <Pagination.Basic<number>
                                progress={progress}
                                data={carousels?.map(c => c.id)}
                                size={12}
                                dotStyle={{
                                    borderRadius: 100,
                                    backgroundColor: "#979797",
                                }}
                                activeDotStyle={{
                                    borderRadius: 100,
                                    backgroundColor: "#FFF",
                                    overflow: "hidden",
                                }}
                                containerStyle={[,
                                    {
                                        gap: 12,
                                        marginTop: 16,
                                    },
                                ]}
                                horizontal={true}
                                onPress={onPressPagination}
                            />}
                        </View>
                        {/* Top rated */}
                        <View style={styles.section}>
                            <View style={styles.sectionHeader}>
                                <Text style={globalStyle.h1}>
                                    Top rated
                                </Text>
                                <TouchableOpacity style={styles.viewBtn} onPress={() => navigation.navigate("PodcastList", { type: "TopRated" })}>
                                    <Text style={{ color: "#0F69FE", fontSize: 14 }}>View all</Text>
                                </TouchableOpacity>
                            </View>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{}}>
                                <View style={{
                                    flexDirection: 'row',
                                    gap: 10,
                                }}>
                                    {
                                        topRatedPodcasts?.map((value) => {
                                            return <PodcastInfoHori {...value} key={value.id} />
                                        })
                                    }
                                </View>
                            </ScrollView>
                        </View>
                        {/* Categories */}
                        <View style={styles.section}>
                            <View style={styles.sectionHeader}>
                                <Text style={globalStyle.h1}>
                                    Categories
                                </Text>
                            </View>
                            <View style={{
                                flexDirection: 'row',
                                justifyContent: 'space-evenly',
                                flexWrap: 'wrap',
                                gap: 20,
                            }}>
                                {
                                    categories?.map((value, index: number) => {
                                        const logo = value.attributes?.thumb?.data?.attributes?.url;
                                        return <TouchableOpacity
                                            style={{
                                                width: 200,
                                                height: 120,
                                                position: 'relative',
                                                borderRadius: 10,
                                                overflow: 'hidden',
                                            }}
                                            onPress={() => navigation.navigate("PodcastList", { type: "Category", category: value })}
                                            key={index}>
                                            <LinearGradient
                                                colors={['#0F69FE', '#2A86F3']}
                                                style={{
                                                    width: '100%',
                                                    height: '100%',
                                                    borderRadius: 5,
                                                }} />
                                            {logo && <Image
                                                resizeMode="contain"
                                                style={{
                                                    position: 'absolute',
                                                    bottom: 0,
                                                    right: 10,
                                                    width: '60%',
                                                    height: '70%',
                                                }}
                                                source={{
                                                    uri: config.DEV_STRAPI_HOST + logo
                                                }} />}
                                            <Text style={{
                                                position: 'absolute',
                                                width: '50%',
                                                top: 16,
                                                left: 16,
                                                color: 'white',
                                                fontSize: 16,
                                                fontWeight: 'bold'
                                            }}>{value.attributes.title}</Text>
                                        </TouchableOpacity>
                                    })
                                }
                            </View>
                        </View>
                        {/* Newest */}
                        <View style={styles.section}>
                            <View style={styles.sectionHeader}>
                                <Text style={globalStyle.h1}>
                                    Newest
                                </Text>
                                <TouchableOpacity style={styles.viewBtn} onPress={() => navigation.navigate("PodcastList", { type: "Latest" })}>
                                    <Text style={{ color: "#0F69FE", fontSize: 14 }}>View all</Text>
                                </TouchableOpacity>
                            </View>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{}}>
                                <View style={{
                                    flexDirection: 'row',
                                    gap: 10,
                                }}>
                                    {
                                        latestPodcasts?.map((value) => {
                                            return <PodcastInfoHori {...value} key={value.id} />
                                        })
                                    }
                                </View>
                            </ScrollView>
                        </View>
                    </>
            }
        </ScrollView>
    </View>
}

export default Podcasts;

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
})