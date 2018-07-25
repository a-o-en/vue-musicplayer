import jsonp from 'commom/js/jsonp'
import {commomParams, options} from './config'
import axios from 'axios'

export function getRecommend () {
  const url = 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg'
  const data = Object.assign({}, commomParams, {
    platform: 'h5',
    uin: 963284117,
    needNewCode: 1,
    format: 'json'
  })
  return jsonp(url, data, options)
}

export function getDiscList2 () {
  const url = '/api/getDiscList'

  const data = Object.assign({}, commomParams, {
    picmin: 1,
    hostUin: 0,
    rnd: Math.random(),
    g_tk: 1776477251,
    loginUin: 963284117,
    platform: 'yqq',
    needNewCode: 0,
    categoryId: 10000000,
    sortId: 5,
    sin: 0,
    ein: 29,
    format: 'json'
  })

  return axios.get(url, {
    params: data
  }).then((res) => {
    // console.log('recommend里面的res:')
    return Promise.resolve(res.data)
  })
}

export function getDiscList1 () {
  const url = 'http://192.168.42.167:3000/getDiscList'

  const data = Object.assign({}, commomParams, {
    picmin: 1,
    hostUin: 0,
    rnd: Math.random(),
    g_tk: 1776477251,
    loginUin: 963284117,
    platform: 'yqq',
    needNewCode: 0,
    categoryId: 10000000,
    sortId: 5,
    sin: 0,
    ein: 29,
    format: 'json',
    t: new Date().getTime()
  })

  return axios.get(url, {
    params: data
  }).then((res) => {
    console.log('recommend里面的res:')
    return Promise.resolve(res.data)
  })
}

export function getDiscSongList (disstid) {
  const url = 'http://192.168.42.167:3000/getDiscSongList'

  const data = Object.assign({}, commomParams, {
    disstid,
    type: 1,
    json: 1,
    utf8: 1,
    onlysong: 0,
    platform: 'yqq',
    hostUin: 0,
    needNewCode: 0,
    format: 'json'
  })

  return axios.get(url, {
    params: data
  }).then((res) => {
    // console.log('getDiscSongList里面的res:')
    // console.log(res) 输出就知道为什么是res.data了
    return Promise.resolve(res.data)
  })
}
