import { Image, TouchableOpacity } from "react-native"
import { View } from "react-native"
import { Text } from "react-native";
import { AirbnbRating, Rating } from "@rneui/themed";
import { useMemo } from "react";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { CourseStackParams } from "../../../navigation/props";
import { colors, screenWidth } from "../../../assets/css/globalStyle";
import config from "../../../../app.config";
import { CourseItem } from "../../../api/strapi/types";
import { useSelector } from "react-redux";
import { selectCourses } from "../../../api/strapi/courseSlice";

const CourseInfoVert = (props: CourseItem) => {
    const navigation = useNavigation<NavigationProp<CourseStackParams>>();
    const { num1, num2 } = useMemo(() => {
        const a = (props.attributes.price ?? "").toString().split('.');
        return { num1: a[0], num2: a.length > 1 ? a[1] : 0 };
    }, [])
    const courseList = useSelector(selectCourses);
    const bannerUrl = props.attributes.thumb?.data?.attributes?.url ?? (courseList?.find(b => b.id === props.id)?.attributes.thumb?.data?.attributes?.url);

    return <TouchableOpacity
        style={{
            flexDirection: 'column',
            backgroundColor: "#0B1925",
            borderRadius: 6,
            justifyContent: 'space-between',
            alignItems: 'center',
            width: screenWidth * 0.45,
            height: 360,
        }}
        onPress={() => navigation.navigate("CourseInfo", {
            data: props
        })}
    >
        <View style={{
            overflow: 'hidden',
            height: 150,
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            {
                bannerUrl ? <Image
                    source={{
                        uri: config.DEV_STRAPI_HOST + bannerUrl
                    }}
                    style={{
                        width: screenWidth * 0.45 - 20,
                        height: 130,
                        borderRadius: 8,
                    }}
                    resizeMode="cover" />
                    : <View style={{
                        width: screenWidth * 0.45 - 20,
                        height: 130,
                        backgroundColor: '#ccc'
                    }} />
            }
        </View>
        <View style={{
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: 12,
            width: '100%',
            backgroundColor: colors.primaryLight,
            flex: 1
        }}>
            <Text style={{ textAlign: 'auto', fontSize: 14, color: 'white' }}>{props.attributes.title}</Text>
            <View style={{
                flexDirection: 'row',
                alignItems: 'center',
            }}></View>
            <Text style={{ fontSize: 12, color: 'gray' }}>{props.attributes.author}</Text>
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
    CourseInfoVert
}