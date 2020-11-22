
const Yup = require('yup');
const Schedule = require('../models/Schedule');
const Group = require('../models/Group');

module.exports = {
  async index(request, response) {
    const schedules = await Schedule.find().sort('-date').populate({
      path: 'group',
      populate: {
        path: 'activity',
        model: 'Activity'
      }
    }).populate({
      path: 'group',
      populate: {
        path: 'leader',
        model: 'User'
      }
    }).populate('location');

    return response.json(schedules);
  },

  async indexGroup(request, response) {
    // Denição do padrão de objeto com Yup.
    const schema = Yup.object().shape({
      group: Yup.string()
          .required()
          .min(24)
      });
  
      // Validação de campos com o Yup.
      if (!(await schema.isValid(request.params))) {
          return response.status(400).json({ error: 'Falha na validação dos dados.' });
      }

    const { group } = request.params;

    const schedules = await Schedule.find({ group }).populate({
      path: 'group',
      populate: {
        path: 'activity',
        model: 'Activity'
      }
    }).populate({
      path: 'group',
      populate: {
        path: 'leader',
        model: 'User'
      }
    }).populate('location');

    return response.json(schedules);
  },
  
  async store(req, res) {
    // Denição do padrão de objeto com Yup.
    const schema = Yup.object().shape({
    group: Yup.string()
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
      .required()
    });

    // Validação de campos com o Yup.
    if (!(await schema.isValid(req.body))) {
        return res.status(400).json({ error: 'Falha na validação dos dados.' });
    }

    const { group, date, hourIni, hourFim, location } = req.body;
    
    try {

        try {
          // Verificando se o grupo já possui agendamento para este horário
          const sch = await Schedule.findOne({ group, hourIni, hourFim });
          if (sch) {
            return res.status(401).json({ error: 'O grupo já possui agendamento neste horário.' });
          }
        } catch (err) {
          return res.status(401).json({ error: 'O ID do grupo ou do local esta no formato inválido' });
        }
  
        schedule = await Schedule.create({
            group,
            location,
            date,
            hourIni,
            hourFim
          });
  
        return res.json(schedule);
  
      } catch (err) {
        return res.status(401).json({ error: 'Erro ao cadastrar o agendamento do grupo' });
      }
  },

  async update(req, res) {
    // Denição do padrão de objeto com Yup.
    const schema = Yup.object().shape({
    location: Yup.string()
      .required()
      .min(24),
    date: Yup.date()
      .required(),
    hourIni: Yup.number()
      .required(),
    hourFim: Yup.number()
      .required()
    });

    // Validação de campos com o Yup.
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Falha na validação dos dados.' });
    }

    const { date, hourIni, hourFim, location } = req.body;
    const user = req.userId;
    const { id } = req.params;

    try {
      try {
        // Verificando se o grupo existe
        const sche = await Schedule.findOne({ _id: id });
        const gp = await Group.findOne({ _id: sche.group })
        if (!sche) {
          return res.status(401).json({ error: 'O aviso não foi encontrado.' });
        }
        if (user != gp.leader) {
          return res.status(401).json({ error: 'Você não tem permissão para editar este agendamento.' });
        }
      } catch (err) {
        return res.status(401).json({ error: 'O ID do agendamento esta no formato inválido' });
      }

      const schedule = await Schedule.findOne({ _id: id });
      schedule.location = location;
      schedule.date = date;
      schedule.hourIni = hourIni;
      schedule.hourFim = hourFim;

      await schedule.save();

      return res.json(schedule);

    } catch (err) {
      return res.status(400).json({ error: 'Erro ao atualizar o agendamento' });
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
        const schedule = await Schedule.findOne({ _id: id });
        if (!schedule) {
          return res.status(401).json({ error: 'O agendamento não foi encontrado.' });
        }

      } catch (err) {
        return res.status(401).json({ error: 'O ID do agendamento esta no formato inválido' });
      }

      const response = await Schedule.deleteOne({ _id: id });

      return res.json(response);

    } catch (err) {
      return res.status(400).json({ error: 'Erro ao remover o agendamento' });
    }

  }
};