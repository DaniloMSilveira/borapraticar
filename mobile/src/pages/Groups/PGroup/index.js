import React, { useRef, useState, useEffect, useCallback } from 'react';
import { withNavigationFocus } from 'react-navigation';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import api from '~/services/api';

import Background from '~/components/Background';

import {
  Container,
  Title,
  List,
  MyGroup,
  Menu,
  Dropdown,
  SearchButton,
  GContainer,
  GLeft,
  GAccess,
  GInfo,
  GTitle,
  GName,
  GDescr,
  GAvatar,
  GInfoButton,
  FormInput
} from './styles';

export default function PGroup({ navigation }) {
  const [groups, setGroups] = useState([]);
  const [groupsbkp, setGroupsbkp] = useState([]);
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

  async function loadGroups() {
    const response = await api.get('/groups');

    const groupsArray = [];
    var qtd = "";

    // Criado uma promise para percorrer o array e preencher os valores
    const promises = response.data.map(async item => {
      qtd = await qtdUsersGroup(item._id);

      groupsArray.push( { ...item, qtd } );

    });

    const result = await Promise.all(promises);

    if (response.data[0] && result) {
      setGroups(groupsArray);
      setGroupsbkp(groupsArray);
    }
  }

  async function qtdUsersGroup(group) {
    const response = await api.get(`/qtdUsersGroup/${group}`);

    const number = response.data.qtd.toString();

    return number;

  }

  useEffect(() => {
    loadGroups();
  }, []);

  function ApplyFilters(activity, name) {
    newGroups = [];

    groupsbkp.map(item => {
      if (((item.activity._id == activity) && ((item.name.includes(name.trim())) || (name.trim() == ""))) || ((activity == '0') && (name.trim() == "")) || ((activity == '0') && ((item.name.includes(name.trim())) || (name.trim() == "")))) {
        newGroups.push(item);
      }
    });

    setGroups(newGroups);
  }

  return (
    <Background>
      <Container>
        <Icon name="arrow-left" size={32} color={'#fff'} onPress={() => {navigation.navigate('Group')}}  style={{ marginRight: 50, marginLeft: 20, marginTop: 23 }} />
        <Menu>
          <Title>Pesquisar Grupos</Title>
          <Dropdown
            icon="fitness-center"
            selectedValue={activity}
            onValueChange={setActivity}
          >
            <Dropdown.Item label="Atividade física" value="0" />
            {activitys.map(item => <Dropdown.Item label={item.name} value={item._id} key={item._id} />)}
          </Dropdown>
          <FormInput
            icon="account-group"
            placeholder="Nome do grupo"
            value={name}
            onChangeText={setName}
          />
          <SearchButton onPress={() => {ApplyFilters(activity, name)}}>Aplicar filtro</SearchButton>
        </Menu>

        <MyGroup>
          <List
            data={groups}
            keyExtractor={item => String(item._id)}
            renderItem={({ item: group }) => (
              <GContainer>
                <GLeft>
                  <GAvatar
                  source={{
                      uri: group.activity.url,
                  }}
                  />
                  <GInfo>
                    <GTitle><Icon name="account-group" size={16} color={'#967E69'} /> {group.name}</GTitle>
                    <GName><Icon name="crown" size={16} color={'#ECE413'} /><GDescr> {group.leader.name}</GDescr></GName>
                    <GName><Icon name="dumbbell" size={16} color={'#3b9eff'} /><GDescr> {group.activity.name}</GDescr></GName>
                    <GName><Icon name="account" size={16} color={'#967E69'} /><GDescr> {group.qtd}/{group.limit}</GDescr></GName>
                  </GInfo>
                </GLeft>
                <GAccess>
                  <GInfoButton onPress={() => {navigation.navigate('IGroup', {
                    name: group.name,
                    leader: group.leader.name,
                    activity: group.activity.name,
                    description: group.description,
                    _id: group._id,
                    leader_id: group.leader._id,
                    url: group.activity.url,
                    activityId: group.activity._id,
                    limit: group.limit
                  })}}>Acessar o grupo</GInfoButton>
                </GAccess>
              </GContainer>
            )}
          />
        </MyGroup>

      </Container>
    </Background>
  );
}
