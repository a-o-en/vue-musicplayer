import OriginJsonp from 'jsonp'

export default function jsonp (url, data, options) {
  let realURL = url + (url.indexOf('?') < 0 ? '?' : '&') + getParams(data)
  return new Promise((resolve, reject) => {
    // 注册回调函数在window上， jsonp 返回的是js,然后执行。
    // 因为它是异步的。 OriginJsonp(url, options, fn) 其实只是执行这个。
    OriginJsonp(realURL, options, (err, data) => {
      if (!err) {
        resolve(data)
      } else {
        reject(data)
      }
    })
    // 因为它是异步的。
  })
}

export function getParams (data) {
  let url = ''
  for (let k in data) {
    let value = data[k] !== undefined ? data[k] : ''
    url += '&' + k + '=' + encodeURIComponent(value)
    // let str = `&${k}=${data[k]}`
    // url += str
  }
  return url.substring(1)
}
