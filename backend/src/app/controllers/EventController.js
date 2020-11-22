const Yup = require('yup');
const mongoose = require('mongoose');
const Event = require('../models/Event');
const Activity = require('../models/Activity');
const EventUser = require('../models/EventUser');

module.exports = {
  async index(req, res) {
    const aevents = await EventUser.find({ user: req.userId }).select("event");

    const arrayEvents = [];
    aevents.map(ev => arrayEvents.push(mongoose.Types.ObjectId(ev.event)));
    
    const events = await Event.find( { _id: { $nin: arrayEvents } } ).populate('leader').populate('activity').populate('location');

    return res.json(events);
  },

  async indexUser(req, res) {
    const events = await Event.find({ leader: req.userId }).populate('leader').populate('activity');

    return res.json(events);
  },
  
  async indexSchedule(req, res) {
    const events = await Event.find().populate('leader').populate('activity').populate('location');

    return res.json(events);
  },

  async store(req, res) {
    // Denição do padrão de objeto com Yup.
    const schema = Yup.object().shape({
    avatar: Yup.string()
      .required(),
    name: Yup.string()
        .required()
        .min(4),
    activity: Yup.string()
        .required()
        .min(24),
    location: Yup.string()
        .required()
        .min(24),
    date: Yup.date()
        .required(),
    hourIni: Yup.number()
        .required(),
    hourFim: Yup.number()
        .required(),
    description: Yup.string(),
    limit: Yup.number()
        .required()
    });

    // Validação de campos com o Yup.
    if (!(await schema.isValid(req.body))) {
        return res.status(400).json({ error: 'Falha na validação dos dados.' });
    }

    const { avatar, name, activity, location, date, hourIni, hourFim, description, limit } = req.body;
    const leader = req.userId;

    try {

      try {
        // Verificando se a atividade física existe
        const act = await Activity.findOne({ _id: activity });
        if (!act) {
          return res.status(401).json({ error: 'Atividade não foi encontrada.' });
        }
      } catch (err) {
        return res.status(401).json({ error: 'O ID da atividade esta no formato inválido' });
      }

      try {
        // Verificando se o usuário ja possui grupo com este nome
        const event = await Event.findOne({ leader, name });
        if (event) {
          return res.status(401).json({ error: 'Você já possui um evento com este nome.' });
        }
      } catch (err) {
        return res.status(401).json({ error: 'O ID do evento esta no formato inválido' });
      }

      const event = await Event.create({
        avatar,
        name,
        leader,
        activity,
        location,
        date,
        hourIni,
        hourFim,
        description,
        limit
      });

      const eventUser = await EventUser.create({
        event: event._id
        ,user: event.leader
      })

      if (eventUser)
        return res.json(event);

    } catch (err) {
      return res.status(401).json({ error: 'Erro ao cadastrar o evento' });
    }
  },

  async update(req, res) {
    // Denição do padrão de objeto com Yup.
    const schema = Yup.object().shape({
    name: Yup.string()
        .required()
        .min(4),
    date: Yup.date()
        .required(),
    hourIni: Yup.number()
        .required(),
    hourFim: Yup.number()
        .required(),
    description: Yup.string(),
    limit: Yup.number()
        .required()
    });

    // Validação de campos com o Yup.
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Falha na validação dos dados.' });
    }

    const { name, date, hourIni, hourFim, description, limit } = req.body;
    const leader = req.userId;
    const { id } = req.params;
    try {
      try {
        // Verificando se o grupo existe
        const event = await Event.findOne({ _id: id, leader });
        if (!event) {
          return res.status(401).json({ error: 'O evento não foi encontrado.' });
        }
      } catch (err) {
        return res.status(401).json({ error: 'O ID do evento esta no formato inválido' });
      }

      const ev = await Event.findOne({ _id: id, leader });
      ev.name = name;
      ev.date = date;
      ev.hourIni = hourIni;
      ev.hourFim = hourFim;
      ev.description = description;
      ev.limit = limit;

      await ev.save();

      return res.json(ev);

    } catch (err) {
      return res.status(400).json({ error: err });
    }

  },

  async remove(req, res) {
    // Denição do padrão de objeto com Yup.
    const schema = Yup.object().shape({
    id: Yup.string()
      .required()
      .min(24)
    });

    // Validação de campos com o Yup.
    if (!(await schema.isValid(req.params))) {
      return res.status(400).json({ error: 'Falha na validação dos dados.' });
    }

    const { id } = req.params;

    try {
      try {
        // Verificando se o grupo existe
        const event = await Event.findOne({ _id: id, leader: req.userId });
        if (!event) {
          return res.status(401).json({ error: 'O evento não foi encontrado ou você não é o lider do grupo.' });
        }

      } catch (err) {
        return res.status(401).json({ error: 'O ID do evento esta no formato inválido' });
      }

      await EventUser.deleteMany({ event: id });

      const response = await Event.deleteOne({ _id: id, leader: req.userId });

      return res.json(response);

    } catch (err) {
      return res.status(400).json({ error: 'Erro ao remover o evento e seus usuários' });
    }

  }

};

