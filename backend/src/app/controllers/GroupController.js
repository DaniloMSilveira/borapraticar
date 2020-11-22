const Yup = require('yup');
const mongoose = require('mongoose');
const Group = require('../models/Group');
const Activity = require('../models/Activity');
const GroupUser = require('../models/GroupUser');



module.exports = {
  async index(req, res) {
    const agroups = await GroupUser.find({ user: req.userId }).select("group");

    const arrayGroups = [];
    agroups.map(gp => arrayGroups.push(mongoose.Types.ObjectId(gp.group)));
    
    const groups = await Group.find( { _id: { $nin: arrayGroups } } ).populate('leader').populate('activity');

    return res.json(groups);
  },

  async indexUser(req, res) {
    const groups = await Group.find({ leader: req.userId }).populate('leader').populate('activity');

    return res.json(groups);
  },
  
  async store(req, res) {
    // Denição do padrão de objeto com Yup.
    const schema = Yup.object().shape({
    name: Yup.string()
        .required()
        .min(4),
    activity: Yup.string()
        .required(),
    description: Yup.string(),
    limit: Yup.number()
        .required()
    });

    // Validação de campos com o Yup.
    if (!(await schema.isValid(req.body))) {
        return res.status(400).json({ error: 'Falha na validação dos dados.' });
    }

    const { name, activity, description, limit } = req.body;
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
        const group = await Group.findOne({ leader, name });
        if (group) {
          return res.status(401).json({ error: 'Você já possui um grupo com este nome.' });
        }
      } catch (err) {
        return res.status(401).json({ error: 'O ID do grupo esta no formato inválido' });
      }

      const group = await Group.create({
        name,
        leader,
        activity,
        description,
        limit
      });

      const groupUser = await GroupUser.create({
        group: group._id
        ,user: group.leader
      })

      if (groupUser)
        return res.json(group);

    } catch (err) {
      return res.status(401).json({ error: 'Erro ao cadastrar o grupo' });
    }
  },

  async update(req, res) {
    // Denição do padrão de objeto com Yup.
    const schema = Yup.object().shape({
    name: Yup.string()
      .required()
      .min(4),
    description: Yup.string(),
    limit: Yup.number()
      .required()
    });

    // Validação de campos com o Yup.
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Falha na validação dos dados.' });
    }

    const { name, activity, description, limit } = req.body;
    const leader = req.userId;
    const { id } = req.params;

    try {
      try {
        // Verificando se o grupo existe
        const group = await Group.findOne({ _id: id, leader });
        if (!group) {
          return res.status(401).json({ error: 'O grupo não foi encontrado.' });
        }
      } catch (err) {
        return res.status(401).json({ error: 'O ID do grupo esta no formato inválido' });
      }

      const group = await Group.findOne({ _id: id, leader });
      group.name = name;
      group.description = description;
      group.limit = limit;

      await group.save();

      return res.json(group);

    } catch (err) {
      return res.status(400).json({ error: 'Erro ao atualizar o grupo' });
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
        const group = await Group.findOne({ _id: id, leader: req.userId });
        if (!group) {
          return res.status(401).json({ error: 'O grupo não foi encontrado ou você não é o lider do grupo.' });
        }

      } catch (err) {
        return res.status(401).json({ error: 'O ID do grupo esta no formato inválido' });
      }

      await GroupUser.deleteMany({ group: id });

      const response = await Group.deleteOne({ _id: id, leader: req.userId });

      return res.json(response);

    } catch (err) {
      return res.status(400).json({ error: 'Erro ao remover o grupo e seus usuários' });
    }

  }

};

