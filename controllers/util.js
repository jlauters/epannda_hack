// util.js
var request = require('request'),
    async   = require('async');

module.exports = {

    sortByKey: function(array, key) {
        return array.sort(function(a, b) {
            var x = a[key];
            var y = b[key];

            return ( (x > y) ? -1 : ((x < y) ? 1 : 0) );
        });
    },

    syntaxHighlight: function(json) {

        // type conversion
        if( typeof json != 'string' ) { json = JSON.stringify(json, undefined, 2); }

        json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {

            var cls = 'number';
      
            if(/^"/.test(match)) {
                if(/:$/.test(match)) { cls = 'key'; }
                else { cls = 'string'; }
            } else if(/true|false/.test(match)) {
                cls = 'boolean';
            } else if(/null/.test(match)) {
                cls = 'null';
            }
  
            return '<span class="' + cls + '">' + match + '</span>';
        });
    },

    match_results: function(pbdb, idigbio, callback) {

        for( var idx in idigbio ) {

            // initialize scorable match fields
            var uuid        = idigbio[idx].uuid;
            var sciNameAuth = idigbio[idx].data['dwc:scientificNameAuthorship'];
 
            // break out scientific name authorship from publish date
            var sciNameAuthDate = '';
            if( undefined != sciNameAuth ) {
                var sciNameParts = sciNameAuth.split(' ');
                sciNameAuth     = sciNameParts[0];
                sciNameAuthDate = sciNameParts[1];
            }

            var identRemarks     = idigbio[idx].data['dwc:identificationRemarks'];
            var recordedBy       = idigbio[idx].data['dwc:recordedBy'];
            var biblioCitation   = idigbio[idx].data['dcterms:bibliographicCitation'];
            var eventDate        = idigbio[idx].data['dwc:eventDate'];
            var occurrenceRemark = idigbio[idx].data['dwc:occurrenceRemarks'];
            var associatedRef    = idigbio[idx].data['dwc:associatedReferences'];
            var identRef         = idigbio[idx].data['dwc:identificationReferences'];
            var scientificName   = idigbio[idx].data['dwc:scientificName'];
            var order            = idigbio[idx].data['dwc:order'];
            var stateProvince    = idigbio[idx].data['dwc:stateProvince'];
            var locality         = idigbio[idx].data['dwc:locality']; 

            for( var pidx in pbdb ) {
                var score = 0;
                var matched_on = [];

                if( 0 < pbdb[pidx].auth1.indexOf( sciNameAuth ) ) {
                    console.log('Scientific Name Author: ' + sciNameAuth + ' matched PBDB  record (auth1): ' + pbdb[pidx].oid);
                    matched_on.push( 'SciNameAuth - auth1' );
                    process.exit();
                }
                if ( 0 < pbdb[pidx].auth2.indexOf( sciNameAuth ) ) {
                    console.log('Scientific Name Author: ' + sciNameAuth + ' matched PBDB record (auth2): ' + pbdb[pidx].oid);
                    matched_on.push( 'SciNameAuth - auth2' );
                    process.exit();
                }
                if ( 0 < pbdb[pidx].oauth.indexOf( sciNameAuth ) ) {
                    console.log('Scientific Name Author: ' + sciNameAuth + ' matched PBDB record (oauth): ' + pbdb[pidx].oid);
                    matched_on.push( 'SciNameAuth - oauth' );
                    process.exit();
                }
                if ( 0 < pbdb[pidx].auth1.indexOf( recordedBy ) ) {
                    console.log('Recorded By: ' + recordedBy + ' matched PBDB record (auth1): ' + pbdb[pidx].oid);
                    matched_on.push( 'recordedBy - auth1');
                    process.exit();
                }
                if ( 0 < pbdb[pidx].auth2.indexOf( recordedBy ) ) {
                    console.log('Recorded By: ' + recordedBy + ' matched PBDB record (auth2): ' + pbdb[pidx].oid);
                    matched_on.push( 'recordedBy - auth2');
                    process.exit();
                }
                if ( 0 < pbdb[pidx].oauth.indexOf( recordedBy ) ) {
                    console.log('Recorded By: ' + recordedBy + ' matched PBDB record (oauth): ' + pbdb[pidx].oid);
                    matched_on.push( 'recordedBy - oauth');
                    process.exit();
                }
                if ( 0 < pbdb[pidx].auth1.indexOf( identRemarks ) ) {
                    console.log('Ident Remarks: ' + identRemarks + ' matched PBDB record (auth1): ' + pbdb[pidx].oid);
                    matched_on.push( 'identRemarks - auth1');
                    process.exit();
                }
                if ( 0 < pbdb[pidx].auth2.indexOf( identRemarks ) ) {
                    console.log('Ident Remarks: ' + identRemarks + ' matched PBDB record (auth2): ' + pbdb[pidx].oid);
                    matched_on.push( 'identRemarks - auth2');
                    process.exit();
                }
                if ( 0 < pbdb[pidx].oauth.indexOf( identRemarks ) ) {
                    console.log('Ident Remarks: ' + identRemarks + ' matched PBDB record (oauth): ' + pbdb[pidx].oid);
                    matched_on.push( 'identRemarks - oauth');
                    process.exit();
                }
                if ( 0 < pbdb[pidx].title.indexOf( scientificName ) ) {
                    console.log('Scientific Name: ' + scientificName + ' matched PBDB record (title): ' + pbdb[pidx].oid);
                    matched_on.push( 'ScientificName - title');
                    process.exit();
                }
                if ( 0 < pbdb[pidx].publication.indexOf( scientificName ) ) {
                    console.log('Scientific Name: ' + scientificName + ' matched PBDB record ( PubTitle): ' + pbdb[pidx].oid);
                    matched_on.push( 'ScientificName - publication');
                    process.exit();
                }
                if ( 0 < pbdb[pidx].title.indexOf( order ) ) {
                    matched_on.push( 'Order - title');
                    score = score + 1; 
                }
                if ( 0 < pbdb[pidx].publication.indexOf( order ) ) {
                    matched_on.push( 'Order - publication');
                    score = score + 1;
                }
                if ( 0 < pbdb[pidx].title.indexOf( locality ) ) {
                    matched_on.push( 'Locality - title');
                    score = score + 1;
                }
                if ( 0 < pbdb[pidx].publication.indexOf( locality ) ) {
                    matched_on.push( 'Locality - publication');
                    score = score + 1;
                }
                if ( 0 < pbdb[pidx].title.indexOf( stateProvince ) ) {
                    matched_on.push( 'State/Province - title');
                    score = score + 1;
                } 
                if ( 0 < pbdb[pidx].publication.indexOf( stateProvince ) ) {
                    matched_on.push( 'State/Province - publication');
                    score = score + 1;
                }
                if ( parseInt( pbdb[pidx].year ) >= parseInt( sciNameAuthDate ) ) {
                    matched_on.push( 'PBDB Date > SciNameAuthDate');
                    score = score + 1;
                }

                // if 1 < score = 26,000 matches. if 2 < score 550 matches.
                if( 2 < score ) {

                    var match = {
                        "pbdb": pbdb[pidx],
                        "pbdb_obj": pbdb[pidx],
                        "pbdb_link": "https://paleobiodb.org/data1.1/refs/single.json?id=" + pbdb[pidx].oid + "&show=both",
                        "idigbio_link": "http://search.idigbio.org/v2/view/records/" + uuid,
                        "idigbio": {
                            "order": order,
                            "scientificName": scientificName,
                            "recordedBy": recordedBy,
                            "identRemarks": identRemarks,
                            "SciNameAuthor": sciNameAuth,
                            "SciNameAuthorDate": sciNameAuthDate,
                            "biblioCitation": biblioCitation,
                            "eventDate": eventDate,
                            "occurrenceRemark": occurrenceRemark,
                            "associatedReferences": associatedRef,
                            "identRef": identRef,
                            "locality": locality,
                            "stateProvince": stateProvince
                        },
                        "score": score,
                        "matched_on": matched_on.toString()
                    };
  
                    matches.push( match );
                }
            }
        }

        // Send Matched Array of PBDB and iDigBio to next stet ( BHL lookup )
        sorted = module.exports.sortByKey(matches, 'score');
        callback(null, sorted);
    },

    deep_match: function( pbdb, idigbio ) {

        async.waterfall([
            async.apply(this.match_results, pbdb, idigbio),
            // match pbdb title to BHL
            function(data, callback) {
                var pb_title = '';
                for( var i = 0; i <= 2; i++) {

                    var pb_title = data[i].pbdb.publication;

                    console.log('PB Title: ' + pb_title);

                    request.get('http://localhost:3000/bhl_title/' + encodeURIComponent( pb_title ), function(err, res, body) {
                        if(!err && res.statusCode == 200) {
                            var results = JSON.parse( body );
                            callback(null, results.title_id );
                        }
                    });
                }
            },
            function(title_id, callback) {
                request.get('http://localhost:3000/bhl_title_items/' + title_id, function(err, res, body) {
                    if(!err && res.statusCode == 200) {
                        var results = JSON.parse( body );
                        var item_id = results.Result.ItemID;
                        callback(null, item_id);
                    }
                });
            },
            function(item_id, callback) {
                request.get('http://localhost:3000/bhl_item_meta/' + item_id, function(err, res, body) {
                    if(!err && res.statusCode == 200) {
                        var results = JSON.parse( body );
                        console.log('now we need to look through OCR Results to match more iDigBIo Fields'); 
                    }
                });
            }
        ], function(error, result) {
            if(error) {
                console.log(error);
            } else {
                // Success Case
                // Display results?
                console.log('weeeeee');
            }
        });


    },
};
