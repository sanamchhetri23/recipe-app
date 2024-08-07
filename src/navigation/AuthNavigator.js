// src/navigation/AuthStack.js

import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Login from '../screens/login';
import Signup from '../screens/signup';
import RecipeDetailScreen from '../screens/myRecipe';

const Stack = createStackNavigator();

export default function AuthStack() {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen name="Login" component={Login}options={{ headerShown: false }}/>
      <Stack.Screen name="Signup" component={Signup}options={{ headerShown: false }} />
      <Stack.Screen 
        name="RecipeDetail" 
        component={RecipeDetailScreen} 
        options={{ title: 'Recipe Details' }}
      />
    </Stack.Navigator>
  );
}

