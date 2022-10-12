
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

// 🍀c58-10)
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



// 🍀route : get, post, put, delete

// 🍀 app.use(), routes.js
app.use('/', require('./routes/routes.js'))


// 🦄🦄c28. MongoClient.connect(url, function(err, client) {~~} 

// 🦄🦄c30 Database, client.db('').collection('').insertOne(, )

// url, password
let url = process.env.mongoDB_url;

MongoClient.connect(url, function(mongo_err, client) {
  if (mongo_err) throw mongo_err;
  console.log((`ig-Database created!`).bgBrightMagenta)

  let db = client.db('db0929')

  // 🦄🦄c32 npm ejs 1
  // 👉write.ejs

  // 🍀post, bodyParser
  //  post() insetOne(), send(), req.body.ig_title
  app.post('/add',function (req,res) {    

    res.render('write.ejs')

    console.log('post-add fin'.bgMagenta)
    console.log(req.body)
    console.log(req.body.ig_title)

    // 🦄🦄c38  id, auto increment, findOne(.), insertOne(.)
   
    // 🍀c38.findOne, total count    
    // .collecton(~) :
    db.collection('counter').findOne({name:'total post count'},function (p_err,pp_res) {
      console.log(pp_res)
      console.log(pp_res.totalPost)
      
      // 🍀insertOne, _id: pp_res.totalPost+1
      db.collection('post').insertOne({_id:pp_res.totalPost+1,title: req.body.ig_title, date:req.body.ig_data, desc: req.body.ig_desc },function (){
        console.log('insertone success'.bgBlue)         
    
        // 🦄🦄c40 id+1, updateOne(.), mongodb operator $inc $set 
        // 🍀c40.updateOne, $inc:{totalPost:1}
        db.collection('counter').updateOne({name:'total post count'},{$inc:{totalPost:1}},function (PPP_err,ppp_res) {
          if (PPP_err) {
            return console.log(PPP_err)            
          }           
        });
      })
    });
  })
  

  //🦄🦄c34 find(.).toArray(,)={}), { posts   }

  // 🍀c34-2. list-reverse
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


  // 🦄🦄c42 AJAX로 DELETE , $.ajax(.), app.delete('delete',(.)={})
  // 🦄🦄c44 deleteOne(.), data-~~, .dataset.~~, parseInt(.)
  // 🦄🦄c46 .status(~).send(~)

  // 👉./views/list.ejs

  // 🍀c42, delete
  app.delete('/delete', function (req,res) {
    
    console.log(`delete`.bgBrightMagenta)
    console.log(req.body)

    /*🍀
      "req.body.~id"를 number로 바꿈  -> "req.body"를 deleteOne()에 사용함. 
      ("req.body._id"  가 아니라. "req.body") 
    */
    req.body._id = parseInt(req.body._id);

    // ~.deleteOne()
    db.collection('post').deleteOne(req.body, function (pp_err, pp_res) {
         console.log('ig delete fin'.bgBlue)

      // c46-30)  200:  res.status(200).send({message : "c46, success"});  
      // 👉 list.ejs
      res.status(200).send({message:"ig delete fail"});

      // c46-40)  400:  res.status(400).send({message : "c46, fail"});        
      // res.status(400).send({message : "c46, fail"});
    })
    
  });


  // 🦄🦄c48 id (URL parameter), req.params.id
  // 👉/views/detail.ejs
  
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



  // 🦄🦄c50 ejs include (= react components), static, express.static('public') 
  // 👉 app.use('.public', express.static('pulbic'));
  //  👉 ./views/nav.html 
  // 👉./views/~~~.ejs


  // 🦄🦄c52 =PUT=update,  PUT, method-override 
  // 👉update.ejs, update-id.ejs



  // 🍀 /update/:id
  app.get("/update/:id", function (req, res) {
    db.collection('post').findOne({_id: parseInt(req.params.id)},function (pp_err, p_db) {    
        
      console.log(p_db)
      res.render('update-id.ejs',{ig_post: p_db})      
    })
  });


  // 🦄🦄🦄c54, 👉update-id.ejs

  app.put('/update-id',function (req,res) {

    console.log(res.body)

    db.collection('post').updateOne({_id:parseInt(req.body.ig_id)},{$set:{title: req.body.ig_title, date: req.body.ig_date, desc: req.body.ig_desc}},function (p_err, p_res) {
      console.log('ig- update- fin')

      // 🍀redirect     
      res.redirect('/list');
    })
  });


  // 🦄🦄c58  app.use(~), passport, express-session, passport.authenticate(~), passport.use(new LocalStorategy(~))
  // 🦄🦄c60  passport-local, passport.serializeUser(~), bcryptjs
  // 🦄🦄c62  mypage.ejs, middleware로그인확인, passport.deserializeUser, req.user: db의 데이터
  // 👉 up
  // 👉mypage.ejs
  // 👉login.ejs

  console.log('🦄🦄c56,58,60,62')


  app.get('/login',(req,res)=>{
    res.render('login.ejs');
  });

  app.get('/login_fail',function (req,res) {
    res.render('login_fail.ejs')    
  })


  // 🍀passport
  /*🍀-20)
    passport.authenticate('local') : (인증해주세요)함수 ,    
    인증 실패시 (failureRedirect : '/fail') :  '/login_fail' 로 연결 
    인증 성공시 : res.redirect('/') 
  */
  app.post('/login', 
    passport.authenticate('local', { failureRedirect: '/login_fail' }),
    function(req, res) {
      console.log('🦄c58. login')
      res.redirect('/');
  });


  // 🍀passport-local
  // 🍀c60-30) passport.authenticate('local',~)...로그인 성공시, 다음코드 실행됨
  passport.use(new LocalStrategy(
    {
    usernameField:'id',             // 👉login.ejs
    passwordField:'pw',            // 👉login.ejs
    session: true,                       // login 후 session을 저장할것인지?
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

  // 🍀passport.serializeUser  
  // 👉f12 -> Application -> Cookies
  passport.serializeUser(function(user, done) {
    console.log(('passport.serializeUser').bgYellow)
    console.log(user)

    done(null, user.id);
  });


  // 🦄c62,  👉mypage.ejs
  // 🍀 passport.deserializeUser
  // login 성공 때, 위의 session데이터를 가진사람(login한 유저)의 정보를 db에서 찾아줌
  // user : db에서 찾은 정보
  // p_id : passport.serializeUser에서의 use정보.id
  passport.deserializeUser(function(p_id, done) {
    db.collection('login').findOne({id:p_id}, function (err, user) {
      done(err, user);
    });
  });

  // 🍀62-50. app.get("/mypage",~~~~), 
  // 🍉req.user : db의 데이터
  app.get("/mypage",loginCheck, function (req, res) {
    console.log((`/mypage : req.user`).bgYellow)
    console.log(req.user)  
    res.render('mypage.ejs',{ig_mypage유저정보: req.user})
  });

  //🥒62-50. loginCheck
  // req.user가 있으면 next() : 통과  👉app.get("/mypage",~~~~실행
  // req.user가 없으면 res.render(~~)  (html에 메시지 띄움)
  function loginCheck(req,res,next) {
    if (req.user) {
      console.log(colors.bgBrightGreen('loginCheck'))
      next()    
    } else {
      res.render('login_fail.ejs')    
    }  
  }



  // 🦄🦄c64 .env 파일, environment variable, 
  // 👉.env  
  console.log('🦄🦄c64 ')


  //🦄🦄c66  Query string parameters, ('/search?value='+입력한value), req.query.value, window.location.replace('/~')
  // 👉views/list.ejs : html, javascript 
  


  //🦄🦄c70 mongoDB...search index탭, $.parma(~), $("#form").serialize(~), aggregate(~), $search, $sort,$limit, $project, {$meta:"searchScore"}
  // 👉mongoDB사이트  collection 👉 index
  // 👉 mongoDB사이트...search index탭 

    app.get('/search',(req,res)=>{

      console.log(('get./search').bgBrightMagenta)
      console.log(req.query.value)

      //  🍀70-15) .find(pipeline).toArray()
      // 👉mongoDB사이트  collection 👉 index
      // {title:req.query.value} : full scan하는 이전 방법 

      // 🍀실패함 {$text:{ $search: req.query.value}}
      
      //  🍀70-20) .aggregate(pipeline).toArray()  
      // 👉 mongoDB사이트...search index탭 활용함      


      let pipeline =[
        {
          $search:{
            index : "ig_titleSearch2",
            text:{
              query: req.query.value,
              path: ["title",'date']        //db안의 오브젝트 이름
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


    //🦄🦄 72 회원 기능...게시판 기능, req.body._id, req.user._id 
    // 👉./views/register.ejs
    // 👉./views/list.ejs
    


    app.get('/register', (req,res)=>{
      res.render('register.ejs')

    });
    
    //🍀register post하기 : passport~~~ 코드 밑에 코딩해야함
    app.post('/register_post', (req,res)=>{
      
      console.log(colors.bgBrightMagenta('register_post'))
      console.log(req.body.id)

      // 🍉insertOne({id:req.body.id, pw:req.body.pw}, : post로 넘어온 req.body.~ 데이터 저장
      db.collection('login').insertOne({id:req.body.id, pw:req.body.pw},function (p_err,p_db) {

        // 🍉redirect
        res.redirect('/');         
      })
    });


    // 🍀write할때, 로그인 한 작성자도 추가하기 : passport~~~ 코드 밑에 코딩해야함
    // 👉register.ejs
    app.post('/add_c72',function (req,res) {    
      
      console.log((`app.post('/add_c72'`).bgBrightMagenta)  
      console.log(req.body)
      console.log(req.body.ig_title)

      res.render('register.ejs')


      /* 
        🍀작성자: req.user._id        
          req.user._id : 현재 로그인한 사람의 정보
          req.user.pw  : 현재 로그인한 사람의 password
      */
      let 저장할것 = {작성자: req.user._id , title: req.body.ig_title, date:req.body.ig_data}

      db.collection('post').insertOne(저장할것,function (p_err, p_db) {

        console.log('co0921-saved')        
      })      
    })

    
    // 🍀delete, 실제 로그인 한 _id == 글에 저장된 _id 같을때만 삭제하기 : passport~~~ 코드 밑에 코딩해야함
    // 👉./views/list.ejs

      app.delete('/delete_c72', function (req,res) {
        
        console.log((`delete_c72`).bgBlue)
        console.log(req.body)
        console.log((`req.body._id`).bgBlue)
        console.log(req.body._id)
        console.log((`req.body.title`).bgBlue)
        console.log(req.body.title)
        console.log(req.user._id)

        req.body._id = parseInt(req.body._id);

        // 🍉{_id:req.body._id, 작성자:req.user._id} 둘다 만족하는 게시물을 찾아서 delete해줌
        let 삭제할데이터 = {_id:req.body._id, 작성자:req.user._id}

        //🍉기존 c41에서의 코드와의 차이점 :  db.collection('post').deleteOne(req.body, function (pp_err, pp_res) {
        db.collection('post').deleteOne(삭제할데이터, function (pp_err, pp_res) {
            console.log('ig delete fin')

          res.status(200).send({message:"ig delete fail"});
        })        
      });


    // 👉🍀c18, listen 
    app.listen(process.env.PORT || 8080 , function () {
        console.log((`bgMagenta`).bgMagenta)
        console.log(`ig node server gogo, port: ${process.env.PORT}`.rainbow);        
    }); 

    //🍀 client.close()있으면 post가 안됨..왜인지는 모름
    // client.close();
});





