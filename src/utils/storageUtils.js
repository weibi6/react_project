/* 进行local数据存储管理的工具模块 */
/* 方法一：原生js本地存储， 缺点：对某些低版本浏览器不支持 */
//const USER_KEY = 'user_key';
//export default {
    /* 保存user */
    /* saveUser (user) {
        localStorage.setItem(USER_KEY, JSON.stringify(user))
    }, */
    /* 读取user */
    /* getUser () {
        return JSON.parse(localStorage.getItem() || '{}')
    }, */
    /* 删除user */
    /* removeUser () {
        localStorage.removeItem(USER_KEY)
    } */
//}
/* 方法二：引入store库，支持低版本浏览器 */
var store = require('store');
const USER_KEY = 'user_key';
export default {
    /* 保存user */
    saveUser (user) {
        store.set(USER_KEY, user)
    },
    /* 读取user */
    getUser () {
        return store.get(USER_KEY) || {}
    },
    /* 删除user */
    removeUser () {
        store.remove(USER_KEY)
    }
}