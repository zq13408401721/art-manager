const RandomStr = "A0B1C2D3E4F5G6H7I8J9K0L1M2N3O4P5Q6R7S8T9U0V1W2X3Y4Z5"

const SchoolStr = "a1b2c3d4e5f6g7h8i9j0k9l8m7n6o5q4r3s2t1u0v1w2x3y4z"

module.exports = {
    CODE_ERR_REQUEST:10000,
    CODE_ERR_LOGIN:10001,
    CODE_ERR_CLASSEXIST:10002,
    CODE_ERR:10003,
    CODE_ERR_NOMEMBER:10004,
    CODE_ERR_NOACTIVECODE:10005,
    CODE_ERR_CLASSMEMBER:10006,
    CODE_ERR_PASSWORD:10007,
    MSG_REQUEST:"请求方式错误",
    MSG_LOGIN:"账号密码错误",
    MSG_CLASSEXIST:"班级名已存在",
    MSG_ERR:"未知错误",
    MSG_NOMEMBER:"没有未激活账号",
    MSG_NOACTIVECODE:"没有未使用激活码",
    MSG_CLASSMEMBER:"班级中有成员不能删除",
    MSG_PASSWORD:"密码错误",


    /**
     * 随机激活码
     * @param no
     * @returns {string}
     */
    randomCode(no){
        var str = ""
        var index=0
        while(index < no){
            index++
            var start = Math.random()*RandomStr.length;
            str += RandomStr.substring(start,start+1)
        }
        return str;
    },

    /**
     * 学校
     * @param no
     */
    schoolIdCode(no){
        var code = ""
        var index = 0
        while (index < no){
            index++
            var start = Math.random()*SchoolStr.length;
            code += RandomStr.substring(start,start+1)
        }
        return parseInt(new Date().getTime()/1000)+code
    }
}

