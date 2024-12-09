import dbUtils from './util.strotage.js'

/**
 * 检查路由对象是否具有权限
 * @param {Array} perms - 权限列表
 * @param {Object} route - 路由对象
 * @returns {boolean} - 是否具有权限
 */
export const hasPermission = (perms, route) => {
    if (perms.includes('*')) return true
    if (route.meta && route.meta.perms) {
        // 如果路由对象定义了 meta 属性或者定义 meta.perms 属性，那么就根据权限值来判断是否具有权限
        return perms.some(perm => route.meta.perms.includes(perm))
    } else {
        // 如果路由对象没有定义 meta 属性或者没有定义 meta.perms 属性，那么默认认为具有权限，返回 true。
        return true
    }
}
/**
 * 检查指定权限是否具有权限
 * @param {String} auth - 权限 sys:menus:list
 */
export const hasPermAuth = (auth) => {
    const perms = dbUtils.get('perms')
    if (perms.includes('*')) return true
    return perms.includes(auth)
}
