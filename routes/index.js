
/*
 * GET home page.
 */

var http    = require('http'),
    request = require('request'),
    util    = require('../controllers/util.js'),
    pbdb    = require('../controllers/pbdb.js'),
    idigbio = require('../controllers/idigbio.js'),
    bhl     = require('../controllers/bhl.js');
    

exports.index = function(req, res) { res.send("Index Hit"); }

exports.biblio = function(req, res) {

    //pbdb     = []; 
    //dig_hits = [];
    //matches  = [];

    var pbdb_options = { url: 'https://paleobiodb.org/data1.2/taxa/refs.json?base_name=coleoptera&textresult' };
    request.get(pbdb_options, pbdb.parseResults);

    console.log( ' ... seeing what we broke ');

    process.exit();


    var PBDB_request = request.get(pbdb_options, function(error, response, body) {
        if(!error && response.statusCode == 200) {

            // Look up Occurance in iDigBio
            var dig_options = {
                url: "http://search.idigbio.org/v2/search/records/",
                json: true,
                headers: { 'Content-Type': 'application/json' },
                body: {
                    "rq": { "order": "coleoptera", "stateprovince": "colorado"},
                }
            };

            var json = JSON.parse(body);
            for( var idx in json.records) {

                if( undefined !== json.records[idx].tit ) {

                    var auth1 = '';
                    if( undefined !== json.records[idx].al1 ) { auth1 = json.records[idx].al1; }

                    var auth2 = '';
                    if( undefined !== json.records[idx].al2 ) { auth2 = json.records[idx].al2; }

                    var oauth = '';
                    if( undefined !== json.records[idx].oau ) { oauth = json.records[idx].oau; }                    

                    var publication = '';
                    if( undefined !== json.records[idx].pbt ) { publication = json.records[idx].pbt; } 

                    var pbdb_obj = {
                       'auth1': auth1,
                       'auth2': auth2,
                       'oauth': oauth,
                       'title': json.records[idx].tit,
                       'year':  json.records[idx].pby,
                       'publication': publication,
                       'volume': json.records[idx].vol,
                       'oid': json.records[idx].oid.replace('ref:', '')
                    };

                    pbdb.push( pbdb_obj );
                }
            }       

            request.post(dig_options, function(error, response, body) {
                if(!error && response.statusCode == 200) {

                    dig_hits = response.body.items;
                    for( var dig_idx in dig_hits) {

                        // iDigBio ( mostly Darwin Core ) fields as potential mappable to PBDB
                        uuid             = dig_hits[dig_idx].uuid;
                        sciNameAuth      = dig_hits[dig_idx].data['dwc:scientificNameAuthorship'];

                        // usually contains auther last name and a publication? date
                        sciNameAuthDate  = '';
                        if( undefined != sciNameAuth ) {
                            sciNameParts = sciNameAuth.split(' ');
                            sciNameAuth      = sciNameParts[0];
                            sciNameAuthDate  = sciNameParts[1];
                        }

                        identRemarks     = dig_hits[dig_idx].data['dwc:identificationRemarks'];
                        recordedBy       = dig_hits[dig_idx].data['dwc:recordedBy'];
                        biblioCitation   = dig_hits[dig_idx].data['dcterms:bibliographicCitation'];
                        eventDate        = dig_hits[dig_idx].data['dwc:eventDate'];
                        occurrenceRemark = dig_hits[dig_idx].data['dwc:occurrenceRemarks'];
                        associatedRef    = dig_hits[dig_idx].data['dwc:associatedReferences'];
                        identRef         = dig_hits[dig_idx].data['dwc:identificationReferences']; 
                        scientificName   = dig_hits[dig_idx].data['dwc:scientificName'];
                        order            = dig_hits[dig_idx].data['dwc:order'];
                        stateProvince    = dig_hits[dig_idx].data['dwc:stateProvince'];
                        locality         = dig_hits[dig_idx].data['dwc:locality'];
                      
                        // look for match in PBDB data arrays
                        for( var pidx in pbdb ) {

                            score = 0;
                            matched_on = [];

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
                                    "pbdb": util.syntaxHighlight( pbdb[pidx] ),
                                    "pbdb_obj": pbdb[pidx],
                                    "pbdb_link": "https://paleobiodb.org/data1.1/refs/single.json?id=" + pbdb[pidx].oid + "&show=both",
                                    "idigbio_link": "http://search.idigbio.org/v2/view/records/" + uuid,
                                    "idigbio": util.syntaxHighlight( {
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
                                    } ),
                                    "score": score,
                                    "matched_on": matched_on.toString()
                                };
  
                                matches.push( match );
                            }

                        } // END PBDB Loop
                    } // END iDigBio Loop

                    var sorted = util.sortByKey(matches, 'score');
                    console.log('how many sorted: ' + sorted.length);

                    // Check if PBDB Publication exists in biodiversitylibrary.org
                    var bio_api_key = '5415e6dc-c430-4de8-8346-6d6091d08edb';

                    for( var i = 0; i <= 5; i++ ) {

                        pbdb_pub_title = sorted[i].pbdb_obj.publication;
                        console.log(' PBDB Pub title: ' + pbdb_pub_title);

                        var bio_options = {
                            url: "http://www.biodiversitylibrary.org/api2/httpquery.ashx?op=TitleSearchSimple&title=" + 
                                encodeURIComponent( pbdb_pub_title ) + "&apikey=" + bio_api_key + "&format=json",
                        };

                        request.get(bio_options, function(error, response, body) {
                            if(!error && response.statusCode == 200) {
                                var bio_results = JSON.parse( body );
                                if( "ok" == bio_results.Status ) {
                                    for( var bidx in bio_results.Result ) {
                                        console.log( 'BHL Full Title: ' + bio_results.Result[bidx].FullTitle );
                                    }
                                }
                            }
                        });
                    }

                    res.render('biblio', { title: 'Bibliographic Matches', matches: sorted } );

                } // iDIG BIO Response Status Check 
            }); // END IDIG Bio request.post
        } // PBDB Resposne Status Check   
    }); // END PBDB request.get
}

