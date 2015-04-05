module.exports = {


  friendlyName: 'Get Pokemon',


  description: 'Get information about a Pokemon based on its unique ID number',


  extendedDescription: '',


  inputs: {

    id: {
      description: 'The unique id for a Pokemon',
      example: 1,
      required: true
    }
  },


  defaultExit: 'success',


  exits: {

    error: {
      description: 'Unexpected error occurred.',
    },

    success: {
      description: 'Done.',
      example: {
        name: 'Bulbasaur',
        types: ['poison', 'grass']
      }
    },

  },


  fn: function (inputs,exits) {

    var _ = require('lodash');
    var Http = require('machinepack-http');

    // Send an HTTP request and receive the response.
    Http.sendHttpRequest({
      url: '/pokemon/'+inputs.id,
      baseUrl: 'http://pokeapi.co/api/v1'
    }).exec({
      // An unexpected error occurred.
      error: function(err) {
        return exits.error(err);
      },
      // OK.
      success: function(result) {

        var pokemon;
        try {
          var parsedResponse = JSON.parse(result.body);
          pokemon = {
            name: parsedResponse.name,
            types: _.pluck(parsedResponse.types, 'name')
          };
        }
        catch (e) {
          return exits.error(e);
        }

        return exits.success(pokemon);
      },
    });
  },



};
