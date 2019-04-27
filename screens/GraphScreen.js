import React, { Component } from 'react';
import {View, Text, TouchableWithoutFeedback}  from 'react-native';
import BarChart from './DynamicBarChart';

import { connect } from 'react-redux';

import Columna from '../reducers.js';

import * as actions from '../actions.js';

class GraphScreen extends React.Component {
    constructor(props) {
        super(props);       
    }

    static navigationOptions = {
    title: 'Columna',
    };

    render() {            
        return (
            <View>
              <Text>
              Nombre de la columna: {this.props.nombre}
              </Text>
              <BarChart
              />   
            </View>
        );
    }
}

const mapStateToProps = (state,ownProps) =>{
/**
using REDUX stores, it allows us to just access the reducer values       by going state.name. Notice how name is what is being exported in    the reducer above
**/
  return{
    nombreColumna: state.nombreColumna,
    columnas: state.columnas,
    capas: state.capas,
    layers: state.layers,
    nombre: state.name
  }
}

const mapDispatchToProps = (dispatch) => {
 return {
   addColumn:(name)=>{
    dispatch(actions.addColumn(name))
   },
   saveName:()=>{
    dispatch(actions.saveName())
   },
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(GraphScreen);