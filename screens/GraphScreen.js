import React, { Component } from 'react';
import {View, Text, TouchableWithoutFeedback}  from 'react-native';
import BarChart from './BarChart';

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
              <TouchableWithoutFeedback onPress={()=>{
                this.props.addColumn('APKL')
                console.log(this.props.columnas)
                }
              }>
                <Text> {this.props.nombreColumna} </Text>
              </TouchableWithoutFeedback>
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