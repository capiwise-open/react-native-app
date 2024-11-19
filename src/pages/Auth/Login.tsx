import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
} from "react-native";

import { useDispatch, useSelector } from "react-redux";
import CheckBox from '@react-native-community/checkbox';
import * as Keychain from "react-native-keychain";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import Toast from 'react-native-toast-message';
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ActivityIndicator } from "react-native-paper";
import { SignInOutput, signIn, signInWithRedirect, signOut } from "aws-amplify/auth";

import { Question } from "../../assets/img/Constant";
import { globalStyle } from "../../assets/css/globalStyle"
import { RootStackParams } from "../../navigation/props";
import Api from "../../api/api"
import { emailValidation } from "../../utils/utils";

type Props = NativeStackScreenProps<RootStackParams, "Login">;

export default function Login({ route, navigation }: Props) {
  const dispatch = useDispatch();

  // ui states & hooks
  const [rememberMe, setRememberMe] = useState(false);
  const [passwordIcon, setPasswordIcon] = useState(
    require("../../assets/img/show_pwd.png")
  );
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showTooltip, setShowTooltip] = useState(false); // State to manage the visibility of the text
  const [loading, setLoading] = useState<boolean>(false);

  const handleRemberMe = () => {
    setRememberMe(!rememberMe);
    AsyncStorage.setItem("remember", rememberMe ? '0' : '1');
  }
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
    const newIcon = showPassword
      ? require("../../assets/img/show_pwd.png")
      : require("../../assets/img/close_eye.png");
    setPasswordIcon(newIcon);
  };

  // init with cached credential
  const loadCachedCredential = async () => {
    try {
      const credentials: any = await Keychain.getGenericPassword();
      if (credentials?.username && credentials?.password) {
        const remember = await AsyncStorage.getItem("remember");
        if (!!credentials?.password && !!credentials?.username) {
          setPassword(credentials?.password);
          setEmail(credentials?.username);
        }
        setRememberMe(remember === '1');
      }
    } catch (error) { console.log(error) }
  }
  useEffect(() => {
    loadCachedCredential()
  }, [])

  // navgiate to forgot_password, terms, policy, signup screens
  const handleSignUpPress = () => {
    navigation.navigate("Name");
  };
  const handleForgotPress = () => {
    navigation.navigate("Forgot");
  };

  const handleTerm = () => {
    navigation.navigate("TermsAndConditions");
  };

  const handlePrivacyPolicy = () => {
    navigation.navigate("PrivacyPolicy");
  };

  // signin_with_password
  const onLoginWithPassword = async () => {
    if (!emailValidation(email)) {
      Toast.show({
        type: 'Capiwise_Error',
        position: "top",
        text1: "",
        text2: "Please input email correctly."
      })
    } else {
      setLoading(true);
      signIn({
        username: email,
        password
      }).then((value: SignInOutput) => {
        rememberMe === true && Keychain.setGenericPassword(email, password);
        if (value.isSignedIn) {
          console.log("onLoginWithPassword", value);
        }
        setLoading(false);
      }).catch((e: any) => {
        Toast.show({
          type: 'Capiwise_Error',
          position: "top",
          text1: "",
          text2: JSON.stringify(e)
        })
        setLoading(false);
      })
    }
  };

  return (
    <View style={[globalStyle.container, { height: '100%', flexDirection: 'column', justifyContent: 'space-between' }]}>
      <View>
        {/* title, signup */}
        <View style={styles.layout}>
          <Text style={styles.title}>Welcome back</Text>
          <Text style={styles.subTitle}>
            New to Capiwise?{" "}
            <Text style={{ color: "#2EBD85" }} onPress={handleSignUpPress}>
              Sign up
            </Text>
          </Text>
        </View>
        {/* input forms */}
        <View style={styles.layout}>
          <TextInput
            style={styles.input}
            placeholder="Your email address"
            placeholderTextColor="#979797"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={(text) => setEmail(text)}
          />
          <View style={[globalStyle.alignItemsCenter, { marginTop: 16 }]}>
            <TextInput
              style={[styles.input, { marginTop: 0 }]}
              placeholder="Your password"
              placeholderTextColor="#979797"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={(text) => setPassword(text)}
            />
            <TouchableOpacity onPress={toggleShowPassword}>
              <Image source={passwordIcon} style={{ width: 18, height: 9, marginLeft: -30 }} />
            </TouchableOpacity>
          </View>
          <View style={[globalStyle.alignItemsCenter, { marginTop: 16, justifyContent: 'space-between', width: '100%', }]}>
            <View style={globalStyle.alignItemsCenter}>
              <View style={styles.checkContainer}>
                <View style={[styles.checkLayout, { backgroundColor: rememberMe ? '#FFF' : 'transparent' }]}>
                  <CheckBox
                    style={{ transform: [{ scaleX: rememberMe ? 1.8 : 1.6 }, { scaleY: rememberMe ? 1.8 : 1.6 }] }}
                    value={rememberMe}
                    onValueChange={handleRemberMe}
                  />
                </View>
              </View>
              <Text style={{ color: '#FFF', fontSize: 12, marginRight: 10 }}>Remember me &nbsp;</Text>
              <TouchableOpacity onPress={() => setShowTooltip(!showTooltip)}>
                <Question />
              </TouchableOpacity>
            </View>
            <Text style={{ color: '#2EBD85', fontSize: 12 }} onPress={handleForgotPress}>Forgotten my password?</Text>
          </View>
          {showTooltip && (
            <View style={styles.textContainer}>
              <Text style={styles.textContent}>
                Your password will be remembered the next time you log in to
                your account.
              </Text>
            </View>
          )}
        </View>
      </View>
      {/* bottombar - login_button, terms, privacy */}
      <View style={{ width: '100%' }}>
        <TouchableOpacity onPress={onLoginWithPassword} style={styles.loginBtn}>
          <Text style={{ color: "#FFF", fontSize: 16 }}>Log in</Text>
        </TouchableOpacity>
        <View style={[globalStyle.justifyCenter, { gap: 5, marginTop: 30 }]}>
          <Text style={{ color: '#2EBD85', fontSize: 12 }} onPress={handleTerm}>Terms of use</Text>
          <Text style={{ color: '#FFF', fontSize: 12 }}>|</Text>
          <Text style={{ color: '#2EBD85', fontSize: 12 }} onPress={handlePrivacyPolicy}>Privacy policy</Text>
        </View>
      </View>
      {
        loading && <View style={{
          display: 'flex',
          position: 'absolute',
          width: '100%',
          height: '100%',
          backgroundColor: '#0000',
          left: 15,
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <ActivityIndicator size={50} color="#2EBD85" />
        </View>
      }
    </View>
  );
}

const styles = StyleSheet.create({
  layout: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10
  },
  title: {
    color: "#FFF",
    fontWeight: 'bold',
    fontSize: 24,
    marginTop: '30%'
  },
  subTitle: {
    fontWeight: '400',
    fontSize: 16,
    color: "#FFF",
  },
  input: {
    height: 50,
    borderColor: "#979797",
    borderWidth: 1,
    borderRadius: 8,
    marginTop: 80,
    width: '100%',
    paddingHorizontal: 10,
    color: "#FFF",
  },
  textContainer: {
    width: '100%',
    backgroundColor: "#FFF",
    padding: 10,
    borderRadius: 5,
  },
  textContent: {
    fontSize: 12,
    color: "#000",
  },
  loginBtn: {
    height: 50,
    backgroundColor: "#2EBD85",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 50,
  },
  checkContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 5,
    backgroundColor: "#fff",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#979797',
    // backgroundColor: 'transparent'
  },
  checkLayout: {
    width: 30,
    height: 30,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  }
});
