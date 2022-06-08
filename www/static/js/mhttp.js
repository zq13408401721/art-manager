var base_url = "http://127.0.0.1:12006/";

/**
 * post网络情趣
 * @param action 接口
 * @param param 参数
 * @param cb 回调函数
 */
function post(action,param,cb){
    $.post(base_url+action,param,function(data,status){
        console.log("result:"+data+"status:"+status);
        cb(data);
    })
};


/**
 * get网络请求
 * @param action 请求接口
 * @param cb回调函数
 */
function get(action,cb){
    $.get(base_url+action,function(data,statuc){
        console.log("get返回："+data+"statuc:"+status)
        cb(data)
    })
};
