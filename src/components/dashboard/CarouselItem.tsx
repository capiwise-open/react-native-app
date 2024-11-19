import { memo, useMemo } from "react";
import { Image, PixelRatio } from "react-native";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    RefreshControl,
    Dimensions,
    Linking,
} from "react-native";
import Animated, { SharedValue } from "react-native-reanimated";
import { useGetCarouselsQuery } from "../../api/strapi/dashboard";
import { DashboardCarouselItem } from "../../api/strapi/types";
import config from "../../../app.config";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");
const pixelDensity = PixelRatio.get();

const carouselItem = ({ index, onNext, onPrev }: {
    index: number,
    onNext: () => void,
    onPrev: () => void,
    animationValue: SharedValue<number>
}) => {
    const { data: carousels } = useGetCarouselsQuery({});
    const item: DashboardCarouselItem | undefined = useMemo(() => {
        if (!!carousels)
            return carousels[index];
    }, [carousels]);
    const bannerUrl = item?.attributes.banner?.data?.attributes?.url;

    return <View key={index} style={{
        backgroundColor: 'black',
        width: '100%',
        height: screenWidth * 0.9,
        // marginLeft: 25,
        // marginRight: 25,
        flexDirection: 'column',
        overflow: 'hidden'
    }}>
        <Image
            resizeMode="cover"
            source={{ uri: config.DEV_STRAPI_HOST + bannerUrl }}
            style={{
                width: '100%',
                height: '100%',
                position: 'absolute'
            }} />
        <View style={{
            padding: 30,
            flexDirection: 'column',
            height: '100%',
            justifyContent: 'flex-start',
            paddingBottom: 40,
            position: 'relative'
        }}>
            <Text numberOfLines={3} style={{ fontSize: pixelDensity >= 3 ? 24 : 36, fontWeight: '700', color: 'white', width: '80%' }}>{item?.attributes.title}</Text>
            <Text numberOfLines={3} style={{ fontSize: 14, color: 'white', width: '80%' }}>{item?.attributes.sub_title}</Text>
            <View style={{ width: '100%', height: '100%', position: 'absolute', flexDirection: 'row', justifyContent: 'space-between' }}>
                <TouchableOpacity onPress={onPrev} style={{ width: '40%', height: '100%', backgroundColor: '#fff0' }} />
                <TouchableOpacity onPress={onNext} style={{ width: '40%', height: '100%', backgroundColor: '#fff0' }} />
            </View>
            <TouchableOpacity
                style={{ width: '60%', backgroundColor: '#2EBD85', borderRadius: 30, padding: pixelDensity >= 3 ? 8 : 15, marginTop: 30, justifyContent: 'center' }}>
                <Text numberOfLines={1} style={{ fontSize: 16, color: 'white', textAlign: 'center' }}>Explore {item?.attributes.category}</Text>
            </TouchableOpacity>
        </View>
    </View>
}

export default carouselItem;