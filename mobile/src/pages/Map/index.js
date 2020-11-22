import React, { useState, useRef, useEffect } from 'react';
import { SafeAreaView, TextInput, View, TouchableOpacity, Text, Image } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import MapView, { Marker, Callout } from 'react-native-maps';
import { Modalize } from 'react-native-modalize';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import api from '~/services/api';

import {
    styles
  } from './styles';

export default function Map({ navigation }) {
  const [currentRegion, setCurrentRegion] = useState(null);
  const [schedules, setSchedules] = useState([]);
  const [eventSchedules, setEventSchedules] = useState([]);
  const [groups, setGroups] = useState('');
  const [currentLocation, setcurrentLocation] = useState(null);

  const modalizeRef = useRef(null);

  async function loadSchedules() {
    const response = await api.get('/schedules');
    
    setSchedules(response.data);
  }

  async function loadEventSchedules() {
    const response = await api.get('/eventsSchedule');

    const events = [];
    var base64 = "";

    // Criado uma promise para percorrer o array e preencher os valores
    const promises = response.data.map(async item => {
      base64 = await imgEvent(item.avatar);
      events.push( { ...item, base64 } );

    });

    const result = await Promise.all(promises);

    if (response.data[0] && result) {
      setEventSchedules(events);
    }
  }

  useEffect(() => {
    loadEventSchedules();
    loadSchedules();
  }, []);

  async function imgEvent(filename) {
    const response = await api.get(`/image/${filename}`);

    const number = response.data.base64;

    return number;

  }

  function handleRegionChanged(region) {
    setCurrentRegion(region);
  }

  function modalOpen() {
    modalizeRef.current?.open();
  }

  function formatDate(data) {
    var dateForm = new Date(data);

    var year = dateForm.getFullYear();
    var month = (dateForm.getMonth()+1).toString().length > 1 ? dateForm.getMonth()+1 : "0" + (dateForm.getMonth()+1);
    var date = (dateForm.getDate()).toString().length > 1 ? dateForm.getDate() : "0" + (dateForm.getDate());
    var time = date + '/' + month + '/' + year;

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

  if (!currentRegion) {
    setCurrentRegion({
      latitude: -20.9492067,
      longitude: -48.4820678,
      latitudeDelta: 0.04,
      longitudeDelta: 0.04,
    })
  }

  return (
    <>
      <MapView 
        onRegionChangeComplete={handleRegionChanged} 
        initialRegion={currentRegion} 
        style={{ flex: 1 }}
      >
        {schedules.map(schedule => (
          <Marker 
            key={schedule._id}
            coordinate={{ 
              longitude: schedule.location.location.coordinates[0],
              latitude: schedule.location.location.coordinates[1], 
            }}
            onPress={async () => {
              await setcurrentLocation(schedule.location._id);
              modalOpen();
            }}
          >
          </Marker>
        ))}
        {eventSchedules.map(schedule => (
          <Marker 
            key={schedule._id}
            coordinate={{ 
              longitude: schedule.location.location.coordinates[0],
              latitude: schedule.location.location.coordinates[1], 
            }}
            onPress={async () => {
              await setcurrentLocation(schedule.location._id);
              modalOpen();
            }}
          >
          </Marker>
        ))}
      </MapView>
      <View style={styles.searchForm}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar grupos ou eventos..."
          placeholderTextColor="#999"
          autoCapitalize="words"
          autoCorrect={false}
          value={groups}
          onChangeText={setGroups}
        />

        <TouchableOpacity style={styles.loadButton} onPress={() => {}}>
          <Icon name="magnify" size={24} color="#FFF" />
        </TouchableOpacity >
      </View>

      {
      currentLocation ? 
      (
        <Modalize
          ref={modalizeRef}
          snapPoint={250}
        >
          <FlatList
            contentContainerStyle={{ paddingBottom: 5, paddingLeft: 20, paddingRight: 20, paddingTop: 20 }}
            data={schedules}
            keyExtractor={item => String(item._id)}
            renderItem={({ item: schedule }) => (
              schedule.location._id == currentLocation ?
              <View style={styles.callout}>
                <View style={styles.left}>
                  <Image style={styles.avatar} source={{ uri: schedule.group.activity.url }} />
                  <View style={styles.info}>
                    <Text style={styles.gpName}><Icon name="account-group" size={16} color={'#967E69'} /> {schedule.group.name}</Text>
                    <Text style={styles.gpActivity}><Icon name="dumbbell" size={16} color={'#3b9eff'} /> {schedule.group.activity.name}</Text>
                    <Text style={styles.gpEndereco}><Icon name="map-marker" size={16} color={'#B82916'} /> {schedule.location.address}</Text>
                    <Text style={styles.gpHour}><Icon name="calendar" size={16} color={'#3b9eff'} /> Data: {formatDate(schedule.date)}</Text>
                    <View style={styles.containerHour}>
                      <Text style={styles.gpHour}><Icon name="alarm" size={16} color={'#09ABA9'} /> Inicio: {formatTime(schedule.hourIni)}</Text>
                      <Text style={styles.gpHourFim}><Icon name="alarm" size={16} color={'#AD3A21'} /> Termino: {formatTime(schedule.hourFim)}</Text>
                    </View>
                  </View>
                </View>
                <View style={styles.access}>
                  <TouchableOpacity style={styles.gpButton} onPress={() => {navigation.navigate('IGroup', {
                            name: schedule.group.name,
                            leader: schedule.group.leader.name,
                            activity: schedule.group.activity.name,
                            description: schedule.group.description,
                            _id: schedule.group._id,
                            leaderId: schedule.group.leader._id,
                            url: schedule.group.activity.url,
                            activityId: schedule.group.activity._id,
                            limit: schedule.group.limit
                          })}}>
                    <Text style={styles.gpTextButton}>Acessar Grupo</Text>
                  </TouchableOpacity>
                </View>
              </View>
              :
              <></>
            )}
          />
         
         <FlatList
            contentContainerStyle={{ paddingBottom: 5, paddingLeft: 20, paddingRight: 20 }}
            data={eventSchedules}
            keyExtractor={item => String(item._id)}
            renderItem={({ item: schedule }) => (
              schedule.location._id == currentLocation ?
              <View style={styles.callout}>
                <View style={styles.left}>
                  <Image style={styles.avatar} source={{ uri: schedule.base64 }} />
                  <View style={styles.info}>
                    <Text style={styles.gpName}><Icon name="account-group" size={16} color={'#967E69'} /> {schedule.name}</Text>
                    <Text style={styles.gpActivity}><Icon name="dumbbell" size={16} color={'#3b9eff'} /> {schedule.activity.name}</Text>
                    <Text style={styles.gpEndereco}><Icon name="map-marker" size={16} color={'#B82916'} /> {schedule.location.address}</Text>
                    <Text style={styles.gpHour}><Icon name="calendar" size={16} color={'#3b9eff'} /> Data: {formatDate(schedule.date)}</Text>
                    <View style={styles.containerHour}>
                      <Text style={styles.gpHour}><Icon name="alarm" size={16} color={'#09ABA9'} /> Inicio: {formatTime(schedule.hourIni)}</Text>
                      <Text style={styles.gpHourFim}><Icon name="alarm" size={16} color={'#AD3A21'} /> Termino: {formatTime(schedule.hourFim)}</Text>
                    </View>
                  </View>
                </View>
                <View style={styles.access}>
                  <TouchableOpacity style={styles.gpButton} onPress={() => {navigation.navigate('IEvent', {
                    name: schedule.name,
                    leader: schedule.leader.name,
                    activity: schedule.activity.name,
                    description: schedule.description,
                    _id: schedule._id,
                    leaderId: schedule.leader._id,
                    url: schedule.base64,
                    activityId: schedule.activity._id,
                    limit: schedule.limit,
                    location: schedule.location.address,
                    locationId: schedule.location._id,
                    date: new Date(schedule.date),
                    hourIni: formatTime(schedule.hourIni),
                    hourFim: formatTime(schedule.hourFim)
                  })}}>
                    <Text style={styles.gpTextButton}>Acessar Evento</Text>
                    </TouchableOpacity>
                </View>
              </View>
              :
              <></>
            )}
          />
        </Modalize>
      )
      :
      null
      }
    </>
  );
}

Map.navigationOptions = {
  tabBarLabel: 'Mapa',
  tabBarIcon: ({ tintColor }) => (
    <Icon name="map-search-outline" size={20} color={tintColor} />
  ),
};

