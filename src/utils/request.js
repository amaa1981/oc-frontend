import axios from 'axios'
import { Notification, MessageBox, Message, Loading } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'
import errorCode from '@/utils/errorCode'
import { tansParams, blobValidate } from "@/utils/ruoyi";
import cache from '@/plugins/cache'
import { saveAs } from 'file-saver'
import { translate as $t } from "@/lang"

let downloadLoadingInstance;
// Whether to show re-login prompt
export let isRelogin = { show: false };

axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8'
// Create axios instance
const service = axios.create({
  // The request configuration in axios has baseURLOptions, which indicates the public part of the request URL.
  baseURL: process.env.VUE_APP_BASE_API,
  // timeout in ms (1000 = 1 second)
  timeout: 60000
})

// request interceptor
service.interceptors.request.use(config => {
  // Whether to attach token
  const isToken = (config.headers || {}).isToken === false
  // Do you need to prevent data duplication?Submit
  const isRepeatSubmit = (config.headers || {}).repeatSubmit === false
  if (getToken() && !isToken) {
    config.headers['Authorization'] = 'Bearer ' + getToken() // Let each request carry customizationtoken Please make your own decisions based on the actual situationEdit
    // config.headers["Locale"] = "en";
  }
  // Serialize GET query params into URL
  if (config.method === 'get' && config.params) {
    let url = config.url + '?' + tansParams(config.params);
    url = url.slice(0, -1);
    config.params = {};
    config.url = url;
  }
  if (!isRepeatSubmit && (config.method === 'post' || config.method === 'put')) {
    const requestObj = {
      url: config.url,
      data: typeof config.data === 'object' ? JSON.stringify(config.data) : config.data,
      time: new Date().getTime()
    }
    const sessionObj = cache.session.getJSON('sessionObj')
    if (sessionObj === undefined || sessionObj === null || sessionObj === '') {
      cache.session.setJSON('sessionObj', requestObj)
    } else {
      const s_url = sessionObj.url;                  // Request URL
      const s_data = sessionObj.data;                // Request data
      const s_time = sessionObj.time;                // Request time
      const interval = 1000;                         // Interval time(ms)，Anything less than this time will be considered a repeatSubmit
      if (s_data === requestObj.data && requestObj.time - s_time < interval && s_url === requestObj.url) {
        const message = $t('axiosConfig.submitRepeatTip');
        console.warn(`[${s_url}]: ` + message)
        return Promise.reject(new Error(message))
      } else {
        cache.session.setJSON('sessionObj', requestObj)
      }
    }
  }
  return config
}, error => {
  console.log(error)
  Promise.reject(error)
})

// response interceptor
service.interceptors.response.use(res => {

  // Default to success when status code is missing
  const code = parseInt(res.data.code);
  // Resolve error message
  const msg = errorCode[code] || res.data.msg || errorCode['default']
  // Binary data is directly Back
  if (res.request.responseType === 'blob' || res.request.responseType === 'arraybuffer') {
    return res.data
  }

  if (code === 401) {
    if (!isRelogin.show) {
      isRelogin.show = true;
      MessageBox.confirm($t('axiosConfig.loginTimeout'), $t('axiosConfig.systemTip'), { confirmButtonText: $t('axiosConfig.loginAgain'), cancelButtonText: $t('axiosConfig.cancel'), type: 'warning' }).then(() => {
        isRelogin.show = false;
        store.dispatch('LogOut').then(() => {
          location.href = '/index';
        })
      }).catch(() => {
        isRelogin.show = false;
      });
    }
    return Promise.reject($t('axiosConfig.sessionTimeout'))
  } else if (code === 500) {
    Message({ message: msg, type: 'error' })
    return Promise.reject(new Error(msg))
  } else if (code === 601) {
    Message({ message: msg, type: 'warning' })
    return Promise.reject('error')
  } else if (code !== 200) {
    Notification.error({ title: msg })
    return Promise.reject('error')
  } else {
    return res.data
  }
},
  error => {
    console.log('err' + error)
    let { message } = error;
    if (message == "Network Error") {
      message = $t('axiosConfig.networkError');
    } else if (message.includes("timeout")) {
      message = $t('axiosConfig.requestTimeout');
    } else if (message.includes("Request failed with status code")) {
      message = $t('axiosConfig.apiError', { api: message.substr(message.length - 3) });
    }
    Message({ message: message, type: 'error', duration: 5 * 1000 })
    return Promise.reject(error)
  }
)

// Common download helper
export function download(url, params, filename, config) {
  downloadLoadingInstance = Loading.service({ text: $t('axiosConfig.downloadText'), spinner: "el-icon-loading", background: "rgba(0, 0, 0, 0.7)", })
  return service.post(url, params, {
    transformRequest: [(params) => { return tansParams(params) }],
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    responseType: 'blob',
    ...config
  }).then(async (data) => {
    const isBlob = blobValidate(data);
    if (isBlob) {
      const blob = new Blob([data])
      saveAs(blob, filename)
    } else {
      const resText = await data.text();
      const rspObj = JSON.parse(resText);
      const errMsg = errorCode[rspObj.code] || rspObj.msg || errorCode['default']
      Message.error(errMsg);
    }
    downloadLoadingInstance.close();
  }).catch((r) => {
    console.error(r)
    Message.error($t('axiosConfig.downloadError'))
    downloadLoadingInstance.close();
  })
}

export default service
