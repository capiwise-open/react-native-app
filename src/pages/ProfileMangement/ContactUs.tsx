import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import Api from "../../api/api";
import { globalStyle } from "../../assets/css/globalStyle";
import Toast from "react-native-toast-message";
import { useGetProfileQuery } from "../../api";

export default function ContactUs({ navigation }) {
  const [body, setBody] = useState("");
  const { data: userProfile } = useGetProfileQuery({});

  const handleSendMail = async () => {
    let data = {
      subject: "Contact Us",
      body: `Sender's Email: ${userProfile?.email}\n\n${body}`,
      is_html_body: false,
    }

    try {
      await Api.sendMail(data)
        .then((res: any) => {
          if (res.statusCode == 200) {
            navigation.navigate("MessegeSent")
          } else {
            Toast.show({
              type: 'Capiwise_Error',
              position: "top",
              text1: "",
              text2: 'Network error'
            });
          }
        })
        .catch(e => console.log(e))
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerBackVisible: false,
      headerTitle: () => (
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ ...globalStyle.alignItemsCenter, gap: 15 }}>
          <FontAwesome name="angle-left" size={28} color="white" />
          <Text style={{ color: "#FFF", fontSize: 24 }}>
            Contact us
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
    <View style={styles.container}>
      <View
        style={{
          width: "100%",
          height: 385,
          borderRadius: 5,
          backgroundColor: "#0B1620",
          marginTop: 20,
        }}
      >
        <TextInput
          multiline={true}
          maxLength={500}
          style={{
            color: "#FFF",
            fontSize: 16,
            padding: 10,
            lineHeight: 20
          }}
          placeholder="Tell us how we can help."
          placeholderTextColor="#FFF"
          onChangeText={(text) => setBody(text)}
          value={body}
        >
        </TextInput>
      </View>
      <Text style={{ color: "#FFF", fontSize: 16, marginTop: 20, }}>
        By clicking Send, you acknowledge Capiwise may review metadata
        associated with your account to try to troubleshoot and solve your
        resported issue.
      </Text>
      <TouchableOpacity
        onPress={handleSendMail}
        style={[styles.actionBtn, { backgroundColor: body.length > 0 ? '#2EBD85' : '#979797' }]}
        disabled={body.length > 0 ? false : true}
      >
        <Text style={{ color: "#FFF", fontSize: 16 }}>Send</Text>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  actionBtn: {
    height: 50,
    backgroundColor: "#2EBD85",
    marginTop: 30,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 50,
    borderWidth: 0,
    width: '100%'
  },
  container: {
    flex: 1,
    backgroundColor: "#040B11",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingHorizontal: 15,
    marginTop: 0,
  },
});