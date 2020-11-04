/*
 * 迭代一代码，主要完成给单词分级以及单词提供功能
 */

var wxCharts = require('../../utils/wxcharts.js');

var app = getApp();
var pieChart = null;

Page({
  data: {
    time: "",
    cpt: false,
    counter: {},                          //存储当前单词号码
    today_new_word: 0,
    dis: false,   
    id3: 3,
    id4: 4,
    today_num: 0,
    today_word: [],
    task_detail: {}
  },
  onLoad: function(options) {
    var time=this.set_time(new Date())
    this.setData({
      time: time,        //日期
      day_num: wx.getStorageSync('day_task'), //每天任务量

    })
    if(!wx.getStorageSync('today_detail') || wx.getStorageSync('today_detail')===undefined){
      wx.setStorage({
        key: 'today_detail',
        data: { "day": this.data.time, "rem": 0, "mohu": 0, "forget": 0 }
      })
    }



    //数据初始化处获取背诵所需单词
    this.setData({
      book: wx.getStorageSync('book'),//从文件book中读取所需的单词
      today_word: wx.getStorageSync('today_word'),
      task_detail: wx.getStorageSync("task_detail"),
      today_new_num: wx.getStorageSync("today_new_num")//新的今日所需背诵单词数目s
    })

   
  




  //设置背单词当天日期
  set_time: function(date) {
    var month = date.getMonth() + 1
    var day = date.getDate()
    var year = date.getFullYear()
    const formatNumber = n => {
      n = n.toString()
      return n[1] ? n : '0' + n
    }
    return [year, month, day].map(formatNumber).join('/')

  },


    //设置单词等级
   

    pieChart = new wxCharts({
      animation: true,
      canvasId: 'pieCanvas',
      type: 'pie',
      series: [{
        name: '认识',
        data: chart_detail.rem,
      }, {
        name: '模糊',
        data: chart_detail.mohu,
      }, {
        name: '忘记',
        data: chart_detail.forget,
      }],
      width: windowWidth,
      height: 220,
      dataLabel: true,
    });


  

  },

  




    //按照单词等级设置单词的权值
    var len = today_detail.length;
    for (var i = 0; i < len; i++) {
      last_list[i].day = 0;
      if (today_detail[i].rem >= 1) {
        last_list[i].ease = last_list[i].ease + 0.05;
      } else {
        if (today_detail[i].mohu < today_detail[i].forget) {
          last_list[i].ease = last_list[i].ease - 0.1;
        } else last_list[i].ease = last_list[i].ease - 0.05;
      }
    }

    //单词乱序
    var len2 = list.length;
    for (var i = len; i < len2; i++) {
      list[i].day++;
    }
    for (var i = 0; i < len2; i++) {
      for (var j = i + 1; j < len2; j++) {
        if (list[j].ease < list[i].ease) {
          var temp = list[j];
          list[j] = list[i];
          list[i] = temp;
        }
      }
    }
    wx.setStorageSync("word_list", list);
  },

  
  