const jwt = require('jsonwebtoken');
const Yup = require('yup');
const bcrypt = require('bcryptjs');

const User = require('../models/User');
const authConfig = require('../../config/auth');

function generateToken(params = {}) {
  return jwt.sign(params, authConfig.secret, {
    expiresIn: authConfig.expiredsIn,
  });
}

module.exports = {
  async store(req, res) {
    // Denição do padrão de objeto com Yup.
    const schema = Yup.object().shape({
      name: Yup.string()
        .required()
        .min(4),
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string()
        .required()
        .min(6),
    });

    // Validação de campos com o Yup.
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Falha na validação dos dados.' });
    }

    const { name, email, password } = req.body;

    try {

      // Verificando se já existe usuário com este e-mail
      if (await User.findOne({ email })) {
        return res.status(400).json({ error: 'Este e-mail já esta sendo utilizado.' });
      }

      const user = await User.create({
        name,
        email,
        password
      });

      user.password = undefined;

      return res.json({
        user,
        token: generateToken({ id: user.id }),
      });

    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  },

  async update(req, res) {
    // Denição do padrão de objeto com Yup.
    const schema = Yup.object().shape({
      name: Yup.string()
        .required()
        .min(6),
      email: Yup.string()
        .email()
        .required(),
      oldPassword: Yup.string()
        .min(6),
      password: Yup.string()
        .min(6)
        .when('oldPassword', (oldPassword, field) =>
          oldPassword ? field.required() : field
        ),
      confirmPassword: Yup.string()
        .when('password', (password, field) =>
        password ? field.required().oneOf([Yup.ref('password')]) : field
      ),
    });

    // Validação de campos com o Yup.
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Falha na validação dos dados.' });
    }

    const { name, email, oldPassword, confirmPassword } = req.body;
    const id = req.userId;

    const user = await User.findOne({ _id: id }).select('+password');

    // Verificando se usuário irá alterar email.
    if (email !== user.email) {
      return res.status(400).json({ error: 'Não é possível alterar o e-mail da conta.' });
    }

    // Faz apenas a verificacao caso o usuario queira mudar a senha antiga.
    if (!await bcrypt.compare(oldPassword, user.password)) {
      return res.status(401).json({ error: 'A senha antiga não é a mesma que a senha atual.' });
    }

    user.password = confirmPassword;
    user.name = name;

    await user.save();

    user.password = undefined;

    return res.json(user);

  },

  async session (req, res) {
    // Denição do padrão de objeto com Yup.
    const schema = Yup.object().shape({
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string().required(),
    });

    // Validação de campos com o Yup.
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Falha na validação dos dados.' });
    }

    const { email, password } = req.body;

    try {

      const user = await User.findOne({ email }).select('+password').select('+image');

      if (!user) {
        return res.status(401).json({ error: 'Usuário não foi encontrado.' });
      }

      if (!await bcrypt.compare(password, user.password)) {
        return res.status(401).json({ error: 'A senha esta incorreta.' });
      }

      console.log(user)

      user.password = undefined;

      const { id, name, image } = user;

      return res.json({
        user: {
          id,
          name,
          email,
          image
        },
        token: generateToken({ id: user.id }),
      });

    } catch (err) {
      return res.status(400).json({ error: 'Falha ao criar a sessão.' });
    }
  },
  async updateImg(req, res) {
    // Denição do padrão de objeto com Yup.
    const schema = Yup.object().shape({
      filenameHex: Yup.string()
        .required()
    });

    // Validação de campos com o Yup.
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Falha na validação dos dados.' });
    }

    const { filenameHex } = req.body;
    const id = req.userId;

    const user = await User.findOne({ _id: id }).select('+password');

    user.image = filenameHex;

    await user.save();

    return res.json(user);

  },

};

