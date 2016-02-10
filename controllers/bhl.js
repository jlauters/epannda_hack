// bhl.js

var request = require('request');

module.exports = function(app,config) {

    return {

        title_search: function(req, res, callback) {

            var title    = req.params.title;
            var bio_api_key = '5415e6dc-c430-4de8-8346-6d6091d08edb';

            var bio_options = {
                url: "http://www.biodiversitylibrary.org/api2/httpquery.ashx?op=TitleSearchSimple&title=" + title + "&apikey=" + bio_api_key + "&format=json"
            };

            request.get(bio_options, function(error, response, body) {
                if(!error && response.statusCode == 200) {

                    var titleID = '';

                    var bio_results = JSON.parse( body );
                    if("ok" == bio_results.Status) {
                        for( var bidx in bio_results.Result ) {

                            (function(bidx) {

                                // Data sanitization
                                var bhl_title = bio_results.Result[bidx].FullTitle.replace('.', '');

                                if(title == bhl_title) {
                                    titleID = bio_results.Result[bidx].TitleID;
                                    return titleID;
                                } 

                            })(bidx);

                        }

                        res.setHeader("Content-Type", "application/json");
                        res.send('{"titleID": "' + titleID + '" }');

                    }
                }
            });
        },

        title_items: function(req, res, callback) {
  
            var title_id = req.params.title_id;
            var volume   = req.params.volume;
            var year     = req.params.year;

            var bio_api_key = '5415e6dc-c430-4de8-8346-6d6091d08edb';

            var bio_options = {
                url: "http://www.biodiversitylibrary.org/api2/httpquery.ashx?op=GetTitleItems&titleid=" + title_id + "&apikey=" + bio_api_key + "&format=json"
            };

            request.get(bio_options, function(error, response, body) {
                if(!error && response.statusCode == 200) {

                    var itemID = 0;
                    var title_items = JSON.parse( body );
                    if("ok" == title_items.Status) {
                        for( var tidx in title_items.Result) {

                            (function(tidx) {

                                if( 0 < title_items.Result[tidx].Year.indexOf( year ) ||
                                    0 < title_items.Result[tidx].Volume.indexOf( volume ) ) {

                                    itemID = title_items.Result[tidx].ItemID;
                                    return itemID;
                                }

                            })(tidx);
                        }

                        res.setHeader("Content-Type", "application/json");
                        res.send('{"itemID": "' + itemID + '" }');
                    }
                }
            });

        },

        item_metadata: function(req, res, callback) {
 
            // TODO: We need PBDB title to match against OCR Text

            var item_id = req.params.item_id;
            var pb_title = req.params.pb_title;

            var bio_api_key = '5415e6dc-c430-4de8-8346-6d6091d08edb';

            var bio_options = {
                url: "http://www.biodiversitylibrary.org/api2/httpquery.ashx?op=GetItemMetadata&itemid=" + item_id + 
                "&pages=t&ocr=t&parts=t&apikey=" + bio_api_key + "&format=json"
            }

            request.get(bio_options, function(error, response, body) {
                if(!error && response.statusCode == 200) {

                    var ocr = '';
                    var item_meta = JSON.parse( body );
                    
                    if("ok" == item_meta.Status) {

                        for( var pidx in item_meta.Result.Pages) {

                            (function(pidx) {
                                if(item_meta.Result.Pages[pidx].OcrText !== "") {
                                    if(0 < item_meta.Result.Pages[pidx].OcrText.indexOf( pb_title ) ) {
                                        ocr = item_meta.Result.Pages[pidx].OcrText;
                                        return ocr;
                                    }
                                }
                            })(pidx);
                        }
                    }

                    res.setHeader("Content-Type", "application/json");
                    res.send('{"ocrText": ' + JSON.stringify( ocr ) + ' } ');
                    
                }
            });

        }

    }
}
