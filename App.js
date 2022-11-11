import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Button, View, Alert, Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import { useEffect } from 'react';

Notifications.setNotificationHandler({
  handleNotification: async () => {
    return {
      shouldPlaySound: false,
      shouldSetBadge: false,
      shouldShowAlert: true,
    };
  },
});

// //// START: NEWLY ADDED FUNCTIONS ////
// const allowsNotificationsAsync = async () => {
//   const settings = await Notifications.getPermissionsAsync();
//   return (
//     settings.granted ||
//     settings.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL
//   );
// };

// const requestPermissionsAsync = async () => {
//   return await Notifications.requestPermissionsAsync({
//     ios: {
//       allowAlert: true,
//       allowBadge: true,
//       allowSound: true,
//       allowAnnouncements: true,
//     },
//   });
// };
//// END: NEWLY ADDED FUNCTIONS ////

export default function App() {
  useEffect(() => {
    const configurePushNotification = async () => {
      const { status } = await Notifications.getPermissionsAsync();
      let finalStatus = status;

      if (finalStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync;
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        Alert.alert(
          'Permission required',
          'Push notification need the appropriate permissions'
        );
        return;
      }
      const pushTokenData = await Notifications.getExpoPushTokenAsync();
      console.log(pushTokenData);
      if (Platform.OS === 'android') {
        Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.DEFAULT,
        });
      }
    };

    configurePushNotification();
  }, []);

  // useEffect(() => {
  //   const suscription1 = Notifications.addNotificationReceivedListener(
  //     (notification) => {
  //       console.log('Notification recived');
  //       console.log(notification);
  //       const username = notification.request.content.data.userName;
  //       console.log(username);
  //     }
  //   );

  //   const suscription2 = Notifications.addNotificationResponseReceivedListener(
  //     (response) => {
  //       console.log(response);
  //       const username = response.notification.request.content.data.userName;
  //       console.log(username);
  //     }
  //   );
  //   return () => {
  //     suscription1.remove();
  //     suscription2.remove();
  //   };
  // });
  // const scheduleNotificationHandler = async () => {
  //   //// START: CALL FUNCTIONS HERE ////
  //   const hasPushNotificationPermissionGranted =
  //     await allowsNotificationsAsync();

  //   if (!hasPushNotificationPermissionGranted) {
  //     await requestPermissionsAsync();
  //   }
  //   //// END: CALL FUNCTIONS HERE ////

  //   Notifications.scheduleNotificationAsync({
  //     content: {
  //       title: 'My first local notification',
  //       body: 'This is th body of the notification.',
  //       data: { userName: 'Max' },
  //     },
  //     trigger: {
  //       seconds: 2,
  //     },
  //   });
  // };

  const sendPushNotificationHandler = () => {
    fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        //Aca iria el token(en este caso era el de mi celular)
        to: 'ExponentPushToken[6E4SVnJ3evyaNJ_R2BOTI4]',
        title: 'Test - sent from a device!',
        body: 'this is a test',
      }),
    });
  };

  return (
    <View style={styles.container}>
      {/* <Button
        title='Schedule Notification'
        onPress={scheduleNotificationHandler}
      /> */}
      <Button title='Push Notification' onPress={sendPushNotificationHandler} />

      <StatusBar style='auto' />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
