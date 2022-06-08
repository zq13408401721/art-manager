// default config
module.exports = {
  port:12006,
  workers: 1,
  cookie:{
      domain:'',
      path:'/',
      maxAge:24*3600*1000,
      /*signed:false,
      keys:[]*/
  },
  noverify:[
      "index/login"
  ],
  postaction:[
      "mclass/createClass",
  ]
};
