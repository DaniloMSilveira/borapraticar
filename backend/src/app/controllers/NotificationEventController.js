const Yup = require('yup');
const mongoose = require('mongoose');
const Event = require('../models/Event');
const NotificationEvent = require('../models/NotificationEvent');
const User = require('../models/User');



module.exports = {
  async index(req, res) {
    // Denição do padrão de objeto com Yup.
    const schema = Yup.object().shape({
      event: Yup.string()
          .required()
          .min(24)
      });
  
      // Validação de campos com o Yup.
      if (!(await schema.isValid(req.params))) {
          return res.status(400).json({ error: 'Falha na validação dos dados.' });
      }

    const { event } = req.params;

    const notifications = await NotificationEvent.find({ event }).populate("user");

    return res.json(notifications);
  },
  
  async store(req, res) {
    // Denição do padrão de objeto com Yup.
    const schema = Yup.object().shape({
    event: Yup.string()
        .required()
        .min(24),
    title: Yup.string()
        .required(),
    text: Yup.string()
        .required(),
    });

    // Validação de campos com o Yup.
    if (!(await schema.isValid(req.body))) {
        return res.status(400).json({ error: 'Falha na validação dos dados.' });
    }

    const { event, title, text } = req.body;
    const user = req.userId;

    try {

      try {
        // Verificando se o grupo existe
        const ev = await Event.findOne({ _id: event });
        if (!ev) {
          return res.status(401).json({ error: 'Evento não foi encontrada.' });
        }
      } catch (err) {
        return res.status(401).json({ error: 'O ID do evento esta no formato inválido' });
      }

      try {
        // Verificando se o usuário ja possui grupo com este nome
        const evLeader = await Event.findOne({ _id: event,leader: user });
        if (!evLeader) {
          return res.status(401).json({ error: 'Você não pode cadastrar avisos para este evento.' });
        }
      } catch (err) {
        return res.status(401).json({ error: 'O ID do usuário esta no formato inválido' });
      }

      const notification = await NotificationEvent.create({
        event,
        user,
        title,
        text
      });

      return res.json(notification);

    } catch (err) {
      return res.status(401).json({ error: 'Erro ao cadastrar o aviso' });
    }
  },

  async update(req, res) {
    // Denição do padrão de objeto com Yup.
    const schema = Yup.object().shape({
    title: Yup.string()
      .required(),
    text: Yup.string()
      .required()
    });

    // Validação de campos com o Yup.
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Falha na validação dos dados.' });
    }

    const { title, text } = req.body;
    const user = req.userId;
    const { id } = req.params;

    try {
      try {
        // Verificando se o grupo existe
        const noti = await NotificationEvent.findOne({ _id: id });
        if (!noti) {
          return res.status(401).json({ error: 'O aviso não foi encontrado.' });
        }
        if (noti.user != user) {
          return res.status(401).json({ error: 'Você não tem permissão para editar este aviso.' });
        }
      } catch (err) {
        return res.status(401).json({ error: 'O ID do aviso esta no formato inválido' });
      }

      const notification = await NotificationEvent.findOne({ _id: id });
      notification.title = title;
      notification.text = text;

      await notification.save();

      return res.json(notification);

    } catch (err) {
      return res.status(400).json({ error: 'Erro ao atualizar o aviso' });
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
        const notification = await NotificationEvent.findOne({ _id: id, user: req.userId });
        if (!notification) {
          return res.status(401).json({ error: 'O aviso não foi encontrado ou você não tem permissão.' });
        }

      } catch (err) {
        return res.status(401).json({ error: 'O ID do aviso esta no formato inválido' });
      }

      const response = await NotificationEvent.deleteOne({ _id: id, user: req.userId });

      return res.json(response);

    } catch (err) {
      return res.status(400).json({ error: 'Erro ao remover o aviso' });
    }

  }

};

