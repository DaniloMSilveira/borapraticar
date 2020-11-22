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
  Dropdown,
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
  FormInput
} from './styles';

export default function PEvent({ navigation }) {
  const [events, setEvents] = useState([]);
  const [eventsbkp, setEventsbkp] = useState([]);
  const [activitys, setActivitys] = useState([]);

  const [activity,setActivity] = useState('');
  const [name,setName] = useState('');

  async function loadActivitys() {
    const response = await api.get('/activity');

    setActivitys(response.data);
  }

  useEffect(() => {
    loadActivitys();
  }, []);

  async function loadEvents() {
    const response = await api.get('/events');

    const eventsArray = [];
    var qtd = "";
    var base64 = "";

    // Criado uma promise para percorrer o array e preencher os valores
    const promises = response.data.map(async item => {
      qtd = await qtdUsersEvent(item._id);
      base64 = await imgEvent(item.avatar);

      eventsArray.push( { ...item, qtd, base64 } );

    });

    const result = await Promise.all(promises);

    if (response.data[0] && result) {
      setEvents(eventsArray);
      setEventsbkp(eventsArray);
    }
  }

  async function qtdUsersEvent(event) {
    const response = await api.get(`/qtdUsersEvent/${event}`);

    const number = response.data.qtd.toString();

    return number;

  }

  useEffect(() => {
    loadEvents();
  }, []);

  function ApplyFilters(activity, name) {
    newEvents = [];

    eventsbkp.map(item => {
      if (((item.activity._id == activity) && ((item.name.includes(name.trim())) || (name.trim() == ""))) || ((activity == '0') && (name.trim() == "")) || ((activity == '0') && ((item.name.includes(name.trim())) || (name.trim() == "")))) {
        newEvents.push(item);
      }
    });

    setEvents(newEvents);
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

  return (
    <Background>
      <Container>
        <Icon name="arrow-left" size={32} color={'#fff'} onPress={() => {navigation.navigate('Event')}}  style={{ marginRight: 50, marginLeft: 20, marginTop: 23 }} />
        <Menu>
          <Title>Pesquisar Eventos</Title>
          <Dropdown
            icon="fitness-center"
            selectedValue={activity}
            onValueChange={setActivity}
          >
            <Dropdown.Item label="Atividade física" value="0" />
            {activitys.map(item => <Dropdown.Item label={item.name} value={item._id} key={item._id} />)}
          </Dropdown>
          <FormInput
            icon="trophy"
            placeholder="Nome do evento"
            value={name}
            onChangeText={setName}
          />
          <SearchButton onPress={() => {ApplyFilters(activity, name)}}>Aplicar filtro</SearchButton>
        </Menu>

        <MyEvent>
          <List
            data={events}
            keyExtractor={item => String(item._id)}
            renderItem={({ item: event }) => (
              <EContainer>
                <ELeft>
                  <EAvatar
                  source={{
                      uri: event.base64,
                  }}
                  />
                  <EInfo>
                    <ETitle><Icon name="trophy" size={16} color={'#967E69'} /> {event.name}</ETitle>
                    <EName><Icon name="crown" size={16} color={'#ECE413'} /><EDescr> {event.leader.name}</EDescr></EName>
                    <EName><Icon name="dumbbell" size={16} color={'#3b9eff'} /><EDescr> {event.activity.name}</EDescr></EName>
                    <EName><Icon name="account" size={16} color={'#967E69'} /><EDescr> {event.qtd}/{event.limit}</EDescr></EName>
                  </EInfo>
                </ELeft>
                <EAccess>
                  <EInfoButton onPress={() => {navigation.navigate('IEvent', {
                   name: event.name,
                   leader: event.leader.name,
                   activity: event.activity.name,
                   description: event.description,
                   _id: event._id,
                   leaderId: event.leader._id,
                   url: event.base64,
                   activityId: event.activity._id,
                   limit: event.limit,
                   location: event.location.address,
                   locationId: event.location._id,
                   date: new Date(event.date),
                   hourIni: formatTime(event.hourIni),
                   hourFim: formatTime(event.hourFim)
                  })}}>Acessar o evento</EInfoButton>
                </EAccess>
              </EContainer>
            )}
          />
        </MyEvent>

      </Container>
    </Background>
  );
}
