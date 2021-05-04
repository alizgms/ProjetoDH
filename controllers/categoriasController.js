const { Categoria, Produto } = require('../models');

const categoriasController = {
  index: async (request, response) => {
    const categoria = await Categoria.findAll({
      include: { model: Produto, as: 'produtos' },
    });

    return response.render('produtos', { listProducts: categoria });
  },

  store: async (request, response) => {
    const { nome } = request.body;

    await Categoria.create({ nome });

    return response.status(201).json(nome);
  },
};

module.exports = categoriasController;
