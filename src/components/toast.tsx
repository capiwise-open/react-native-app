import { AntDesign, SimpleLineIcons } from '@expo/vector-icons';
import { View, Text, StyleSheet, TouchableOpacity, Linking, Platform } from 'react-native';
import Toast, { ToastConfig } from 'react-native-toast-message';
import VersionCheck from 'react-native-version-check';
import { WhiteCheck, WarningCheckTriangle } from "./../assets/img/Constant"

const toastConfig: ToastConfig = {
  Capiwise_Info: ({ text1, text2 }) => (
    <View style={styles.infoMessageBody}>
      <SimpleLineIcons name="exclamation" size={24} color="white" />
      {/* <AntDesign name="checkcircle" size={30} color={'white'} /> */}
      <View style={{ width: '90%', flexDirection: 'column', alignItems: 'flex-start' }}>
        <Text style={{ color: 'white', fontSize: 16, marginHorizontal: 15, verticalAlign: 'middle' }}>{text1}</Text>
        {/* <Text style={{ fontSize: 12, fontWeight: "700", color: '#FFF' }}>{text1}</Text> */}
        <Text style={{ fontSize: 12, fontWeight: "400", color: '#FFF' }}>{text2}</Text>
      </View>
    </View>
  ),
  Capiwise_Success: ({ text1, text2 }) => (
    <View style={[styles.messageBody]}>
      <AntDesign name="checkcircle" size={30} color={'white'} />
      <View style={{ width: '90%', flexDirection: 'column', marginHorizontal: 15, alignItems: 'flex-start' }}>
        <Text style={{ color: 'white', fontSize: 14, verticalAlign: 'middle' }}>{text1}</Text>
        {!!text2 && text2.length > 0 && <Text style={{ fontSize: 12, fontWeight: "400", color: '#FFF' }}>{text2}</Text>}
      </View>
    </View>
  ),
  Capiwise_Error: ({ text1, text2 }) => (
    <View style={[styles.messageBody, { backgroundColor: '#E2433B' }]}>
      <WarningCheckTriangle />
      <Text style={styles.messageText}>
        {text2} &nbsp;
      </Text>
    </View>
  ),
  Capiwise_Update: () => (
    <View style={[styles.messageBody, {
      borderRadius: 15, justifyContent: 'center', backgroundColor: '#252F3A', paddingVertical: 15, width: '70%'
    }]}>
      <Text style={styles.messageText}>Update is available</Text>
      <Text style={{ ...styles.messageText, color: '#0B1620' }}>|</Text>
      <TouchableOpacity onPress={async () => {
        const storeUrl = await VersionCheck.getStoreUrl({ platform: Platform.OS });
        Linking.openURL(storeUrl);
      }}>
        <Text style={{ ...styles.messageText, color: '#2EBD85' }}>Update</Text>
      </TouchableOpacity>
    </View>
  ),
};

const styles = StyleSheet.create({
  messageBody: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: "#007C4A",
    padding: 10,
    borderRadius: 5,
    width: '90%',
    marginTop: 20,
  },
  messageText: {
    color: "white",
    marginLeft: 10,
  },
  infoMessageBody: {
    flexDirection: 'row',
    gap: 8,
    borderRadius: 4,
    width: '90%',
    backgroundColor: '#0B1620',
    padding: 10
  }
})

export {
  toastConfig
}