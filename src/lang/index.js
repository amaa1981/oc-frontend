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
    // Set locale Options en | zh
    locale: Cookies.get('language') || 'en',
    // Message bundles
    messages
})

// Use this helper outside Vue SFCs
export const translate = (localeKey) => {
    const locale = Cookies.get('language') || 'en'
    const hasKey = i18n.te(localeKey, locale)  // Use i18n te() to check if key exists
    const translatedStr = i18n.t(localeKey)
    if (hasKey) {
        return translatedStr
    }
    return localeKey
}

export default i18n