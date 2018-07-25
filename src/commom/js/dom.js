export function hasClass (el, className) {
  // console.log(el.className)  这里正则表达式错误
  let reg = new RegExp('(^|\\s)' + className + '(\\s|$)')
  return reg.test(el.className)
}

export function addClass (el, className) {
  if (hasClass(el, className)) {
    return
  }
  let newClass = el.className.split(' ')
  newClass.push(className)
  el.className = newClass.join(' ')
}

export function setStyle (el, styleCss) {
  if (!el) {
    return
  }
  for (let key in styleCss) {
    el.style[key] = styleCss[key]
  }
}
