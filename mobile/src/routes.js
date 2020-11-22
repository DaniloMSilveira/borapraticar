import React from 'react';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
//import { createStackNavigator } from 'react-navigation-stack';

import { createBottomTabNavigator } from 'react-navigation-tabs';

//import Icon from 'react-native-vector-icons/MaterialIcons';

import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Profile from './pages/Profile';
import Map from './pages/Map';

import Group from './pages/Groups/Group';
import RGroup from './pages/Groups/RGroup';
import IGroup from './pages/Groups/IGroup';
import PGroup from './pages/Groups/PGroup';
import ChatGroup from './pages/Groups/ChatGroup';
import UsersGroup from './pages/Groups/UsersGroup';
import SchedulesGroup from './pages/Groups/SchedulesGroup';
import RSchedulesGroup from './pages/Groups/RSchedulesGroup';
import MapLocation from './pages/MapLocation';
import NotificationGroup from './pages/Groups/NotificationGroup';
import RNotificationGroup from './pages/Groups/RNotificationGroup';

import Event from './pages/Events/Event';
import PEvent from './pages/Events/PEvent';
import REvent from './pages/Events/REvent';
import IEvent from './pages/Events/IEvent';
import UsersEvent from './pages/Events/UsersEvent';
import NotificationEvent from './pages/Events/NotificationEvent';
import RNotificationEvent from './pages/Events/RNotificationEvent';
import ChatEvent from './pages/Events/ChatEvent';


export default (signedIn = false) =>
  createAppContainer(
    createSwitchNavigator(
      {
        Sign: createSwitchNavigator({
          SignIn,
          SignUp,
          RGroup,
          IGroup,
          PGroup,
          ChatGroup,
          UsersGroup,
          SchedulesGroup,
          NotificationGroup,
          RNotificationGroup,
          RSchedulesGroup,
          MapLocation,
          PEvent,
          REvent,
          IEvent,
          UsersEvent,
          NotificationEvent,
          RNotificationEvent,
          ChatEvent
        }),
        App: createBottomTabNavigator(
          {
            Map,
            Group,
            Event,
            Profile,
          }
        ),
      },
      {
        initialRouteName: signedIn ? 'App' : 'Sign',
      }
    )
  );
