// src/navigation/AuthStack.js

import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Login from '../components/login';
import Signup from '../components/signup';

const Stack = createStackNavigator();

export default function AuthStack() {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Signup" component={Signup} />
    </Stack.Navigator>
  );
}