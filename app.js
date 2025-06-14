const express = require('express');
const path = require('path');
const app = express();
const port = 5502;

app.use(express.static(path.join(__dirname, 'Public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname,'Public', 'views', 'modelmenu.html'));
})

app.get('/modelj', (req, res) => {
    res.sendFile(path.join(__dirname,'Public', 'views', 'modelj.html'));
});

app.get('/modelk', (req, res) => {
    res.sendFile(path.join(__dirname,'Public', 'views', 'modelk.html'));
})

app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname,'Public', 'views', 'register.html'));
})

app.get('/subjectmenu', (req, res) => {
    res.sendFile(path.join(__dirname,'Public', 'views', 'subjectmenu.html'));
})

app.listen(port, '0.0.0.0',() => {
  console.log(`App running at https://103.75.25.77:${port}`);
});
