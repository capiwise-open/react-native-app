import { Image, TouchableOpacity } from "react-native"
import { View } from "react-native"
import { Text } from "react-native";
import { AirbnbRating, Rating } from "@rneui/themed";
import { useMemo } from "react";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";

import { PodcastItem } from "../../../api/strapi/types";
import { colors } from "../../../assets/css/globalStyle";
import config from "../../../../app.config";
import { PodcastStackParams } from "../../../navigation/props";
import { selectPodcasts } from "../../../api/strapi/podcastSlice";

const PodcastInfoHori = (props: PodcastItem) => {
    const navigation = useNavigation<NavigationProp<PodcastStackParams>>();
    const { num1, num2 } = useMemo(() => {
        const a = (props.attributes.price ?? "").toString().split('.');
        return { num1: a[0], num2: a.length > 1 ? a[1] : 0 };
    }, [])
    const podcastlist = useSelector(selectPodcasts);
    const bannerUrl = props.attributes.thumb?.data?.attributes?.url ?? (podcastlist?.find(b => b.id === props.id)?.attributes.thumb?.data?.attributes?.url);

    return <TouchableOpacity
        style={{
            flexDirection: 'row',
            backgroundColor: colors.primaryLight,
            padding: 12,
            borderRadius: 6,
            justifyContent: 'space-between',
            alignItems: 'center',
            width: 360,
            height: 200,
            gap: 12,
        }}
        onPress={() => navigation.navigate("PodcastInfo", {
            data: props
        })}
    >
        {
            bannerUrl ? <Image source={{
                uri: config.DEV_STRAPI_HOST + bannerUrl
            }} style={{
                width: 160,
                height: 170,
            }} resizeMode="cover" />
                : <View style={{
                    width: 160,
                    height: 170,
                    backgroundColor: '#ccc'
                }} />
        }
        <View style={{
            flexDirection: 'column',
            justifyContent: 'flex-start',
            height: '100%',
            gap: 8,
            flex: 1
        }}>
            <Text style={{ textAlign: 'auto', fontSize: 14, color: 'white' }}>{props.attributes.title}</Text>
            <View style={{
                flexDirection: 'row',
                alignItems: 'center',
            }}></View>
            <Text style={{ fontSize: 12, color: 'gray' }}>Podcast by {props.attributes.author}</Text>
            {
                props.attributes.rating_count > 0 &&
                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                }}>
                    <Text style={{ fontSize: 12, color: 'white' }}>{props.attributes.rating}</Text><AirbnbRating
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
    PodcastInfoHori
}