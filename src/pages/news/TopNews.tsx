import React, { useEffect, useState } from "react";
import { ScrollView } from "react-native";
import Api from "../../api/api";
import CardNews from "../../components/news/CardNews";
import { globalStyle } from "../../assets/css/globalStyle";
import Loading from "../../components/loading/Loading"
import { useGetNewsByCategoryQuery, useGetProfileQuery } from "../../api";

export default function TopNews() {
  const { data: news, isFetching: isNewsFetching, isLoading: isNewsLoading, isError: isNewsError } = useGetNewsByCategoryQuery({ category: "top", token: "" });

  return (
    <ScrollView contentContainerStyle={globalStyle.scrollContainer}>
      {isNewsLoading ? <Loading /> : <CardNews news={news} />}
    </ScrollView>
  )
}