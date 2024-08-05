// src/navigation/AuthStack.js

import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Login from '../components/login';
import Signup from '../components/signup';
import RecipeDetailScreen from '../components/recipeDetails';
const Stack = createStackNavigator();

export default function AuthStack() {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Signup" component={Signup} />
      <Stack.Screen 
        name="RecipeDetail" 
        component={RecipeDetailScreen} 
        options={{ title: 'Recipe Details' }}
      />
    </Stack.Navigator>
  );
}

