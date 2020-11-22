
const Yup = require('yup');
const Location = require('../models/Location');
const parseStringAsArray = require('../utils/parseStringAsArray');

module.exports = {
  async index(request, response) {
    const locations = await Location.find();

    return response.json(locations);
  },
  
  async store(request, response) {
    // Denição do padrão de objeto com Yup.
    const schema = Yup.object().shape({
    address: Yup.string()
      .required(),
    hourIni: Yup.date()
      .required(),
    hourFim: Yup.date()
      .required(),
    latitude: Yup.number()
      .required(),
    longitude: Yup.number()
      .required()
    });

    // Validação de campos com o Yup.
    if (!(await schema.isValid(request.body))) {
        return response.status(400).json({ error: 'Falha na validação dos dados.' });
    }

    const { address, hourIni, hourFim, latitude, longitude } = request.body;
  
    const locationPoint = {
      type: 'Point',
      coordinates: [longitude, latitude],
    };
  
    location = await Location.create({
      address,
      hourIni,
      hourFim,
      location: locationPoint
    });

    return response.json(location);
  }
};