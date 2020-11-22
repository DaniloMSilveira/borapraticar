import React, { useRef, useState, useEffect } from 'react';
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
  Dropdown,
  FormInputTextArea
} from './styles';

export default function RGroup({ navigation }) {
  const url = navigation.getParam('url');
  const nameParam = navigation.getParam('name');
  const leader = navigation.getParam('leader');
  const activityParam = navigation.getParam('activity');
  const descriptionParam = navigation.getParam('description');
  const _id = navigation.getParam('_id');
  const leaderId = navigation.getParam('leaderId');
  const activityId = navigation.getParam('activityId');
  const limitParam = navigation.getParam('limit');
 
  const [name, setName] = useState('');
  const [activity,setActivity] = useState('');
  const [description, setDescription] = useState('');
  const [limit,setLimit] = useState('');

  const [activitys, setActivitys] = useState([]);

  async function loadActivitys() {
    const response = await api.get('/activity');

    setActivitys(response.data);
  }

  useEffect(() => {
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
  }, []);

  const groupObj = {
    url,
    name,
    leader,
    activity: activityParam,
    description,
    _id,
    leaderId,
    activityId,
    limit
  }

  const groupObjOld = {
    url,
    name: nameParam,
    leader,
    activity: activityParam,
    description: descriptionParam,
    _id,
    leaderId,
    activityId,
    limit: limitParam
  }

  function handleChangeOptionAct(val) {
    if (val !== "0") {
      setActivity(val);
    }
  }

  function handleChangeOptionLim(val) {
    if (val !== "0") {
      setLimit(val);
    }
  }

  async function handleSubmit() {
    const group = {
      name
      ,activity
      ,description
      ,limit
    }

    try {
      await api.post('/groups', group);
      Alert.alert(
        'Sucesso!',
        'O grupo foi cadastrado. Convide agora mesmo seus amigos!'
      );
      navigation.navigate('Group');
    } catch (err) {
      Alert.alert(
        'Falha na criação do grupo',
        'Erro ao criar o grupo. Verifique os dados preenchidos'
      );
    }
  }

  async function handleEdit() {
    const group = {
      name
      ,description
      ,limit
    }

    try {
      await api.put(`/groups/${_id}`, group);
      Alert.alert(
        'Sucesso!',
        'O grupo foi alterado com sucesso.'
      );
      navigation.navigate('IGroup', groupObj);
    } catch (err) {
      Alert.alert(
        'Falha na criação do grupo',
        'Erro ao alterar o grupo. Verifique os dados preenchidos'
      );
    }
  }

  return (
    <Background>
      <Container>
        <Title>Cadastrar Grupo</Title>
        <Form>
          <FormInput
            icon="account-group"
            placeholder="Nome do grupo"
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
          <Dropdown
            icon="group-work"
            selectedValue={limit}
            onValueChange={handleChangeOptionLim}
            label="Test"
          >
            <Dropdown.Item label="Limite de pessoas" value="0" />
            <Dropdown.Item label="5" value={5} />
            <Dropdown.Item label="10" value={10} />
            <Dropdown.Item label="15" value={15} />
            <Dropdown.Item label="30" value={30} />
          </Dropdown>
          <SubmitButton onPress={_id ? handleEdit : handleSubmit}>
            {_id ? "Editar grupo" : "Criar grupo"}
          </SubmitButton>
          <BackButton onPress={() => {_id ? navigation.navigate('IGroup', groupObjOld) : navigation.navigate('Group') }}>
            Voltar
          </BackButton>
        </Form>
      </Container>
    </Background>
  );
}
