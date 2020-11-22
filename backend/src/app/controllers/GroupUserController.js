
const Yup = require('yup');
const Group = require('../models/Group');
const User = require('../models/User');
const GroupUser = require('../models/GroupUser');

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

    const groupUsers = await GroupUser.find({ group }).populate('user');

    return res.json(groupUsers);
  },

  async indexUser(req, res) {
    const groups = await GroupUser.find({ user: req.userId }).populate({
      path: 'group',
      populate: {
        path: 'leader',
        model: 'User'
      }
    }).populate({
      path: 'group',
      populate: {
        path: 'activity',
        model: 'Activity'
      }
    }).populate('user');
    
    return res.json(groups);
  },

  async qtdUsersGroup(req, res) {
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

    const qtd = await GroupUser.find({ group }).count();

    const response = {
      qtd
    }

    return res.json(response);
  },
  
  async store(req, res) {
    // Denição do padrão de objeto com Yup.
    const schema = Yup.object().shape({
    group: Yup.string()
        .required(),
    user: Yup.string()
        .required()
    });

    // Validação de campos com o Yup.
    if (!(await schema.isValid(req.body))) {
        return res.status(400).json({ error: 'Falha na validação dos dados.' });
    }

    const { group, user } = req.body;

    try {

      try {
        // Verificando se o grupo existe
        const grp = await Group.findOne({ _id: group });
        if (!grp) {
          return res.status(401).json({ error: 'Grupo não foi encontrado.' });
        }
      } catch (err) {
        return res.status(401).json({ error: 'O ID do grupo esta no formato inválido' });
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
        const grpUsr = await GroupUser.findOne({ group, user });
        if (grpUsr) {
          return res.status(401).json({ error: 'Usuário já esta cadastrado para esse grupo.' });
        }
      } catch (err) {
        return res.status(401).json({ error: 'O ID do usuário ou do grupo esta no formato inválido' });
      }

      const groupUser = await GroupUser.create({
        group,
        user
      });

      return res.json(groupUser);

    } catch (err) {
      return res.status(401).json({ error: 'Erro ao cadastrar o usuário para o grupo indicado' });
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
        const group = await GroupUser.findOne({ group: id, user: req.userId });
        if (!group) {
          return res.status(401).json({ error: 'O grupo não foi encontrado ou você não participa do grupo.' });
        }

      } catch (err) {
        return res.status(401).json({ error: 'O ID do grupo esta no formato inválido' });
      }

      const response = await GroupUser.deleteOne({ group: id, user: req.userId });

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
        const group = await GroupUser.findOne({ _id: id });
        const gp = await Group.findOne({ _id: group.group, leader: group.user });
        if (!group) {
          return res.status(401).json({ error: 'Não foi encontrado o usuário para este grupo.' });
        }
        if (gp) {
          return res.status(401).json({ error: 'Você não pode remover o lider do grupo' });
        }

      } catch (err) {
        return res.status(401).json({ error: 'O ID do usuário para o grupo esta no formato inválido' });
      }

      const response = await GroupUser.deleteOne({ _id: id });

      return res.json(response);

    } catch (err) {
      return res.status(400).json({ error: 'Erro ao remover o usuário o grupo' });
    }

  }

};


