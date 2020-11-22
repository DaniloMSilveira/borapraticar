
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
  Left,
  Info,
  SubTitle,
  Access,
  Avatar,
  List,
  LeaveButton,
  ButtonContainer,
  InfoButtonFull,
  Descr,
  Area
} from './styles';

export default function UsersGroup({ navigation }) {
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

  const [usersGroup, setUsersGroup] = useState([]);

  async function imgProfile(filename) {
    const response = await api.get(`/image/${filename}`);

    const number = response.data.base64;

    return number;

  }

  async function loadUsersGroup() {
    const response = await api.get(`/userGroups/${_id}`);

    const profiles = [];
    var base64 = "";

    // Criado uma promise para percorrer o array e preencher os valores
    const promises = response.data.map(async item => {
      if (item.user.image)
        base64 = await imgProfile(item.user.image);

      profiles.push( { ...item, base64 } );

    });

    const result = await Promise.all(promises);

    if (response.data[0] && result) {
      setUsersGroup(profiles);
    }
      
  }

  useEffect(() => {
      loadUsersGroup();
  }, []);

  async function RemoveUserGroup(id,userId) {

    try {
      if (profile.id != userId) {
        await api.delete(`/userGroupsRemove/${id}`);

        const newArray = [];
        usersGroup.map(item => {
          if (item._id != id) {
            newArray.push(item);
          }
        });

        setUsersGroup(newArray);

        Alert.alert(
            'Sucesso!',
            'Você removeu o usuario do grupo.'
        );
      }
      else {
        Alert.alert(
            'Falha!',
            'Você não pode remover o lider do grupo.'
        );
      } 
    } catch (err) {
      Alert.alert(
          'Falha',
          'Erro ao remover o usuario do grupo. Atualize a página e tente novamente'
      );
    }
  }

  return (
    <Background>
      <Container>
        <Icon name="arrow-left" size={32} color={'#fff'} onPress={() => {navigation.navigate('IGroup', groupObj)}}  style={{ marginRight: 50, marginLeft: 20, marginTop: 23 }} />
        <Menu>
          <Title>Participantes do Grupo</Title>
        </Menu>

        <Separator />

        <Area>
        <List
          data={usersGroup}
          keyExtractor={item => String(item._id)}
          renderItem={({ item: user }) => (
            <PContainer>
              <Left>
                <Avatar
                  source={{ 
                    uri: user.base64 ? user.base64
                    : "https://k2partnering.com/wp-content/uploads/2016/05/Person.jpg" 
                }} />
                <Info>
                  <SubTitle> {user.user.name}</SubTitle>
                </Info>
              </Left>
              <Access>
                {
                  leaderId == profile.id ? 
                  <ButtonContainer>
                    <LeaveButton onPress={() => {RemoveUserGroup(user._id,user.user._id)}}>Remover</LeaveButton>
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

