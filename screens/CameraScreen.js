
import React from "react";
import { StyleSheet, Text, View, Switch, TouchableOpacity, Image, Alert, Dimensions, AsyncStorage } from "react-native";
import { Camera, Permissions } from 'expo';

const screen = Dimensions.get('window');
const width = screen.width
const height = screen.height

export default class App extends React.Component {
  state = {
    switchValue: false ,
    hasCameraPermission: null, //Permission value
    type: Camera.Constants.Type.back, //specifying app start with back camera.
    imageuri:"",
    location:null,
    locationError:null,
    procesando: false,

  };  

  async componentWillMount() {
  //Getting Permission result from app details.
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === 'granted' });
  }

  cameraChange = () => {
  this.setState({
    type:
      this.state.type === Camera.Constants.Type.back
        ? Camera.Constants.Type.front
        : Camera.Constants.Type.back
  });
  };

  snap = async () => {
    if (this.camera) {
      this.setState({
        procesando: true,
      });
      let photo = await this.camera.takePictureAsync({ skipProcessing: true });
      console.log(photo);
      this.setState({
        photo, imageuri:photo.uri,
      });
      this.findCoordinates();
      this.setStorage('foto', {image: photo , location: this.state.location})
    }
  };

  findCoordinates = () => {
    navigator.geolocation.getCurrentPosition(
      position => {
        let location = position;
        console.log(location.coords.latitude)
        this.setState({ 
          location,
          procesando:false,
         });
      },
      error => {
        Alert.alert(error.message);
        this.setState({ 
          locationError: "No se pudo obtener la ubicación",
          procesando:false,
        })
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 1000 }
    );
  };

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

  setStorage = async (key,value) => {
    try {
        await AsyncStorage.setItem(key, value);
      } catch (error) {
        // Error saving data
      }
  }



  render() {
    const { hasCameraPermission } = this.state;
    if (hasCameraPermission === null) {
      return <View />;
    } else if (hasCameraPermission === false) {
      return (
        <View>
          <Text>No access to camera</Text>
        </View>
      );
    }else {
    return (
      <View style={ {
    flex: 1,
    backgroundColor: '#1dd1a1',
    justifyContent: 'center',
  }}>
    {(this.state.imageuri != "" ) ? (
    <View style={styles.cameraview}>
      {this.state.procesando && <Text style={{fontSize:20, textAlign:'center' }}> Procesando la imagen y locación </Text>}

        <Image
          source={{
            uri: this.state.imageuri
          }}
          style={{width:width, height:height*2/4}}
          resizeMode="contain"
      />
        {(this.state.location && !this.state.locationError) &&
            <View>
            <Text style={{fontSize:20, textAlign:'center' }}> Localizacion </Text>
            <Text style={{fontSize:20, textAlign:'center' }}> Latitud: {this.state.location.coords.latitude} </Text>
            <Text style={{fontSize:20, textAlign:'center' }}> Longitud: {this.state.location.coords.longitude} </Text>
            </View>
            }
        {(!this.state.location && this.state.locationError) &&
            <View>
            <Text style={{fontSize:20, textAlign:'center'}}> {this.state.locationError}</Text>
            </View>
            }
    </View>
    ):(
            <View>
          <TouchableOpacity
                style={styles.cameraButtons}
                onPress={this.cameraChange}
            >
            <Text style={{ fontSize: 18, color: "white" }} >
                Flip
            </Text>
          </TouchableOpacity>
          <Camera ref={ref => { this.camera = ref; }} type={this.state.type}>
            <View style={{width: width, height:height*2/4}}>
            </View>
          </Camera>
        
          <TouchableOpacity onPress={this.snap}>
            <Text style={{ fontSize: 18, color: "white" }}>
                  Captura
            </Text>
          </TouchableOpacity>
        </View>


    )}
    </View>
    );
  }
  }
}
const styles = {
  cameraButtons:{
    position: 'absolute',
    top:0
  }
};
