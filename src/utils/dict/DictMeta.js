import { mergeRecursive } from "@/utils/ruoyi";
import DictOptions from './DictOptions'

/**
 * @classdesc dictionary metadata
 * @property {String} type type
 * @property {Function} request request
 * @property {String} label Label field
 * @property {String} value value field
 */
export default class DictMeta {
  constructor(options) {
    this.type = options.type
    this.request = options.request
    this.responseConverter = options.responseConverter
    this.labelField = options.labelField
    this.valueField = options.valueField
    this.lazy = options.lazy === true
  }
}


/**
 * Parse dictionary metadata
 * @param {Object} options
 * @returns {DictMeta}
 */
DictMeta.parse= function(options) {
  let opts = null
  if (typeof options === 'string') {
    opts = DictOptions.metas[options] || {}
    opts.type = options
  } else if (typeof options === 'object') {
    opts = options
  }
  opts = mergeRecursive(DictOptions.metas['*'], opts)
  return new DictMeta(opts)
}
