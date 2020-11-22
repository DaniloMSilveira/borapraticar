
import React, { useRef, useState, useEffect, useCallback } from 'react';
import { withNavigationFocus } from 'react-navigation';
import { useDispatch, useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Alert } from 'react-native';

import api from '~/services/api';

import Background from '~/components/BackgroundTwo';

import {
  Container,
  Title,
  Menu,
  Separator,
  DescrDate,
  PContainer,
  Info,
  SubTitle,
  List,
  Descr,
  Area,
  Access,
  ButtonContainer,
  InfoButton,
  RegisterButton,
  LeaveButton
} from './styles';

export default function NotificationEvent({ navigation }) {
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

  const profile = useSelector(state => state.user.profile);

  const [notificationEvent, setNotificationEvent] = useState([]);

  async function loadNotificationsEvent() {
    const response = await api.get(`/notificationEvent/${_id}`);

    setNotificationEvent(response.data);
  }

  useEffect(() => {
    loadNotificationsEvent();
  }, []);

  function formatDate(data) {
    var dateForm = new Date(data);

    var year = dateForm.getFullYear();
    var month = (dateForm.getMonth()+1).toString().length > 1 ? dateForm.getMonth()+1 : "0" + (dateForm.getMonth()+1);
    var date = (dateForm.getDate()).toString().length > 1 ? dateForm.getDate() : "0" + (dateForm.getDate());
    var hour = (dateForm.getHours()).toString().length > 1 ? dateForm.getHours() : "0" + (dateForm.getHours());
    var min = (dateForm.getMinutes()).toString().length > 1 ? dateForm.getMinutes() : "0" + (dateForm.getMinutes());
    var sec = (dateForm.getSeconds()).toString().length > 1 ? dateForm.getSeconds() : "0" + (dateForm.getSeconds());
    var time = date + '/' + month + '/' + year + ' ' + hour + ':' + min + ':' + sec ;

    return time;
  }

  async function RemoveNotificationEvent(id,userId) {

    try {
      if (profile.id == userId) {
        await api.delete(`/notificationEvent/${id}`);

        const newArray = [];
        notificationEvent.map(item => {
          if (item._id != id) {
            newArray.push(item);
          }
        });

        setNotificationEvent(newArray);

        Alert.alert(
            'Sucesso!',
            'Você removeu o aviso do evento.'
        );
      }
      else {
        Alert.alert(
            'Falha!',
            'Você não pode remover avisos do evento.'
        );
      } 
    } catch (err) {
      Alert.alert(
          'Falha',
          'Erro ao remover o aviso do evento. Atualize a página e tente novamente'
      );
    }
  }

  return (
    <Background>
      <Container>
        <Icon name="arrow-left" size={32} color={'#fff'} onPress={() => {navigation.navigate('IEvent', eventObj)}}  style={{ marginRight: 50, marginLeft: 20, marginTop: 23 }} />
        <Menu>
          <Title>Avisos do Evento</Title>
        </Menu>

        <Separator />

        <Area>
          {
            leaderId == profile.id ? <RegisterButton onPress={() => {navigation.navigate('RNotificationEvent', eventObj)}}>Cadastrar Aviso</RegisterButton>
            : <></>
          }
          <List
            data={notificationEvent}
            keyExtractor={item => String(item._id)}
            renderItem={({ item: notification }) => (
              <PContainer>
                  <Info>
                    <SubTitle>{notification.title}</SubTitle>
                    <DescrDate>Data: {formatDate(notification.createdAt)}</DescrDate>
                    <Descr>{notification.text}</Descr>
                  </Info>
                  <Access>
                    {
                      leaderId == profile.id ? 
                      <ButtonContainer>
                        <InfoButton onPress={() => {navigation.navigate('RNotificationEvent', { ...eventObj, idNotification: notification._id, title: notification.title, text: notification.text })}}>Editar</InfoButton>
                        <LeaveButton onPress={() => {RemoveNotificationEvent(notification._id,notification.user._id)}}>Remover</LeaveButton>
                      </ButtonContainer>
                      : <></>
                    }
                  </Access>
              </PContainer>
            )}
          />
        </Area>

      </Container>
    </Background>
  );
}

