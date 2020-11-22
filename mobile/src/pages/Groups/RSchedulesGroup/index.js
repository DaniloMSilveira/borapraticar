import React, { useRef, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Alert } from 'react-native';

import convertHourToMinutes from '../../../utils/convertHoursToMinutes';

import Background from '~/components/Background';

import api from '~/services/api';

import {
  Container,
  Form,
  FormInput,
  SubmitButton,
  Title,
  BackButton,
  RegisterButton,
  LabelDate,
  DateInputForm,
  ContainerHours,
  ContainerHour
} from './styles';

export default function RSchedulesGroup({ navigation }) {
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

  const locationId = navigation.getParam('locationId');
  const dateParam = navigation.getParam('date');
  const addressParam = navigation.getParam('location');
  const hourIniParam = navigation.getParam('hourIni');
  const hourFimParam = navigation.getParam('hourFim');

  const idSchedule = navigation.getParam('idSchedule');
 
  const [address, setAddress] = useState('');
  const [hourIni, setHourIni] = useState('');
  const [hourFim, setHourFim] = useState('');
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    if (locationId) {
      setAddress(addressParam);
    }
    if (dateParam) {
      setDate(dateParam);
    }
    if (hourIniParam) {
      setHourIni(hourIniParam);
    }
    if (hourFimParam) {
      setHourFim(hourFimParam);
    }
  }, []);

  async function handleEdit() {
    try {
      const schedule = {
        location: locationId,
        date: new Date(date),
        hourIni: convertHourToMinutes(hourIni),
        hourFim: convertHourToMinutes(hourFim)
      }

      await api.put(`/schedules/${idSchedule}`, schedule);
      Alert.alert(
        'Sucesso!',
        'O agendamento foi alterado com sucesso!'
      );
      navigation.navigate('SchedulesGroup', groupObj);
    } catch (err) {
      Alert.alert(
        'Falha na alteração do agendamento',
        'Erro ao alterar o aviso. Verifique os dados preenchidos'
      );
    }
  }

  async function handleSubmit() {
    try {
      const schedule = {
        group: _id,
        location: locationId,
        date,
        hourIni: convertHourToMinutes(hourIni),
        hourFim: convertHourToMinutes(hourFim)
      }

      await api.post('/schedules', schedule);
      Alert.alert(
        'Sucesso!',
        'O agendamento foi cadastrado com sucesso!'
      );
      navigation.navigate('SchedulesGroup', groupObj);
    } catch (err) {
      Alert.alert(
        'Falha na criação do agendamento',
        'Erro ao criar o agendamento. Verifique os dados preenchidos'
      );
    }
  }

  return (
    <Background>
      <Container>
        <Title>Cadastrar Agendamento</Title>
        <Form>
          <RegisterButton onPress={() => {navigation.navigate('MapLocation', { ...groupObj,
                                                                            address: address,
                                                                            date: date,
                                                                            locationId: locationId,
                                                                            hourIni: hourIni,
                                                                            hourFim: hourFim,
                                                                            idSchedule: idSchedule,
                                                                            origin: 'Schedule'
                                                                            })}}>
            Procurar Locais
          </RegisterButton>
          <LabelDate>Local:</LabelDate>
          <FormInput
            icon="map"
            placeholder="Endereço do local"
            value={address}
            onChangeText={setAddress}
            editable = {false}
          />
          <LabelDate>Data Agendamento:</LabelDate>
          <DateInputForm date={date} onChange={setDate} />

          <ContainerHours>
            <ContainerHour>
              <LabelDate>Hora Inicio:</LabelDate>
              <FormInput
                icon="alarm"
                placeholder="HH:MM"
                value={hourIni}
                onChangeText={setHourIni}
              />
            </ContainerHour>
            <ContainerHour>
              <LabelDate>Hora Final:</LabelDate>
              <FormInput
                icon="alarm"
                placeholder="HH:MM"
                value={hourFim}
                onChangeText={setHourFim}
              />
            </ContainerHour>
          </ContainerHours>

          <SubmitButton onPress={idSchedule ? handleEdit : handleSubmit}>
            Salvar
          </SubmitButton>
          <BackButton onPress={() => {navigation.navigate('SchedulesGroup', groupObj)}}>
            Voltar
          </BackButton>
        </Form>
      </Container>
    </Background>
  );
}
