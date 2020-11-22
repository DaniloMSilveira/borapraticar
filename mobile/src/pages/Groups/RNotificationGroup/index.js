import React, { useRef, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Alert } from 'react-native';

import Background from '~/components/Background';

import api from '~/services/api';

import {
  Container,
  Form,
  FormInput,
  SubmitButton,
  Title,
  BackButton,
  FormInputTextArea
} from './styles';

export default function RNotificationGroup({ navigation }) {
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

  const profile = useSelector(state => state.user.profile);

  const idNotification = navigation.getParam('idNotification');
  const titleParam = navigation.getParam('title');
  const textParam = navigation.getParam('text');

  const textRef = useRef();
 
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');

  useEffect(() => {
    if (idNotification) {
      setTitle(titleParam);
      setText(textParam);
    }
  }, []);

  async function handleEdit() {
    const notification = {
      title,
      text
    }

    try {
      await api.put(`/notificationgroup/${idNotification}`, notification);
      Alert.alert(
        'Sucesso!',
        'O aviso foi alterado com sucesso!'
      );
      navigation.navigate('NotificationGroup', groupObj);
    } catch (err) {
      Alert.alert(
        'Falha na alteração do aviso',
        'Erro ao alterar o aviso. Verifique os dados preenchidos'
      );
    }
  }

  async function handleSubmit() {
    const notification = {
      group: _id,
      title,
      text
    }

    try {
      await api.post('/notificationgroup', notification);
      Alert.alert(
        'Sucesso!',
        'O aviso foi cadastrado com sucesso!'
      );
      navigation.navigate('NotificationGroup', groupObj);
    } catch (err) {
      Alert.alert(
        'Falha na criação do aviso',
        'Erro ao criar o aviso. Verifique os dados preenchidos'
      );
    }
  }

  return (
    <Background>
      <Container>
        <Title>{idNotification ? 'Alterar' : 'Cadastrar'} Aviso</Title>
        <Form>
          <FormInput
            icon="information"
            placeholder="Titulo do aviso"
            returnKeyType="next"
            onSubmitEditing={() => textRef.current.focus()}
            value={title}
            onChangeText={setTitle}
          />
          <FormInputTextArea
            icon="card-text"
            placeholder="Descrição"
            ref={textRef}
            multiline
            numberOfLines={8}
            value={text}
            onChangeText={setText}
          />
          <SubmitButton onPress={idNotification ? handleEdit : handleSubmit}>
            Salvar
          </SubmitButton>
          <BackButton onPress={() => navigation.navigate('NotificationGroup', groupObj)}>
            Voltar
          </BackButton>
        </Form>
      </Container>
    </Background>
  );
}
