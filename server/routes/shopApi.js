var express = require('express');//导入express
var router = express.Router();//导入路由
var mongoose = require('mongoose');//导入mongoose
var Goods = require('./../models/goods');//导入数据模型
var Users = require('./../models/users');//导入数据模型
require('./../util/util');

//连接MongoDB数据库
mongoose.connect('mongodb://127.0.0.1:27017/shopmall');
//监听数据库连接状态
mongoose.connection.on("connected",function(){
  console.log("MongoDB connected success.");
});

mongoose.connection.on("error",function(){
  console.log("MongoDB connected fail.");
});

mongoose.connection.on("disconnected",function(){
  console.log("MongoDB disconnected.");
});

//查询商品列表数据
router.get("/list",function(req,res,next){
  let page = parseInt(req.param("page"));
  let pageSize = parseInt(req.param("pageSize"));
  let sort = req.param("sort");
  let priceLevel = req.param("priceLevel");
  let skip = (page-1)*pageSize;
  let params = {};
  var priceGt = '',priceLte = '';
  if(priceLevel!='all'){
    switch(priceLevel){
      case '0':priceGt = 0;priceLte = 100;break;
      case '1':priceGt = 100;priceLte = 500;break;
      case '2':priceGt = 500;priceLte = 1000;break;
      case '3':priceGt = 1000;priceLte = 2000;break;
    }
    params = {
      salePrice:{
        $gt:priceGt,
        $lte:priceLte
      }
    };
  }
  let goodsModel = Goods.find(params).skip(skip).limit(pageSize);
  goodsModel.sort({'salePrice':sort});
  goodsModel.exec(function(err,doc){
    if(err){
      res.json({
        status:'1',
        msg:err.message,
        result:''
      });
    }else{
      res.json({
        status:'0',
        msg:'',
        result:{
          count:doc.length,
          list:doc
        }
      })
    }
  });
});

//加入购物车
router.post("/addCart",function(req,res,next){
  var userId = req.cookies.userId;
  let productId = req.body.productId;
  let Users = require('./../models/users');
  Users.findOne({userId:userId},function(err,userDoc){
    if(err){
      res.json({
        status:'1',
        msg:err.message,
        result:''
      });
    }else{
      if(userDoc){
        let goodsItem = '';
        userDoc.cartList.forEach(function(item){
          if(item.productId == productId){
            goodsItem = item;
            item.productNum++;
            item.checked = 1;
          }
        });
        if(goodsItem){
          userDoc.save(function(err2,doc){
            if(err2){
              res.json({
                status:'1',
                msg:err2.message,
                result:''
              });
            }else{
              res.json({
                status:'0',
                msg:'',
                result:'购物车添加成功！'
              });
            }
          });
        }else{
          Goods.findOne({productId:productId},function(err1,goodsDoc){
            if(err1){
              res.json({
                status:'1',
                msg:err.message,
                result:''
              });
            }else{
              if(goodsDoc){
                goodsDoc.productNum = 1;
                goodsDoc.checked = 1;
                userDoc.cartList.push(goodsDoc);
                userDoc.save(function(err2,doc){
                  if(err2){
                    res.json({
                      status:'1',
                      msg:err2.message,
                      result:''
                    });
                  }else{
                    res.json({
                      status:'0',
                      msg:'',
                      result:'购物车添加成功！'
                    });
                  }
                });
              }
            }
          });
        }
      }
    }
  });
});

//用户登录
router.post('/login', function(req, res, next) {
  var params = {
    userName:req.body.userName,
    userPwd:req.body.userPwd
  };
  Users.findOne(params,function(err,userDoc){
    if(err){
      res.json({
        status:'1',
        msg:err.message,
        result:''
      });
    }else{
      if(userDoc){
        //cookie  在服务端  响应
        res.cookie("userId",userDoc.userId,{
          paths:'/',
          maxAge:1000*60*60
        });
        res.cookie("userName",userDoc.userName,{
          path:'/',
          maxAge:1000*60*60
        });
        //session  在客户端  请求
        // req.session.user = userDoc;
        res.json({
          status:'0',
          msg:'',
          result:{
            userName:userDoc.userName
          }
        });
      }
    }
  });
});

