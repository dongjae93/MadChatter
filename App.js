import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ImageBackground } from 'react-native';
import { Dialogflow_V2 } from 'react-native-dialogflow';
import { dialogflowConfig } from './env.js';
import Welcome from './components/welcome'
import SplashScreen from 'react-native-splash-screen';
import Icon from 'react-native-vector-icons/FontAwesome';
import Bot from './components/bot.js';

class App extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      showBot: false
    }
  }

  componentDidMount() {
    // console.log('moutned');
    Dialogflow_V2.setConfiguration(
      dialogflowConfig.client_email,
      dialogflowConfig.private_key,
      Dialogflow_V2.LANG_ENGLISH_US,
      dialogflowConfig.project_id
    );
    SplashScreen.hide();
  }

  toggleBot = () => {
    this.setState({showBot: !this.state.showBot});
  }

  render() {
    
    return (
      <View style={{flex: 1, backgroundColor: 'rgb(0,73,144)'}}>
        <View style={{justifyContent: 'center', alignItems: 'center', position: 'absolute'}} >
          <Image style={{left: 38, top: 100}} source={require('./data/photo/logoWhite.png')} />
        </View>
        {this.state.showBot ? 
            <Bot/>
          :
          null
        }
        <TouchableOpacity
          style={{
              borderWidth:1,
              borderColor:'rgba(0,0,0,0.2)',
              alignItems:'center',
              justifyContent:'center',
              width:70,
              position: 'absolute',                                          
              bottom: 10,                                                    
              right: 10,
              height:70,
              backgroundColor:'#fff',
              borderRadius:100,
            }}
            onPress={this.toggleBot}
        >
          <Icon name="comment" size={30} color="rgb(0,73,144)" />
        </TouchableOpacity>
        <TouchableOpacity
          style={{
              borderWidth:1,
              borderColor:'rgba(0,0,0,0.2)',
              alignItems:'center',
              justifyContent:'center',
              width:70,
              position: 'absolute',                                          
              top: 50,                                                    
              right: 10,
              height:70,
              backgroundColor:'#fff',
              borderRadius:100,
            }}
            onPress={this.toggleBot}
        >
          <Icon name="shopping-cart" size={30} color="rgb(0,73,144)" />
        </TouchableOpacity>
      </View>
    );
  }
}

export default App;