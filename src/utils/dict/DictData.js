/**
 * @classdesc Dictionary Data
 * @property {String} label Label
 * @property {*} value Label
 * @property {Object} raw original data
 */
export default class DictData {
  constructor(label, value, raw) {
    this.label = label
    this.value = value
    this.raw = raw
  }
}
