const Yup = require('yup');
const Activity = require('../models/Activity');

module.exports = {
  async index(req, res) {
    const activitys = await Activity.find();

    return res.json(activitys);
  },

  async indexOne(req, res) {
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

    const activitys = await Activity.findOne({ _id: id });

    return res.json(activitys);
  },
  
  async store(req, res) {
    // Denição do padrão de objeto com Yup.
    const schema = Yup.object().shape({
    name: Yup.string()
        .required()
    });

    // Validação de campos com o Yup.
    if (!(await schema.isValid(req.body))) {
        return res.status(400).json({ error: 'Falha na validação dos dados.' });
    }

    const { name } = req.body;

    try {

        const activity = await Activity.create({
            name
        });

        return res.json(activity);

    } catch (err) {
        return res.status(400).json({ error: err.message });
    }
  },

  async update(req, res) {
    // Denição do padrão de objeto com Yup.
    const schema = Yup.object().shape({
    name: Yup.string()
        .required()
    });

    // Validação de campos com o Yup.
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Falha na validação dos dados.' });
    }

    const { name } = req.body;
    const { id } = req.params;

    const activity = await Activity.findOne({ _id: id });

    activity.name = name;

    await activity.save();

    return res.json(activity);

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
        const activity = await Activity.findOne({ _id: id });
        if (!activity) {
          return res.status(401).json({ error: 'A atividade não foi encontrada ou você não tem permissão.' });
        }

      } catch (err) {
        return res.status(401).json({ error: 'O ID da atividade esta no formato inválido' });
      }

      const response = await Activity.deleteOne({ _id: id });

      return res.json(response);

    } catch (err) {
      return res.status(400).json({ error: 'Erro ao remover a atividade' });
    }

  }

};

