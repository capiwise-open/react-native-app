import React, { useCallback, useEffect, useState } from "react";
import {
  ImageBackground,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from "react-native";
import { NavigationProp, useFocusEffect, useNavigation } from "@react-navigation/native";
import * as Keychain from "react-native-keychain";
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import * as Sentry from "@sentry/react-native";
import Toast from "react-native-toast-message";
import { useDispatch, useSelector } from "react-redux";
import * as Auth from "aws-amplify/auth";
// import { signInWithRedirect } from "aws-amplify/auth"

import Api from "../../api/api";
import { Google } from "../../assets/img/Constant";
import Loading from "../../components/loading/Loading";
import config from "../../../app.config";
import { RootStackParams } from "../../navigation/props";
import { useAuthenticator } from "@aws-amplify/ui-react-native";
import { signInWithRedirect, signOut } from "aws-amplify/auth";

import { generateClient } from "aws-amplify/data";
import type { Schema } from "../../../amplify/data/resource";
import { GraphQLError } from "graphql";
import { UserAttribute } from "../../api/types";
import { useGetProfileQuery } from "../../api";
const client = generateClient<Schema>();

export default function Splash() {
  const navigation = useNavigation<NavigationProp<RootStackParams>>();

  const [loading, setLoading] = useState(true);

  const { data: userProfile } = useGetProfileQuery({});
  const { authStatus } = useAuthenticator();

  useEffect(() => {
    // orbserve authStatus and navigate to MainApp (Bottombar)
    if (authStatus === "authenticated") {
      // check user's profile status, if not defined navigate to register screens
      (async () => {
        await client?.models?.Profile?.list({
          // authMode: "userPool",
          // authToken: 
        }).then(async ({ data, extensions, nextToken, errors }) => {
          let email = userProfile?.email ?? "";
          let attributes: UserAttribute | undefined = undefined;

          try {
            const authSession = await Auth.fetchAuthSession();
            attributes = authSession?.tokens?.idToken?.payload as UserAttribute;
            console.log(Splash.name, attributes);
            const _email = authSession?.tokens?.idToken?.payload?.email;
            email = typeof _email === "string" ? _email : "";
          } catch (e) { }

          if (errors || !data || data.length <= 0) {
            // await Auth.getCurrentUser().then(console.log).catch(console.log);
            // await Auth.fetchAuthSession().then(console.log).catch(console.log);
            // console.log(user)
            navigation.navigate("First", {
              email
            });
          }
          // if (!userAttribute)
          //   !!attributes && dispatch(setCredentials({ attributes }));

          if (!data || !data[0]?.name) {
            if (!!attributes?.name && attributes?.name.length > 0) {
              await client.models.Profile.update({
                id: data[0].id,
                name: attributes?.name
              });
            } else {
              navigation.navigate("Name", {
                update: true
              });
            }
          }
          // if (!data[0].email) {
          //   !!userProfile && await client.models.Profile.update({
          //     id: userProfile.id,
          //     email
          //   });
          // }
        }).catch(console.log);
      })();
      navigation.navigate("MainApp");
    }
  }, [authStatus]);

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: config.GOOGLE_CLIENT_ID,
      offlineAccess: true,
      scopes: ['profile', 'email', 'openid'],
    });

    // fetch saved credential (password&email) and try auto login
    setTimeout(() =>
      (async () => {
        try {
          const credentials: any = await Keychain.getGenericPassword();
          console.log(credentials)
          if (credentials?.username && credentials?.password && credentials?.username?.length > 0 && credentials?.password?.length > 0) {
            const email = credentials?.username;
            const password = credentials?.password;
            await Auth.signIn({
              username: email,
              password
            }).then(value => console.log("Auth.signin", value));
          }
          setLoading(false);
        } catch (e) {
          console.log(Splash.name, e);
          setLoading(false);
        }
      })(), 1000);
  }, [])
  const handleGetStartedPress = () => navigation.navigate("Name")
  const handleLoginPress = () => navigation.navigate("Login")
  const handleGoogleLogin = async () => {
    // await GoogleSignin.hasPlayServices();
    // await GoogleSignin.signOut();
    signInWithRedirect({
      provider: "Google"
    })
  }

  const [borderColor, setBorderColor] = useState('#979797');
  useFocusEffect(
    useCallback(() => {
      setBorderColor('#979797')
    }, [])
  );

  return (
    <ImageBackground
      source={require("../../assets/img/start-screen-image.png")}
      style={{ width: '100%', height: '100%' }}
      resizeMode="cover"
    >
      <View style={styles.layout}>
        <View style={{ paddingHorizontal: 16 }}>
          <Text style={[styles.title, { marginTop: 95 }]}>Invest with</Text>
          <Text style={styles.title}>confidence</Text>
          <Text style={[styles.subTitle, { marginTop: 10 }]}>The tool you need to make your money</Text>
          <Text style={styles.subTitle}>work harder for you</Text>
        </View>
        {
          loading ? <Loading complete={() => setLoading(false)} />
            : <View style={[styles.actionGroup]}>
              <TouchableHighlight style={styles.googleBtn} underlayColor="#4285F4" onPress={handleGoogleLogin}>
                <>
                  <Google />
                  <Text style={{ color: '#040b11', fontSize: 16, letterSpacing: 0.1, fontWeight: '700' }}>Continue with Google</Text>
                </>
              </TouchableHighlight>
              <TouchableHighlight style={styles.emailBtn} underlayColor="#2ebd85" onPress={() => handleGetStartedPress()}>
                <Text style={{ color: '#FFF', fontSize: 16 }}>Sign up with email</Text>
              </TouchableHighlight>
              <TouchableHighlight
                style={[styles.loginBtn, { borderColor: borderColor }]}
                underlayColor="#040B11"
                onPress={() => handleLoginPress()}
                onPressIn={() => setBorderColor('#040B11')}
                onPressOut={() => {
                  setBorderColor('#979797')
                }}>
                <Text style={{ color: '#FFF', fontSize: 16 }}>Log in</Text>
              </TouchableHighlight>
            </View>
        }
      </View>
    </ImageBackground>
  );
}


const styles = StyleSheet.create({
  layout: {
    height: '100%',
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  title: {
    color: '#FFF',
    fontSize: 48,
    fontWeight: 'bold',
    letterSpacing: 1.09
  },
  subTitle: {
    color: '#FFF',
    fontSize: 16,
    lineHeight: 24,
    fontWeight: 'bold',
  },
  actionGroup: {
    paddingHorizontal: 16,
    marginBottom: 40,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 22
  },
  googleBtn: {
    width: '100%',
    backgroundColor: '#FFF',
    height: 48,
    borderRadius: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10
  },
  emailBtn: {
    width: '100%',
    backgroundColor: '#2ebd85',
    height: 48,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center'
  },
  loginBtn: {
    width: '100%',
    backgroundColor: 'transparent',
    height: 48,
    borderRadius: 50,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});
