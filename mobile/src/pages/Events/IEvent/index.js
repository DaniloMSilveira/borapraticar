import React, { useRef, useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Alert } from 'react-native';

import api from '~/services/api';

import convertHourToMinutes from '../../../utils/convertHoursToMinutes';
import Background from '~/components/BackgroundTwo';

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
HourContainer,
DescrTitle
} from './styles';

export default function IEvent({ navigation }) {
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

    const [user, setUser] = useState('');
    const profile = useSelector(state => state.user.profile);
    
    async function loadUser() {
        const response = await api.get(`/userEvents/${_id}`);

        var usu = "1";
        var base = "";

        // Criado uma promise para percorrer o array e preencher os valores
        const promises = response.data.map(async item => {
        
            if (item.user._id == profile.id) 
                usu = item.user._id;

        });

        const result = await Promise.all(promises);

        if (result) {
            setUser(usu);
        }
            
    }

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

    useEffect(() => {
        loadUser();
    }, []);

    async function RemoveEvent() {
        
        try {
            if (profile.id == leaderId) {
                await api.delete(`/events/${_id}`);
                Alert.alert(
                    'Sucesso!',
                    'Você removeu o evento'
                );
                navigation.navigate('Event');
            }
            else {
                await api.delete(`/userEvents/${_id}`);
                Alert.alert(
                    'Sucesso!',
                    'Você saiu do evento'
                );
                navigation.navigate('Event');
            }
        } catch (err) {
            if (profile.id == leaderId) {
                Alert.alert(
                    'Falha',
                    'Erro ao remover o evento. Atualize a página e tente novamente'
                );
            }
            else {
                Alert.alert(
                    'Falha',
                    'Erro ao sair do evento. Atualize a página e tente novamente'
                ); 
            }
        }
    }

    async function SubmitEvent() {
        const userEvent = {
            event: _id
            ,user: profile.id
        }
        try {
            await api.post('/userEvents', userEvent);
            Alert.alert(
                'Sucesso!',
                'Você entrou para o evento'
            );
            navigation.navigate('Event');
        } catch (err) {
            Alert.alert(
                'Falha ao entrar do evento',
                'Erro ao entrar do evento. Atualize a página e tente novamente'
            ); 
        }
    }

    return (
        <Background>
            <Container>
                <Icon name="arrow-left" size={32} color={'#fff'} onPress={() => {navigation.navigate('Event')}}  style={{ marginRight: 50, marginLeft: 20, marginTop: 23 }} />
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
                    <Subtitle><Icon name="map" size={20} color={'#83ED00'}/> Local: {location}</Subtitle>
                    <Subtitle><Icon name="calendar" size={20} color={'#FFDA1C'}/> Data: {formatDate(date)}</Subtitle>
                    <HourContainer>
                        <Subtitle><Icon name="alarm" size={20} color={'#36EB5B'}/> Inicio: {Number.isInteger(hourIni) ? formatTime(hourIni) : hourIni}    </Subtitle>
                        <Subtitle><Icon name="alarm" size={20} color={'#FF3628'}/> Final: {Number.isInteger(hourFim) ? formatTime(hourFim) : hourFim}</Subtitle>
                    </HourContainer>
                </DetailsContainer>
                <PanelContainer>
                    <DescrContainer>
                        <DescrTitle>Descrição do evento</DescrTitle>
                        <Descr>{description}</Descr>
                    </DescrContainer>
                </PanelContainer>

                
            </Container>
            <Separator />

            
            {
                user == profile.id ? 
                <ButtonsContainer>
                    <Icon name="chat" size={32} color={'#fff'} onPress={() => {navigation.navigate('ChatEvent', eventObj)}} style={{marginTop: 10, marginLeft: 35}} />
                    <Icon name="account" size={32} color={'#fff'} onPress={() => {navigation.navigate('UsersEvent', eventObj)}} style={{marginTop: 10}} />
                    <Icon name="alert-circle" size={32} color={'#fff'} onPress={() => {navigation.navigate('NotificationEvent', eventObj)}} style={{marginTop: 10, marginRight: 35}} />
                </ButtonsContainer>
                :
                <ButtonsContainer>
                    <Icon name="account" size={32} color={'#fff'} onPress={() => {navigation.navigate('UsersEvent', eventObj)}} style={{marginTop: 10, marginLeft: 40}} />
                    <Icon name="alert-circle" size={32} color={'#fff'} onPress={() => {navigation.navigate('NotificationEvent', eventObj)}} style={{marginTop: 10, marginRight: 40}} />
                </ButtonsContainer>
            }
            
            <Separator />
            {
                profile.id == leaderId ?
                <RegisterButton onPress={() => {navigation.navigate('REvent', {
                    ...eventObj
                })}}>Editar Evento</RegisterButton>
                :
                <></>
            }
            {
                user ? 
                    (
                        user == profile.id ?
                            <GRemoveButton onPress={() => {RemoveEvent()}}>{profile.id == leaderId ? "Remover Evento" : "Sair do Evento"}</GRemoveButton>
                        : 
                            <SearchButton onPress={() => {SubmitEvent()}}>Participar do evento</SearchButton>
                    )
                :
                    <></>
            }
        </Background>
    );
}
