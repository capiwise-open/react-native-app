import { memo, useMemo, useState } from "react"
import { LayoutChangeEvent, Text } from "react-native";
import { TouchableOpacity, View } from "react-native";
import { ListItem } from '@rneui/themed';
import { useGetProfileQuery, useGetStockSummaryQuery } from "../../api";
import { colors } from "../../assets/css/globalStyle";
import { getRoundOffValue } from "../../utils/utils";
import { Image } from "react-native";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParams } from "../../navigation/props";
import { Schema } from "../../../amplify/data/resource";
import { useGetNotificationQuery, useUpdateNotificationMutation } from "../../api/notifications";

type Props = {
    alert: Schema["Alert"]["type"],
}

const InboxClosedItem = (props: Props) => {
    const { data: user } = useGetProfileQuery({});
    const { data: summary, isLoading, isFetching, isError } = useGetStockSummaryQuery({ symbol: props.alert.identifier, email: user?.email, token: "" });
    const navigation = useNavigation<NavigationProp<RootStackParams>>();
    const { data: notifications } = useGetNotificationQuery({ email: user?.email });
    const [updateNotification] = useUpdateNotificationMutation();

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
            if (notification?.data?.alert_id === props?.alert?.id) { // push-notification
                return true;
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

    return <ListItem.Swipeable
        onPress={() => {
            readNotification(notifications);
            // if (isNotified) 
            {
                if (props.alert.etf) {
                    navigation.navigate("EtfTab", {
                        symbol: props.alert.identifier
                    });
                } else {
                    navigation.navigate("SummaryTab", {
                        data: {
                            key: props.alert.identifier,
                        },
                    });
                }
            }
        }}
        topDivider
        containerStyle={{
            backgroundColor: colors.primaryDark,
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
            padding: 10,
            margin: 0
        }}
        rightContent={(
            <View style={{
                flexDirection: 'row',
                height: '100%'
            }}
                onLayout={(e: LayoutChangeEvent) => {
                }}>
                <TouchableOpacity
                    onPress={() => {
                        navigation.navigate("DeleteAlert", {
                            update: true,
                            symbol: props.alert.identifier,
                            etf: props.alert.etf ?? false
                        })
                    }}
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
                    }}>Delete</Text>
                </TouchableOpacity>
            </View>
        )}
    >
        <View style={{ width: 45, height: 45, position: 'relative' }}>
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
        <ListItem.Content style={{ gap: 5 }}>
            <ListItem.Title style={{ color: isNotified ? "#2EBD85" : "white", fontWeight: "bold" }}>
                {props.alert.identifier} alert {isNotified ? "is triggered" : "is now closed"}
            </ListItem.Title>
            <ListItem.Subtitle style={{ color: "#aaaa", fontSize: 12 }}>
                You were looking for a price {props.alert.condition} {props.alert.signal === 'percent' ? `${props.alert.value}%` : `$${props.alert.value}`}
            </ListItem.Subtitle>
            <View style={{
                width: '100%',
                justifyContent: 'space-between',
                flexDirection: 'row',
            }}>
                <Text style={{ color: "white", fontSize: 12 }}>{formattedDate(new Date(props.alert.triggered_at || props.alert.createdAt))}</Text>
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

export default memo(InboxClosedItem);