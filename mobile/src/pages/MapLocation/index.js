import React, { useState, useRef, useEffect } from 'react';
import { Platform, TextInput, View, TouchableOpacity, Text, Image, FlatList } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import MapView, { Marker, Callout } from 'react-native-maps';
import { Modalize } from 'react-native-modalize';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import api from '~/services/api';

import {
    styles
  } from './styles';

export default function MapLocation({ navigation }) {
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
  const dateParam = navigation.getParam('date');
  const hourIniParam = navigation.getParam('hourIni');
  const hourFimParam = navigation.getParam('hourFim');

  const obj = {
      url,
      name,
      leader,
      activity,
      description,
      _id,
      leaderId,
      activityId,
      limit,
      date: dateParam,
      hourIni: hourIniParam,
      hourFim: hourFimParam
  }

  const profile = useSelector(state => state.user.profile);

  const idSchedule = navigation.getParam('idSchedule');

  const [currentRegion, setCurrentRegion] = useState(null);
  const [locations, setLocations] = useState([]);
  const [currentLocation, setCurrentLocation] = useState(null);

  const modalizeRef = useRef(null);

  async function loadLocations() {
    const response = await api.get(`/locations`);
    
    setLocations(response.data);
  }

  function handleRegionChanged(region) {
    setCurrentRegion(region);
  }

  function modalOpen() {
    modalizeRef.current?.open();
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

  useEffect(() => {
    loadLocations();
  }, []);

  const origin = navigation.getParam('origin');
  const avatar = navigation.getParam('avatar');
  const filenameHex = navigation.getParam('filenameHex');

  return (
    <>
      <MapView 
        onRegionChangeComplete={handleRegionChanged} 
        initialRegion={currentRegion} 
        style={{ flex: 1 }}
      >
        {locations.map(location => (
          <Marker 
            key={location._id}
            coordinate={{ 
              longitude: location.location.coordinates[0],
              latitude: location.location.coordinates[1], 
            }}
            onPress={async () => {
              await setCurrentLocation(location);
              modalOpen();
            }}
          />
        ))}
      </MapView>
      <View style={styles.searchForm}>
        <TouchableOpacity style={styles.loadButton} onPress={() => {navigation.navigate(origin == 'Event' ? 'REvent' : 'RSchedulesGroup', { ...obj,
        location,
        locationId,
        idSchedule: idSchedule,
        avatar: avatar,
        filenameHex: filenameHex
        })}}>
          <Icon name="keyboard-backspace" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>

      {
      currentLocation ? 
      <Modalize
        ref={modalizeRef}
        snapPoint={180}
        modalHeight={180}
      >
        <View style={styles.callout}>
          <Text style={styles.gpName}><Icon name="map-marker" size={16} color={'#AD3A21'} /> {currentLocation.address}</Text>
          <Text style={styles.gpHour}><Icon name="alarm" size={16} color={'#09ABA9'} /> Abertura: {formatTime(currentLocation.hourIni)}</Text>
          <Text style={styles.gpHour}><Icon name="alarm" size={16} color={'#AD3A21'} /> Encerramento: {formatTime(currentLocation.hourFim)}</Text>
          <TouchableOpacity style={styles.gpButton} onPress={() => {
              navigation.navigate(origin == 'Event' ? 'REvent' : 'RSchedulesGroup', { ...obj,
                location: currentLocation.address,
                locationId: currentLocation._id,
                idSchedule: idSchedule,
                avatar: avatar,
                filenameHex: filenameHex
              })
              }}>
            <Text style={styles.gpTextButton}>Selecionar Local</Text>
          </TouchableOpacity>
        </View>
      </Modalize>
      :
      null
      }
    </>
  );
}

