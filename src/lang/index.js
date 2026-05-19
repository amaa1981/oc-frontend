/*
 * @Descripttion: 
 * @version: 
 * @Author: FGJ
 * @Date: 2023-05-31 16:51:09
 * @LastEditors: FGJ
 * @LastEditTime: 2023-07-10 14:01:35
 */
import Vue from 'vue'
import VueI18n from 'vue-i18n'
import Cookies from 'js-cookie'
import elementEnLocale from 'element-ui/lib/locale/lang/en' // element-ui lang
import elementZhLocale from 'element-ui/lib/locale/lang/zh-CN'// element-ui lang
import enLocale from './en'
import zhLocale from './zh'
Vue.use(VueI18n)

const messages = {
    en: {
        ...enLocale,
        ...elementEnLocale
    },
    zh: {
        ...zhLocale,
        ...elementZhLocale
    },

}

const i18n = new VueI18n({
    // 设置语言 选项 en | zh
    locale: Cookies.get('language') || 'en',
    // 设置文本内容
    messages
})

// 非 vue 文件中使用这个方法
export const translate = (localeKey) => {
    const locale = Cookies.get('language') || 'en'
    const hasKey = i18n.te(localeKey, locale)  // 使用i18n的 te 方法来检查是否能够匹配到对应键值
    const translatedStr = i18n.t(localeKey)
    if (hasKey) {
        return translatedStr
    }
    return localeKey
}

export default i18n