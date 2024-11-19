import { Image, TouchableOpacity } from "react-native"
import { View } from "react-native"
import { BookItem } from "../../../api/strapi/types";
import { Text } from "react-native";
import { colors } from "../../../assets/css/globalStyle";
import { AirbnbRating, Rating } from "@rneui/themed";
import { useMemo } from "react";
import config from "../../../../app.config";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { BookStackParams } from "../../../navigation/props";
import { useSelector } from "react-redux";
import { selectBooks } from "../../../api/strapi/bookSlice";
const banner = require("../../../assets/img/banner2.png");

const BookInfoHori = (props: BookItem) => {
    const navigation = useNavigation<NavigationProp<BookStackParams>>();
    const { num1, num2 } = useMemo(() => {
        const a = (props.attributes.price ?? "").toString().split('.');
        return { num1: a[0], num2: a.length > 1 ? a[1] : 0 };
    }, [])
    const booklist = useSelector(selectBooks);
    const bannerUrl = props.attributes.thumb?.data?.attributes?.url ?? (booklist?.find(b => b.id === props.id)?.attributes.thumb?.data?.attributes?.url);

    return <TouchableOpacity
        style={{
            flexDirection: 'row',
            backgroundColor: colors.primaryLight,
            padding: 12,
            borderRadius: 6,
            justifyContent: 'space-between',
            alignItems: 'center',
            width: 340,
            height: 220,
            gap: 12,
        }}
        onPress={() => navigation.navigate("BookInfo", {
            data: props
        })}
    >
        {
            bannerUrl ? <Image source={{
                uri: config.DEV_STRAPI_HOST + bannerUrl
            }} style={{
                width: 150,
                height: 200,
            }} resizeMode="cover" />
                : <View style={{
                    width: 150,
                    height: 200,
                    backgroundColor: '#ccc'
                }} />
        }
        <View style={{
            flexDirection: 'column',
            justifyContent: 'space-between',
            height: '100%',
            flex: 1
        }}>
            <Text numberOfLines={4} style={{ textAlign: 'auto', fontSize: 14, color: 'white' }}>{props.attributes.title}</Text>
            <View style={{
                flexDirection: 'row',
                alignItems: 'center',
            }}></View>
            <Text style={{ fontSize: 12, color: 'gray' }}>by {props.attributes.author}</Text>
            <View style={{
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
            <Text style={{ fontSize: 14, color: 'white' }}>{props.attributes.category}</Text>
            <View style={{
                flexDirection: 'row'
            }}>
                <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white' }}>
                    ${num1}
                </Text>
                <Text style={{ fontSize: 12, fontWeight: 'bold', color: 'white', }}>{num2}</Text>
            </View>
        </View>
    </TouchableOpacity>
}

export {
    BookInfoHori
}