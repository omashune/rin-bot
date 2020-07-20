module.exports = class Utils {

    /**
     * @description Compare one string to another string, ignoring case
     * @param {String} a first string
     * @param {String} b second string
     */
    static compare(a, b) {
        return new RegExp(`^${a}$`, 'i').test(b);                
    }

}