// pbdb.js

var request  = require('request');

module.exports = function(app, config) {

    return {

        taxon_lookup: function(req, res, callback) {
 
            var base_name = req.params.taxon;
            var pbdb_options = { url: 'https://paleobiodb.org/data1.2/taxa/refs.json?base_name=' + base_name + '&textresult' };

            var PBDB_request = request.get(pbdb_options, function(error, response, body) {
                if(!error && response.statusCode == 200) {

                    var pbdb_results = [];
                    var json = JSON.parse(body);
                    for( var idx in json.records) {
                        if( undefined !== json.records[idx].tit ) {
                            var auth1       = '';
                            var auth2       = '';
                            var oauth       = '';
                            var publication = '';

                            if( undefined !== json.records[idx].al1 ) { auth1 = json.records[idx].al1; }
                            if( undefined !== json.records[idx].al2 ) { auth2 = json.records[idx].al2; }
                            if( undefined !== json.records[idx].oau ) { oauth = json.records[idx].oau; }
                            if( undefined !== json.records[idx].pbt ) { publication = json.records[idx].pbt; }

                            var pbdb_obj = {
                                'oid': json.records[idx].oid.replace('ref:', ''),
                                'auth1': auth1,
                                'auth2': auth2,
                                'oauth': oauth,
                                'title': json.records[idx].tit,
                                'publication': publication,
                                'year': json.records[idx].pby,
                                'volume': json.records[idx].vol         
                            };
                
                            pbdb_results.push( pbdb_obj );
                        }
                   }

                   // Send off PBDB results to next step
                   //callback( pbdb_results );

                   // This Dumps JSON to string. I think we want to Callback to iDigBio function.
                   res.setHeader('Content-Type', 'application/json');
                   res.send( JSON.stringify(pbdb_results, 0, 4) );
               } else {
                   console.log('PBDB GET Error!');
                   console.log(error);
               }
            });
        }
    }    
};
