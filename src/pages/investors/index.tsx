import { FontAwesome } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { Image, StyleSheet, Text, Touchable, View } from "react-native"
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, globalStyle, screenWidth } from "../../assets/css/globalStyle";
import { NavigationProp, useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { InvestorStackParams } from "../../navigation/props";
import Carousel, { ICarouselInstance, Pagination } from "react-native-reanimated-carousel";
import { useSharedValue } from "react-native-reanimated";
import CarouselItem from "../../components/strapi/CarouselItem";
import { LinearGradient } from "expo-linear-gradient";
import { TextInput } from "react-native";
import { StatusBar } from "expo-status-bar";
import config from "../../../app.config";
import Searchbar from "../../components/strapi/Searchbar";
import { useSelector } from "react-redux";
import { useGetCarouselsQuery, useGetInvestorsQuery } from "../../api/strapi/investor";
import InvestorInfo from "../../components/strapi/investors/InvestorInfo";
import { Divider } from "@rneui/themed";
import { InvestorItem } from "../../api/strapi/types";

const biography = require("../../assets/img/biography.png");

type InvestorRoute = RouteProp<InvestorStackParams, "Investors">;

const Investors = () => {
    const route = useRoute<InvestorRoute>();
    const navigation = useNavigation<NavigationProp<InvestorStackParams>>();
    const [page, setPage] = useState(1);
    const { data: carousels } = useGetCarouselsQuery({});
    const { data: investors } = useGetInvestorsQuery({ page: page });
    const [investorList, setInvestorList] = useState<InvestorItem[]>([]);

    useEffect(() => {
        !!investors && setInvestorList([...investorList, ...investors]);
    }, [investors])

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
                        Experts investors
                    </Text>
                </TouchableOpacity>
            ),
            headerStyle: {
                backgroundColor: "#040B11",
            },
            headerTintColor: "#FFF",
        });
    }, [navigation]);

    const ref = React.useRef<ICarouselInstance>(null);
    const progress = useSharedValue<number>(0);

    return <View style={{
        ...styles.container
    }}>
        <StatusBar backgroundColor={colors.statusbar} style="light" />
        <ScrollView
            style={{
                marginBottom: 20,
                flex: 1,
            }}
            onScrollEndDrag={() => setPage(page + 1)}
        >
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
            </View>
            {/* Expert list */}
            <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <Text style={{ fontSize: 16, color: 'white' }}>
                        Top stock market investors
                    </Text>
                </View>
                <Divider />
                <View style={{
                    flexDirection: 'column',
                    gap: 20,
                }}>
                    {
                        investorList?.map((value) => {
                            const pictureUrl = value.attributes?.picture?.data?.attributes?.url;
                            return <View
                                style={{
                                    flexDirection: 'column',
                                    gap: 16,
                                }}
                                key={value.id}>
                                <TouchableOpacity
                                    style={{
                                        flexDirection: 'column',
                                        gap: 8,
                                    }}
                                    onPress={() => navigation.navigate("InvestorInfo", {
                                        data: value
                                    })}
                                >
                                    {
                                        !!pictureUrl && pictureUrl.length > 0 && <Image
                                            source={{ uri: config.DEV_STRAPI_HOST + pictureUrl }}
                                            style={{
                                                width: '100%',
                                                height: screenWidth * 0.5,
                                                borderRadius: 16,
                                            }}
                                            resizeMode="cover"
                                        />
                                    }
                                    <Text style={{ color: 'white', fontSize: 20 }}>{value.attributes.name}</Text>
                                    <Text style={{ color: 'white', fontSize: 16, lineHeight: 24, }}>{value.attributes.title}</Text>
                                    <Image source={biography} />
                                </TouchableOpacity>
                                <Divider />
                            </View>
                        })
                    }
                </View>
            </View>
        </ScrollView>
    </View>
}

export default Investors;

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