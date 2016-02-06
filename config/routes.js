module.exports = function(app, config) {

    // home route
    var home    = require('../controllers/home')(app, config);
    var pbdb    = require('../controllers/pbdb')(app, config);
    var idigbio = require('../controllers/idigbio')(app, config);
    var bhl     = require('../controllers/bhl')(app, config);

    // placeholder or main process kickoff?
    app.route('/').get(home.index);
  
    // PBDB Search
    app.route('/pbdb_lookup/:taxon').get(pbdb.taxon_lookup);
 
    // IDigBio Search for scientific name and state province ( potentially locality )
    app.route('/idigbio_lookup/:scientific_name/:state_province').get(idigbio.search);

    // BHL Search
    app.route('/bhl_title/:title').get(bhl.title_search);
    app.route('/bhl_title_items/:title_id').get(bhl.title_items);
    app.route('/bhl_item_meta/:item_id').get(bhl.item_metadata);
};
