const Yup = require('yup');
const mongoose = require('mongoose');
const Event = require('../models/Event');
const ChatEvent = require('../models/ChatEvent');

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

    const chats = await ChatEvent.find({ event }).populate("user");

    return res.json(chats);
  },
  
  async store(req, res) {
    // Denição do padrão de objeto com Yup.
    const schema = Yup.object().shape({
    event: Yup.string()
      .required()
      .min(24),
    message: Yup.string()
        .required(),
    });

    // Validação de campos com o Yup.
    if (!(await schema.isValid(req.body))) {
        return res.status(400).json({ error: 'Falha na validação dos dados.' });
    }

    const { event, message } = req.body;
    const user = req.userId;

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

      const chat = await ChatEvent.create({
        event,
        user,
        message
      });

      const response = await ChatEvent.find({ _id: chat._id }).populate('user');

      return res.json(response);

    } catch (err) {
      return res.status(401).json({ error: 'Erro ao cadastrar a mensagem' });
    }
  }

};

