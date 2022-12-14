
// c18 express
const express = require("express");
const app = express();

// colors
let colors = require("colors");

// c24-5) bodyParser
let bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }))

// dotenv
require('dotenv').config()

// c30) mogoClient
let MongoClient = require('mongodb').MongoClient;

 // c32) ejs
// let ejs = require('ejs'); 

app.set('layout', 'layouts/layout');

// c50)
app.use(express.static('public'))

// c52)  method-override
let methodOverride = require('method-override')
app.use(methodOverride('_method'))

// ๐c58-10)
// passport
const passport = require('passport');

// passport-local
const LocalStrategy = require('passport-local').Strategy;

// express-session
const session = require('express-session');

// middleware
app.use(session({ secret: 'ig123', resave: true, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

// express-ejs-layouts
// var expressLayouts = require('express-ejs-layouts');
// app.use(expressLayouts);



// ๐route : get, post, put, delete

// ๐ app.use(), routes.js
app.use('/', require('./routes/routes.js'))


// ๐ฆ๐ฆc28. MongoClient.connect(url, function(err, client) {~~} 

// ๐ฆ๐ฆc30 Database, client.db('').collection('').insertOne(, )

// url, password
let url = process.env.mongoDB_url;

MongoClient.connect(url, function(mongo_err, client) {
  if (mongo_err) throw mongo_err;
  console.log((`ig-Database created!`).bgBrightMagenta)

  let db = client.db('db0929')

  // ๐ฆ๐ฆc32 npm ejs 1
  // ๐write.ejs

  // ๐post, bodyParser
  //  post() insetOne(), send(), req.body.ig_title
  app.post('/add',function (req,res) {    

    res.render('write.ejs')

    console.log('post-add fin'.bgMagenta)
    console.log(req.body)
    console.log(req.body.ig_title)

    // ๐ฆ๐ฆc38  id, auto increment, findOne(.), insertOne(.)
   
    // ๐c38.findOne, total count    
    // .collecton(~) :
    db.collection('counter').findOne({name:'total post count'},function (p_err,pp_res) {
      console.log(pp_res)
      console.log(pp_res.totalPost)
      
      // ๐insertOne, _id: pp_res.totalPost+1
      db.collection('post').insertOne({_id:pp_res.totalPost+1,title: req.body.ig_title, date:req.body.ig_data, desc: req.body.ig_desc },function (){
        console.log('insertone success'.bgBlue)         
    
        // ๐ฆ๐ฆc40 id+1, updateOne(.), mongodb operator $inc $set 
        // ๐c40.updateOne, $inc:{totalPost:1}
        db.collection('counter').updateOne({name:'total post count'},{$inc:{totalPost:1}},function (PPP_err,ppp_res) {
          if (PPP_err) {
            return console.log(PPP_err)            
          }           
        });
      })
    });
  })
  

  //๐ฆ๐ฆc34 find(.).toArray(,)={}), { posts   }

  // ๐c34-2. list-reverse
  app.get("/list", function (req, res) {

    // find().toArray()
    db.collection('post').find().toArray(function (err,pp_res) {
      console.log((`list`).bgBlue)
      console.log(pp_res)
      
      // ejs
      //res.render
      res.render('list.ejs',{ig_posts:pp_res,  meta_title:'miniProject'});
    })

  });


  // ๐ฆ๐ฆc42 AJAX๋ก DELETE , $.ajax(.), app.delete('delete',(.)={})
  // ๐ฆ๐ฆc44 deleteOne(.), data-~~, .dataset.~~, parseInt(.)
  // ๐ฆ๐ฆc46 .status(~).send(~)

  // ๐./views/list.ejs

  // ๐c42, delete
  app.delete('/delete', function (req,res) {
    
    console.log(`delete`.bgBrightMagenta)
    console.log(req.body)

    /*๐
      "req.body.~id"๋ฅผ number๋ก ๋ฐ๊ฟ  -> "req.body"๋ฅผ deleteOne()์ ์ฌ์ฉํจ. 
      ("req.body._id"  ๊ฐ ์๋๋ผ. "req.body") 
    */
    req.body._id = parseInt(req.body._id);

    // ~.deleteOne()
    db.collection('post').deleteOne(req.body, function (pp_err, pp_res) {
         console.log('ig delete fin'.bgBlue)

      // c46-30)  200:  res.status(200).send({message : "c46, success"});  
      // ๐ list.ejs
      res.status(200).send({message:"ig delete fail"});

      // c46-40)  400:  res.status(400).send({message : "c46, fail"});        
      // res.status(400).send({message : "c46, fail"});
    })
    
  });


  // ๐ฆ๐ฆc48 id (URL parameter), req.params.id
  // ๐/views/detail.ejs
  
  // :id
  app.get('/detail/:id',function (req,res) {

    //  req.params.id 
    // findOne({~},function(){})
    // parseInt 
    db.collection('post').findOne({_id: parseInt(req.params.id)},function (pp_err,p_res) {
      console.log(p_res)

      // .render('~c~',{ ~b~ : ~a~ })
      res.render('detail.ejs',{ig_data: p_res})      
    });    
  });



  // ๐ฆ๐ฆc50 ejs include (= react components), static, express.static('public') 
  // ๐ app.use('.public', express.static('pulbic'));
  //  ๐ ./views/nav.html 
  // ๐./views/~~~.ejs


  // ๐ฆ๐ฆc52 =PUT=update,  PUT, method-override 
  // ๐update.ejs, update-id.ejs



  // ๐ /update/:id
  app.get("/update/:id", function (req, res) {
    db.collection('post').findOne({_id: parseInt(req.params.id)},function (pp_err, p_db) {    
        
      console.log(p_db)
      res.render('update-id.ejs',{ig_post: p_db})      
    })
  });


  // ๐ฆ๐ฆ๐ฆc54, ๐update-id.ejs

  app.put('/update-id',function (req,res) {

    console.log(res.body)

    db.collection('post').updateOne({_id:parseInt(req.body.ig_id)},{$set:{title: req.body.ig_title, date: req.body.ig_date, desc: req.body.ig_desc}},function (p_err, p_res) {
      console.log('ig- update- fin')

      // ๐redirect     
      res.redirect('/list');
    })
  });


  // ๐ฆ๐ฆc58  app.use(~), passport, express-session, passport.authenticate(~), passport.use(new LocalStorategy(~))
  // ๐ฆ๐ฆc60  passport-local, passport.serializeUser(~), bcryptjs
  // ๐ฆ๐ฆc62  mypage.ejs, middleware๋ก๊ทธ์ธํ์ธ, passport.deserializeUser, req.user: db์ ๋ฐ์ดํฐ
  // ๐ up
  // ๐mypage.ejs
  // ๐login.ejs

  console.log('๐ฆ๐ฆc56,58,60,62')


  app.get('/login',(req,res)=>{
    res.render('login.ejs');
  });

  app.get('/login_fail',function (req,res) {
    res.render('login_fail.ejs')    
  })


  // ๐passport
  /*๐-20)
    passport.authenticate('local') : (์ธ์ฆํด์ฃผ์ธ์)ํจ์ ,    
    ์ธ์ฆ ์คํจ์ (failureRedirect : '/fail') :  '/login_fail' ๋ก ์ฐ๊ฒฐ 
    ์ธ์ฆ ์ฑ๊ณต์ : res.redirect('/') 
  */
  app.post('/login', 
    passport.authenticate('local', { failureRedirect: '/login_fail' }),
    function(req, res) {
      console.log('๐ฆc58. login')
      res.redirect('/');
  });


  // ๐passport-local
  // ๐c60-30) passport.authenticate('local',~)...๋ก๊ทธ์ธ ์ฑ๊ณต์, ๋ค์์ฝ๋ ์คํ๋จ
  passport.use(new LocalStrategy(
    {
    usernameField:'id',             // ๐login.ejs
    passwordField:'pw',            // ๐login.ejs
    session: true,                       // login ํ session์ ์?์ฅํ?๊ฒ์ธ์ง?
    passReqToCallback:false,
    },
    function(username, password, done) {
      db.collection('login').findOne({ id: username }, function (err, user) {

        console.log(colors.bgYellow('passport.use(new LocalStrategy'))            
        console.log(username,password)
        console.log(user)

        if (err) { return done(err); }
        if (!user) { return done(null, false,{message:'wrong ID'}); }
        if (password !== user.pw) { 
          return done(null, false,{message: 'wrong password'});
        }
        return done(null, user,{message:'success log in'});

      });
    }
  ));

  // ๐passport.serializeUser  
  // ๐f12 -> Application -> Cookies
  passport.serializeUser(function(user, done) {
    console.log(('passport.serializeUser').bgYellow)
    console.log(user)

    done(null, user.id);
  });


  // ๐ฆc62,  ๐mypage.ejs
  // ๐ passport.deserializeUser
  // login ์ฑ๊ณต ๋, ์์ session๋ฐ์ดํฐ๋ฅผ ๊ฐ์ง์ฌ๋(loginํ ์?์?)์ ์?๋ณด๋ฅผ db์์ ์ฐพ์์ค
  // user : db์์ ์ฐพ์ ์?๋ณด
  // p_id : passport.serializeUser์์์ use์?๋ณด.id
  passport.deserializeUser(function(p_id, done) {
    db.collection('login').findOne({id:p_id}, function (err, user) {
      done(err, user);
    });
  });

  // ๐62-50. app.get("/mypage",~~~~), 
  // ๐req.user : db์ ๋ฐ์ดํฐ
  app.get("/mypage",loginCheck, function (req, res) {
    console.log((`/mypage : req.user`).bgYellow)
    console.log(req.user)  
    res.render('mypage.ejs',{ig_mypage์?์?์?๋ณด: req.user})
  });

  //๐ฅ62-50. loginCheck
  // req.user๊ฐ ์์ผ๋ฉด next() : ํต๊ณผ  ๐app.get("/mypage",~~~~์คํ
  // req.user๊ฐ ์์ผ๋ฉด res.render(~~)  (html์ ๋ฉ์์ง ๋์)
  function loginCheck(req,res,next) {
    if (req.user) {
      console.log(colors.bgBrightGreen('loginCheck'))
      next()    
    } else {
      res.render('login_fail.ejs')    
    }  
  }



  // ๐ฆ๐ฆc64 .env ํ์ผ, environment variable, 
  // ๐.env  
  console.log('๐ฆ๐ฆc64 ')


  //๐ฆ๐ฆc66  Query string parameters, ('/search?value='+์๋?ฅํvalue), req.query.value, window.location.replace('/~')
  // ๐views/list.ejs : html, javascript 
  


  //๐ฆ๐ฆc70 mongoDB...search indexํญ, $.parma(~), $("#form").serialize(~), aggregate(~), $search, $sort,$limit, $project, {$meta:"searchScore"}
  // ๐mongoDB์ฌ์ดํธ  collection ๐ index
  // ๐ mongoDB์ฌ์ดํธ...search indexํญ 

    app.get('/search',(req,res)=>{

      console.log(('get./search').bgBrightMagenta)
      console.log(req.query.value)

      //  ๐70-15) .find(pipeline).toArray()
      // ๐mongoDB์ฌ์ดํธ  collection ๐ index
      // {title:req.query.value} : full scanํ๋ ์ด์? ๋ฐฉ๋ฒ 

      // ๐์คํจํจ {$text:{ $search: req.query.value}}
      
      //  ๐70-20) .aggregate(pipeline).toArray()  
      // ๐ mongoDB์ฌ์ดํธ...search indexํญ ํ์ฉํจ      


      let pipeline =[
        {
          $search:{
            index : "ig_titleSearch2",
            text:{
              query: req.query.value,
              path: ["title",'date']        //db์์ ์ค๋ธ์?ํธ ์ด๋ฆ
            }  
          }
        },
        // 70-30)$sort, $limit,$project
        {$sort :{_id :1}},
        {$limit : 10},
        {$project : {title : 1, date:1, _id: 0, score :{$meta : "searchScore"}}}
      ];
      db.collection('post').aggregate(pipeline).toArray((err,p_db)=>{
        console.log(p_db)  
  
        res.render('search.ejs',{ig_posts:p_db});
      })       
    });


    //๐ฆ๐ฆ 72 ํ์ ๊ธฐ๋ฅ...๊ฒ์ํ ๊ธฐ๋ฅ, req.body._id, req.user._id 
    // ๐./views/register.ejs
    // ๐./views/list.ejs
    


    app.get('/register', (req,res)=>{
      res.render('register.ejs')

    });
    
    //๐register postํ๊ธฐ : passport~~~ ์ฝ๋ ๋ฐ์ ์ฝ๋ฉํด์ผํจ
    app.post('/register_post', (req,res)=>{
      
      console.log(colors.bgBrightMagenta('register_post'))
      console.log(req.body.id)

      // ๐insertOne({id:req.body.id, pw:req.body.pw}, : post๋ก ๋์ด์จ req.body.~ ๋ฐ์ดํฐ ์?์ฅ
      db.collection('login').insertOne({id:req.body.id, pw:req.body.pw},function (p_err,p_db) {

        // ๐redirect
        res.redirect('/');         
      })
    });


    // ๐writeํ?๋, ๋ก๊ทธ์ธ ํ ์์ฑ์๋ ์ถ๊ฐํ๊ธฐ : passport~~~ ์ฝ๋ ๋ฐ์ ์ฝ๋ฉํด์ผํจ
    // ๐register.ejs
    app.post('/add_c72',function (req,res) {    
      
      console.log((`app.post('/add_c72'`).bgBrightMagenta)  
      console.log(req.body)
      console.log(req.body.ig_title)

      res.render('register.ejs')


      /* 
        ๐์์ฑ์: req.user._id        
          req.user._id : ํ์ฌ ๋ก๊ทธ์ธํ ์ฌ๋์ ์?๋ณด
          req.user.pw  : ํ์ฌ ๋ก๊ทธ์ธํ ์ฌ๋์ password
      */
      let ์?์ฅํ?๊ฒ = {์์ฑ์: req.user._id , title: req.body.ig_title, date:req.body.ig_data}

      db.collection('post').insertOne(์?์ฅํ?๊ฒ,function (p_err, p_db) {

        console.log('co0921-saved')        
      })      
    })

    
    // ๐delete, ์ค์? ๋ก๊ทธ์ธ ํ _id == ๊ธ์ ์?์ฅ๋ _id ๊ฐ์๋๋ง ์ญ์?ํ๊ธฐ : passport~~~ ์ฝ๋ ๋ฐ์ ์ฝ๋ฉํด์ผํจ
    // ๐./views/list.ejs

      app.delete('/delete_c72', function (req,res) {
        
        console.log((`delete_c72`).bgBlue)
        console.log(req.body)
        console.log((`req.body._id`).bgBlue)
        console.log(req.body._id)
        console.log((`req.body.title`).bgBlue)
        console.log(req.body.title)
        console.log(req.user._id)

        req.body._id = parseInt(req.body._id);

        // ๐{_id:req.body._id, ์์ฑ์:req.user._id} ๋๋ค ๋ง์กฑํ๋ ๊ฒ์๋ฌผ์ ์ฐพ์์ deleteํด์ค
        let ์ญ์?ํ?๋ฐ์ดํฐ = {_id:req.body._id, ์์ฑ์:req.user._id}

        //๐๊ธฐ์กด c41์์์ ์ฝ๋์์ ์ฐจ์ด์? :  db.collection('post').deleteOne(req.body, function (pp_err, pp_res) {
        db.collection('post').deleteOne(์ญ์?ํ?๋ฐ์ดํฐ, function (pp_err, pp_res) {
            console.log('ig delete fin')

          res.status(200).send({message:"ig delete fail"});
        })        
      });


    // ๐๐c18, listen 
    app.listen(process.env.PORT || 8080 , function () {
        console.log((`bgMagenta`).bgMagenta)
        console.log(`ig node server gogo, port: ${process.env.PORT}`.rainbow);        
    }); 

    //๐ client.close()์์ผ๋ฉด post๊ฐ ์๋จ..์์ธ์ง๋ ๋ชจ๋ฆ
    // client.close();
});





