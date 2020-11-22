import React, { useRef, useState, useEffect } from 'react';
import { Alert } from 'react-native';
import ImagePicker from 'react-native-image-picker';

import convertHourToMinutes from '../../../utils/convertHoursToMinutes';

import Background from '~/components/BackgroundTwo';

import api from '~/services/api';

import {
  Container,
  Form,
  FormInput,
  SubmitButton,
  Title,
  BackButton,
  Dropdown,
  FormInputTextArea,
  AvatarContainer,
  Avatar,
  ButtonChose,
  LabelDate,
  DateInputForm,
  ContainerHours,
  ContainerHour,
  RegisterButton
} from './styles';

export default function REvent({ navigation }) {
  const url = navigation.getParam('url');
  const nameParam = navigation.getParam('name');
  const leader = navigation.getParam('leader');
  const activityParam = navigation.getParam('activity');
  const descriptionParam = navigation.getParam('description');
  const _id = navigation.getParam('_id');
  const leaderId = navigation.getParam('leaderId');
  const activityId = navigation.getParam('activityId');
  const limitParam = navigation.getParam('limit');
  const location = navigation.getParam('location');
  const locationId = navigation.getParam('locationId');
  const dateParam = navigation.getParam('date');
  const hourIniParam = navigation.getParam('hourIni');
  const hourFimParam = navigation.getParam('hourFim');

  const [activitys, setActivitys] = useState([]);


  const [name, setName] = useState('');
  const [activity,setActivity] = useState('');
  const [description, setDescription] = useState('');
  const [limit,setLimit] = useState('');
  const [avatar, setAvatar] = useState();
  const [address, setAddress] = useState('');
  const [date, setDate] = useState(new Date());
  const [hourIni, setHourIni] = useState('');
  const [hourFim, setHourFim] = useState('');
  const [flagAvatar, setFlagAvatar] = useState(1);
  const [filenameHex, setFilenameHex] = useState('');

  const addressParam = navigation.getParam('address');
  const avatarParam = navigation.getParam('avatar');
  const filenameHexParam = navigation.getParam('filenameHex');

  async function loadActivitys() {
    const response = await api.get('/activity');

    setActivitys(response.data);
  }

  async function uploadImage() {
    const file = {
      uri: avatar.uri,
      name: avatar.fileName,
      type: avatar.type
    }
    
    const body = new FormData()
    body.append('file', file)
    
    try {
      await fetch('https://borapraticar-backend.herokuapp.com/upload', {
      method: 'POST',
      body
    }).then(response => response.json())
      .then(result => {
        let { filenameHex } = result;
        setFilenameHex(filenameHex);
      })
    } catch (error) {
      console.log(error);
    }
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

  console.log(filenameHex);

  useEffect(() => {
    setFlagAvatar(1);
    loadActivitys();

    if (nameParam) {
      setName(nameParam);
    }
    if (activityId) {
      setActivity(activityId);
    }
    if (descriptionParam) {
      setDescription(descriptionParam);
    }
    if (limitParam) {
      setLimit(limitParam);
    }
    if (locationId) {
      setAddress(location);
    }
    if (dateParam) {
      setDate(dateParam);
    }
    if (hourIniParam) {
      if (Number.isInteger(hourIniParam))
        setHourIni(formatTime(hourIniParam))
        
      setHourIni(hourIniParam); 
      ;
    }
    if (hourFimParam) {
      if (Number.isInteger(hourFimParam))
        setHourFim(formatTime(hourFimParam))
        
      setHourFim(hourFimParam);
    }
    if (url) {
      setAvatar(url)
    }
    if (avatarParam) {
      setAvatar(avatarParam);
    }
    if (filenameHexParam) {
      setFilenameHex(filenameHexParam);
    }
  }, []);

  function handleChangeOptionAct(val) {
    if (val !== "0") {
      setActivity(val);
    }
  }

  const eventObj = {
    url,
    name,
    leader,
    activity: activityParam,
    description,
    _id,
    leaderId,
    activityId: activity,
    limit,
    location,
    locationId,
    date,
    hourIni,
    hourFim
  }

  const eventObjOld = {
    url,
    name: nameParam,
    leader,
    activity: activityParam,
    description: descriptionParam,
    _id,
    leaderId,
    activityId,
    limit: limitParam,
    location,
    locationId,
    date: dateParam,
    hourIni: hourIniParam,
    hourFim: hourFimParam
  }

  useEffect(() => {
    if (flagAvatar == 2) {
      uploadImage();
    }
  }, [flagAvatar]);

  async function imagePickerCallback(data) {
    if (data.didCancel) {
      return;
    }

    if (data.error) {
      return;
    }

    if (!data.uri) {
      return;
    }

    setAvatar(data);
    setFlagAvatar(2);
  }

  async function handleSubmit() {
    try {
      console.log(filenameHex);
      if (filenameHex) {
        const event = {
          avatar: filenameHex
          ,name
          ,activity
          ,location: locationId
          ,date
          ,hourIni: convertHourToMinutes(hourIni)
          ,hourFim: convertHourToMinutes(hourFim)
          ,description
          ,limit
        }

        console.log('criei o evento');

        await api.post('/events', event);
        Alert.alert(
          'Sucesso!',
          'O evento foi cadastrado. Convide agora mesmo a comunidade para participar!'
        );
        navigation.navigate('Event');
      }
    } catch (err) {
      console.log(err);
      Alert.alert(
        'Falha na criação do evento',
        'Erro ao criar o evento. Verifique os dados preenchidos'
      );
    }
  }

  async function handleEdit() {
    const event = {
      avatar: filenameHex
      ,name
      ,activity
      ,location: locationId
      ,date
      ,hourIni: convertHourToMinutes(hourIni)
      ,hourFim: convertHourToMinutes(hourFim)
      ,description
      ,limit
    }

    try {
      await api.put(`/events/${_id}`, event);
      Alert.alert(
        'Sucesso!',
        'O evento foi alterado com sucesso.'
      );
      navigation.navigate('IEvent', eventObj);
    } catch (err) {
      Alert.alert(
        'Falha na criação do evento',
        'Erro ao alterar o evento. Verifique os dados preenchidos'
      );
    }
  }

  return (
    <Background>
      <Container>
        <Title>Cadastrar Evento</Title>
        <Form>
        <AvatarContainer>
          <Avatar source={{
              uri: avatar
                ? ( avatar.uri ? avatar.uri : avatar )
                : "https://oiguassu.com.br/wp-content/themes/fox/images/placeholder.jpg" 
          }} />
          {activityParam ? 
            <></>
          :
            <ButtonChose onPress={() => ImagePicker.showImagePicker({}, imagePickerCallback)}>
              Escolher imagem
            </ButtonChose>
          }
          
        </AvatarContainer>
          <FormInput
            icon="trophy"
            placeholder="Nome do evento"
            value={name}
            onChangeText={setName}
          />
          <Dropdown
            icon="fitness-center"
            selectedValue={activity}
            onValueChange={handleChangeOptionAct}
            enabled={activityParam ? false : true}
          >
            <Dropdown.Item label="Atividade física" value="0" />
            {activitys.map(item => <Dropdown.Item label={item.name} value={item._id} key={item._id} />)}
          </Dropdown>
          <FormInputTextArea
            icon="card-text"
            placeholder="Descrição"
            multiline
            numberOfLines={4}
            value={description}
            onChangeText={setDescription}
          />
          <FormInput
            icon="account-group-outline"
            placeholder="Número de participantes"
            keyboardType="numeric"
            value={limit.toString()}
            onChangeText={setLimit}
          />

          {activityParam ? 
            <></>
          :
            <RegisterButton onPress={() => {navigation.navigate('MapLocation', { ...eventObj,
                                                                              idSchedule: _id,
                                                                              origin: 'Event',
                                                                              avatar: avatar,
                                                                              filenameHex: filenameHex
                                                                              })}}>
              Procurar Locais
            </RegisterButton>
          }
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
          <SubmitButton onPress={_id ? handleEdit : handleSubmit}>
            {_id ? "Editar evento" : "Criar evento"}
          </SubmitButton>
          <BackButton onPress={() => { _id ? navigation.navigate('IEvent', eventObjOld) : navigation.navigate('Event') }}>
            Voltar
          </BackButton>
        </Form>
      </Container>
    </Background>
  );
}
