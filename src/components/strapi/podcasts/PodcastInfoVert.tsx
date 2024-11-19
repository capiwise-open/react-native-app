import { Image, TouchableOpacity } from "react-native"
import { AirbnbRating, Rating } from "@rneui/themed";
import { View } from "react-native"
import { Text } from "react-native";

import { PodcastItem } from "../../../api/strapi/types";
import { colors } from "../../../assets/css/globalStyle";
import { useMemo } from "react";
import config from "../../../../app.config";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { PodcastStackParams } from "../../../navigation/props";
import { selectPodcasts } from "../../../api/strapi/podcastSlice";
import { useSelector } from "react-redux";

const PodcastInfoVert = (props: PodcastItem) => {
    const navigation = useNavigation<NavigationProp<PodcastStackParams>>();
    const { num1, num2 } = useMemo(() => {
        const a = (props.attributes.price ?? "").toString().split('.');
        return { num1: a[0], num2: a.length > 1 ? a[1] : 0 };
    }, [])
    const podcastList = useSelector(selectPodcasts);
    const bannerUrl = props.attributes.thumb?.data?.attributes?.url ?? (podcastList?.find(b => b.id === props.id)?.attributes.thumb?.data?.attributes?.url);

    return <TouchableOpacity
        style={{
            flexDirection: 'column',
            backgroundColor: "#0B1925",
            borderRadius: 6,
            overflow: 'hidden',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '46%',
            height: 300,
            gap: 10,
        }}
        onPress={() => navigation.navigate("PodcastInfo", {
            data: props
        })}
    >
        {
            bannerUrl ? <Image source={{
                uri: config.DEV_STRAPI_HOST + bannerUrl
            }} style={{
                width: '100%',
                height: 130,
            }} resizeMode="cover" />
                : <View style={{
                    width: '100%',
                    height: 130,
                    backgroundColor: '#ccc'
                }} />
        }
        <View style={{
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: 12,
            width: '100%',
            backgroundColor: colors.primaryLight,
            flex: 1
        }}>
            <Text numberOfLines={3} style={{ textAlign: 'auto', fontSize: 14, color: 'white' }}>{props.attributes.title}</Text>
            <View style={{
                flexDirection: 'row',
                alignItems: 'center',
            }}></View>
            <Text style={{ fontSize: 12, color: 'gray' }}>Podcast by {props.attributes.author}</Text>
            {
                props.attributes.rating_count > 0 && <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                }}>
                    <Text style={{ fontSize: 12, color: 'white' }}>{props.attributes.rating}</Text>
                    <AirbnbRating
                        count={5}
                        reviews={[]}
                        defaultRating={props.attributes.rating}
                        size={14}
                        showRating={false}
                    />
                    <Text style={{ fontSize: 12, color: 'white' }}>({props.attributes.rating_count})</Text>
                </View>
            }
        </View>
    </TouchableOpacity>
}

export {
    PodcastInfoVert
}