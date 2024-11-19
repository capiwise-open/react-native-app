import React, { useEffect, useRef, useState } from 'react';
import { NavigationContainer, NavigationContainerRef, StackNavigationState } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createDrawerNavigator } from '@react-navigation/drawer';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import * as TaskManager from 'expo-task-manager';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import Bottombar from '../components/bottombar/Bottombar';
import Splash from "../pages/Auth/Splash"
import Login from "../pages/Auth/Login";
import Name from "../pages/Auth/Register/Name"
import VerifyUserScreen from "../pages/Auth/Register/VerifyUserScreen";
import ResetPassword from '../pages/ForgotPassword/ResetPassword';
import Confirmation from "../pages/ForgotPassword/Confirmation";
import Forgot from "../pages/ForgotPassword/Forgot";
import ChangePasswordByCode from "../pages/ForgotPassword/ChangePasswordByCode";
import ProfileScreen from "../pages/ProfileMangement/ProfileScreen";
import CloseAccount from "../pages/ProfileMangement/CloseAccount";
import First from "../pages/Stepper/First";
import Second from "../pages/Stepper/Second";
import Third from "../pages/Stepper/Third";
import ClosureAcc from "../pages/ProfileMangement/ClosureAcc";
import ContactUs from "../pages/ProfileMangement/ContactUs";
import CloseAccStep2 from "../pages/ProfileMangement/CloseAccStep2";
import CloseAccStep3 from "../pages/ProfileMangement/CloseAccStep3";
import CloseAccStep4 from "../pages/ProfileMangement/CloseAccStep4";
import MessegeSent from "../pages/alerts/MessageSent";
import SettingMain from "../pages/ProfileMangement/Settings/SettingMain";
import SettingNotifications from "../pages/ProfileMangement/Settings/SettingNotifications";
import AccountMain from "../pages/ProfileMangement/Account/AccountMain";
import EditPhoto from "../pages/ProfileMangement/Account/EditPhoto";
import AddLocation from "../pages/ProfileMangement/Account/AddLocation";
import LannguageRegion from "../pages/ProfileMangement/Settings/LannguageRegion";
import SetNewPassword from "../pages/ProfileMangement/Settings/SetNewPassword";
import TermsAndConditions from "../pages/Auth/TermsAndConditions";
import PrivacyPolicy from "../pages/Auth/PrivacyPolicy";
import ExploreSearch from "../pages/Explore/ExploreSearch";
import SummaryTab from "../pages/StockSummary/SummaryTab";
import EtfTab from "../pages/ETFSummary/EtfTab";
import CreateAlert from "../pages/alerts/CreateAlert";
import CloseAlert from "../pages/alerts/CloseAlert";
import ManageAlerts from "../pages/alerts/ManageAlerts";
import NewsArticle from "../pages/news/NewsArticle";
import WatchListEdit from "../pages/watchlist/WatchListMainEdit";
import NameEmail from '../pages/Auth/Register/NameEmail';
import NameEmailPhone from '../pages/Auth/Register/NameEmailPhone';
import NEPPassword from '../pages/Auth/Register/NEPPassword';
import { AudioBookStackParams, BookStackParams, CourseStackParams, DrawStackParams, InvestorStackParams, PodcastStackParams, RootStackParams } from './props';
import DeleteAlert from '../pages/alerts/DeleteAlert';
import PushNotification from '../pages/notification';
import DrawerContent from '../components/DrawerContent';

import { useGetProfileQuery, useRegisterNotificationTokenMutation } from '../api';
import AudioBooks from '../pages/audiobooks';
import InboxScreen from '../pages/inbox/InboxScreen';
import SystemNotification from '../pages/inbox/SystemNotification';
import { log2fs } from '../utils/log';
import { Schema } from '../../amplify/data/resource';
import { userApi } from '../api/profile';
import { notificationApi, useGetNotificationQuery, useUpdateNotificationMutation } from '../api/notifications';
import { alertApi } from '../api/alert';
import Api from '../api/api';
import OverviewAlert from '../pages/alerts/OverviewAlert';
import Books from '../pages/books';
import BookInfo from '../pages/books/BookInfo';
import BookList from '../pages/books/BookList';
import AudiobookList from '../pages/audiobooks/AudiobookList';
import Podcasts from '../pages/podcast';
import PodcastList from '../pages/podcast/PodcastList';
import PodcastInfo from '../pages/podcast/PodcastInfo';
import InvestorInfo from '../components/strapi/investors/InvestorInfo';
import Investors from '../pages/investors';
import Courses from '../pages/courses';
import CourseList from '../pages/courses/CourseList';
import CourseInfo from '../pages/courses/CourseInfo';
import AudiobookInfo from '../pages/audiobooks/AudiobookInfo';

const MainStack = createNativeStackNavigator<RootStackParams>();
const DrawerStack = createDrawerNavigator<DrawStackParams>();

