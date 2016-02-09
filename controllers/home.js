"use strict";

var request = require('request'),
    async   = require('async'),
    util    = require('./util.js'),
    http    = require('http');

module.exports = function(app, config) {

    return {
        index: function(req, res, next) {

             async.parallel({
                 // PBDB Call
                 pbdb: function(callback) {
                 
                     // REQUEST to PBDB API
                     request.get('http://localhost:3000/pbdb_lookup/coleoptera', function(err, res, body) {
                         if(!err && res.statusCode == 200) {
                             console.log('pbdb done');
                             callback(null, JSON.parse(body));
                         } else {
                             callback(true, err);
                         }
                     });
                 },
                 // iDigBio Call
                 idigbio: function(callback) {

                     // REQUEST to iDigBio API
                     request.get('http://localhost:3000/idigbio_lookup/coleoptera/colorado', function(err, res, body) {
                         if(!err && res.statusCode == 200) {
                             console.log('idigbio done');
                             callback(null, JSON.parse(body));
                         } else {
                             callback(true, err);
                         }
                     });
                 }
             }, function(err, results) {

                 if(!err) { 
 
                     // Now we need to match PBDB and iDigBio
                     // Send matched array to BHL Calls
                     util.deep_match( results.pbdb, results.idigbio );

                 } else {
                     console.log('Async Error!!!! ');
                     console.log(results);
                 }

                 //res.write('ePANNDA Matching Complete.');
                 //res.end();
             });

        }
    }
};
