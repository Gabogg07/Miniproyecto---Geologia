import React, { Component } from 'react';
import {View, Text}  from 'react-native';
import BarChart from './BarChart';


export default class GraphScreen extends React.Component {
    constructor(props) {
        super(props);       
    }

    static navigationOptions = {
    title: 'Columna',
    };

    render() {            
        return (
            <View>
              <BarChart/>   
            </View>
        );
    }
}

