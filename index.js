const express = require('express');
const multer = require('multer');
const upload = multer({ dest:'uploads/'});
const sizeOf = require('image-size');
const exphbs = require('express-handlebars');

const app = express();

app.use(express.static(__dirname +'/public'));

app.engine('.hbs', exphbs({ extname:'.hbs'}));
app.set('view engine','.hbs');

app.get('/', (req, res) => {
  return res.render('index', {layout: false});
});

app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file.mimetype.startsWith('image/')) {
    return res.status(422).json({
      error :'The uploaded file must be an image'
    });
  }

  const dimensions = sizeOf(req.file.path);

  if ((dimensions.width < 640) || (dimensions.height < 480)) {
    return res.status(422).json({
      error :'The image must be at least 640 x 480px'
    });
  }

  return res.status(200).send(req.file);
});

app.listen(8080, () => {
  console.log('Express server listening on port 8080');
});
