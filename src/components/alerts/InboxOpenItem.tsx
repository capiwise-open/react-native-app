import { memo, useMemo, useRef } from "react"
import { Text } from "react-native";
import { TouchableOpacity, View } from "react-native";
import { ListItem, ListItemSwipeableProps } from '@rneui/themed';
// import { ListItem, ListItemSwipeableProps } from "react-native-elements";
import { useGetProfileQuery, useGetStockSummaryQuery } from "../../api";
import { colors } from "../../assets/css/globalStyle";
import { getRoundOffValue } from "../../utils/utils";
import { Image } from "react-native";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParams } from "../../navigation/props";
import { AlertData } from "../../api/types";
import { useGetNotificationQuery, useUpdateNotificationMutation } from "../../api/notifications";
import { Swipeable } from "react-native-gesture-handler";

type Props = {
    alert: AlertData,
}

const InboxOpenItem = (props: Props) => {
    const { data: user } = useGetProfileQuery({});
    const { data: summary, isLoading, isFetching, isError } = useGetStockSummaryQuery({ symbol: props.alert.identifier, email: user?.email, token: "" });
    const navigation = useNavigation<NavigationProp<RootStackParams>>();
    const { data: notifications } = useGetNotificationQuery({ email: user?.email });
    const [updateNotification] = useUpdateNotificationMutation();
    const swipeableRef = useRef<Swipeable>();

    const readNotification = (notifications: any[]) => {
        for (let not of notifications) {
            const notification = JSON.parse(not.notification);
            if (!!notification?.pushToken) { // push-notification
                if (notification?.data?.alert_id === props.alert.id) {
                    updateNotification({
                        id: not.id
                    });
                }
            } else if (notification?.id && notification?.identifier) { // new alert notification
                if (notification?.id === props.alert.id) {
                    updateNotification({
                        id: not.id
                    });
                }
            }
        }
    }

    const isNotified = useMemo(() => {
        for (let not of notifications) {
            const notification = JSON.parse(not.notification);
            if (!!notification?.pushToken) { // push-notification
                if (notification?.data?.alert_id === props?.alert?.id) {
                    return true;
                }
            } else if (notification?.id && notification?.identifier) { // new alert notification
                if (notification?.id === props?.alert?.id) {
                    return true;
                }
            }
        }
        return false;
    }, [notifications]);

    const formattedDate = (date: Date) => date.toLocaleString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });

    const caclExpiredTime = () => {
        const d = Math.ceil((new Date().getTime() - new Date(props?.alert?.createdAt ?? 0).getTime()) / 3600 / 1000 / 24);
        return 180 - d;
    }

    const onReplaceAlert = () => {
        navigation.navigate("CreateAlert", {
            update: true,
            symbol: props.alert.identifier,
            etf: props.alert.etf ?? false
        })
    }

    const onCancelAlert = () => {
        navigation.navigate("CloseAlert", {
            symbol: props.alert.identifier,
            etf: props.alert.etf ?? false
        });
    }

    const getChanged = () => {
        if (props.alert.signal === 'percent')
            return (summary?.day1Range?.percentChange > props.alert.value) ? `is ${getRoundOffValue(summary?.day1Range.percentChange)} changed` : 'is in your watch'
        else
            return summary?.day1Range?.change > props.alert.value ? `is now above ${getRoundOffValue(summary?.day1Range.close)}` : 'is in your watch'
    }

    return <ListItem.Swipeable
        // ref={swipeableRef}
        ViewComponent={View}
        topDivider
        onPress={() => {
            readNotification(notifications);
            // if (isNotified) {
            //     if (props.alert.etf) {
            //         navigation.navigate("EtfTab", {
            //             symbol: props.alert.identifier
            //         });
            //     } else {
            //         navigation.navigate("SummaryTab", {
            //             data: {
            //                 key: props.alert.identifier,
            //             },
            //         });
            //     }
            // } else
            navigation.navigate("OverviewAlert", {
                alert: props.alert,
            });
        }}
        containerStyle={{
            backgroundColor: colors.primaryDark,
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
            padding: 10,
            margin: 0
        }}
        rightContent={(
            <View style={{
                width: '100%',
                flexDirection: 'row',
                height: '100%'
            }}>
                <TouchableOpacity
                    onPress={onReplaceAlert}
                    style={{
                        flex: 1,
                        justifyContent: "center",
                        height: '100%',
                        backgroundColor: colors.secondary,
                    }}
                >
                    <Text style={{
                        color: "white",
                        textAlign: "center",
                        fontSize: 12,
                        fontWeight: 'bold'
                    }}>Replace</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={onCancelAlert}
                    style={{
                        flex: 1,
                        justifyContent: "center",
                        height: '100%',
                        backgroundColor: colors.third,
                    }}
                >
                    <Text style={{
                        color: "white",
                        textAlign: "center",
                        fontSize: 12,
                        fontWeight: 'bold'
                    }}>Cancel</Text>
                </TouchableOpacity>
            </View>
        )}
    >
        <View style={{ width: 45, height: 45 }}>
            {
                !!summary?.profile?.logo && !!(summary?.profile?.logo?.length > 0) &&
                <Image
                    source={{ uri: `${summary?.profile?.logo}` }}
                    style={{ width: 40, height: 40, borderRadius: 20 }}
                />
            }
            {isNotified && <View style={{
                backgroundColor: '#2EBD85',
                borderRadius: 50,
                width: 10,
                height: 10,
                position: 'absolute',
                right: 0,
                top: 0,
            }}></View>}
        </View>
        <ListItem.Content style={{ gap: 5, }}>
            <ListItem.Title style={{ color: isNotified ? "#2EBD85" : "white", fontWeight: "bold" }}>
                {props.alert.identifier} {getChanged()}
            </ListItem.Title>
            <ListItem.Subtitle style={{ color: "#aaaa", fontSize: 12 }}>
                You’re looking for a price above {props.alert.signal === 'percent' ? `${props.alert.value}%` : `$${props.alert.value}`}
            </ListItem.Subtitle>
            <View style={{
                width: '100%',
                justifyContent: 'space-between',
                flexDirection: 'row',
            }}>
                <Text style={{ color: "white", fontSize: 12 }}>{formattedDate(new Date(props.alert.createdAt))}</Text>
                {
                    props.alert?.type === 'gtc' && <Text style={{ color: "#eeee", fontSize: 12 }}>{caclExpiredTime()} days left</Text>
                }
            </View>
        </ListItem.Content>
        <ListItem.Chevron
            color="white"
            size={20}
            containerStyle={{
                alignSelf: 'flex-start',
            }} />
    </ListItem.Swipeable>
}

export default memo(InboxOpenItem);