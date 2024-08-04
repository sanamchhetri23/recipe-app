import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import Home from '../components/home';
import Profile from '../components/profile';
import Favourite from '../components/favourite';
import AddRecipe from '../components/addRecipe';


const Tab = createBottomTabNavigator();

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
                    } else if (route.name === 'addRecipe') {
                        iconName = focused ? 'add-circle' : 'add-circle-outline';
                    }

                    // You can return any component here to use as the icon
                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: 'tomato',
                tabBarInactiveTintColor: 'gray',
            })}
        >
            <Tab.Screen name="Home" component={Home} />
            <Tab.Screen name="addRecipe" component={AddRecipe} />
            <Tab.Screen name="Favourite" component={Favourite} />
            <Tab.Screen name="Profile" component={Profile} />
        </Tab.Navigator>
    );
}