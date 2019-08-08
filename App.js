import React, { Component } from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';
import { Dialogflow_V2 } from 'react-native-dialogflow';
import { dialogflowConfig } from './env.js';

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
          text: `Hi! I am the FAQ bot 🤖 from MadChatter.\n\nHow may I help you with today?`,
          createdAt: new Date(),
          user: BOT
        }
      ]
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
    let payload = result.queryResult.webhookPayload;;
    console.log("payload: ", payload);
    this.sendBotResponse(text, payload);
  }

  sendBotResponse(text, payload) {
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
      </View>
    );
  }
}

export default App;