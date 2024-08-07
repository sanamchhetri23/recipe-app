import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import AddRecipe from '../screens/addRecipe';
import Favourite from '../screens/favourite';
import Setting from '../screens/setting';
import Home from '../screens/home';
import CategoryRecipe from '../screens/recipeCategory'; // Direct import
import CategoryRecipeDetail from '../screens/recipeDetail'; // Direct import
import Profile from '../components/profile'; // Direct import
import RecipeDetails from '../screens/myRecipe'; // Direct import

const Tab = createBottomTabNavigator();
const HomeStack = createStackNavigator();
const ProfileStack = createStackNavigator();
const FavoriteStack = createStackNavigator();

const HomeNavigation = () => (
  <HomeStack.Navigator>
    <HomeStack.Screen 
      name="HomeScreen" 
      component={Home}
      options={{ headerShown: false }} // This hides the header for the main home screen
    />
    <HomeStack.Screen 
      name="CategoryRecipes" 
      component={CategoryRecipe}
      options={({ route }) => ({ title: route.params.category })} // This sets the title to the category name
    />
    <HomeStack.Screen 
      name="CategoryRecipeDetail" 
      component={CategoryRecipeDetail}
      options={({ route }) => ({ 
        title: route.params?.title || 'Recipe Details',
        headerBackTitleVisible: false,
      })}
    />
  </HomeStack.Navigator>
);

const ProfileNavigation = () => (
  <ProfileStack.Navigator>
    <ProfileStack.Screen 
      name="ProfileMain" 
      component={Profile}
      options={{ headerShown: false }} // This hides the header for the main profile screen
    />
    <ProfileStack.Screen 
      name="RecipeDetail" 
      component={RecipeDetails}
      options={({ route }) => ({ 
        title: route.params?.title || 'Recipe Details',
        headerBackTitleVisible: false,
      })}
    />
  </ProfileStack.Navigator>
);

const FavouriteNavigation = () => (
  <FavoriteStack.Navigator>
    <FavoriteStack.Screen 
      name="FavoriteMain" 
      component={Favourite}
      options={{ headerShown: false }}
    />
    <FavoriteStack.Screen 
      name="CategoryRecipeDetail" 
      component={CategoryRecipeDetail}
      options={({ route }) => ({ 
        title: route.params?.title || 'Recipe Details',
        headerBackTitleVisible: false,
      })}
    />
  </FavoriteStack.Navigator>
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
      <Tab.Screen name="Favourite" component={FavouriteNavigation} />
      <Tab.Screen name="AddRecipe" component={AddRecipe} />
      <Tab.Screen name="Profile" component={ProfileNavigation} /> 
      <Tab.Screen name="Setting" component={Setting} /> 
    </Tab.Navigator>
  );
}
