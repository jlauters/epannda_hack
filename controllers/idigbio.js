// idigbio.js

module.exports = {

    pbdb_results: [],

    // TODO: Function to take results of pbdb.parseResults
    matchPBDB: function(pbdb_results) {

        console.log('idigBio.matchPBDB ... ');
        this.pbdb_results = pbdb_results;

        var options = {
            url: "http://search.idigbio.org/v2/search/records/",
            json: true,
            headers: { 'Content-Type': 'application/json' },
            body: {
                "rq": { "order": "coleoptera", "stateprovince": "colorado" }
            }
        };

        // Callback to handle response from iDigBio
        request.post(options, idigbio.parseRequest);
    },

    // TODO: Function to make iDigBio API Call and parseResults.
    parseRequest: function(err, response, body) {
        if(!err && response.statusCode == 200) {

            console.log('idigBio.parseRequest ...');

            var idigbio_results = body.items;
            for( var idx in idigbio_results ) {

                // initialize scorable match fields
                var uuid        = idigbio_results[idx].uuid;
                var sciNameAuth = idigbio_results[idx].data['dwc:scientificNameAuthorship'];
 
                // break out scientific name authorship from publish date
                var sciNameAuthDate = '';
                if( undefined != sciNameAuth ) {
                    var sciNameParts = sciNameAuth.split(' ');
                    sciNameAuth     = sciNameParts[0];
                    sciNameAuthDate = sciNameParts[1];
                }

                var identRemarks     = idigbio_results[idx].data['dwc:identificationRemarks'];
                var recordedBy       = idigbio_results[idx].data['dwc:recordedBy'];
                var biblioCitation   = idigbio_results[idx].data['dcterms:bibliographicCitation'];
                var eventDate        = idigbio_results[idx].data['dwc:eventDate'];
                var occurrenceRemark = idigbio_results[idx].data['dwc:occurrenceRemarks'];
                var associatedRef    = idigbio_results[idx].data['dwc:associatedReferences'];
                var identRef         = idigbio_results[idx].data['dwc:identificationReferences'];
                var scientificName   = idigbio_results[idx].data['dwc:scientificName'];
                var order            = idigbio_results[idx].data['dwc:order'];
                var stateProvince    = idigbio_results[idx].data['dwc:stateProvince'];
                var locality         = idigbio_results[idx].data['dwc:locality']; 


                // iterate through PBDB Results to score potential matches.
                var pbdb = this.pbdb_results;

                for( var pidx in pbdb ) {
                    var score = 0;
                    var matched_on = [];
                }
            }
        }
    }
}
