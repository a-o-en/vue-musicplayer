import jsonp from 'commom/js/jsonp'
import {commomParams, options} from './config'

export function getSingerList () {
  const url = 'https://c.y.qq.com/v8/fcg-bin/v8.fcg'

  const data = Object.assign({}, commomParams, {
    channel: 'singer',
    page: 'list',
    key: 'all_all_all',
    pagesize: 100,
    pagenum: 1,
    hostUin: 0,
    needNewCode: 0,
    platform: 'yqq'
  })

  return jsonp(url, data, options)
}

// 这个函数是 根据tag获取 对应的数据
export function getSingerList1 (params) {
  const url = 'https://u.y.qq.com/cgi-bin/musicu.fcg'

  const data = Object.assign({}, commomParams, {
    loginUin: 963284117,
    hostUin: 0,
    format: 'jsonp',
    platform: 'yqq',
    needNewCode: 0,
    data: `{"comm":{"ct":24,"cv":10000},
    "singerList":{"module":"Music.SingerListServer",
    "method":"get_singer_list",
    "param":{"area":${params.area},"sex":${params.sex},"genre":${params.genre},"index":${params.index},"sin":0,"cur_page":1}}}`
  })

  return jsonp(url, data, {
    params: 'callback'
  })
}

export function getSingerDetail (id) {
  const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_singer_track_cp.fcg'

  const data = Object.assign({}, commomParams, {
    format: 'jsonp',
    loginUin: 963284117,
    hostUin: 0,
    begin: 0,
    num: 30,
    songstatus: 1,
    platform: 'yqq',
    needNewCode: 0,
    singermid: id,
    order: 'listen'
  })
  return jsonp(url, data, options)
}

export function getVKey (mid) {
  if (mid === undefined) {
    console.log(mid)
    return
  }
  const url = 'https://c.y.qq.com/base/fcgi-bin/fcg_music_express_mobile3.fcg'
  const data = Object.assign({}, commomParams, {
    format: 'json',
    loginUin: 963284117,
    hostUin: 0,
    songstatus: 1,
    platform: 'yqq',
    needNewCode: 0,
    cid: '205361747',
    songmid: mid,
    filename: `C400${mid}.m4a`,
    guid: '3185011594'
  })
  return jsonp(url, data, {
    params: 'callback'
  })
}

// let url = 'http://dl.stream.qqmusic.qq.com/C400000QCwge3B6Ad1.m4a?vkey=1B697B54702074330FA7D5415EAB3160556EE0B4B6817BE1ABE05A7D07E6E5D6834EC7ECB6FA4590FCA9D65E0C914CE5D84CA0AA79667829&guid=3185011594&uin=963284117&fromtag=66'
