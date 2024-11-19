import { FontAwesome } from "@expo/vector-icons";
import React, { useEffect, useMemo, useState } from "react";
import { Image, StyleSheet, Text, Touchable, View } from "react-native"
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, globalStyle, screenWidth } from "../../assets/css/globalStyle";
import { NavigationProp, useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { CourseStackParams } from "../../navigation/props";
import { StatusBar } from "expo-status-bar";
import Searchbar from "../../components/strapi/Searchbar";
import { useSelector } from "react-redux";
import { CourseItem } from "../../api/strapi/types";
import { useGetCoursesByCategoryQuery, useGetCoursesQuery } from "../../api/strapi/course";
import { CourseInfoVert } from "../../components/strapi/courses/CourseInfoVert";

type Route = RouteProp<CourseStackParams, "CourseList">;

const CourseList = () => {
    const route = useRoute<Route>();
    const navigation = useNavigation<NavigationProp<CourseStackParams>>();

    useEffect(() => {
        navigation.setOptions({
            headerShown: true,
            headerBackVisible: false,
            headerLeft: () => <></>,
            headerTitle: () => (
                <TouchableOpacity
                    onPress={() => navigation.navigate("Courses")}
                    style={{ ...globalStyle.alignItemsCenter, gap: 15, height: '100%' }}>
                    <FontAwesome name="angle-left" size={28} color="white" />
                    <Text style={{ color: "#FFF", fontSize: 24 }}>
                        {route.name}
                    </Text>
                </TouchableOpacity>
            ),
            headerStyle: {
                backgroundColor: "#040B11",
            },
            headerTintColor: "#FFF",
        });
    }, [navigation]);

    const [page, setPage] = useState(1);
    const { data: courses } = useGetCoursesQuery({ type: route.params.type, page: page });
    const { data: coursesbyCategory } = useGetCoursesByCategoryQuery({ page: page, category_id: route.params.category?.id });
    const [courseList, setCourseList] = useState<CourseItem[]>([]);
    const [searchText, setSearchText] = useState("");

    useEffect(() => {
        setCourseList([]);
    }, [])

    useEffect(() => {
        if (route.params.type === "TopRated" || route.params.type === "Latest")
            !!courses && setCourseList([...courseList, ...courses]);
        if (route.params.type === "Category")
            !!coursesbyCategory && setCourseList([...courseList, ...coursesbyCategory]);
    }, [courses, coursesbyCategory])

    return <SafeAreaView style={{
        ...styles.container
    }}>
        <StatusBar backgroundColor={colors.statusbar} style="light" />
        {/* Searchbar */}
        <Searchbar onChange={setSearchText} />
        <ScrollView
            style={{
                marginBottom: 20,
                flex: 1,
            }}
            onScrollToTop={() => { }}
            onScrollEndDrag={() => setPage(page + 1)}
        >
            {/* Searchbar */}
            <Searchbar />
            {/* Course list */}
            <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <Text style={globalStyle.h1}>
                        {route.params.type === "Latest" ? "Newest courses" : route.params.type === "TopRated" ? "Top rated courses" : route.params.category?.attributes?.title}
                    </Text>
                </View>
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-evenly',
                    flexWrap: 'wrap',
                    gap: 10,
                }}>
                    {
                        courseList?.filter(course => (course.attributes?.title?.includes(searchText) || course.attributes?.author?.includes(searchText)))?.map((value, index) => {
                            return <CourseInfoVert key={index} {...value} />
                        })
                    }
                </View>
            </View>
        </ScrollView>
    </SafeAreaView>
}

export default CourseList;

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.background,
        flex: 1,
        paddingHorizontal: 8,
    },
    section: {
        width: "100%",
        paddingHorizontal: 8,
        paddingVertical: 4,
        display: 'flex',
        flexDirection: 'column',
        borderColor: 'white',
        // borderWidth: 1,
        gap: 20
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 16,
    },
    viewBtn: {
        width: 74,
        height: 24,
        backgroundColor: '#2EBD8500',
        borderRadius: 16,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
})