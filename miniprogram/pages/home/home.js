const db = wx.cloud.database()
Page({
    data: {
        showModal: false,
        start: '做个决定吧',
        food: '今天吃什么？',
        foodList: "小龙虾 水饺 烧烤 黄焖鸡 沙县小吃 过桥米线 麻辣烫 盖饭 炸鸡汉堡 烤肉拌饭 吃土",
        timer: null,
        foodName: '',
        flag:1,
        openid: ''
    },
    // 页面加载时获取openid
    onLoad: function (options){
        let that = this;
        wx.cloud.callFunction({
         name: 'getOpenId',
         complete: res => {
          console.log('云函数获取到的openid: ', res.result.openid)
          var openid = res.result.openid;
          that.setData({
           openid: openid
          })
          console.log("ss",openid)
         }
        })
    },
   
 

    //开始和停止按钮 
    btnEvent(event) {
        var that = this;
        let food=that.data.foodList.split(/[\s\n]/);//将字符串拆分成数组
        var num = food.length;
        console.log(food,num)
        var i = 0;
        if (this.data.flag === 1) {
            that.setData({ start: '停止' });
            that.timer = setInterval(
                () => {
                    let nowFood = food[i];
                    that.setData({
                        food: nowFood ? nowFood : null
                    });
                    i = (i + 1) % num;
                    console.log(i);
                }, 100)
        }
        if (this.data.flag === 0) {
            console.log(0);
            clearInterval(that.timer)
            that.setData({ start: '不想吃?换一个' })
            
        }
        let nowFlag = this.data.flag === 0 ? 1 : 0
        this.setData({
            flag: nowFlag
        })
    },
    // 获取添加的菜名
    foodInput: function(e) {
        console.log("foodinput")
        this.setData({
            foodName: e.detail.value
        })
    },
    // 清空菜单
    tonull:function(){
       this.setData({
       foodList:''
    })
    },
    // 增加菜单
    addFood: function(e) {
        //如果在弹窗中输入了菜名，则清空原来的foodList，将弹窗中数据绑定给foodlist
        if(this.data.foodName!=''){
            this.tonull
        this.setData({
            foodList: this.data.foodName,
            showModal:false
        })
        //更新foodList
            db.collection('menu').
            doc(this.data.openid)
            .update({
                // data 字段表示需新增的 JSON 数据
                data: {
                  foodList:this.data.foodList
                }
              })
    }else{
        this.setData({
            showModal:false
        })
    }
    },
 

    //打开弹窗
    eject:function(){
      //  查询数据库中用户的foodList
        db.collection("menu")
        .doc(this.data.openid)
         .get()
         .then(res => {
        //先把foodList清空
        this.tonull
        //查询到将结果绑定到foodList
            this.setData({
            foodList:res.data.foodList
              })
         }).catch(err=>{
            //  没有查询到数据，则说明数据库中未保存用户信息，在这里进行新增
            db.collection('menu').add({
                // data 字段表示需新增的 JSON 数据
                data: {
                   _id: this.data.openid,
                  foodList:this.data.foodList
                }
              })
          })
        this.setData({
          showModal:true
        })
      },
   //关闭弹窗
      back:function(){
        this.setData({
          showModal:false
        })
      },
      /**
      * 获取input输入值
      */
      wish_put:function(e){
        this.setData({
          textV:e.detail.value
        })
      },
      /**
      * 点击确定按钮获取input值并且关闭弹窗
      */
      name:function(){
        this.setData({
            showModal:false,
          })
        },
        /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function (res) {
        return {
            title: '今天吃什么鸭',
            path: '/pages/home/home',
           imageUrl: 'https://7379-sy-5gjwc3zn49bc5ab6-1306280710.tcb.qcloud.la/%E9%A2%86%E5%88%B8/%E5%90%83%E4%BB%80%E4%B9%88%E9%B8%AD.jpg?sign=1467d82dcd82dbd2b6bbf73e7a9fb2d8&t=1625745996'
        }
    },
    onShareTimeline: function (res) {
        return {
            title: '想不到吃什么，来这试试呀',
            path: '/pages/home/home',
            imageUrl: 'https://7379-sy-5gjwc3zn49bc5ab6-1306280710.tcb.qcloud.la/%E9%A2%86%E5%88%B8/%E5%90%83%E4%BB%80%E4%B9%88%E9%B8%AD.jpg?sign=1467d82dcd82dbd2b6bbf73e7a9fb2d8&t=1625745996',
        }
    }
})


