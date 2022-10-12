const express = require('express')
const router = express.Router()


router.get("/", function (req, res) {
    res.render('index.ejs',{meta_title:'miniProject'})  
});


/* 
router.get("/style.css", function (req, res) {
    res.sendFile(__dirname + "/style.css");
});
*/

// 🦄🦄c24  app.post('/add',(res,req)=>{}), body-parser : body-parser, form, input, name)
// 👉write.html

router.get("/write", function (req, res) {
    res.render('write.ejs')
});

  
module.exports = router