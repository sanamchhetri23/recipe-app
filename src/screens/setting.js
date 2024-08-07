import React, { useState, useEffect } from 'react';
import { View, Text, Switch, StyleSheet, Modal, TouchableOpacity, Alert } from 'react-native';
import { signOut } from 'firebase/auth';
import { auth } from '../database/firebase';
import DateTimePicker from '@react-native-community/datetimepicker';
import {
  requestPermissions,
  scheduleDailyNotification,
  cancelAllNotifications,
  checkScheduledNotifications,
} from '../components/notificationComponent';

export default function Setting({ navigation }) {
  const [isNotificationEnabled, setIsNotificationEnabled] = useState(false);
  const [isLogoutModalVisible, setLogoutModalVisible] = useState(false);
  const [notificationTime, setNotificationTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);

  useEffect(() => {
    const initializeNotificationSettings = async () => {
      const permissionsGranted = await requestPermissions();
      if (permissionsGranted) {
        await checkScheduledNotifications(); // Check and log scheduled notifications
      }
    };
    initializeNotificationSettings();
  }, []);

  const toggleNotificationSwitch = async () => {
    const newState = !isNotificationEnabled;
    setIsNotificationEnabled(newState);
    if (newState) {
      console.log('Notification enabled');
      await scheduleDailyNotification(notificationTime);
    } else {
      console.log('Notification disabled');
      await cancelAllNotifications();
    }
  };

  const handleTimeChange = (event, selectedDate) => {
    const currentDate = selectedDate || notificationTime;
    setShowTimePicker(false);
    setNotificationTime(currentDate);
    if (isNotificationEnabled) {
      console.log('Scheduling notification for new time:', currentDate);
      scheduleDailyNotification(currentDate);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setLogoutModalVisible(false);
      navigation.navigate('Login');
    } catch (error) {
      console.error('Logout error:', error);
      Alert.alert('Logout Error', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.containerTitle}>Settings</Text>
      <View style={styles.secondContainer}>
        <Text style={styles.label}>Notification:</Text>
        <Text style={styles.description}>Set your notification time for daily updates about your recipes.</Text>
        <View style={styles.switchContainer}>
          <Switch
            trackColor={{ false: "white", true: "#AAD4F8" }}
            thumbColor={isNotificationEnabled ? "#1BD4F5" : "white"}
            onValueChange={toggleNotificationSwitch}
            value={isNotificationEnabled}
          />
          <TouchableOpacity onPress={() => setShowTimePicker(true)}>
            <Text style={styles.timeText}>
              {notificationTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={styles.buttonLogoutMain}
          onPress={() => setLogoutModalVisible(true)}>
          <Text style={styles.textStyle}>Logout</Text>
        </TouchableOpacity>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isLogoutModalVisible}
        onRequestClose={() => setLogoutModalVisible(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Are you sure you want to logout?</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.button, styles.buttonCancel]}
                onPress={() => setLogoutModalVisible(false)}
              >
                <Text style={styles.textStyle}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.buttonLogout]}
                onPress={handleLogout}
              >
                <Text style={styles.textStyle}>Logout</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {showTimePicker && (
        <DateTimePicker
          mode="time"
          value={notificationTime}
          onChange={handleTimeChange}
          display="default"
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 50,
    padding: 16,
    flex: 1,
  },
  containerTitle: {
    fontSize: 30,
    fontWeight: 'bold',
    paddingBottom: 10,
  },
  secondContainer: {
    marginTop: 20,
    backgroundColor: '#D9D9D9',
    padding: 16,
    borderRadius: 8,
  },
  label: {
    fontSize: 18,
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    marginBottom: 16,
    color: '#666',
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  timeText: {
    fontSize: 18,
    marginLeft: 10,
    color: '#1BD4F5',
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: 18,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    minWidth: 100,
  },
  buttonCancel: {
    backgroundColor: "#2196F3",
  },
  buttonLogout: {
    backgroundColor: "#FF0000",
  },
  buttonLogoutMain: {
    backgroundColor: 'red',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 6,
    marginBottom: 4,
    alignSelf: 'center',
    marginTop: '16%',
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
});
