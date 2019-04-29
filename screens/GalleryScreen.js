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
  ScrollView
} from 'react-native';


const screen = Dimensions.get('window');
const width = screen.width
const height = screen.height

export default class GalleryScreen extends Component {
  static navigationOptions = {
    title: 'Galeria',
  };

    state = {
      ready:false,
      data_imagenes: false
    }

  componentWillMount(){
    this.fetchStorage('foto');
  }

  componentDidMount(){
  }


  fetchStorage = async (key) => {
    try {
        value = await AsyncStorage.getItem(key);
        if (value !== null) {
          this.setState({data_imagenes : JSON.parse(value)})
          this.imagesToCards();
          return JSON.parse(value)
        } 

      } catch (error) {
        // Error retrieving data
      }
  }

  setStorage = async (key,value) => {
    try {
        await AsyncStorage.setItem(key, value);
      } catch (error) {
        // Error saving data
      }
  }

  refreshList = () => {
    this.fetchStorage('foto');
    this.imagesToCards();
  }

  imagesToCards = () => {
    console.log("*************************")
    console.log(this.state.data_imagenes);
    console.log("*************************")

    let i = -3;
    imagenes = this.state.data_imagenes.map((entrada) => {
      i = i + 3;

      console.log("\n\n");
      console.log(JSON.parse(entrada).uri);
      if(JSON.parse(entrada).coords) console.log(JSON.parse(entrada).coords);
      return(
        <View style={{flexDirection:'row'}}key={i}>
        <Image
          source={{
            uri: JSON.parse(entrada).uri
          }}
          style={{width:width/2, height:height/4, margin: 5}}
          resizeMode="contain"
          key = {i}
        />
          {JSON.parse(entrada).coords ? 
            <View style={{flexDirection:'column', justifyContent:'center'}}>
              <Text >
                Latitud : {JSON.parse(entrada).coords.latitude}
              </Text> 
              <Text >
                Longitud: {JSON.parse(entrada).coords.longitude}
              </Text>
              <Text >
                Altitud: {JSON.parse(entrada).coords.altitude}
              </Text>
            </View>
            : <Text>
                Sin ubicación registrada
              </Text>
            }
        </View>
    )})
    this.setState({
      ready: true,
      imagenes,
    })
  }

  render() {
    if(this.state.ready){
      return (
        <ScrollView style={styles.container}>
          {this.state.imagenes}
          <TouchableHighlight onPress = {()=>this.refreshList()} >
            <View style={styles.optionButtons}>
              <Text style={styles.optionButtonsText}> 
                Refrescar
              </Text>
            </View>
          </TouchableHighlight>
        </ScrollView>
      );
    } else {
      return(
      <View style={styles.container}>
          <View >
            <Text> Cargando  </Text>
          </View>
        </View>
      )
    }

  }
}

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
    alignItems:'center',
    justifyContent:'center',
    textAlign:'center',
    margin:3
  },
  optionButtonsText:{
    color:'white',
    fontSize: 16,
    margin:5
  }
});
 