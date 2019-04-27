import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/HomeScreen';
import SettingsScreen from '../screens/SettingsScreen';
import GraphScreen from '../screens/GraphScreen';
import LocationScreen from '../screens/LocationScreen';
import CameraScreen from '../screens/CameraScreen';
import GalleryScreen from '../screens/GalleryScreen';
import FormScreen from '../screens/FormScreen';





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

const FormStack = createStackNavigator({
  Form: FormScreen,
});

FormStack.navigationOptions = {
  tabBarLabel: 'Form',
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

const GalleryStack = createStackNavigator({
  Gallery: GalleryScreen,
});

GalleryStack.navigationOptions = {
  tabBarLabel: 'Galeria',
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




const GraphStack = createStackNavigator({
  Graph: GraphScreen,
});

GraphStack.navigationOptions = {
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
  FormStack,
  GalleryStack,
  GraphStack,
});


//http://reactnative.sataiva.com/reactnative-intro/reactnative-expo-upload-image-in-amazons3/

//https://iesa.higheredtalent.org/Login?r=https%3A%2F%2Fiesa.higheredtalent.org%2FPositionsList%2F-%2Fq-Nike