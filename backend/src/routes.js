
const { Router } = require('express');

const UserController = require('./app/controllers/UserController');
const GroupController = require('./app/controllers/GroupController');
const ActivityController = require('./app/controllers/ActivityController');
const GroupUserController = require('./app/controllers/GroupUserController');
const LocationController = require('./app/controllers/LocationController');
const ScheduleController = require('./app/controllers/ScheduleController');
const NotificationGroupController = require('./app/controllers/NotificationGroupController');
const NotificationEventController = require('./app/controllers/NotificationEventController');
const EventController = require('./app/controllers/EventController');
const EventUserController = require('./app/controllers/EventUserController');
const ChatGroupController = require('./app/controllers/ChatGroupController');
const ChatEventController = require('./app/controllers/ChatEventController');

const authMiddleware = require('./app/middlewares/auth');

const routes = new Router();

routes.post('/sessions', UserController.session);
routes.post('/users', UserController.store);

// Neste caso, o Middleware de Autenticação só vai funcionar para as rotas que estão abaixo dele.
routes.use(authMiddleware);

routes.put('/users', UserController.update);
routes.put('/updateImg', UserController.updateImg);



routes.get('/activity', ActivityController.index);
routes.get('/activity/:id', ActivityController.indexOne);
routes.post('/activity', ActivityController.store);
routes.put('/activity/:id', ActivityController.update);
routes.delete('/activity/:id', ActivityController.remove);

routes.get('/locations', LocationController.index);
routes.post('/locations', LocationController.store);

routes.get('/schedules', ScheduleController.index);
routes.get('/schedules/:group', ScheduleController.indexGroup);
routes.post('/schedules', ScheduleController.store);
routes.put('/schedules/:id', ScheduleController.update);
routes.delete('/schedules/:id', ScheduleController.remove);

routes.get('/userGroups/:group', GroupUserController.index);
routes.get('/userGroupsUser', GroupUserController.indexUser);
routes.get('/qtdUsersGroup/:group', GroupUserController.qtdUsersGroup);
routes.post('/userGroups', GroupUserController.store);
routes.delete('/userGroups/:id', GroupUserController.remove);
routes.delete('/userGroupsRemove/:id', GroupUserController.removeUser);

routes.get('/groups', GroupController.index);
routes.get('/groupsUser', GroupController.indexUser);
routes.post('/groups', GroupController.store);
routes.put('/groups/:id', GroupController.update);
routes.delete('/groups/:id', GroupController.remove);

routes.get('/notificationgroup/:group', NotificationGroupController.index);
routes.post('/notificationgroup', NotificationGroupController.store);
routes.put('/notificationgroup/:id', NotificationGroupController.update);
routes.delete('/notificationgroup/:id', NotificationGroupController.remove);

routes.get('/userEvents/:event', EventUserController.index);
routes.get('/userEventsUser', EventUserController.indexUser);
routes.get('/qtdUsersEvent/:event', EventUserController.qtdUsersEvent);
routes.post('/userEvents', EventUserController.store);
routes.delete('/userEvents/:id', EventUserController.remove);
routes.delete('/userEventsRemove/:id', EventUserController.removeUser);

routes.get('/events', EventController.index);
routes.get('/eventsUser', EventController.indexUser);
routes.get('/eventsSchedule', EventController.indexSchedule);
routes.post('/events', EventController.store);
routes.put('/events/:id', EventController.update);
routes.delete('/events/:id', EventController.remove);

routes.get('/notificationevent/:event', NotificationEventController.index);
routes.post('/notificationevent', NotificationEventController.store);
routes.put('/notificationevent/:id', NotificationEventController.update);
routes.delete('/notificationevent/:id', NotificationEventController.remove);

routes.get('/chatgroup/:group', ChatGroupController.index);
routes.post('/chatgroup', ChatGroupController.store);

routes.get('/chatevent/:event', ChatEventController.index);
routes.post('/chatevent', ChatEventController.store);


module.exports =  routes;

