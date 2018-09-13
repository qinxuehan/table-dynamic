/**
* @Author: jianglei
* @Date:   2017-10-12 12:06:49
  @Author2: qinxuehan
* @Date:   2018-9-13 16:33
*/
'use strict'
import Vue from 'vue'
export default function treeToArray (data, expandAll, parent = null, level = null) {
  let tmp = []
  Array.from(data).forEach(function (record) {
    if (record._expanded === undefined) {
      Vue.set(record, '_expanded', expandAll)
    }
    let _level = 1
    if (level !== undefined && level !== null) {
      _level = level + 1
    }
    Vue.set(record, '_level', _level)
    // 如果有父元素
    if (parent) {
      Vue.set(record, 'parent', parent)
    }
    tmp.push(record)
    if (record.childrenNote && record.childrenNote.length > 0) {
      const childrenNote = treeToArray(record.childrenNote, expandAll, record, _level)
      tmp = tmp.concat(childrenNote)
    }
    // console.log(record);
  })
  return tmp
}
