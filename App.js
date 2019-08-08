import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';
import { Dialogflow_V2 } from 'react-native-dialogflow';
import { dialogflowConfig } from './env.js';
import openMap, { createOpenLink }from 'react-native-open-maps';
import Geolocation from '@react-native-community/geolocation';
import Welcome from './components/welcome'
import SplashScreen from 'react-native-splash-screen';
import Icon from 'react-native-vector-icons/FontAwesome';
const BOT = {
  _id: 2,
  name: 'FAQ Bot',
  avatar: 'https://ci.imgur.com/7k12EPD.png'
};

class App extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      messages: [
        {
          _id: 1,
          text: `Hi! I am Lowe's FAQ bot 🤖.\n\nHow may I help you with today?`,
          createdAt: new Date(),
          user: BOT
        }
      ],
      coords: null
    }
    this.onSend = this.onSend.bind(this);
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
    this.findCoordinates();
  }

  findCoordinates = () => {
    Geolocation.getCurrentPosition(({coords}) => {
      console.log(coords);
      this.setState({coords})
    }, (err) => console.log('getting location err: ', err), {enableHighAccuracy: true});
  };

  goToCurrentLocation = () => {
    let currentLong = this.state.coords.longitude;
    let currentLat = this.state.coords.latitude;
    openMap({end: "Lowe's", start: "My Location", travelType: "drive" })
  }
  
  onSend(messages = []) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages)
    }));
    let message = messages[0].text;
    Dialogflow_V2.requestQuery(
      message, 
      result => this.handleGoogleResponse(result), 
      err => console.log('RESPONSE ERROR!', err)).then((data) => {
        console.log('successfully got response!');
      }).catch((err) => {
        console.log('err: ', err);
      });
  }

  handleGoogleResponse(result) {
    console.log('GOOGLE BOT RESPONSE', result.queryResult);
    let text = result.queryResult.fulfillmentText
    let action = result.queryResult.action ? result.queryResult.action : null;
    let payload = result.queryResult.webhookPayload;;
    console.log("payload: ", payload);
    this.sendBotResponse(text, payload, action);
  }

  sendBotResponse(text, payload, action) {
    let message = {
      _id: this.state.messages.length + 1,
      text,
      createdAt: new Date(),
      user: BOT
    }
    if(payload && payload.is_url) {
      console.log('TEXXXXXXXXXTTTTTTTT: ', text);
      message.text = "image";
      message.image = text;
    }
    if(action && action.includes("maps")) {
      message.text = <Text onPress={() => this.goToCurrentLocation()}>To Lowe's</Text>
    }
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, [message])
    }));
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: '#fff' }}>
        <GiftedChat
          messages={this.state.messages}
          onSend={messages => this.onSend(messages)}
          user={{
            _id: 1
          }}
        />
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
 >
   <Icon name="plus"  size={30} color="#01a699" />
  </TouchableOpacity>
      </View>
    );
  }
}

export default App;