var express = require('express');
var router = express.Router();
var moment = require('moment');



/* GET reset app. */
router.get('/resetLog', function(req, res) {
    
    // Set our internal DB variable
    var db = req.db;

    // Set our collection
    var collection = db.get('battLog');

    collection.drop( function (err, doc) {
        if (err) {
            // If it failed, return error
            res.send("There was a problem adding the information to the database.");
        }
        else {
            res.send("OK! Table dropped");
        }
    });
});

/* POST battery event summary. */
router.post('/battEventSumm', function(req, res) {

    var param = req.body.period;

    //var now = Date.now();
    
    var today = moment().startOf('day').add(-1, 'seconds');
 
    var yesterday = moment(today).add(-1, 'days');

    var _timeStampYday = moment(yesterday).valueOf();
    var _timeStampToday = moment(today).valueOf();
    
    
    
    console.log('---test---', _timeStampYday, _timeStampToday); 

    
    // Set our internal DB variable
    var db = req.db;
    var _today = req.body.today;

    // Set our collection
    var collection = db.get('battLog');

    if(param == 'yesterday'){
        
        //last 24hours
        
        collection.find({ timeStamp: { $gt: _timeStampYday } , timeStamp: { $lt: _timeStampToday }},{"sort": {"timeStamp": -1}},function(e,docs){
            //res.json(docs);
            //console.log(docs);
            res.send(docs);
        });

    }else
    {
        
        //today
        collection.find({ timeStamp: { $gt: _timeStampToday }},{"sort": {"timeStamp": -1}},function(e,docs){
            //res.json(docs);
            //console.log(docs);
            res.send(docs);
        });

    }


    
});

/* POST to log new low battery event */
router.post('/logEvent', function(req, res) {
	console.log(req.body, req.body.length);

    // Set our internal DB variable
    var db = req.db;

    //get logObj
    logObj = req.body;

    
    // Set our collection
    var collection = db.get('battLog');

    // Submit to the DB
    collection.insert(logObj, function (err, doc) {
        if (err) {
            // If it failed, return error
            res.send("There was a problem adding the information to the database.");
        }
        else {
            if(logObj.length > 0){
            	//if its critical to send back timestamps for deleted items
            	res.send({"BulkUpdate":true});
            }else
            {
            	res.send("OK! Thanks for the update");
            }
            
        }
    });
});



module.exports = router;
