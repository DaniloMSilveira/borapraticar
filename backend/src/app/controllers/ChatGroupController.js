const Yup = require('yup');
const mongoose = require('mongoose');
const Group = require('../models/Group');
const NotificationGroup = require('../models/NotificationGroup');
const User = require('../models/User');
const ChatGroup = require('../models/ChatGroup');



module.exports = {
  async index(req, res) {
    // Denição do padrão de objeto com Yup.
    const schema = Yup.object().shape({
      group: Yup.string()
        .required()
        .min(24)
      });
  
      // Validação de campos com o Yup.
      if (!(await schema.isValid(req.params))) {
          return res.status(400).json({ error: 'Falha na validação dos dados.' });
      }

    const { group } = req.params;

    const chats = await ChatGroup.find({ group }).populate("user");

    return res.json(chats);
  },
  
  async store(req, res) {
    // Denição do padrão de objeto com Yup.
    const schema = Yup.object().shape({
    group: Yup.string()
      .required()
      .min(24),
    message: Yup.string()
        .required(),
    });

    // Validação de campos com o Yup.
    if (!(await schema.isValid(req.body))) {
        return res.status(400).json({ error: 'Falha na validação dos dados.' });
    }

    const { group, message } = req.body;
    const user = req.userId;

    try {

      try {
        // Verificando se o grupo existe
        const gp = await Group.findOne({ _id: group });
        if (!gp) {
          return res.status(401).json({ error: 'Grupo não foi encontrado.' });
        }
      } catch (err) {
        return res.status(401).json({ error: 'O ID do grupo esta no formato inválido' });
      }

      const chat = await ChatGroup.create({
        group,
        user,
        message
      });

      const response = await ChatGroup.find({ _id: chat._id }).populate('user');

      return res.json(response);

    } catch (err) {
      return res.status(401).json({ error: 'Erro ao cadastrar a mensagem' });
    }
  }

};

