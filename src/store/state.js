import {playMode} from 'commom/js/config'
import {loadStorage} from '../api/cache'

const state = {
  kinds: [-100, -100, -100, -100], // index, area, sex, genre
  singer: {},
  playing: false,
  fullScreen: false,
  playlist: [],
  sequenceList: [],
  mode: playMode.sequence,
  currentIndex: -1,
  disc: {},
  topList: {},
  query: '',
  searchHistory: loadStorage()
}
export default state
