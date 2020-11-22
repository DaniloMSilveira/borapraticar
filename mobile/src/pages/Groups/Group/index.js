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
  Subtitle,
  RegisterButton,
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
} from './styles';

function Group({ isFocused, navigation }) {
  const [groups, setGroups] = useState([]);
  const [msg, setMsg] = useState('');
  const [icon, setIcon] = useState(null);

  async function loadGroups() {
    const response = await api.get('/userGroupsUser');

    const groups = [];
    var qtd = "";

    // Criado uma promise para percorrer o array e preencher os valores
    const promises = response.data.map(async item => {
      qtd = await qtdUsersGroup(item.group._id);

      groups.push( { ...item, qtd } );

    });

    const result = await Promise.all(promises);

    if (response.data[0] && result)
      setGroups(groups);
    else
      setMsg("Você não participa de nenhum grupo...");
  }

  async function qtdUsersGroup(group) {
    const response = await api.get(`/qtdUsersGroup/${group}`);

    const number = response.data.qtd.toString();

    return number;

  }

  useEffect(() => {
    if (isFocused) {
      loadGroups();
    }
  }, [isFocused]);

  return (
    <Background>
      <Container>
      <Title>Grupos</Title>
        <Menu>
          <RegisterButton onPress={() => navigation.navigate('PGroup')}>Pesquisar</RegisterButton>
          <SearchButton onPress={() => navigation.navigate('RGroup')}>Cadastrar</SearchButton>
        </Menu>

        <MyGroup>
          <Subtitle>Meus Grupos</Subtitle>

          {
          groups.length > 0 ?
          <List
            data={groups}
            keyExtractor={item => String(item._id)}
            renderItem={({ item: group }) => (
              <GContainer>
                <GLeft>
                  <GAvatar
                    source={{ uri: group.group.activity.url }}
                  />
                  <GInfo>
                    <GTitle><Icon name="account-group" size={16} color={'#967E69'} /> {group.group.name}</GTitle>
                    <GName><Icon name="crown" size={16} color={'#ECE413'} /><GDescr> {group.group.leader.name}</GDescr></GName>
                    <GName><Icon name="dumbbell" size={16} color={'#3b9eff'} /><GDescr> {group.group.activity.name}</GDescr></GName>
                    <GName><Icon name="account" size={16} color={'#967E69'} /><GDescr> {group.qtd}/{group.group.limit}</GDescr></GName>
                  </GInfo>
                </GLeft>
                <GAccess>
                  <GInfoButton onPress={() => {navigation.navigate('IGroup', {
                    name: group.group.name,
                    leader: group.group.leader.name,
                    activity: group.group.activity.name,
                    description: group.group.description,
                    _id: group.group._id,
                    leaderId: group.group.leader._id,
                    url: group.group.activity.url,
                    activityId: group.group.activity._id,
                    limit: group.group.limit
                  })}}>Acessar o grupo</GInfoButton>
                </GAccess>
              </GContainer>
            )}
          />
          :
          <Subtitle>{msg}</Subtitle>
          }
        </MyGroup>

      </Container>
    </Background>
  );
}

Group.navigationOptions = {
  tabBarLabel: 'Grupos',
  tabBarIcon: ({ tintColor }) => (
    <Icon name="account-group" size={20} color={tintColor} />
  ),
};


export default withNavigationFocus(Group);
