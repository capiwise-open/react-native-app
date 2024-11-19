import { memo, useEffect, useState } from "react";
import { globalStyle } from "../../assets/css/globalStyle";
import { StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { FontAwesome, FontAwesome5, Ionicons } from "@expo/vector-icons";
import { SystemNotificationIcon } from "../../assets/img/Constant";
import { Badge } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { useGetProfileQuery } from "../../api";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParams } from "../../navigation/props";

import { generateClient } from "aws-amplify/data";
import type { Schema } from "../../../amplify/data/resource";
import { GraphQLError } from "graphql";
import { UserAttribute, UserProfile } from "../../api/types";
import { useAuthenticator } from '@aws-amplify/ui-react-native';
import { useGetNotificationQuery } from "../../api/notifications";
const client = generateClient<Schema>();

const InboxScreen = ({ }) => {
    const { data: user } = useGetProfileQuery({});
    const [alertsData, setAlertsData] = useState<Schema["Alert"]["type"][]>([]);
    const navigation = useNavigation<NavigationProp<RootStackParams>>();
    const { data: notifications } = useGetNotificationQuery({ email: user?.email });

    useEffect(() => {
        (async () => {
            await client?.models?.Alert?.list({
                // authMode: "userPool",
                // authToken: 
            }).then(async ({ data, extensions, nextToken, errors }) => {
                if (!!data && data.length > 0) {
                    !!data && setAlertsData([...data]);
                }
            });
        })();
    }, []);

    useEffect(() => {
        navigation.setOptions({
            headerShown: true,
            headerBackVisible: false,
            headerTitle: () => (
                <TouchableOpacity onPress={() => navigation.goBack()} style={{ ...globalStyle.alignItemsCenter, gap: 15 }}>
                    <FontAwesome name="angle-left" size={28} color="white" />
                    <Text style={{ color: "#FFF", fontSize: 24 }}>
                        Inbox
                    </Text>
                </TouchableOpacity>
            ),
            headerStyle: {
                backgroundColor: "#040B11",
            },
            headerTintColor: "#FFF",
        });
    }, [navigation]);

    return <SafeAreaView style={styles.container}>
        <StatusBar />
        {/* <View style={styles.titleBox}>
            <Text style={styles.title}>Inobx</Text>
        </View> */}
        <View style={styles.cardList}>
            <TouchableOpacity onPress={() => navigation.navigate("ManageAlerts")}>
                <View style={styles.card}>
                    <Ionicons name="notifications-outline" size={20} color="white" />
                    <View style={styles.cardBody}>
                        <Text style={styles.cardTitle}>Alerts</Text>
                        <Text style={styles.cardSubTitle}>View your stock and ETF's alerts</Text>
                    </View>
                    <View style={styles.cardAction}>
                        {
                            notifications?.length > 0 && <Badge size={20} style={{ backgroundColor: '#E2433B', alignSelf: 'center' }}>{notifications?.length}</Badge>
                        }
                        <FontAwesome name="angle-right" size={28} color="white" />
                    </View>
                </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate("SystemNotification")}>
                <View style={styles.card}>
                    <SystemNotificationIcon />
                    <View style={styles.cardBody}>
                        <Text style={styles.cardTitle}>System notifications</Text>
                        <Text style={styles.cardSubTitle}>View the latest updates in Capiwise</Text>
                    </View>
                    <View style={styles.cardAction}>
                        {
                            false && <Badge size={20} style={{ backgroundColor: '#E2433B', alignSelf: 'center' }}>0</Badge>
                        }
                        <FontAwesome name="angle-right" size={28} color="white" />
                    </View>
                </View>
            </TouchableOpacity>
        </View>
    </SafeAreaView>
}

export default memo(InboxScreen);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#040B11',
        paddingHorizontal: 15
    },
    titleBox: {
        marginVertical: 10,
    },
    title: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
    },
    cardList: {
        flexDirection: 'column',
        gap: 15,
    },
    card: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 10,
        padding: 15,
        backgroundColor: '#0B1620',
        borderRadius: 10,
    },
    cardBody: {
        flexDirection: 'column',
        justifyContent: 'space-between'
    },
    cardAction: {
        marginLeft: 'auto',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        gap: 10,
    },
    cardTitle: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    cardSubTitle: {
        color: '#fff',
        fontSize: 14,
    }
})