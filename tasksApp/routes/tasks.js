var express = require('express');
var router = express.Router();
var db = require('monk')('localhost/tasks');
var taskCollection = db.get('tasks');


router.get('/', function(req, res) {
    taskCollection.find({}, function (err, docs) {
      res.json(docs);
  });
});

router.post('/', function(req, res) {
  taskCollection.insert(req.body, function(err, result){
      res.send(
          (err === null) ? { msg: '' } : { msg: err }
      );
  });
});

router.delete('/:id', function(req, res) {
  taskCollection.remove({_id: req.params.id}, function(err) {
        res.send((err === null) ? { msg: '' } : { msg:'error: ' + err });
    });
});

module.exports = router;