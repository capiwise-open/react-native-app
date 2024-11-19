import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Linking,
  TouchableOpacity,
  ScrollView,
  Share,
} from "react-native";
import { Image } from "react-native";
import { getTimeDifference } from "../../utils/utils";
import { ShareIcon } from "../../assets/img/Constant";
import { globalStyle } from "../../assets/css/globalStyle";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import FlatNews from "../../components/news/FlatNews";
import Loading from "../../components/loading/Loading";
import Api from "../../api/api";
import { useGetNewsByCategoryQuery, useGetProfileQuery } from "../../api";

export default function NewsArticle(props) {
  const data = props?.route?.params?.data?.key;
  const navigation = useNavigation();
  const { data: topNews, isLoading } = useGetNewsByCategoryQuery({ category: "top" });

  const onShare = async (data: any) => {
    try {
      const result = await Share.share({
        title: data?.title,
        message: data?.url + " - Shared By Capiwise"
      }, { dialogTitle: data?.title });

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

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerBackVisible: false,
      headerTitle: () => (
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ ...globalStyle.alignItemsCenter, gap: 15 }}>
          <FontAwesome name="angle-left" size={28} color="white" />
          <Text style={{ color: "#FFF", fontSize: 24 }}>
            News
          </Text>
        </TouchableOpacity>
      ),
      headerStyle: {
        backgroundColor: "#040B11",
      },
      headerTintColor: "#FFF",
    });
  }, [navigation]);

  return (
    <ScrollView contentContainerStyle={globalStyle.scrollContainer}>
      {isLoading ? <Loading /> :
        <>
          {
            !!data && <><Image
              source={data?.image_url ? { uri: data?.image_url } : require("../../assets/img/blank_news.jpg")}
              style={{ height: 190, width: "100%", }}
            />
              <View style={globalStyle.container}>
                <View style={{ paddingTop: 14 }}>
                  <Text style={styles.CardTitle}>{data?.title}</Text>
                  <View style={[globalStyle.justifyBetween, { alignItems: 'center', marginTop: 12 }]}>
                    <Text style={styles.CardSubTitle}>{data?.source} {" "}
                      <Text style={{ fontWeight: "300" }}>
                        {getTimeDifference(data?.published_at).value + " " +
                          getTimeDifference(data?.published_at).unit + " ago"}
                      </Text>
                    </Text>
                    <TouchableOpacity onPress={(e) => onShare(data)} style={globalStyle.shareIcon}>
                      <ShareIcon />
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={{ marginTop: 16 }}>
                  <Text style={styles.CardContent}>{data?.description}</Text>
                  {data?.description !== data?.content && (
                    <Text style={[styles.CardContent, { marginTop: 16 }]}>
                      {data?.content}
                    </Text>
                  )}
                </View>
                <TouchableOpacity
                  onPress={() => { Linking.openURL(data?.url) }}
                  style={styles.articleBtn}
                >
                  <Text style={{ color: "#FFF", fontSize: 18 }}>Read full article</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.divider} />
              <View style={globalStyle.container}>
                <Text style={[styles.CardTitle, { marginTop: 24 }]}>Related News</Text>
              </View>
            </>
          }
          <FlatNews news={(!data?.similar || data?.similar?.length == 0) ? topNews : data?.similar} />
        </>
      }
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  divider: {
    width: '100%',
    marginTop: 35,
    height: 0.5,
    backgroundColor: "#464646",
  },
  CardTitle: {
    color: "#FFF",
    fontSize: 24,
    letterSpacing: 0.2,
    fontWeight: "500",
    textAlign: "left",
  },
  CardSubTitle: {
    width: "75%",
    color: "#FFF",
    fontSize: 12,
    fontWeight: "500"
  },
  CardContent: {
    fontSize: 16,
    lineHeight: 24,
    color: '#FFF'
  },
  articleBtn: {
    width: '100%',
    height: 45,
    backgroundColor: "#2EBD85",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 50,
  }
});