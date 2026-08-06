import { Platform } from 'react-native';

let Notifications: any = null;
let Device: any = null;
let notificationsAvailable = false;

try {
  if (Platform.OS !== 'web') {
    Notifications = require('expo-notifications');
    Device = require('expo-device');
    notificationsAvailable = true;

    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldShowBanner: true,
        shouldShowList: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
      }),
    });
  }
} catch (e) {
  notificationsAvailable = false;
}

export async function requestNotificationPermissions(): Promise<boolean> {
  if (!notificationsAvailable || !Notifications || !Device) return false;
  if (Platform.OS === 'web') return false;
  if (!Device.isDevice) return false;

  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    return finalStatus === 'granted';
  } catch (e) {
    console.warn('Failed to request notification permissions:', e);
    return false;
  }
}

export async function scheduleDailyNotification(timeStr: string) {
  if (!notificationsAvailable || !Notifications) return;
  if (Platform.OS === 'web') return;

  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
    const [hour, minute] = timeStr.split(':').map(Number);

    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'MindProtocol',
        body: 'Your 15-minute daily reset is ready.',
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour,
        minute,
      },
    });
  } catch (e) {
    console.warn('Failed to schedule notification:', e);
  }
}
