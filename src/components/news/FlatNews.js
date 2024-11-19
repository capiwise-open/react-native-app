import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  Share,
} from "react-native";
import { Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { getTimeDifference } from "../../utils/utils";
import { ShareIcon } from "../../assets/img/Constant";
import { globalStyle } from "../../assets/css/globalStyle";

export default function FlatNews({news}) {
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
    navigation.navigate("NewsArticle",{data: { key: data} });
  };

  return (
    <View style={globalStyle.container}>
    {news?.map((data, index) => (
      <View key={index}>
        <TouchableOpacity onPress={ ()=> handleNewsArticle(data)}>
          <View style={styles.TrendingStocks}>
            <View style={[globalStyle.flexRow, {gap:12, justifyContent: 'space-between',}]}>
              <View style={globalStyle.newsImageSize}>
                <Image
                  source={data?.image_url ? { uri: data?.image_url } : require("../../assets/img/blank_news.jpg")}
                  style={{width:'100%', height:'100%'}}
                />
              </View>
              <View>
                <Text style={[globalStyle.newsTitle, {width: Dimensions.get('window').width - 182}]}>
                  {data?.title.substring(0, 40) + '...'}
                </Text>
                <View style={[globalStyle.flexRow, {gap:4}]}>
                {data?.entities.slice(0, 3)?.map((symbols, index) => {
                  return <Text key={index + 'symbols'} style={globalStyle.newssubTitle}>{index>0?" | ":""}{symbols.symbol}</Text>
                })}
                </View>
                <View 
                  style={[globalStyle.justifyBetween, globalStyle.alignItemsCenter,{
                    marginTop: 5,
                  }]}>
                  <View style={{flexDirection:'row', gap:5, alignItems:'center'}}>
                    <Text
                      style={globalStyle.newsTimeline}
                    >
                      {data?.source?.length>20?data?.source?.substring(0,20) + '...':data?.source}.{" "}
                      <Text
                        style={{
                          fontWeight: "300",
                        }}
                      >
                        {(getTimeDifference(data?.published_at)).value + " " + (getTimeDifference(data?.published_at)).unit + " ago"}
                      </Text>
                    </Text>
                  </View>      
                  <TouchableOpacity onPress={(e) => onShare(data)} style={globalStyle.shareIcon}> 
                    <ShareIcon/>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    ))}
  </View>
  );
}

const styles = StyleSheet.create({
  TrendingStocks: {
    width: "100%",
    paddingTop: 25,
  },
});
