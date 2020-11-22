
import React, { useRef, useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { withNavigationFocus } from 'react-navigation';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { TouchableOpacity } from 'react-native';
import { Alert } from 'react-native';

import api from '~/services/api';

import Background from '~/components/BackgroundTwo';

import MessageBubble from '~/components/MessageBubble';

import {
  Container,
  Title,
  Menu,
  ContainerChat,
  InputText,
  InputContainer,
  SendButton,
  List
} from './styles';

export default function ChatEvent({ navigation }) {
  const url = navigation.getParam('url');
  const name = navigation.getParam('name');
  const leader = navigation.getParam('leader');
  const activity = navigation.getParam('activity');
  const description = navigation.getParam('description');
  const _id = navigation.getParam('_id');
  const leaderId = navigation.getParam('leaderId');
  const activityId = navigation.getParam('activityId');
  const limit = navigation.getParam('limit');
  const location = navigation.getParam('location');
  const locationId = navigation.getParam('locationId');
  const date = navigation.getParam('date');
  const hourIni = navigation.getParam('hourIni');
  const hourFim = navigation.getParam('hourFim');

  const eventObj = {
      url,
      name,
      leader,
      activity,
      description,
      _id,
      leaderId,
      activityId,
      limit,
      location,
      locationId,
      date,
      hourIni,
      hourFim
  }

  const [message, setMessage] = useState('');
  const [chats, setChats] = useState([]);

  const profile = useSelector(state => state.user.profile);

  async function loadChats() {
    const response = await api.get(`/chatevent/${_id}`);
    setChats(response.data);
  }

  useEffect(() => {
    loadChats();
  }, []);

  async function AddMessage() {
  try {
    const chat = {
      event: _id,
      message
    }

    const response = await api.post(`/chatevent`, chat);

    setChats([...chats, response.data[0]]);
  }
  catch (err) {
    Alert.alert(
        'Falha',
        'Erro ao inserir mensagem.'
    );
  }
}

  return (
  <Background>
    <Container>
      <Icon name="arrow-left" size={32} color={'#fff'} onPress={() => {navigation.navigate('IEvent', eventObj)}}  style={{ marginRight: 50, marginLeft: 20, marginTop: 23 }} />
      <Menu>
        <Title>Chat do Evento</Title>
      </Menu>
      <ContainerChat>
      <List
        data={chats}
        keyExtractor={item => String(item._id)}
        renderItem={({ item: chat }) => (
          <MessageBubble
            name={chat.user.name}
            text={chat.message}
            mine={chat.user._id == profile.id ? false : true}
          />
        )}
      />
      </ContainerChat>
      <InputContainer>
        <InputText 
          value={message}
          placeholder="Digite a sua mensagem..."
          returnKeyType="send"
          onChangeText={setMessage} 
        />
        <TouchableOpacity style={{
            width: '15%',
            backgroundColor: '#007aff',
            height: 50,
            borderWidth: 1,
            alignItems: "center",
            justifyContent: 'center'
          }}
          onPress={() => {
            AddMessage();
            setMessage('');
          }}
        
        ><Icon name="send" size={25} color={'#fff'} /></TouchableOpacity>
      </InputContainer>
    </Container>
  </Background>
  );
}

