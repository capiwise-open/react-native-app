import React, { memo, useEffect, useMemo, useState } from "react";
import {
  View,
  useWindowDimensions,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { AntDesign, FontAwesome, FontAwesome5, Ionicons } from "@expo/vector-icons";
import { Button, Card, Snackbar, Switch, Text, TextInput } from "react-native-paper";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import { globalStyle } from "../../assets/css/globalStyle"
import { Tab, Tooltip } from "react-native-elements";
import Toast from "react-native-toast-message";
import { formatDateAnalysis, getRoundOffValue } from "../../utils/utils";
import { AlertData, EtfStockSummary, StockSummary } from "../../api/types";
import { useCreateAlertMutation, useGetAlertsQuery, useUpdateAlertMutation } from "../../api/alert";
import { Image } from "react-native";
import { useGetProfileQuery, useGetStockSummaryQuery } from "../../api";
import { useGetEtfStockSummaryQuery } from "../../api/stock";
import { RootStackParams } from "../../navigation/props";
import { useAddNotificationMutation } from "../../api/notifications";

type CreateAlertRoute = RouteProp<RootStackParams, "CreateAlert">;

const CreateAlert = ({ navigation }) => {
  const route = useRoute<CreateAlertRoute>();
  const isUpdate = route.params?.update === true;
  const [isEtf, setIsEtf] = useState<boolean>(route.params?.etf ?? false);
  const symbol = route.params?.symbol;

  const { data: user } = useGetProfileQuery({});
  const { data: alertsData } = useGetAlertsQuery({});
  const alertData = useMemo<AlertData | undefined | null>(() => alertsData?.find((alert: AlertData) => (alert.identifier === symbol)), [alertsData]);
  const { data: summary, isLoading, isFetching, isError } = isEtf
    ? useGetEtfStockSummaryQuery({ symbol, email: user?.email, token: "" })
    : useGetStockSummaryQuery({ symbol, email: user?.email, token: "" });
  const [createAlert] = useCreateAlertMutation();
  const [updateAlert] = useUpdateAlertMutation();
  const [addNotification] = useAddNotificationMutation();

  const [value, setValue] = useState<string>(isUpdate ? `${(alertData?.value == null || alertData?.value == undefined) ? "" : alertData?.value}` : "");
  const [openSignal, setOpenSignal] = useState(false);
  const [valueSignal, setValueSignal] = useState<"price" | "percent">(isUpdate ? (alertData?.signal ?? "price") : "price");
  const [signal, setSignal] = useState([
    { label: "Price", value: "price" },
    { label: "Price % Change (Daily)", value: "percent" },
  ]);
  const [openCondition, setOpenCondition] = useState(false);
  const [valueCondition, setValueCondition] = useState<"above" | "below">(isUpdate ? (alertData?.condition ?? "above") : "above");
  const [condition, setCondition] = useState([
    { label: "Is above", value: "above" },
    { label: "Is below", value: "below" },
  ]);
  const [disclosureModalVisible, setDisclosureModalVisible] = useState(false);
  const [tabIndex, setTabIndex] = React.useState(0);
  const [isEmail, setIsEmail] = useState(isUpdate ? alertData?.email : false);
  const [type, setType] = useState<"dod" | "gtc">(isUpdate ? (alertData?.type ?? "dod") : "dod");
  const [isNotification, setIsNotification] = useState(isUpdate ? alertData?.notification : true);

  const validateFullfilled = (!!value && (value.length > 0) && (isEmail === true || isNotification === true))

  useEffect(() => {
    if (isUpdate === true && !!alertData) {
      setIsEtf(alertData?.etf === true);
      setValue(`${(alertData?.value == null || alertData?.value == undefined) ? "" : alertData?.value}`);
      setValueSignal(alertData?.signal);
      setValueCondition(alertData?.condition);
      setIsEmail(alertData?.email);
      setType(alertData?.type); setTabIndex(alertData?.type === 'dod' ? 0 : 1);
      setIsNotification(alertData?.notification);
    }
  }, [alertData]);

  const onSaveAlert = () => {
    if (isUpdate === true) {
      !!user && !!alertData && updateAlert({
        id: alertData?.id!,
        signal: valueSignal,
        user_id: user?.email,
        condition: valueCondition,
        value: parseFloat(value),
        type,
        email: isEmail,
        notification: isNotification,
        identifier: symbol,
        status: true,
        etf: isEtf
      }).then((value) => {
        if (!value.error) {
          Toast.show({
            type: 'Capiwise_Success',
            position: "top",
            text1: "You have set an alert for " + symbol,
          })
          navigation.goBack();
        }
      }).catch(console.log)
    } else {
      !!user && createAlert({
        signal: valueSignal,
        user_id: user?.email,
        condition: valueCondition,
        value: parseFloat(value),
        type,
        email: isEmail,
        notification: isNotification,
        identifier: symbol,
        status: true,
        etf: isEtf
      }).then((value) => {
        if (!value.error) {
          Toast.show({
            type: 'Capiwise_Success',
            position: "top",
            text1: "You have set an alert for " + symbol,
          })
          console.log(value.data)
          addNotification({ user_id: user?.email, data: value.data })
          navigation.goBack();
        }
      }).catch(console.log)
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
            {!!isUpdate ? "Edit Alert" : "Create Alert"}
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
    <View style={{
      width: "100%",
      backgroundColor: "#040B11",
      minHeight: '100%',
    }}>
      <ScrollView style={globalStyle.scrollContainer}>
        <View style={{ ...styles.section, paddingHorizontal: 15 }}>
          {/* Stock Summary */}
          <Card style={{
            backgroundColor: '#0B1620',
          }}
            mode="contained">
            <Card.Content style={{
              display: 'flex',
              flexDirection: 'column',
            }}>
              <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginVertical: 10
              }}>
                <Text style={styles.cardText}>Symbol</Text>
                <Text style={styles.cardText}>{symbol} ({symbol})</Text>
              </View>
              <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginVertical: 10
              }}>
                <Text style={styles.cardTextSmall}
                  variant="titleLarge">Last price</Text>
                <Text style={{
                  ...styles.cardTextSmall,
                  color: '#2EBD85'
                }}
                  variant="bodyMedium">
                  ${getRoundOffValue(isEtf ? summary?.overview?.day1Range.change : summary?.day1Range?.change)} ({getRoundOffValue(isEtf ? summary?.overview?.day1Range?.percentChange : summary?.day1Range?.percentChange)})%
                </Text>
              </View>
              <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <Text style={styles.cardTextLarge}>${getRoundOffValue(isEtf
                  ? summary?.overview?.day1Range?.close
                  : summary?.day1Range?.close)}
                  <Text
                    style={{
                      ...styles.cardText,
                      fontWeight: 'bold',
                    }}
                  >
                    {" "}USD
                  </Text>
                </Text>
                <Text style={styles.cardTextSmall}
                  variant="bodyMedium">Data as of {formatDateAnalysis(summary?.date)}</Text>
              </View>
            </Card.Content>
          </Card>
          {/* Signal Dropdown */}
          <View style={styles.section}>
            <Text
              style={styles.sectionLabel}
            >
              Signal
            </Text>
            <DropDownPicker
              open={openSignal}
              value={valueSignal}
              items={signal}
              setOpen={setOpenSignal}
              setValue={setValueSignal}
              setItems={setSignal}
              containerStyle={{
                borderWidth: 1,
                borderColor: "#979797",
                borderRadius: 5,
                zIndex: 9001,
              }}
              style={{
                backgroundColor: "#0000",
              }}
              theme="DARK"
              placeholder={"select"}
              listMode="FLATLIST"
              textStyle={{
                color: '#fff8',
                fontSize: 16
              }}
              dropDownContainerStyle={{
                marginTop: 5,
                backgroundColor: "white",
                borderRadius: 5,
              }}
              labelStyle={{
                color: 'white'
              }}
              listItemLabelStyle={{
                color: '#000a'
              }}
              selectedItemLabelStyle={{
                color: '#000'
              }}
            />
          </View>
          {/* Condition Dropdown */}
          <View style={styles.section}>
            <Text
              style={styles.sectionLabel}
            >
              Condition
            </Text>
            <DropDownPicker
              open={openCondition}
              value={valueCondition}
              items={condition}
              setOpen={setOpenCondition}
              setValue={setValueCondition}
              setItems={setCondition}
              placeholder={"select"}
              containerStyle={{
                borderWidth: 1,
                borderColor: "#979797",
                borderRadius: 5,
                zIndex: 9000,
              }}
              style={{
                backgroundColor: "#0000",
              }}
              theme="DARK"
              listMode="FLATLIST"
              textStyle={{
                color: '#fff8',
                fontSize: 16
              }}
              dropDownContainerStyle={{
                marginTop: 5,
                backgroundColor: "white",
                borderRadius: 5,
              }}
              labelStyle={{
                color: 'white'
              }}
              listItemLabelStyle={{
                color: '#000a'
              }}
              selectedItemLabelStyle={{
                color: '#000'
              }}
            />
          </View>
          {/* Condition Vlaue */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>
              Value
            </Text>
            <TextInput
              style={[styles.conditionValueInput]}
              keyboardType="number-pad"
              // borderColor={"white"}
              // borderWidth={0}
              outlineColor="#0000"
              underlineStyle={{
                backgroundColor: '#0000'
              }}
              underlineColorAndroid={"#979797"}
              underlineColor="#9799797"
              cursorColor="white"
              placeholder="Enter a value"
              value={value}
              textColor="white"
              onChangeText={(e) => setValue(e)}
            />
          </View>
          {/* Alert Mode */}
          <View style={styles.section}>
            <Text
              style={{
                fontSize: 24,
                color: 'white',
                fontWeight: 'bold',
                marginVertical: 10,
              }}
            >
              Time in force
            </Text>
            {/* Mode Tabs */}
            <View style={{
              backgroundColor: '#0B1620',
              borderRadius: 30,
              position: 'relative',
              padding: 3,
            }}>
              <Tab
                value={tabIndex}
                indicatorStyle={{
                  backgroundColor: '#2EBD85',
                  height: '100%',
                  borderRadius: 30,
                }}
                variant="default"
              >
                <Tab.Item
                  title=" "
                  containerStyle={styles.tabItemContainerStyle}
                />
                <Tab.Item
                  title=" "
                  containerStyle={styles.tabItemContainerStyle}
                />
              </Tab>
              <View style={{
                position: 'absolute',
                display: 'flex',
                flexDirection: 'row',
                width: '100%',
                height: '100%',
                justifyContent: 'space-around',
                alignItems: 'center'
              }}>
                <Text style={styles.tabTextLarge} onPress={() => {
                  setTabIndex(0);
                  setType("dod");
                }}>During one day</Text>
                <Text style={styles.tabTextLarge} onPress={() => {
                  setTabIndex(1);
                  setType("gtc");
                }}>Good til canceled</Text>
              </View>
            </View>
            {/* tooltip */}
            <View style={{ ...globalStyle.flexRow, marginVertical: 10, alignItems: 'center', position: 'relative' }}>
              <Text style={styles.textSmall}>Canceled after 180 days if not executed.{" "}</Text>
              <Tooltip
                containerStyle={{
                  backgroundColor: '#fff',
                  width: 300,
                  height: 100,
                  transform: `translate(${0}px, ${-60}px)`
                }}
                // backgroundColor="#0000"
                overlayColor="0000"
                withPointer={true}
                animationType="fade"
                pointerColor={'#fff'}
                popover={<Text style={{ color: 'black', fontSize: 12 }}>
                  A Good-Til-Cancelled (GTC) order is an order to buy or sell a stock that lasts until the order is completed or canceled. Brokerage firms typically limit the length of time an investor can leave a GTC order open.
                </Text>}>
                <FontAwesome5 name="question-circle" size={12} color="white" />
              </Tooltip>
            </View>
            {/* Switch */}
            <View style={styles.section}>
              <View style={styles.row}>
                <Text style={styles.text}>Email</Text>
                <Switch value={isEmail} color="#2EBD85" onChange={() => setIsEmail(!isEmail)} />
              </View>
              <View style={styles.row}>
                <Text style={styles.text}>Push notification</Text>
                <Switch color="#2EBD85" value={isNotification} onChange={() => setIsNotification(!isNotification)} />
              </View>
            </View>
          </View>
          {/* Save button */}
          <View style={styles.section}>
            <TouchableOpacity
              disabled={!validateFullfilled}
              onPress={() => {
                if (!value || value?.length === 0) {
                  Toast.show({
                    type: 'Capiwise_Error',
                    position: "top",
                    text2: "You should input value.",
                  })
                  return;
                }
                if (!isEmail && !isNotification)
                  return;
                setDisclosureModalVisible(true)
              }}
              style={{ ...styles.saveButton, backgroundColor: validateFullfilled ? "#2EBD85" : "#979797" }}
            >
              <Text style={{ color: "#FFF", fontSize: 18, fontWeight: 'bold' }}>Save alert</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      {/* Disclosure modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={disclosureModalVisible}
        onRequestClose={() => {
          setDisclosureModalVisible(false);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalBox}>
            <Image source={require('../../assets/img/Notification.png')} />
            <Text
              style={[styles.modalText, { fontWeight: "bold", fontSize: 24, color: '#2EBD85' }]}
            >Important notice</Text>
            <Text style={styles.modalText}>
              {"By enabling this alert, you'll get notified when the stock reaches your target value."}{" "}
              <Text style={{ ...styles.modalText, fontWeight: 'bold' }}>Remember, this is not intended as investment advice.</Text>
            </Text>
            <Text style={styles.modalText}>
              Please read our{" "}
              <Text style={{ color: "#2EBD85" }}>Terms of Service</Text>
            </Text>
            <TouchableOpacity
              onPress={() => {
                onSaveAlert();
                setDisclosureModalVisible(false);
              }}
              style={{ ...styles.closeButton, backgroundColor: "#2EBD85" }}
            >
              <Text style={styles.closeButtonText}>Got it</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    // marginBottom:50,
    borderRadius: 20,
    backgroundColor: "#0B1620",
  },
  tabItem: {
    paddingHorizontal: 40,
    paddingVertical: 10,
    marginRight: 10,
    // marginBottom:30,
    borderRadius: 20,
  },
  tabItemFocused: {
    width: "auto",
    backgroundColor: "#2EBD85",
  },
  tabItemText: {
    // width:100,
    color: "#FFF",
    fontSize: 15,
  },
  indicator: {
    backgroundColor: "#2EBD85", // Set indicator color
    height: 48,
    marginLeft: 25,
    width: 110,
    borderRadius: 40,
    // textAlign:"center"
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // semi-transparent black background
  },
  modalBox: {
    alignItems: "center",
    backgroundColor: "#FFF",
    padding: 20,
    marginHorizontal: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#000",
  },
  modalText: {
    textAlign: "center",
    fontSize: 16,
    marginVertical: 10,
  },
  closeButton: {
    width: 200,
    backgroundColor: "#2EBD85",
    paddingVertical: 10,
    borderRadius: 20,
    alignSelf: "center",
    marginVertical: 10,
  },
  closeButtonText: {
    color: "#FFF",
    fontSize: 16,
    textAlign: "center",
  },
  label: {
    alignItems: "center",
    textTransform: "none",
    fontWeight: "normal",
    color: "#FFF", // Default text color
    fontSize: 15,
    marginLeft: 150,
    width: 180, // Set the width of the label
    // textAlign: "right", // Center the text within the label
  },
  heading: {
    color: "#FFF",
    fontFamily: "Roboto",
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 20,
  },
  flex: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  inputContainer: {
    // paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: "#040B11",
    color: "#FFF",
    marginTop: 16,
    borderBottomColor: "#000000",
  },
  conditionValueInput: {
    height: 40,
    color: "white",
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#979797',
    fontSize: 16,
    backgroundColor: "#040B11",
    borderBottomColor: "white"
  },
  dropdownContainer: {
    borderWidth: 1,
    borderColor: "#979797",
    borderRadius: 8,
    marginVertical: 10,
    zIndex: 2000,
    backgroundColor: "#FFF",
  },
  dropdown: {
    backgroundColor: "#040B11",
    color: 'black'
  },
  dropdownText: {
    color: "black",
  },
  cardText: {
    color: 'white',
    fontSize: 16
  },
  cardTextSmall: {
    color: 'white',
    fontSize: 14
  },
  cardTextLarge: {
    color: 'white',
    fontSize: 24,
    fontWeight: "bold",
  },
  section: {
    display: 'flex',
    flexDirection: 'column',
    marginVertical: 7,
  },
  row: {
    display: 'flex',
    marginVertical: 5,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  text: {
    color: 'white',
    fontSize: 16,
  },
  textLarge: {
    color: 'white',
    fontSize: 24,
  },
  textSmall: {
    color: 'white',
    fontSize: 12,
  },
  sectionLabel: {
    color: "white",
    fontSize: 14,
    marginVertical: 12
  },
  tabTextLarge: {
    color: 'white',
    height: '100%',
    width: '50%',
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: 16,
    paddingTop: 5,
    fontWeight: '500'
  },
  tabItemContainerStyle: {
    height: 35,
    backgroundColor: '#0000',
    borderRadius: 30,
  },
  bottombar: {
    position: 'absolute',
    width: '100%',
    bottom: 0,
    left: 15,
    paddingVertical: 15,
    backgroundColor: '#040B118'
  },
  saveButton: {
    marginHorizontal: 0,
    paddingVertical: 10,
    backgroundColor: "#2EBD85",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 50,
    borderWidth: 0,
  }
});

export default memo(CreateAlert);