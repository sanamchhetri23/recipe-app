// src/navigation/TabNavigator.js

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import AddRecipe from '../components/addRecipe';
import Favourite from '../components/favourite'
import Setting from '../components/setting';
import { CategoryRecipeDetail } from '../components/categoryRecipeDescription';


const Tab = createBottomTabNavigator();
const HomeStack = createStackNavigator();
const ProfileStack = createStackNavigator();

const HomeNavigation = () => (
  <HomeStack.Navigator>
    <HomeStack.Screen 
      name="HomeMain" 
      getComponent={() => require('../components/home').default}
      options={{ headerShown: false }} // This hides the header for the main home screen
    />
    <HomeStack.Screen 
      name="CategoryRecipes" 
      getComponent={() => require('../components/categoryRecipe').default}
      options={({ route }) => ({ title: route.params.category })} // This sets the title to the category name
    />
     <HomeStack.Screen 
      name="CategoryRecipeDetail" 
      component={CategoryRecipeDetail}
      options={{ title: 'route.params.title'}}
    />
  </HomeStack.Navigator>
);

const ProfileNavigation = () => (
  <ProfileStack.Navigator>
    <ProfileStack.Screen 
      name="ProfileMain" 
      getComponent={() => require('../components/profile').default}
      options={{ headerShown: false }} // This hides the header for the main profile screen
    />
    <ProfileStack.Screen 
      name="RecipeDetail" 
      getComponent={() => require('../components/recipeDetails').default}
      options={{ title: 'Recipe Details' }}
    />
  </ProfileStack.Navigator>
);

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          } else if (route.name === 'Favourite') {
            iconName = focused ? 'heart' : 'heart-outline';
          } else if (route.name === 'AddRecipe') {
            iconName = focused ? 'add-circle' : 'add-circle-outline';
          } else if (route.name === 'Setting') {
            iconName = focused ? 'settings' : 'settings-outline'; 
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'gray',
        headerShown: false, // This hides the header for all tab screens
      })}
    >
      <Tab.Screen name="Home" component={HomeNavigation} />
      <Tab.Screen name="Favourite" component={Favourite} />
      <Tab.Screen name="AddRecipe" component={AddRecipe} />
      <Tab.Screen name="Profile" component={ProfileNavigation} /> 
      <Tab.Screen name="Setting" component={Setting} /> 
    </Tab.Navigator>
  );
}
