import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/HomeScreen';
import SettingsScreen from '../screens/SettingsScreen';
import GraphScreen from '../screens/GraphScreen';
import LocationScreen from '../screens/LocationScreen';
import CameraScreen from '../screens/CameraScreen';



const HomeStack = createStackNavigator({
  Home: HomeScreen,
});

HomeStack.navigationOptions = {
  tabBarLabel: 'Inicio',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={
        Platform.OS === 'ios'
          ? `ios-information-circle${focused ? '' : '-outline'}`
          : 'md-information-circle'
      }
    />
  ),
};

const LocationStack = createStackNavigator({
  Location: LocationScreen,
});

LocationStack.navigationOptions = {
  tabBarLabel: 'Locacion',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={
        Platform.OS === 'ios'
          ? `ios-information-circle${focused ? '' : '-outline'}`
          : 'md-information-circle'
      }
    />
  ),
};

const CameraStack = createStackNavigator({
  Camera: CameraScreen,
});

CameraStack.navigationOptions = {
  tabBarLabel: 'Camara',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={
        Platform.OS === 'ios'
          ? `ios-information-circle${focused ? '' : '-outline'}`
          : 'md-information-circle'
      }
    />
  ),
};




const SettingsStack = createStackNavigator({
  Settings: GraphScreen,
});

SettingsStack.navigationOptions = {
  tabBarLabel: 'Columna',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? 'ios-options' : 'md-options'}
    />
  ),
};

export default createBottomTabNavigator({
  HomeStack,
  CameraStack,
  LocationStack,
  SettingsStack,
});


//http://reactnative.sataiva.com/reactnative-intro/reactnative-expo-upload-image-in-amazons3/

//https://iesa.higheredtalent.org/Login?r=https%3A%2F%2Fiesa.higheredtalent.org%2FPositionsList%2F-%2Fq-Nike