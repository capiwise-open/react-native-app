import { memo } from "react";
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
import config from "../../../app.config";
import { CarouselItem } from "../../api/strapi/types";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");
const pixelDensity = PixelRatio.get();

const carouselItem = ({ data, index, onNext, onPrev }: {
    data: CarouselItem
    index: number,
    onNext: () => void,
    onPrev: () => void,
    animationValue: SharedValue<number>
}) => {
    const banner = data.attributes.banner?.data?.attributes?.url;
    const textNodes = data.attributes.title.split("\\n");

    return <View key={index} style={{
        backgroundColor: 'black',
        borderRadius: 12,
        height: screenWidth * 0.5,
        marginLeft: 25,
        marginRight: 25,
        flexDirection: 'column',
        overflow: 'hidden'
    }}>
        {banner && <Image
            resizeMode="cover"
            source={{ uri: config.DEV_STRAPI_HOST + banner }}
            style={{
                width: '100%',
                height: '100%',
                position: 'absolute'
            }} />}
        <View style={{
            padding: 30,
            flexDirection: 'column',
            height: '80%',
            justifyContent: 'space-between',
            position: 'relative',
            gap: 0,
        }}>
            {
                textNodes?.map((txt: string, index: number) => {
                    const s = txt.indexOf("<b>");

                    return s >= 0 ? <Text style={{ fontSize: pixelDensity >= 3 ? 16 : 24, fontWeight: '700', color: 'white', width: '80%' }} key={index}>
                        {txt.slice(0, s)}<Text style={{ fontSize: pixelDensity >= 3 ? 16 : 24, fontWeight: '700', color: '#2EBD85', width: '80%' }}>{txt.slice(s + 3, txt.indexOf("</b>"))}</Text>
                    </Text>
                        : <Text
                            style={{ fontSize: pixelDensity >= 3 ? 16 : 24, fontWeight: '700', color: 'white', width: '80%' }}
                            key={index}>
                            {txt}
                        </Text>
                })
            }
        </View>
    </View>
}

export default carouselItem;