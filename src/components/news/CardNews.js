import React from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Share
} from "react-native";
import { Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { getTimeDifference } from "../../utils/utils";
import { ShareIcon } from "../../assets/img/Constant";
import { globalStyle } from "../../assets/css/globalStyle";

export default function CardNews({ news }) {
    const navigation = useNavigation();
    const onShare = async(data) => {
        try {
            const result = await Share.share({
              title: data?.title, 
              message: data?.url + " - Shared By Capiwise"
            }, {dialogTitle: data?.title});
            
            if (result.action === Share.sharedAction) {
              if (result.activityType) {
                // shared with activity type of result.activityType
              } else {
                // shared
              }
            } else if (result.action === Share.dismissedAction) {
              // dismissed
            }
        } catch (error) {
            console.log(error)
        }
    }
    const handleNewsArticle = (data) => {
        navigation.navigate("NewsArticle", { data: { key: data } });
    };

    return (<>
        {news?.map((data, index) => (
            <TouchableOpacity onPress={() => handleNewsArticle(data)} key={index} style={{paddingTop:16}}>
                <>
                <View style={globalStyle.container}>
                    <View style={styles.CardImage}>
                        <Image 
                            source={data?.image_url? { uri: data?.image_url }:require("../../assets/img/blank_news.jpg")}
                            style={styles.CardImage}
                        />
                    </View>
                    <View style={{paddingTop:14}}>
                        <Text style={styles.CardTitle}>{data?.title}</Text>
                        <View style={[globalStyle.flexRow, {gap:4, marginTop:12}]}>
                        {data?.entities.slice(0, 3)?.map((symbols, index) => {
                            return <Text key={index + 'symbols'} style={globalStyle.newssubTitle}>{index>0?" | ":""}{symbols.symbol}</Text>
                        })}
                        </View>
                        <View style={[globalStyle.justifyBetween, {alignItems:'center', marginTop:12}]}>
                            <Text style={styles.CardSubTitle}>{data?.source} {" "}
                                <Text style={{fontWeight: "300"}}>
                                    {getTimeDifference(data?.published_at).value + " " +
                                    getTimeDifference(data?.published_at).unit + " ago"}
                                </Text>
                            </Text>
                            <TouchableOpacity onPress={(e) => onShare(data)} style={globalStyle.shareIcon}> 
                                <ShareIcon/>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                <View style={styles.divider} />
                </>
            </TouchableOpacity>
        ))}
        </>
    );
}

const styles = StyleSheet.create({
    divider: {
        width: '100%',
        marginTop: 16,
        height: 0.5,
        backgroundColor: "#464646",
    },
    CardImage:{
        height: 190,
        width: "100%",
        borderRadius: 5,
        overflow:'hidden'
    },
    CardTitle:{
        color: "#FFF",
        fontSize: 20,
        letterSpacing:0.2,
        fontWeight: "500",
        textAlign: "left",
    },
    CardSubTitle:{
        width: "75%",
        color: "#FFF",
        fontSize: 12,
        fontWeight: "500"
    },
});
