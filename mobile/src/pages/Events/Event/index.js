import React, { useRef, useState, useEffect, useCallback } from 'react';
import { withNavigationFocus } from 'react-navigation';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import api from '~/services/api';

import Background from '~/components/BackgroundTwo';

import {
  Container,
  Title,
  List,
  MyEvent,
  Menu,
  Subtitle,
  RegisterButton,
  SearchButton,
  
  EContainer,
  ELeft,
  EAccess,
  EInfo,
  ETitle,
  EName,
  EDescr,
  EAvatar,
  EInfoButton,
} from './styles';

function Event({ isFocused, navigation }) {
  const [events, setEvents] = useState([]);
  const [msg, setMsg] = useState('');
  const [icon, setIcon] = useState(null);

  async function loadEvents() {
    const response = await api.get('/userEventsUser');

    const newArray = [];
    const newArrayTwo = [];
    var qtd = "";
    var base64 = "";

    // Criado uma promise para percorrer o array e preencher os valores
    const promises = response.data.map(async item => {
      qtd = await qtdUsersEvent(item.event._id);
      newArray.push( { ...item, qtd } );

    });

    const result = await Promise.all(promises);

    if (response.data[0] && result) {

      const promises2 = newArray.map(async item => {
        base64 = await imgEvent(item.event.avatar);
        newArrayTwo.push( { ...item, base64 } );
  
      });

      const result2 = await Promise.all(promises2);

      if (result2) {
        setEvents(newArrayTwo);
      }
    }
      
    else
      setMsg("Você não participa de nenhum evento...");
  }

  async function qtdUsersEvent(event) {
    const response = await api.get(`/qtdUsersEvent/${event}`);

    const number = response.data.qtd.toString();

    return number;

  }

  async function imgEvent(filename) {
    const response = await api.get(`/image/${filename}`);

    const number = response.data.base64;

    return number;

  }

  function formatTime(time) {
    var hour = Math.floor(time/60).toString();
    var minute = (time % 60).toString();

    if (hour.length == 1)
      hour = '0' + hour

    if (minute.length == 1)
      minute = '0' + minute

    return hour + ':' + minute
  }

  useEffect(() => {
    if (isFocused) {
      loadEvents();
    }
  }, [isFocused]);


  return (
    <Background>
      <Container>
      <Title>Eventos</Title>
        <Menu>
          <RegisterButton onPress={() => navigation.navigate('PEvent')}>Pesquisar</RegisterButton>
          <SearchButton onPress={() => navigation.navigate('REvent')}>Cadastrar</SearchButton>
        </Menu>

        <MyEvent>
          <Subtitle>Meus Eventos</Subtitle>

          {
          events.length > 0 ?
          <List
            data={events}
            keyExtractor={item => String(item._id)}
            renderItem={({ item: event }) => (
              <EContainer>
                <ELeft>
                  <EAvatar
                    source={{ uri: event.base64 }}
                  />
                  <EInfo>
                    <ETitle><Icon name="trophy" size={16} color={'#967E69'} /> {event.event.name}</ETitle>
                    <EName><Icon name="crown" size={16} color={'#ECE413'} /><EDescr> {event.event.leader.name}</EDescr></EName>
                    <EName><Icon name="dumbbell" size={16} color={'#3b9eff'} /><EDescr> {event.event.activity.name}</EDescr></EName>
                    <EName><Icon name="account" size={16} color={'#967E69'} /><EDescr> {event.qtd}/{event.event.limit}</EDescr></EName>
                  </EInfo>
                </ELeft>
                <EAccess>
                  <EInfoButton onPress={() => {navigation.navigate('IEvent', {
                    name: event.event.name,
                    leader: event.event.leader.name,
                    activity: event.event.activity.name,
                    description: event.event.description,
                    _id: event.event._id,
                    leaderId: event.event.leader._id,
                    url: event.base64,
                    activityId: event.event.activity._id,
                    limit: event.event.limit,
                    location: event.event.location.address,
                    locationId: event.event.location._id,
                    date: new Date(event.event.date),
                    hourIni: formatTime(event.event.hourIni),
                    hourFim: formatTime(event.event.hourFim)
                  })}}>Acessar o evento</EInfoButton>
                </EAccess>
              </EContainer>
            )}
          />
          :
          <Subtitle>{msg}</Subtitle>
          }
        </MyEvent>

      </Container>
    </Background>
  );
}

Event.navigationOptions = {
  tabBarLabel: 'Eventos',
  tabBarIcon: ({ tintColor }) => (
    <Icon name="trophy" size={20} color={tintColor} />
  ),
};


export default withNavigationFocus(Event);
