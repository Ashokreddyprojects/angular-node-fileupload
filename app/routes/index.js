var express = require('express');
var multer = require('multer');
var router = express.Router();
var formidable = require('formidable');
var fs = require('fs')
const csv = require('csvtojson');
var form = new formidable.IncomingForm();


var storage = multer.diskStorage({ //multers disk storage settings
  destination: function (req, file, cb) {
      cb(null, './uploads/')
  },
  filename: function (req, file, cb) {
      var datetimestamp = Date.now();
      cb(null,datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1])
  }
});
var upload = multer({ //multer settings
              storage: storage
          })


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


// router.post("/upload", upload.array("uploads[]", 12), function (req, res) {
//   // console.log('files', req.files);
//   //res.send(req.files);
//   console.log(req.body)
//   console.log(req.files)
// });

router.post('/upload',upload.any() ,function(req, res) {
  console.log(req.body)
  console.log(req.files)
  var csvToJson=[];
//   fs.readFile(req.files[0].path, function read(err, data) {
//     if (err) {
//         throw err;
//     }
//     console.log(data.toJSON())
// });
  // form.parse(req, function(err, fields, files) {
  //   if(err)
  //   {
  //     throw err;
  //   }
  //   else{
  //     console.log(fields)
  //     console.log(files)
  //   }
  // });

  try {
   
    csv()
        .fromFile(req.files[0].path)
        .on('json', (jsonObj) => {
            // combine csv header row and csv line to a json object
            // jsonObj.a ==> 1 or 4
            console.log(jsonObj);
           // res.json(jsonObj);
           csvToJson.push(jsonObj)
        })
        .on('done', (error) => {
            console.log('end')
            res.json(csvToJson);
        })
}
catch (e) {
    console.log(e);
    res.json({ error: "Error" });
}

});


module.exports = router;