async function registerForPushNotificationsAsync() {
  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      throw new Error('Permission not granted to get push token for push notification!');
    }
  } else {
    throw new Error('Must use physical device for push notifications');
  }
}

const RootNavigation = () => {
  const navigationRef = useRef<NavigationContainerRef<RootStackParams>>();
  const { data: user } = useGetProfileQuery({});
  const notificationListener = useRef<Notifications.Subscription>();
  const responseListener = useRef<Notifications.Subscription>();
  const lastNotificationResponse: Notifications.NotificationResponse | null | undefined = Notifications.useLastNotificationResponse();
  const [registerPushtoken] = useRegisterNotificationTokenMutation();
  const dispatch = useDispatch();
  const { data: notifications } = useGetNotificationQuery({ email: user?.email });
  const [updateNotification] = useUpdateNotificationMutation();


  const handleNotificationResponse = (response: Notifications.NotificationResponse | null | undefined) => {
    try {
      if (!!response) {
        const { data } = response.notification.request.content;
        // console.log("notification-responsee", data);
        if (!!data && navigationRef.current) {

          Api.getNotifications(user?.email).then((value: any) => {
            console.log(value);
            if (!!value && Array.isArray(value)) {
              for (let not of value) {
                const notification = JSON.parse(not.notification);
                if (notification?.data?.alert_id === data?.alert_id) {
                  updateNotification({
                    id: not.id
                  });
                }
              }
            }
          })

          if (data.type === 'NEWS' && !!data.news) {
            navigationRef.current?.navigate("NewsArticle", {
              data: {
                key: data.news
              }
            });
          } else if (data.type === 'ALERT') {
            dispatch(alertApi.util.invalidateTags(["Alert"]));
            dispatch(notificationApi.util.invalidateTags(["Notification"]));

            if (data.etf === true) {
              navigationRef.current?.navigate("EtfTab", {
                symbol: data.symbol
              });
            } else {
              navigationRef.current?.navigate("SummaryTab", {
                data: {
                  key: data.symbol
                }
              });
            }
          }
        }
      }
    } catch (e) { console.log(e) }
  }

  useEffect(() => {
    console.log("lastNotificationResponse1");
    handleNotificationResponse(lastNotificationResponse);
  }, [lastNotificationResponse])

  useEffect(() => {
    (async () => {
      if (user?.id) {
        try {
          const projectId = Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
          if (!projectId) {
            throw new Error('Project ID not found');
          }
          try {
            const pushTokenString = (
              await Notifications.getExpoPushTokenAsync({
                projectId,
              })
            ).data;
            if (!!pushTokenString && pushTokenString.length > 0)
              registerPushtoken({ id: user.id, ntoken: pushTokenString });
          } catch (e: any) {
            throw new Error(`${e}`);
          }
        } catch (e) { }
      }
    })();
  }, [user])

  useEffect(() => {
    try {
      registerForPushNotificationsAsync()
        .then(value => {
        }).catch(alert)
    } catch (e) {
    }

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      try {
        // console.log("notification-listener", notification?.request?.content?.data);
      } catch (e) { }
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log("lastNotificationResponse2");
      handleNotificationResponse(response);
    });

    return () => {
      notificationListener.current &&
        Notifications.removeNotificationSubscription(notificationListener.current);
      responseListener.current &&
        Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  return <NavigationContainer ref={navigationRef}>
    <DrawerStack.Navigator
      initialRouteName='RootStack'
      screenOptions={{
        headerShown: false,
        headerShadowVisible: false,
      }}
      drawerContent={(props) => <DrawerContent {...props} />}
    >
      <DrawerStack.Screen name="RootStack" component={MainStackScreen} />
      <DrawerStack.Screen name="BookStack" component={BookStackScreen} />
      <DrawerStack.Screen name="AudiobookStack" component={AudiobookStackScreen} />
      <DrawerStack.Screen name="CourseStack" component={CourseStackScreen} />
      <DrawerStack.Screen name="PodcastStack" component={PodcastStackScreen} />
      <DrawerStack.Screen name="InvestorStack" component={InvestorStackScreen} />
    </DrawerStack.Navigator>
  </NavigationContainer>
}

const BookStack = createNativeStackNavigator<BookStackParams>();
const BookStackScreen = () => {
  return <BookStack.Navigator initialRouteName='Books'>
    <BookStack.Screen name="Books" component={Books} />
    <BookStack.Screen name="BookInfo" component={BookInfo} />
    <BookStack.Screen name="BookList" component={BookList} />
  </BookStack.Navigator>
}

const AudiobookStack = createNativeStackNavigator<AudioBookStackParams>();
const AudiobookStackScreen = () => {
  return <AudiobookStack.Navigator initialRouteName='AudioBooks'>
    <AudiobookStack.Screen name="AudioBooks" component={AudioBooks} />
    <AudiobookStack.Screen name="AudiobookInfo" component={AudiobookInfo} />
    <AudiobookStack.Screen name="AudiobookList" component={AudiobookList} />
  </AudiobookStack.Navigator>
}

const PodcastStack = createNativeStackNavigator<PodcastStackParams>();
const PodcastStackScreen = () => {
  return <PodcastStack.Navigator initialRouteName='Podcasts'>
    <PodcastStack.Screen name="Podcasts" component={Podcasts} />
    <PodcastStack.Screen name="PodcastInfo" component={PodcastInfo} />
    <PodcastStack.Screen name="PodcastList" component={PodcastList} />
  </PodcastStack.Navigator>
}

const InvestorStack = createNativeStackNavigator<InvestorStackParams>();
const InvestorStackScreen = () => {
  return <InvestorStack.Navigator initialRouteName='Investors'>
    <InvestorStack.Screen name="Investors" component={Investors} />
    <InvestorStack.Screen name="InvestorInfo" component={InvestorInfo} />
    <InvestorStack.Screen name="BookInfo" component={BookInfo} />
  </InvestorStack.Navigator>
}

const CourseStack = createNativeStackNavigator<CourseStackParams>();
const CourseStackScreen = () => {
  return <CourseStack.Navigator initialRouteName='Courses'>
    <CourseStack.Screen name="Courses" component={Courses} />
    <CourseStack.Screen name="CourseInfo" component={CourseInfo} />
    <CourseStack.Screen name="CourseList" component={CourseList} />
  </CourseStack.Navigator>
}

const MainStackScreen = () => {
  return <MainStack.Navigator screenOptions={{ headerShown: false }} initialRouteName='Splash'>
    <MainStack.Screen name="SummaryTab" component={SummaryTab} />
    <MainStack.Screen name="Splash" component={Splash} />
    <MainStack.Screen name="Login" component={Login} />
    <MainStack.Screen name="Name" component={Name} />
    <MainStack.Screen name="NameEmail" component={NameEmail} />
    <MainStack.Screen name="NameEmailPhone" component={NameEmailPhone} />
    <MainStack.Screen name="NEPPassword" component={NEPPassword} />
    <MainStack.Screen name="VerifyUserScreen" component={VerifyUserScreen} />

    {/* Auth */}
    <MainStack.Screen name="Forgot" component={Forgot} />
    <MainStack.Screen name="ResetPassword" component={ResetPassword} />
    <MainStack.Screen name="Confirmation" component={Confirmation} />
    <MainStack.Screen name="ChangePasswordByCode" component={ChangePasswordByCode} />

    <MainStack.Screen name="PrivacyPolicy" component={PrivacyPolicy} />
    <MainStack.Screen name="TermsAndConditions" component={TermsAndConditions} />

    {/* Register */}
    <MainStack.Screen name="First" component={First} />
    <MainStack.Screen name="Second" component={Second} />
    <MainStack.Screen name="Third" component={Third} />

    <MainStack.Screen name="CloseAccStep2" component={CloseAccStep2} />
    <MainStack.Screen name="ContactUs" component={ContactUs} />
    <MainStack.Screen name="CloseAccStep3" component={CloseAccStep3} />
    <MainStack.Screen name="CloseAccStep4" component={CloseAccStep4} />
    <MainStack.Screen name="ClosureAcc" component={ClosureAcc} />

    <MainStack.Screen name="Profile" component={ProfileScreen} />
    <MainStack.Screen name="CloseAccount" component={CloseAccount} />
    <MainStack.Screen name="MessegeSent" component={MessegeSent} />

    {/* Setting */}
    <MainStack.Screen name="SetNewPassword" component={SetNewPassword} />
    <MainStack.Screen name="LannguageRegion" component={LannguageRegion} />
    <MainStack.Screen name="SettingMain" component={SettingMain} />
    <MainStack.Screen name="SettingNotifications" component={SettingNotifications} />

    {/* Account */}
    <MainStack.Screen name="AccountMain" component={AccountMain} />
    <MainStack.Screen name="EditPhoto" component={EditPhoto} />
    <MainStack.Screen name="AddLocation" component={AddLocation} />

    {/* Explore */}
    <MainStack.Screen name="ExploreSearch" component={ExploreSearch} />

    {/* EFT */}
    <MainStack.Screen name="EtfTab" component={EtfTab} />
    <MainStack.Screen name="NewsArticle" component={NewsArticle} />
    <MainStack.Screen name="WatchListEdit" component={WatchListEdit} />

    <MainStack.Screen name="MainApp" component={Bottombar} />

    {/* Alerts */}
    <MainStack.Screen name="InboxScreen" component={InboxScreen} />
    <MainStack.Screen name="CreateAlert" component={CreateAlert} />
    <MainStack.Screen name="OverviewAlert" component={OverviewAlert} />
    <MainStack.Screen name="CloseAlert" component={CloseAlert} />
    <MainStack.Screen name="DeleteAlert" component={DeleteAlert} />
    <MainStack.Screen name="ManageAlerts" component={ManageAlerts} />
    <MainStack.Screen name='SystemNotification' component={SystemNotification} />
  </MainStack.Navigator>
}

export default RootNavigation;