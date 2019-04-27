
import React from "react";
import { StyleSheet, Text, View, Switch, TouchableOpacity, Image, Alert, Dimensions, AsyncStorage } from "react-native";
import { Camera, Permissions } from 'expo';
import { Patrones } from '../codigo_patrones.js'

const screen = Dimensions.get('window');
const width = screen.width
const height = screen.height

/* Objeto que viene de la captura de pantalla
Object {"uri":"file:///data/user/0/host.exp.exponent/cache/ExperienceData/%2540anonymous%252FMiniproyecto-76b105d7-eb0d-4213-90d9-d523a7a6e3aa/Camera/0326fc8c-5a52-49a1-b7e2-4e62c873ac27.jpg",
"width":320,
"height":240}
*/

/* Objeto que viene de la localizacion
Object {
  "coords": Object {
    "accuracy": 20,
    "altitude": 0,
    "heading": 0,
    "latitude": 37.4219983,
    "longitude": -37,
    "speed": 0,
  },
  "mocked": false,
  "timestamp": 1552594032000,
}
*/

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
      this.setState({
        photo, imageuri:photo.uri,
      });
      this.findCoordinates();
      let val = JSON.stringify([photo]);
      console.log(Object.keys(Patrones)); 
      //this.setStorage("foto", val);
      //this.fetchStorage('foto');
    }
  };

  findCoordinates = async () => {
    await navigator.geolocation.getCurrentPosition(
      position => {
        let location = position;
        //console.log(location)
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
          console.log('VALOR-------------')
          console.log(value);
          return value
        } 
      } catch (error) {
        // Error retrieving data
      }
  }

  setStorage = async (key,value) => {
    try {
        await AsyncStorage.setItem(key, value);
      } catch (error) {
        console.log(error);
      }
  }

  removeFromStorage = async (key) => {
    try {
      await AsyncStorage.removeItem(key);
      return true;
    }
    catch(exception) {
      console.log(exception)
    }
  }

  savePicture = async () => {
      let image = this.state.photo;
      if (this.state.location){
        image.coords = this.state.location.coords;
      }
      let image2 = JSON.stringify(image)
      let temp = await this.fetchStorage('foto');
      console.log('--------------------------');
      console.log(this.state.imageuri)
      let stored_images;
      if (typeof temp == "undefined" ) {
        temp = [];
        stored_images = []
      } else{
        stored_images = JSON.parse(temp);
        //stored_images = []
      }
    
      console.log('\n\n');
      console.log(stored_images);
      console.log('\n\n')
      stored_images.push(image2);
      console.log(stored_images);
      this.setStorage('foto',JSON.stringify(stored_images))
      this.setState({
        imageuri : "",
        procesando:false,
        location:null,
        locationError:null,
      })


      //console.log(JSON.stringify(image));
      //console.log(JSON.parse(image2))
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
      <TouchableOpacity
                onPress={this.savePicture}
            >
              <Text> Salvar </Text>
            </TouchableOpacity>
        {(this.state.location && !this.state.locationError) &&
            <View>
            <Text style={{fontSize:10, textAlign:'center' }}> Localizacion </Text>
            <Text style={{fontSize:10, textAlign:'center' }}> Latitud: {this.state.location.coords.latitude} </Text>
            <Text style={{fontSize:10, textAlign:'center' }}> Longitud: {this.state.location.coords.longitude} </Text>
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
