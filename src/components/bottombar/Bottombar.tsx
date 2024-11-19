import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    Alert,
    Linking,
    Platform,
    BackHandler
} from "react-native";

import { BottomTabBarButtonProps, createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import * as Application from 'expo-application';
import VersionCheck from 'react-native-version-check';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';

import Dashboard from '../../pages/Dashboard/Dashboard';
import WatchlistMain from '../../pages/watchlist/WatchlistMain';
import MarketsMain from "../../pages/markets/MarketsMain";
import NewsMain from "../../pages/news/NewsMain";
import {
    MenuHome, MenuHomeActive, MenuWatchList, MenuWatchListActive,
    MenuMarket, MenuMarketActive, MenuNews, MenuNewsActive, MenuInbox,
    MenuInboxActive
} from '../../assets/img/Constant';
import { BottomTabParams } from './params';
import Toast from 'react-native-toast-message';
import { NavigationProp, RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { DrawStackParams, RootStackParams } from '../../navigation/props';
import { MoreActive, MoreInActive } from '../../assets/svg';
import { FontAwesome } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { DrawerNavigationProp, useDrawerProgress } from '@react-navigation/drawer';
import * as Auth from "aws-amplify/auth";

import { generateClient } from "aws-amplify/data";
import type { Schema } from "../../../amplify/data/resource";
import { GraphQLError } from "graphql";
import { UserAttribute, UserProfile } from "../../api/types";
import { useAuthenticator } from '@aws-amplify/ui-react-native';
import { useGetProfileQuery } from '../../api';
import { userApi } from '../../api/profile';
import { useAppDispatch } from '../../store';
import EmptyScreen from '../../pages/inbox/EmptyScreen';
const client = generateClient<Schema>();

const Tab = createBottomTabNavigator<BottomTabParams>();
type MainAppRoute = RouteProp<RootStackParams, "MainApp">;

const Bottombar = () => {
    const navigation = useNavigation<NavigationProp<RootStackParams>>();
    const drawerNavigation = useNavigation<DrawerNavigationProp<DrawStackParams>>();
    const route = useRoute<MainAppRoute>();
    const dispatch = useAppDispatch()

    const { data: userProfile } = useGetProfileQuery({});

    useEffect(() => {
        // orbserve profile changes
        const sub = client?.models?.Profile?.observeQuery().subscribe({
            next: ({ items }) => {
                console.log("onProfileChange detected.", items);
                if (!!items && items.length > 0) {
                    dispatch(userApi.util.invalidateTags(['Profile']));
                    // if (!items[0].name)
                    //   navigation.navigate("Name", {
                    //     update: true
                    //   });
                }
            },
        });
        return () => sub.unsubscribe();
    }, []);

    // navigation onBackHandler
    useEffect(() => {
        const beforeRemoveListener = navigation.addListener('beforeRemove', (e) => {
            // Prevent default behavior of leaving the screen
            e.preventDefault();
            console.log(e.data, route);
            if (e.data?.action?.source?.startsWith("Profile") && e.data?.action?.type === "NAVIGATE") {
                navigation.dispatch(e.data.action);
            } else
                // Prompt the user before leaving the screen
                Alert.alert(
                    'Hold on!',
                    'Are you sure you want to exit?',
                    [
                        { text: 'Cancel', style: 'cancel', onPress: () => { } },
                        {
                            text: 'OK',
                            style: 'destructive',
                            onPress: () => BackHandler.exitApp(),
                        },
                    ]
                );
        });

        return () => {
            // Clean up the listener on component unmount
            navigation.removeListener('beforeRemove', beforeRemoveListener);
        };
    }, [navigation]);


    useEffect(() => {
        // register pushnotification device token to Profile, !after signin
        (async () => {
            try {
                if (Device.isDevice) {
                    const projectId =
                        Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
                    if (!!projectId) {
                        const ntoken = (
                            await Notifications.getExpoPushTokenAsync({
                                projectId,
                            })
                        ).data;
                        if (!!userProfile && !userProfile?.ntoken && !!ntoken)
                            !!userProfile.id && client?.models?.Profile?.update({
                                id: userProfile.id,
                                ntoken
                            });
                    }
                } else {
                    alert('Must use physical device for push notifications');
                }
            } catch (e: unknown) {
                console.log(e);
            }
        })();
    }, [userProfile])

    // check app store's new version available
    useEffect(() => {
        const checkVersion = async () => {
            try {
                const latestVersion = await VersionCheck.getLatestVersion();
                const currentVersion = VersionCheck.getCurrentVersion();
                let needed = (await VersionCheck.needUpdate())?.isNeeded;
                console.log(latestVersion, currentVersion, needed, VersionCheck.getPackageName());
                if (!latestVersion) {
                    const res = await fetch(
                        `https://play.google.com/store/apps/details?id=${VersionCheck.getPackageName()}&hl=en`,
                    );
                    const text = await res.text();
                    let latestVersion;
                    const match = text.match(/\[\[\["([\d.]+?)"\]\]/);
                    if (match) {
                        latestVersion = match[1].trim();
                        console.log(latestVersion);
                        needed = await VersionCheck.needUpdate({
                            latestVersion,
                        });
                    }
                }
                if (needed) {
                    Toast.show({
                        type: 'Capiwise_Update',
                        position: "bottom",
                        visibilityTime: 5000
                    })
                }
            } catch (error) {
                // console.error('Error checking app version:', error);
            }
        };

        checkVersion();
    }, []);

    return (
        <Tab.Navigator
            screenOptions={({ route, navigation }) => ({
                tabBarButton: (props: BottomTabBarButtonProps) => {
                    const { accessibilityState } = props;
                    const focused = accessibilityState?.selected;
                    if (route.name === 'T_Home') {
                        return <View style={styles.tabItem}>
                            <TouchableOpacity onPress={() => navigation.navigate("T_Home")} style={[styles.tabItemBody, { backgroundColor: focused ? '#040B11' : 'transparent' }]}>
                                {focused ? <MenuHomeActive /> : <MenuHome />}
                                <Text style={[styles.tabLabel, { color: focused ? '#2EBD85' : '#FFF', marginTop: -2 }]}>
                                    {route.name.substring(2)}
                                </Text>
                            </TouchableOpacity>
                        </View>;
                    } else if (route.name === 'T_Watchlist') {
                        return <View style={styles.tabItem}>
                            <TouchableOpacity onPress={() => navigation.navigate("T_Watchlist")} style={[styles.tabItemBody, { backgroundColor: focused ? '#040B11' : 'transparent' }]}>
                                {focused ? <MenuWatchListActive /> : <MenuWatchList />}
                                <Text numberOfLines={1} ellipsizeMode="tail" style={[styles.tabLabel, { color: focused ? '#2EBD85' : '#FFF' }]}>
                                    {route.name.substring(2)}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    } else if (route.name === 'T_Markets') {
                        return <View style={styles.tabItem}>
                            <TouchableOpacity onPress={() => navigation.navigate("T_Markets")} style={[styles.tabItemBody, { backgroundColor: focused ? '#040B11' : 'transparent' }]}>
                                {focused ? <MenuMarketActive /> : <MenuMarket />}
                                <Text numberOfLines={1} ellipsizeMode="tail" style={[styles.tabLabel, { color: focused ? '#2EBD85' : '#FFF' }]}>
                                    {route.name.substring(2)}
                                </Text>
                            </TouchableOpacity>
                        </View>;
                    }
                    else if (route.name === 'T_News') {
                        return <View style={styles.tabItem}>
                            <TouchableOpacity onPress={() => navigation.navigate("T_News")} style={[styles.tabItemBody, { backgroundColor: focused ? '#040B11' : 'transparent' }]}>
                                {focused ? <MenuNewsActive /> : <MenuNews />}
                                <Text style={[styles.tabLabel, { color: focused ? '#2EBD85' : '#FFF' }]}>
                                    {route.name.substring(2)}
                                </Text>
                            </TouchableOpacity>
                        </View>;
                    }
                    else if (route.name === 'T_More') {
                        return <View style={styles.tabItem}>
                            <TouchableOpacity onPress={() => {
                                drawerNavigation.openDrawer();
                            }} style={[styles.tabItemBody, { backgroundColor: focused ? '#040B11' : 'transparent' }]}>
                                {focused ? <MoreActive /> : <MoreInActive />}
                                <Text style={[styles.tabLabel, { color: focused ? '#2EBD85' : '#FFF' }]}>
                                    {route.name.substring(2)}
                                </Text>
                            </TouchableOpacity>
                        </View>;
                    }
                },
                tabBarStyle: {
                    backgroundColor: '#0B1620',
                    height: 72,
                    borderColor: '#0B1620',
                },
                tabBarShowLabel: false,
                headerShown: false,
            })}
            initialRouteName='T_Home'
        >
            <Tab.Screen name="T_Home" component={Dashboard} />
            <Tab.Screen name="T_Watchlist" component={WatchlistMain} />
            <Tab.Screen name="T_Markets" component={MarketsMain} />
            <Tab.Screen name="T_News" component={NewsMain} />
            <Tab.Screen name="T_More" component={EmptyScreen} />
        </Tab.Navigator>
    );
};

const styles = StyleSheet.create({
    tabItem: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    tabItemBody: {
        flexDirection: 'column',
        gap: 3,
        alignItems: 'center',
        justifyContent: 'center',
        width: 60,
        height: 60,
        borderRadius: 30
    },
    tabItemImage: {
        width: 22, height: 22
    },
    tabLabel: {
        fontSize: 10,
        letterSpacing: 1,
        fontWeight: "700",
    }
})
export default Bottombar;