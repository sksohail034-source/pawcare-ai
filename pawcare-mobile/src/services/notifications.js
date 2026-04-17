import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function requestNotificationPermissions() {
  const { status } = await Notifications.getPermissionsAsync();
  if (status !== 'granted') {
    await Notifications.requestPermissionsAsync();
  }
}

export async function scheduleRoutineAlarm(title, body, date) {
  // schedule repeating daily at specific hour/minute
  const identifier = await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      sound: true,
    },
    trigger: {
      hour: date.getHours(),
      minute: date.getMinutes(),
      repeats: true,
    },
  });
  return identifier;
}

export async function cancelAlarm(identifier) {
  await Notifications.cancelScheduledNotificationAsync(identifier);
}
