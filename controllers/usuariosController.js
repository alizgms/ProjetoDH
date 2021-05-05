const { Usuario } = require('../models');
const bcrypt = require('bcryptjs');
const { v4: uuid } = require('uuid');

const usuariosController = {
  // Renderiza tela de cadastro do usuário
  signup: (request, response) => {
    return response.render('cadastro');
  },
  logoff: (request, response) => {
    request.session.destroy();

    return response.redirect('/');
  },
  // Renderiza perfil do usuário
  profile: (request, response) => {
    return response.render('telaUsuario');
  },

  // Renderiza tela de login
  login: (request, response) => {
    return response.render('login');
  },

  index: async (request, response) => {
    const usuarios = await Usuario.findAll();

    return response.status(200).send({ usuarios });
  },

  // Cadastra usuario
  store: async (request, response) => {
    const { nome, email, senha } = request.body;

    const usuario = {
      id: uuid(),
      nome,
      email,
      senha,
    };

    await Usuario.create(usuario);

    usuario.senha = undefined;

    return response.redirect('/categorias/produtos');
  },

  // Autentica login do usuario
  auth: async (request, response) => {
    const { email, senha, loginStatus } = request.body;

    const usuario = await Usuario.findOne({ where: { email } });

    if (!usuario || !bcrypt.compareSync(senha, usuario.senha)) {
      return response
        .status(400)
        .json({ status: 0, message: 'E-email ou senha incorretos!' });
    }

    const usuario_id = usuario.id;

    await Usuario.update(
      {
        loginStatus: 1,
      },
      {
        where: {
          id: usuario_id,
        },
      }
    );

    // console.log(token);

    request.session.usuarioLogado = usuario;
    return response.redirect('/categorias/produtos');
  },

  delete: async (request, response) => {
    const { id } = request.params;

    await Usuario.destroy({
      where: {
        id,
      },
    });
    return response.status(201).send();
  },
};

module.exports = usuariosController;
