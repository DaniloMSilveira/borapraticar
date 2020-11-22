import React, { useRef, useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Alert } from 'react-native';

import api from '~/services/api';

import Background from '~/components/Background';

import {
Container,
Title,
Subtitle,
Avatar,
Descr,
InfoContainer,
DetailsContainer,
DescrContainer,
PanelContainer,
RegisterButton,
GRemoveButton,
Separator,
SearchButton,
ButtonsContainer,
DescrTitle
} from './styles';

export default function IGroup({ navigation }) {
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

    const [user, setUser] = useState('');
    const profile = useSelector(state => state.user.profile);
    
    async function loadUser() {
        const response = await api.get(`/userGroups/${_id}`);

        var usu = "1";

        // Criado uma promise para percorrer o array e preencher os valores
        const promises = response.data.map(async item => {
        
            if (item.user._id == profile.id) 
                usu = item.user._id;

        });

        const result = await Promise.all(promises);

        if (result)
            setUser(usu);
    }

    useEffect(() => {
        loadUser();
    }, []);

    async function RemoveGroup() {
        
        try {
            if (profile.id == leaderId) {
                await api.delete(`/groups/${_id}`);
                Alert.alert(
                    'Sucesso!',
                    'Você removeu o grupo'
                );
                navigation.navigate('Group');
            }
            else {
                await api.delete(`/userGroups/${_id}`);
                Alert.alert(
                    'Sucesso!',
                    'Você saiu do grupo'
                );
                navigation.navigate('Group');
            }
        } catch (err) {
            if (profile.id == leaderId) {
                Alert.alert(
                    'Falha',
                    'Erro ao remover o grupo. Atualize a página e tente novamente'
                );
            }
            else {
                Alert.alert(
                    'Falha',
                    'Erro ao sair do grupo. Atualize a página e tente novamente'
                ); 
            }
        }
    }

    async function SubmitGroup() {
        const userGroup = {
            group: _id
            ,user: profile.id
        }
        try {
            await api.post('/userGroups', userGroup);
            Alert.alert(
                'Sucesso!',
                'Você entrou para o grupo'
            );
            navigation.navigate('Group');
        } catch (err) {
            Alert.alert(
                'Falha ao entrar do grupo',
                'Erro ao entrar do grupo. Atualize a página e tente novamente'
            ); 
        }
    }

    return (
        <Background>
            <Container>
                <Icon name="arrow-left" size={32} color={'#fff'} onPress={() => {navigation.navigate('Group')}}  style={{ marginRight: 50, marginLeft: 20, marginTop: 23 }} />
                <InfoContainer>
                    <Avatar
                    source={{
                        uri: url,
                    }}
                    />
                    <Title>{name}</Title>
                </InfoContainer>
                <DetailsContainer>
                    <Subtitle><Icon name="crown" size={20} color={'#ECE413'}/> Lider: {leader}</Subtitle>
                    <Subtitle><Icon name="dumbbell" size={20} color={'#3b9eff'}/> Atividade Física: {activity}</Subtitle>
                </DetailsContainer>
                <PanelContainer>
                    <DescrContainer>
                        <DescrTitle>Descrição do grupo</DescrTitle>
                        <Descr>{description}</Descr>
                    </DescrContainer>
                </PanelContainer>

                
            </Container>
            <Separator />

            
            {
                user == profile.id ? 
                <ButtonsContainer>
                    <Icon name="chat" size={32} color={'#fff'} onPress={() => {navigation.navigate('ChatGroup', groupObj)}} style={{marginTop: 10, marginLeft: 25}} />
                    <Icon name="account" size={32} color={'#fff'} onPress={() => {navigation.navigate('UsersGroup', groupObj)}} style={{marginTop: 10}} />
                    <Icon name="calendar-clock" size={32} color={'#fff'} onPress={() => {navigation.navigate('SchedulesGroup', groupObj)}} style={{marginTop: 10}} />
                    <Icon name="alert-circle" size={32} color={'#fff'} onPress={() => {navigation.navigate('NotificationGroup', groupObj)}} style={{marginTop: 10, marginRight: 25}} />
                </ButtonsContainer>
                :
                <ButtonsContainer>
                    <Icon name="account" size={32} color={'#fff'} onPress={() => {navigation.navigate('UsersGroup', groupObj)}} style={{marginTop: 10, marginLeft: 50}} />
                    <Icon name="calendar-clock" size={32} color={'#fff'} onPress={() => {navigation.navigate('SchedulesGroup', groupObj)}} style={{marginTop: 10, marginRight: 50}} />
                </ButtonsContainer>
            }
            
            <Separator />
            {
                profile.id == leaderId ?
                <RegisterButton onPress={() => {navigation.navigate('RGroup', {
                    ...groupObj
                })}}>Editar Grupo</RegisterButton>
                :
                <></>
            }
            {
                user ? 
                    (
                        user == profile.id ?
                            <GRemoveButton onPress={() => {RemoveGroup()}}>{profile.id == leaderId ? "Remover Grupo" : "Sair do Grupo"}</GRemoveButton>
                        : 
                            <SearchButton onPress={() => {SubmitGroup()}}>Participar do grupo</SearchButton>
                    )
                :
                    <></>
            }
        </Background>
    );
}
