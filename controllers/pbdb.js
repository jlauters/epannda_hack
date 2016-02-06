// pbdb.js

var request  = require('request'),
    idigbio = require('./idigbio.js');


module.exports = function(app) {

    return {
        parseResults: function(req, res, callback) { //function(err, response, body) {

            console.log('pbdb parseResults ... ');

            if(!err && response.statusCode == 200) {
        
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

               console.log('pbdb results: ' + pbdb_results.length);
               res.write("<p>PBDB Results: " + pbdb_results.length + "</p>");

               // Callback will take pbdb_results.
               //idigbio.matchPBDB( pbdb_results );
            }    
        }
    }    
};
