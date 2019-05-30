
import React from 'react'
import { View, Text } from 'react-native'
import NativeColorPicker from 'native-color-picker';

const colorArray = ['#e6194b', '#3cb44b', '#ffe119', '#4363d8', '#f58231', '#911eb4', '#46f0f0', '#f032e6', '#bcf60c', '#fabebe', '#008080', '#e6beff', '#9a6324', '#fffac8', '#800000', '#aaffc3', '#808000', '#ffd8b1', '#000075', '#808080', '#ffffff']

export default class ExampleControlledTriangle extends React.Component {
  constructor(props){
    super(props)
    this.state={
      selected:''
    }
  }
  render(){
    return(
      <View style={{flex: 1, padding: 15}}>
        <NativeColorPicker 
            colors={colorArray}
            itemSize={30}
            horizontal
            columns={10}
            marker={'checkmark'}
            selectedColor = {this.state.selected}
            onSelect = {(color)=>{
              this.setState({selected:`${color}`})
              console.log(`${color}`)
            }}
        />
      </View>
    )
  }
}