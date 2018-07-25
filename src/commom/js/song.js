import {getLyric1} from '../../api/song'
import {ERR_OK} from '../../api/config'
import {Base64} from 'js-base64'

export default class Song {
  constructor ({songid, songmid, songname, singer, songalbum, interval, songImage, url, singermid, albumname}) {
    this.songid = songid
    this.songmid = songmid
    this.songname = songname
    this.singer = singer
    this.songalbum = songalbum
    this.interval = interval
    this.songImage = songImage
    this.url = url
    this.singermid = singermid
    this.albumname = albumname
  }

  getLyric () {
    if (this.lyric) {
      return Promise.resolve(this.lyric)
    }
    return new Promise((resolve, reject) => {
      getLyric1(this.songmid).then((res) => {
        if (res.code === ERR_OK) {
          console.log('获取歌词成功')
          this.lyric = Base64.decode(res.lyric)
          resolve(this.lyric)
        } else {
          reject(new Error('no lyric'))
        }
      })
    })
  }
}
// song实例
export function createSong (musicData) {
  return new Song({
    songid: musicData.songid,
    songmid: musicData.songmid,
    singer: filterSinger(musicData.singer),
    songname: musicData.songname,
    songalbum: musicData.albumname,
    interval: musicData.interval,
    songImage: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=2592000`,
    url: `http://dl.stream.qqmusic.qq.com/${musicData.songmid}.m4a?fromtag=66`,
    singermid: musicData.singermid,
    albumname: musicData.albumname
  })
}

// let url1 = 'http://dl.stream.qqmusic.qq.com/C400001Qu4I30eVFYb.m4a?vkey=B0CCDBB64D725C4BD8E85C902ADB3EB2853A9E571F339420B7105C34A6998F59E38F1698287D0D7E0622CBE99A77FEDC75637B39BA6E089C&guid=3185011594&uin=963284117&fromtag=66'
// let url2 = 'http://dl.stream.qqmusic.qq.com/C400000QCwge3B6Ad1.m4a?vkey=4661D3DC14F693C5D208C1AB664CB99A1FE4A1F08DF020BC1A8CB6ADADAA76FE45F6E7C5D2574FB3774CC1F82E214C33E990CD879882545E&guid=3185011594&uin=963284117&fromtag=66'
function filterSinger (singer) {
  let ret = []
  if (!singer) {
    return ''
  }
  singer.forEach((item) => {
    ret.push(item.name)
  })
  return ret.join('/')
}