//用户登出
router.post('/logout',function(req,res,next){
  res.cookie("userId","",{
    path:'/',
    maxAge:-1
  });
  res.cookie("userName","",{
    path:'/',
    maxAge:-1
  });
  res.json({
    status:'0',
    msg:'',
    result:''
  });
});

//检查用户是否登录
router.get('/checkLogin',function(req,res,next){
  if(req.cookies && req.cookies.userId){
    var userId = req.cookies.userId;
    if(userId){
      res.json({
        status:'0',
        msg:'',
        result:req.cookies.userName||''
      });
    }else{
      res.json({
        status:'1',
        msg:'未登录',
        result:''
      });
    }
  }
});

//购物车列表
router.get('/cart',function(req,res,next){
  if(req.cookies && req.cookies.userId){
    var userId = req.cookies.userId;
    var params = {
      userId:userId
    };
    Users.findOne(params,function(err,userDoc){
      if(err){
        res.json({
          status:'1',
          msg:err.message,
          result:''
        });
      }else{
        if(userDoc){
          res.json({
            status:'0',
            msg:'',
            result:userDoc.cartList
          });
        }
      }
    });
  }
});

//查询购物车数量
router.get('/getCartCount',function(req,res,next){
  if(req.cookies && req.cookies.userId){
    var userId = req.cookies.userId;
    var params = {
      userId:userId
    };
    Users.findOne(params,function(err,userDoc){
      if(err){
        res.json({
          status:'1',
          msg:err.message,
          result:''
        });
      }else{
        if(userDoc){
          var cartCount = 0;
          userDoc.cartList.forEach(function(item){
            cartCount += parseInt(item.productNum);
          });
          res.json({
            status:'0',
            msg:'',
            result:cartCount
          });
        }
      }
    });
  }
});

//购物车删除
router.post('/delCart',function(req,res,next){
  if(req.cookies && req.cookies.userId){
    var userId = req.cookies.userId;
    let productId = req.body.productId;
    var params = {
      userId:userId
    };
    Users.update(params,{$pull:{'cartList':{'productId':productId}}},function(err,doc){
      if(err){
        res.json({
          status:'1',
          msg:err.message,
          result:''
        });
      }else{
        if(doc){
          res.json({
            status:'0',
            msg:'',
            result:'删除成功！'
          });
        }
      }
    });
  }
});

//购物车编辑
router.post('/editCart',function(req,res,next){
  if(req.cookies && req.cookies.userId){
    var userId = req.cookies.userId;
    let productId = req.body.productId;
    let productNum = req.body.productNum;
    let checked = req.body.checked;
    Users.update({
        'userId':userId,
        'cartList.productId':productId
      },
      {
        'cartList.$.productNum':productNum,
        'cartList.$.checked':checked
      },function(err,cartDoc){
        if(err){
          res.json({
            status:'1',
            msg:err.message,
            result:''
          });
        }else{
          if(cartDoc){
            res.json({
              status:'0',
              msg:'',
              result:'更新成功！'
            });
          }
        }
      })
  }
});

//购物车全选
router.post('/checkAllCart',function(req,res,next){
  if(req.cookies && req.cookies.userId){
    var userId = req.cookies.userId;
    var params = {
      userId:userId
    };
    let checkAll = req.body.checkAll?'1':'0';
    Users.findOne(params,function(err,userDoc){
      if(err){
        res.json({
          status:'1',
          msg:err.message,
          result:''
        });
      }else{
        if(userDoc){
          userDoc.cartList.forEach(function(item){
            item.checked = checkAll;
          });
          userDoc.save(function(err1,doc){
            if(err1){
              res.json({
                status:'1',
                msg:err.message,
                result:''
              });
            }else{
              res.json({
                status:'0',
                msg:'',
                result:'全选成功！'
              });
            }
          })
        }
      }
    });
  }
});

//获取地址列表
router.get('/addressList',function(req,res,next){
  if(req.cookies && req.cookies.userId){
    var userId = req.cookies.userId;
    var params = {
      userId:userId
    };
    Users.findOne(params,function(err,userDoc){
      if(err){
        res.json({
          status:'1',
          msg:err.message,
          result:''
        });
      }else{
        if(userDoc){
          res.json({
            status:'0',
            msg:'',
            result:userDoc.addressList
          });
        }
      }
    });
  }
});

