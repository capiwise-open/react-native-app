import React, { useEffect, useState } from "react";
import { ScrollView } from "react-native";
import Api from "../../api/api";
import CardNews from "../../components/news/CardNews";
import { globalStyle } from "../../assets/css/globalStyle";
import Loading from "../../components/loading/Loading"
import FlatNews from "../../components/news/FlatNews"
import { useGetNewsByCategoryQuery } from "../../api";
export default function Business() {
  const { data: news, isLoading } = useGetNewsByCategoryQuery({ category: "business" });

  return (
    <ScrollView contentContainerStyle={globalStyle.scrollContainer}>
      {isLoading ? <Loading /> :
        <>
          <CardNews news={news?.slice(0, 1)} />
          <FlatNews news={news?.slice(1)} />
        </>
      }
    </ScrollView>
  )
}