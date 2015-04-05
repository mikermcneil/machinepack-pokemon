module.exports = {


  friendlyName: 'List all Pokemon',


  description: 'List the name and resource_uri for each known Pokemon.',


  extendedDescription: '',


  moreInfoUrl: 'http://pokeapi.co/docs/#pokedex',


  inputs: {

  },


  defaultExit: 'success',


  exits: {

    error: {
      description: 'Unexpected error occurred.',
    },

    success: {
      description: 'Done.',
    },

  },


  fn: function (inputs,exits) {

    var Http = require('machinepack-http');

    // Send an HTTP request and receive the response.
    Http.sendHttpRequest({
      url: '/pokedex/1',
      baseUrl: 'http://pokeapi.co/api/v1'
    }).exec({
      // An unexpected error occurred.
      error: function(err) {
        return exits.error(err);
      },
      // OK.
      success: function(result) {

        var pokemons;
        try {
          var parsedResponse = JSON.parse(result.body);
          pokemons = parsedResponse.pokemon;
        }
        catch (e) {
          return exits.error(e);
        }

        return exits.success(pokemons);
      },
    });

  },



};
