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
  AsyncStorage
} from 'react-native';

export default class LoginScreen extends Component {
  static navigationOptions = {
    title: 'Login',
  };

  constructor(props) {
    super(props);
    state = {
      email   : ' ',
      password: ' ',
    }
  }

  onClickListener = async (viewId) => {
    if (viewId == 'restore_password'){
      try{
        let keys = await AsyncStorage.getAllKeys();
        let val ;
        keys.map(async (key) => {
          val = this.fetchStorage(key);
          //await AsyncStorage.removeItem(key);
          valS = this.fetchSecureStorage(key);
          console.log(`${key} ---- ${val} --- ${valS}`)
        })
        //console.log(await AsyncStorage.getAllKeys())
      } catch (error){

      }
    }
    if (viewId == 'register'){
      try {
        this.setSecureStorage(this.state.email, this.state.password);
        this.setStorage(this.state.email, this.state.password);
      } catch (error) {
        // Error saving data
      }
    }
    if( viewId == 'login') {
      let value = null ;
      try {
        value = await AsyncStorage.getItem(this.state.email);
        if (value !== null) {
          console.log(value);
          if(this.state.password == value){
            Alert.alert("Alert", `Bienvenido ${this.state.email}`);   
            this.props.navigation.navigate('Home')    
          } else {
            Alert.alert("Alert", `Usuario o Clave Incorrecto`);
          }
        } else {
          Alert.alert("Alert", `El usuario ${this.state.email} no esta registrado`);
        }
      } catch (error) {
        // Error retrieving data
      }

    }
  }

  fetchStorage = async (key) => {
    try {
        value = await AsyncStorage.getItem(key);
        if (value !== null) {
          console.log(value);
        } 
      } catch (error) {
        // Error retrieving data
      }
  }

  fetchSecureStorage = async (key) => {
    try{
      let result = await SecureStore.getItemAsync(key);
      console.log(result);
    }catch (error) {

    }
  }

  setStorage = async (key,value) => {
    try {
        await AsyncStorage.setItem(key, value);
      } catch (error) {
        // Error saving data
      }
  }

  setSecureStorage = async (key,value) => {
    try {
        await SecureStore.setItemAsync(key, value);
      } catch (error) {
        // Error saving data
      }
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.inputContainer}>
          <Image style={styles.inputIcon} source={{uri: 'https://png.icons8.com/message/ultraviolet/50/3498db'}}/>
          <TextInput style={styles.inputs}
              placeholder="Email"
              keyboardType="email-address"
              underlineColorAndroid='transparent'
              onChangeText={(email) => this.setState({email})}/>
        </View>
        
        <View style={styles.inputContainer}>
          <Image style={styles.inputIcon} source={{uri: 'https://png.icons8.com/key-2/ultraviolet/50/3498db'}}/>
          <TextInput style={styles.inputs}
              placeholder="Password"
              secureTextEntry={true}
              underlineColorAndroid='transparent'
              onChangeText={(password) => this.setState({password})}/>
        </View>

        <TouchableHighlight style={[styles.buttonContainer, styles.loginButton]} onPress={() => this.onClickListener('login')}>
          <Text style={styles.loginText}>Login</Text>
        </TouchableHighlight>

        <TouchableHighlight style={styles.buttonContainer} onPress={() => this.onClickListener('restore_password')}>
            <Text>Forgot your password?</Text>
        </TouchableHighlight>

        <TouchableHighlight style={styles.buttonContainer} onPress={() => this.onClickListener('register')}>
            <Text>Registrarse</Text>
        </TouchableHighlight>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  }
});
 