//设置默认地址
router.post('/setDefault',function(req,res,next){
  if(req.cookies && req.cookies.userId){
    var userId = req.cookies.userId;
    let addressId = req.body.addressId;
    var params = {
      userId:userId
    };
    Users.findOne(params,function(err,userDoc){
      if(err){
        res.json({
          status:'1',
          msg:err.message,
          result:''
        });
      }else{
        if(userDoc){
          userDoc.addressList.forEach(function(item){
            if(item.addressId == addressId){
              item.isDefault = true;
            }else{
              item.isDefault = false;
            }
          });
          userDoc.save(function(err1,doc){
            if(err1){
              res.json({
                status:'1',
                msg:err.message,
                result:''
              });
            }else{
              if(doc){
                res.json({
                  status:'0',
                  msg:'',
                  result:'设置成功！'
                });
              }
            }
          });
        }
      }
    });
  }
});

//删除地址
router.post('/delAddress',function(req,res,next){
  if(req.cookies && req.cookies.userId){
    var userId = req.cookies.userId;
    let addressId = req.body.addressId;
    var params = {
      userId:userId
    };
    Users.update(params,{$pull:{'addressList':{'addressId':addressId}}},function(err,doc){
      if(err){
        res.json({
          status:'1',
          msg:err.message,
          result:''
        });
      }else{
        if(doc){
          res.json({
            status:'0',
            msg:'',
            result:'删除地址成功！'
          })
        }
      }
    });
  }
});

//点击支付按钮生成订单
router.post('/payMent',function(req,res,next){
  if(req.cookies && req.cookies.userId){
    var userId = req.cookies.userId;
    var params = {
      userId:userId
    };
    let orderTotal = req.body.orderTotal;
    let addressId = req.body.addressId;
    Users.findOne(params,function(err,userDoc){
      if(err){
        res.json({
          status:'1',
          msg:err.message,
          result:''
        });
      }else{
        if(userDoc){
          var address = '',goodsList = [];
          //获取当前用户的地址信息
          userDoc.addressList.forEach(function(item){
            if(item.addressId == addressId){
              address = item.addressId;
            }
          });
          //获取用户购物车购买的商品
          userDoc.cartList.filter(function(item){
            if(item.checked == '1'){
              goodsList.push(item);
            }
          });

          var platform = '621';
          var r1 = Math.floor(Math.random()*10);
          var r2 = Math.floor(Math.random()*10);
          var sysDate = new Date().Format('yyyyMMddhhmmss');
          var createDate = new Date().Format('yyyy-MM-dd hh:mm:ss');
          var orderId = platform+r1+sysDate+r2;
          var order = {
            orderId:orderId,
            orderTotal:orderTotal,
            addressInfo:address,
            goodsList:goodsList,
            orderStatus:'1',
            createDate:createDate
          };
          userDoc.orderList.push(order);
          userDoc.save(function(err1,doc){
            if(err1){
              res.json({
                status:'1',
                msg:err.message,
                result:''
              });
            }else{
              res.json({
                status:'0',
                msg:'',
                result:{
                  orderId:order.orderId,
                  orderTotal:order.orderTotal
                }
              });
            }
          });
        }
      }
    });
  }
});

//根据订单Id查询订单信息
router.get('/orderDetail',function(req,res,next){
  if(req.cookies && req.cookies.userId){
    var userId = req.cookies.userId;
    var params = {
      userId:userId
    };
    let orderId = req.param("orderId");
    Users.findOne(params,function(err,userDoc){
      if(err){
        res.json({
          status:'1',
          msg:err.message,
          result:''
        });
      }else{
        if(userDoc){
          if(userDoc.orderList.length>0){
            var orderTotal = 0;
            userDoc.orderList.forEach(function(item){
              if(item.orderId == orderId){
                orderTotal = item.orderTotal;
              }
            });
            if(orderTotal>0){
              res.json({
                status:'0',
                msg:'',
                result:{
                  orderId:orderId,
                  orderTotal:orderTotal
                }
              });
            }else{
              res.json({
                status:'1002',
                msg:'',
                result:'无此订单！'
              });
            }
          }else{
            res.json({
              status:'1002',
              msg:'',
              result:'无此订单！'
            });
          }
        }
      }
    });
  }
});

module.exports = router;
