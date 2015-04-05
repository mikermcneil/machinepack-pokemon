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
        types: ['poison', 'grass'],
        imageUrl: 'http://pokeapi.co/api/v1/sprite/1/media/img/1383395659.12.png'
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
        var spriteId;
        try {
          var parsedResponse = JSON.parse(result.body);
          pokemon = {
            name: parsedResponse.name,
            types: _.pluck(parsedResponse.types, 'name')
          };
          // Ensure that a sprite id exists
          if (!parsedResponse.sprites[0] || !_.isObject(parsedResponse.sprites[0])) {
            return exits.error(new Error('No sprite URL available for this pokemon.'));
          }
          spriteId = +(parsedResponse.sprites[0].resource_uri.match(/sprite\/([0-9]+)/)[1]);
        }
        catch (e) {
          return exits.error(e);
        }

        // Fetch the primary image url for this pokemon
        // using the 'sprites' that were provided.
        Http.sendHttpRequest({
          url: '/sprite/' + spriteId,
          baseUrl: 'http://pokeapi.co/api/v1'
        }).exec({
          // An unexpected error occurred.
          error: function(err) {
            return exits.error(err);
          },
          // OK.
          success: function(result) {
            try {
              var parsedSpriteResponse = JSON.parse(result.body);
              // Note that we strip the leading slash, and ensure that one exists.
              var spriteImageUrl = 'http://pokeapi.co/' + parsedSpriteResponse.image.replace(/^\//, '');

              // Now set the pokemon imageUrl using the relevant info from the
              // parsed sprite response.
              pokemon.imageUrl = spriteImageUrl;
            }
            catch (e) {
              return exits.error(e);
            }

            return exits.success(pokemon);
          }
        });
      },
    });
  },



};
