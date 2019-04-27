import React, { Component } from 'react';
import { SecureStore } from 'expo';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  TouchableHighlight,
  Image,
  Alert,
  AsyncStorage,
  Dimensions,
  ScrollView,
  Picker
} from 'react-native';

import { Input } from 'react-native-elements';
import { Patrones } from '../codigo_patrones.js'
//import { imagenesPatrones } from '../imagenesPatrones.js'


import { connect } from 'react-redux';

import Columna from '../reducers.js';

import * as actions from '../actions.js';



const screen = Dimensions.get('window');
const width = screen.width
const height = screen.height

class FormScreen extends Component {
  static navigationOptions = {
    title: 'Formulario',
  };

    state = {
      ready: false,
      pickerValues: {},
      nameValues: {},
      heightValues: {},
      noteValues: {}
    }

  componentWillMount(){
    this.fillPicker();
  }

  componentDidMount(){
    this.setState({
      ready:true,
      stratums : [(
        <View key={0}
          style = {{
            borderBottomColor : 'black',
            borderBottomWidth: 2,
            marginVertical: 5
          }}
        >
          <Input
          placeholder='Nombre del estrato'
          label='Nombre del estrato'
          onChangeText={(value) =>{
            this.storeNames(1, value)
          }}
          />
          <Picker
                mode="dialog"
                style={{ margin:0}}
                selectedValue={this.state.pickerValues[1]}
                onValueChange={(itemValue, itemIndex) =>
                this.storePickerValues(1, itemValue) }
          >
                {this.state.picker}
          </Picker>
           <Input
          placeholder='Espesor'
          label= 'Espesor'
          onChangeText={(value) =>{
            this.storesHeights(1, value)
          }}
          />
          <Input
          placeholder='Notas'
          label='Notas'
          onChangeText={(value) =>{
            this.storeNotes(1, value)
          }}
          />
      </View>)]
    })
  }

  fillPicker = () => {
    let dummy = Object.keys(Patrones).map((entrada) => {
      return(
          <Picker.Item label={entrada} value={Patrones[entrada]} key={entrada}/>
      )
    })
    this.setState({
      picker : dummy,
    })
  }

  storePickerValues = (pickerID, value) => {
    console.log(`${pickerID} -- ${value}`);
    let values = this.state.pickerValues;
    values[pickerID] = value;
    this.setState({
      pickerValues : values
    })
  }

  storeNames = (nameID, value) => {
    console.log(`${nameID} -- ${value}`);
    let values = this.state.nameValues;
    values[nameID] = value;
    this.setState({
      nameValues : values
    })
  }

  storesHeights = (heighID, value) => {
    let values = this.state.heightValues;
    values[heighID] = parseInt(value);
    this.setState({
      heightValues : values
    })
  }

  storeNotes = (noteID, value) => {
    let values = this.state.noteValues;
    values[noteID] = value;
    this.setState({
      noteValues : values
    })
  }

  setLayers = () => {
    let numLayers = Object.keys(this.state.pickerValues) ;
    let layers = [] ;
    console.log("COMENZANDO ++++++++++");
    console.log(numLayers)
    console.log(this.state.pickerValues);
    numLayers.map((i)=>{
      console.log(i)
      layers.push({
        letter : this.state.nameValues[i],
        lithography: this.state.pickerValues[i],
        frequency: this.state.heightValues[i],
        note: this.state.noteValues[i]
      })
    })
    console.log('-----------------');
    console.log(this.state.pickerValues[1]);
    console.log('-----------------');

    console.log(layers);
    this.props.newColumn(this.state.nombre, layers)
  }

  addStratums = () => {
    let stratums = this.state.stratums;
    let longitud = stratums.length+1;
    stratums.push(
      <View key={stratums.length} 
        style = {{
          borderBottomColor : 'black',
          borderBottomWidth: 2,
          marginVertical: 5
        }}
      >
        <Input
        placeholder='Nombre del estrato'
        label = 'Nombre del estrato'
        onChangeText={(value) =>{
          this.storeNames(longitud, value)
        }}
        />
        <Picker
              note
              mode="dropdown"
              style={{margin:0}}
              selectedValue={this.state.pickerValues[longitud]}
              onValueChange={(itemValue, itemIndex) =>
              this.storePickerValues(longitud, itemValue) }
        >
              {this.state.picker}
        </Picker>
        <Input
        placeholder='Espesor'
        label = 'Espesor'
        onChangeText={(value) =>{
          this.storesHeights(longitud, value)
        }}
        />
        <Input
        placeholder='Notas'
        label = 'Notas'
        onChangeText={(value) =>{
          this.storeNotes(longitud, value)
        }}
        />
      </View>
      );
    this.setState({
      stratums
    })
    console.log(stratums.length);
    console.log(this.state.nombre)
    console.log(this.state.patron)
  }

  render() {
    return(
      <ScrollView>
      <Input
        placeholder='Nombre de la columna'
        label = 'Nombre de la columna'
        onChangeText={(value) =>{
          console.log("Value")
          this.setState({nombre: value})
        }}
      />
      {this.state.ready && this.state.stratums.map(stratum => stratum)}
      
      <View style={{
          alignItems:'center'
        }}
      >
         <TouchableHighlight onPress= {()=> this.addStratums()}>
          <View style={styles.optionButtons}>
            <Text style={styles.optionButtonsText}> 
              Agregar strato 
            </Text>
          </View>
        </TouchableHighlight>
        <TouchableHighlight onPress= {()=> this.setLayers()}>
          <View style={styles.optionButtons}>
            <Text style={styles.optionButtonsText}> 
              Usar Datos
            </Text>
          </View>
        </TouchableHighlight>
        <TouchableHighlight onPress= 
          {()=> this.props.navigation.navigate('Graph')}>
          <View style={styles.optionButtons}>
            <Text style={styles.optionButtonsText}> 
              Navegar a la Columna
            </Text>
          </View>
        </TouchableHighlight>
      </View>
      </ScrollView>


    )
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
   newColumn: (name,layers) => {
    dispatch(actions.newColumn(name,layers))
   }
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(FormScreen);


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#DCDCDC',
  },
  inputContainer: {
      borderBottomColor: '#F5FCFF',
      backgroundColor: '#FFFFFF',
      borderRadius:30,
      borderBottomWidth: 1,
      width:250,
      height:45,
      marginBottom:20,
      flexDirection: 'row',
      alignItems:'center'
  },
  inputs:{
      height:45,
      marginLeft:16,
      borderBottomColor: '#FFFFFF',
      flex:1,
  },
  inputIcon:{
    width:30,
    height:30,
    marginLeft:15,
    justifyContent: 'center'
  },
  buttonContainer: {
    height:45,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom:20,
    width:250,
    borderRadius:30,
  },
  loginButton: {
    backgroundColor: "#00b5ec",
  },
  loginText: {
    color: 'white',
  },
  optionButtons:{
    backgroundColor:'steelblue',
    borderRadius:5,
    width: width*2/3,
    alignItems:'center',
    margin:3
  },
  optionButtonsText:{
    color:'white',
    fontSize: 16,
    margin:5
  }
});
 