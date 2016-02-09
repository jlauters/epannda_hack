// idigbio.js

var request = require('request');

module.exports = function(app, config) {

    return {

        search: function(req, res, callback) {
 
            matches = [];
            var scientific_name = req.params.scientific_name;
            var state_province =  req.params.state_province;

            var options = {
                url: "http://search.idigbio.org/v2/search/records/",
                json: true,
                headers: { 'Content-Type': 'application/json' },
                body: {
                    "rq": { "order": scientific_name, "stateprovince": state_province }
                }
            };    

            request.post(options, function(error, response, body) {
                if(!error && response.statusCode == 200) {

                   var idigbio_results = body.items;

                   res.setHeader('Content-Type', 'application/json');
                   res.send( JSON.stringify(idigbio_results, 0, 4) );

               }
            });
        },
    }
}
