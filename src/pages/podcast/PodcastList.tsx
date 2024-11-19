import { FontAwesome } from "@expo/vector-icons";
import React, { useEffect, useMemo, useState } from "react";
import { Image, StyleSheet, Text, Touchable, View } from "react-native"
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, globalStyle, screenWidth } from "../../assets/css/globalStyle";
import { NavigationProp, useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { PodcastStackParams } from "../../navigation/props";
import { StatusBar } from "expo-status-bar";
import Searchbar from "../../components/strapi/Searchbar";
import { useSelector } from "react-redux";
import { PodcastItem } from "../../api/strapi/types";
import { useGetPodcastsByCategoryQuery, useGetPodcastsQuery } from "../../api/strapi/podcast";
import { PodcastInfoVert } from "../../components/strapi/podcasts/PodcastInfoVert";

type Route = RouteProp<PodcastStackParams, "PodcastList">;

const PodcastList = () => {
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

    const [page, setPage] = useState(1);
    const { data: podcasts } = useGetPodcastsQuery({ type: route.params.type, page: page });
    const { data: podcastsbyCategory } = useGetPodcastsByCategoryQuery({ page: page, category_id: route.params.category?.id });
    const [podcastList, setPodcastList] = useState<PodcastItem[]>([]);
    const [searchText, setSearchText] = useState("");

    useEffect(() => {
        setPodcastList([]);
    }, [])

    useEffect(() => {
        if (route.params.type === "TopRated" || route.params.type === "Latest")
            !!podcasts && setPodcastList([...podcastList, ...podcasts]);
        if (route.params.type === "Category")
            !!podcastsbyCategory && setPodcastList([...podcastList, ...podcastsbyCategory]);
    }, [podcasts, podcastsbyCategory])

    return <SafeAreaView style={{
        ...styles.container
    }}>
        <StatusBar backgroundColor={colors.statusbar} style="light" />
        {/* Searchbar */}
        <Searchbar onChange={setSearchText} />
        <ScrollView
            style={{
                marginBottom: 20,
                flex: 1,
            }}
            onScrollToTop={() => { }}
            onScrollEndDrag={() => setPage(page + 1)}
        >
            {/* Podcast list */}
            <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <Text style={globalStyle.h1}>
                        {route.params.type === "Latest" ? "Newest podcasts" : route.params.type === "TopRated" ? "Top rated podcasts" : route.params.category?.attributes?.title}
                    </Text>
                </View>
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-evenly',
                    flexWrap: 'wrap',
                    gap: 20,
                }}>
                    {
                        podcastList?.filter(podcast => (podcast.attributes?.title?.includes(searchText) || podcast.attributes?.author?.includes(searchText)))?.map((value, index) => {
                            return <PodcastInfoVert key={index} {...value} />
                        })
                    }
                </View>
            </View>
        </ScrollView>
    </SafeAreaView>
}

export default PodcastList;

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