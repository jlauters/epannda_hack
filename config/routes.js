module.exports = function(app, config) {

    // home route
    var home    = require('../controllers/home')(app, config);
    var pbdb    = require('../controllers/pbdb')(app, config);
    var idigbio = require('../controllers/idigbio')(app, config);
    var bhl     = require('../controllers/bhl')(app, config);

    app.get('/', home.index);
  
    // PBDB Search
    app.get('/pbdb_lookup/:taxon', pbdb.taxon_lookup);
 
    // IDigBio Search for scientific name and state province ( potentially locality )
    app.get('/idigbio_lookup/:scientific_name/:state_province', idigbio.search);

    // BHL Search
    app.get('/bhl_title/:title', bhl.title_search);
    app.get('/bhl_title_items/:title_id/:volume/:year', bhl.title_items);
    app.get('/bhl_item_meta/:item_id/:pb_title', bhl.item_metadata);

    // 404 catch
    app.use(function(err, req, res, callback) {
        if(err) { callback( err ); }
        else {
            res.status(404).json({"error":"Not Found"});
            callback();
        }
    });
};
