import React, { memo, useEffect } from "react";
import { Button, View, StyleSheet, SafeAreaView, TextInput, Text, TouchableOpacity, StatusBar, Touchable, Platform } from "react-native";

import { initializeApp } from 'firebase/app';
import { getFirestore } from "firebase/firestore";

import * as Notifications from 'expo-notifications';

// import { Logs } from 'expo';

import * as Sentry from '@sentry/react-native';
import * as TaskManager from "expo-task-manager";

import { Amplify } from "aws-amplify";
import * as Auth from "aws-amplify/auth";

import { Authenticator, useAuthenticator, withAuthenticator } from "@aws-amplify/ui-react-native";

import { Provider } from 'react-redux';
import {
  PaperProvider,
} from 'react-native-paper';

import outputs from "./amplify_outputs.json";
import TodoList from "./src/TodoList";
import { SignInInput, SignUpInput, signIn, signInWithRedirect, signUp } from "aws-amplify/auth";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import config from "./app.config";
import { store } from "./src/store";
import { theme } from "./src/theme";
import Toast from "react-native-toast-message";
import { toastConfig } from "./src/components/toast";
import RootNavigation from "./src/navigation";
import { log2fs } from "./src/utils/log";

// initialize Amplify
Amplify.configure(outputs);
console.log(JSON.stringify(Amplify.getConfig().Auth));
Amplify.configure({
  // TODO: Why is this so ridiculous and how can these options be  
  //       specified exclusively in amplifyconfiguration.json ???
  ...Amplify.getConfig(),
  Auth: {
    ...Amplify.getConfig().Auth!,
    Cognito: {
      ...Amplify.getConfig()?.Auth?.Cognito,
      identityPoolId: Amplify.getConfig()?.Auth?.Cognito?.identityPoolId!,
      userPoolClientId: Amplify.getConfig()?.Auth?.Cognito?.userPoolClientId!,
      userPoolId: Amplify.getConfig()?.Auth?.Cognito?.userPoolId!,
      loginWith: {
        ...Amplify.getConfig().Auth!.Cognito!.loginWith!,
        oauth: {
          ...Amplify.getConfig().Auth!.Cognito!.loginWith!.oauth!,
          redirectSignIn: ["myapp://localhost", "myapp://bf2e8231b729f506b5a2.auth.eu-central-1.amazoncognito.com"],
          redirectSignOut: ["myapp://localhost", "myapp://bf2e8231b729f506b5a2.auth.eu-central-1.amazoncognito.com"]
        },
      }
    }
  }
});
console.log(JSON.stringify(Amplify.getConfig().Auth?.Cognito));

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyD3HhFWAx9B9NgnUiTx3iaODffbQRMCMbU",
  authDomain: "capiwise-app.firebaseapp.com",
  projectId: "capiwise-app",
  storageBucket: "capiwise-app.appspot.com",
  messagingSenderId: "88668446498",
  appId: "1:88668446498:web:d6033577714696688ccf7b",
  measurementId: "G-M510QGVXC1"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
export const firestore = getFirestore();

console.log(firestore);

// Logs.enableExpoCliLogging()

// Initialize Sanity
Sentry.init({
  dsn: config.SANITY_DSN,
});

// Initialize Background Task, Notification
const BACKGROUND_NOTIFICATION_TASK = "BACKGROUND-NOTIFICATION-TASK";
TaskManager.defineTask(
  BACKGROUND_NOTIFICATION_TASK,
  ({ data, error, executionInfo }) => {
    if (error) {
      console.log("error occurred");
    }
    if (data) {
      console.log("data-----", data);
    }
  }
);
Notifications.registerTaskAsync(BACKGROUND_NOTIFICATION_TASK);
if (Platform.OS === 'android') {
  Notifications.setNotificationChannelAsync('default', {
    name: 'default',
    importance: Notifications.AndroidImportance.MAX,
    vibrationPattern: [0, 250, 250, 250],
    lightColor: '#FF231F7C',
  });
}
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

const SignOutButton = () => {
  const { signOut, authStatus, user, username } = useAuthenticator();
  console.log(user, username, authStatus)

  useEffect(() => {
    Auth.getCurrentUser().then(console.log).catch(console.log)
    Auth.fetchAuthSession().then(console.log).catch(console.log)
  }, [authStatus])

  return (
    <View style={styles.signOutButton}>
      <Button title="Sign Out" onPress={signOut} />
    </View>
  );
};
const Header = () => {
  const { error, validationErrors, authStatus } = useAuthenticator();
  console.log(error, validationErrors, authStatus);

  return <TouchableOpacity
    onPress={async () => {
      // await GoogleSignin.hasPlayServices();
      // await GoogleSignin.signOut();
      signInWithRedirect({
        provider: "Google"
      })
        .then(console.log)
        .catch(console.log)
    }}
    style={{
      backgroundColor: 'black',
      padding: 20
    }}>
    <Text style={{ color: 'white' }}>Googlee</Text>
  </TouchableOpacity>
}

const App = () => {
  return (
    <Provider store={store}>
      <PaperProvider theme={theme}>
        {/* <Authenticator.Provider>
          <SafeAreaView style={styles.container}>
        <StatusBar />
        <TouchableOpacity onPress={() => { 
          signIn({ username: "robert19960318@gmail.com", password: "Pws318!((*" })
            .then(console.log)
            .catch(console.log)
        }}>
          <Text>Signin</Text>
        </TouchableOpacity>
      </SafeAreaView>
          <Authenticator
            Header={Header}
            socialProviders={["google"]}>
            <SafeAreaView style={styles.container}>
              <SignOutButton />
              <TodoList />
            </SafeAreaView>
          </Authenticator>
        </Authenticator.Provider> */}
        <Authenticator.Provider>
          <StatusBar barStyle={"light-content"} backgroundColor='#040B11' />
          <RootNavigation />
          <Toast config={toastConfig} visibilityTime={3000} />
        </Authenticator.Provider>
      </PaperProvider>
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 8,
  },
  signOutButton: {
    alignSelf: "flex-end",
  },
});

export default App;
// export default withAuthenticator(App, {
//   signUpAttributes: ['email'],
//   socialProviders: ['google']
// });