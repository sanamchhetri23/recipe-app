import * as Notifications from 'expo-notifications';
import { Alert } from 'react-native';

// Request notification permissions
export const requestPermissions = async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    console.log('Notification permissions status:', status);
    if (status !== 'granted') {
      Alert.alert('Notification Permission', 'Failed to get permission for notifications.');
      return false;
    }
    return true;
  };
  

// Schedule daily notifications
export const scheduleDailyNotification = async (time) => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Recipe Reminder",
        body: "Don't forget to check out your daily recipe!",
        sound: 'default',
      },
      trigger: {
        hour: time.getHours(),
        minute: time.getMinutes(),
        repeats: true,
      },
    });
}
// Cancel all scheduled notifications
export const cancelAllNotifications = async () => {
  await Notifications.cancelAllScheduledNotificationsAsync();
  console.log('All scheduled notifications canceled');
};

// Check all scheduled notifications
export const checkScheduledNotifications = async () => {
  const notifications = await Notifications.getAllScheduledNotificationsAsync();
  console.log('Scheduled Notifications:', notifications);
};
