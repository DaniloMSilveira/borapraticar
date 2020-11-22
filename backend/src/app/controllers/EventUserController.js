
const Yup = require('yup');
const Event = require('../models/Event');
const User = require('../models/User');
const EventUser = require('../models/EventUser');

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

    const eventUsers = await EventUser.find({ event }).populate('user').populate('event');

    return res.json(eventUsers);
  },

  async indexUser(req, res) {
    const events = await EventUser.find({ user: req.userId }).populate({
      path: 'event',
      populate: {
        path: 'leader',
        model: 'User'
      }
    }).populate({
      path: 'event',
      populate: {
        path: 'activity',
        model: 'Activity'
      }
    }).populate({
      path: 'event',
      populate: {
        path: 'location',
        model: 'Location'
      }
    }).populate('user');
    
    return res.json(events);
  },

  async qtdUsersEvent(req, res) {
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

    const qtd = await EventUser.find({ event }).count();

    const response = {
      qtd
    }

    return res.json(response);
  },
  
  async store(req, res) {
    // Denição do padrão de objeto com Yup.
    const schema = Yup.object().shape({
    event: Yup.string()
        .required(),
    user: Yup.string()
        .required()
    });

    // Validação de campos com o Yup.
    if (!(await schema.isValid(req.body))) {
        return res.status(400).json({ error: 'Falha na validação dos dados.' });
    }

    const { event, user } = req.body;

    try {

      try {
        // Verificando se o grupo existe
        const ev = await Event.findOne({ _id: event });
        if (!ev) {
          return res.status(401).json({ error: 'Evento não foi encontrado.' });
        }
      } catch (err) {
        return res.status(401).json({ error: 'O ID do evento esta no formato inválido' });
      }

      try {
        // Verificando se o usuário existe
        const usr = await User.findOne({ _id: user });
        if (!usr) {
          return res.status(401).json({ error: 'Usuário não foi encontrado.' });
        }
      } catch (err) {
        return res.status(401).json({ error: 'O ID do usuário esta no formato inválido' });
      }

      try {
        // Verificando se o usuário já esta cadastrado no grupo
        const evUsr = await EventUser.findOne({ event, user });
        if (evUsr) {
          return res.status(401).json({ error: 'Usuário já esta cadastrado para esse evento.' });
        }
      } catch (err) {
        return res.status(401).json({ error: 'O ID do usuário ou do evento esta no formato inválido' });
      }

      const eventUser = await EventUser.create({
        event,
        user
      });

      return res.json(eventUser);

    } catch (err) {
      return res.status(401).json({ error: 'Erro ao cadastrar o usuário para o evento indicado' });
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
        const event = await EventUser.findOne({ event: id, user: req.userId });
        if (!event) {
          return res.status(401).json({ error: 'O evento não foi encontrado ou você não participa do evento.' });
        }

      } catch (err) {
        return res.status(401).json({ error: 'O ID do evento esta no formato inválido' });
      }

      const response = await EventUser.deleteOne({ event: id, user: req.userId });

      return res.json(response);

    } catch (err) {
      return res.status(400).json({ error: 'Erro ao remover o usuário o grupo' });
    }

  },

  async removeUser(req, res) {
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
        const eventUsr = await EventUser.findOne({ _id: id });
        const event = await Event.findOne({ _id: eventUsr.event, leader: eventUsr.user });
        if (!eventUsr) {
          return res.status(401).json({ error: 'Não foi encontrado o usuário para este evento.' });
        }
        if (event) {
          return res.status(401).json({ error: 'Você não pode remover o lider do evento' });
        }

      } catch (err) {
        return res.status(401).json({ error: 'O ID do usuário para o evento esta no formato inválido' });
      }

      const response = await EventUser.deleteOne({ _id: id });

      return res.json(response);

    } catch (err) {
      return res.status(400).json({ error: 'Erro ao remover o usuário o evento' });
    }

  }

};


