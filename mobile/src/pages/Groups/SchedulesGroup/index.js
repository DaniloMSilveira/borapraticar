
import React, { useRef, useState, useEffect, useCallback } from 'react';
import { withNavigationFocus } from 'react-navigation';
import { useDispatch, useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Alert } from 'react-native';

import api from '~/services/api';

import Background from '~/components/Background';

import {
  Container,
  Title,
  Menu,
  Separator,
  InfoButton,
  PContainer,
  Info,
  SubTitle,
  Access,
  Avatar,
  List,
  Descr,
  Area,
  ButtonContainer,
  LeaveButton,
  RegisterButton,
  ContainerHour
} from './styles';

export default function SchedulesGroup({ navigation }) {
  const url = navigation.getParam('url');
  const name = navigation.getParam('name');
  const leader = navigation.getParam('leader');
  const activity = navigation.getParam('activity');
  const description = navigation.getParam('description');
  const _id = navigation.getParam('_id');
  const leaderId = navigation.getParam('leaderId');
  const activityId = navigation.getParam('activityId');
  const limit = navigation.getParam('limit');

  const groupObj = {
      url,
      name,
      leader,
      activity,
      description,
      _id,
      leaderId,
      activityId,
      limit
  }

  const [schedules, setSchedules] = useState([]);

  const profile = useSelector(state => state.user.profile);

  async function loadSchedules() {
    const response = await api.get(`/schedules/${_id}`);

    setSchedules(response.data);
  }

  useEffect(() => {
    loadSchedules();
  }, []);

  function formatDate(data) {
    var dateForm = new Date(data);

    var year = dateForm.getFullYear();
    var month = (dateForm.getMonth()+1).toString().length > 1 ? dateForm.getMonth()+1 : "0" + (dateForm.getMonth()+1);
    var date = (dateForm.getDate()).toString().length > 1 ? dateForm.getDate() : "0" + (dateForm.getDate());
    var time = date + '/' + month + '/' + year ;

    return time;
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

  async function RemoveSchedule (id) {

    try {
      await api.delete(`/schedules/${id}`);
      console.log("entrei delete");

      const newArray = [];
      schedules.map(item => {
        console.log("entrei map");
        if (item._id != id) {
          newArray.push(item);
        }
      });

      setSchedules(newArray);

      console.log("entrei alert");
      Alert.alert(
          'Sucesso!',
          'Você removeu o agendamento do grupo.'
      );
    } catch (err) {
      console.log(err);
      Alert.alert(
          'Falha',
          'Erro ao remover o agendamento do grupo. Atualize a página e tente novamente'
      );
    }
  }

  return (
    <Background>
      <Container>
        <Icon name="arrow-left" size={32} color={'#fff'} onPress={() => {navigation.navigate('IGroup', groupObj)}}  style={{ marginRight: 50, marginLeft: 20, marginTop: 23 }} />
        <Menu>
          <Title>Agendamentos do Grupo</Title>
        </Menu>

        <Separator />

        <Area>
          {
            leaderId == profile.id ? <RegisterButton onPress={() => {navigation.navigate('RSchedulesGroup', groupObj)}}>Cadastrar Agendamento</RegisterButton>
            : <></>
          }
          <List
            data={schedules}
            keyExtractor={item => String(item._id)}
            renderItem={({ item: schedule }) => (
              <PContainer>
                  <Avatar
                    source={{ uri: 'https://blog.stayapp.com.br/wp-content/uploads/2019/01/google-maps-1797882_640-1-2.png' }}
                  />
                  <Info>
                    <SubTitle>{schedule.location.address}</SubTitle>
                    <Descr>Data: {formatDate(schedule.date)}</Descr>
                    <ContainerHour>
                      <Descr>Hora Inicio: {formatTime(schedule.hourIni)}</Descr>
                      <Descr>Hora Final: {formatTime(schedule.hourFim)}</Descr>
                    </ContainerHour>
                  </Info>
                  <Access>
                    {
                      leaderId == profile.id ? 
                      <ButtonContainer>
                        <InfoButton onPress={() => {navigation.navigate('RSchedulesGroup', { ...groupObj,
                          date: new Date(schedule.date),
                          hourIni: formatTime(schedule.hourIni),
                          hourFim: formatTime(schedule.hourFim),
                          location: schedule.location.address,
                          locationId: schedule.location._id,
                          idSchedule: schedule._id
                        })
                        }}>Editar</InfoButton>
                        <LeaveButton onPress={() => {RemoveSchedule(schedule._id)}}>Remover</LeaveButton>
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

