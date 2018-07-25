import axios from 'axios'
import {commomParams} from './config'

export function getLyric1 (songmid) {
  const url = 'api/getLyric'
  const data = Object.assign({}, commomParams, {
    pcachetime: +new Date(),
    songmid: songmid,
    platform: 'yqq',
    hostUin: 0,
    needNewCode: 0,
    categoryId: 10000000,
    format: 'jsonp'
  })

  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}
