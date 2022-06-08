const _const = require('../common/mconst.js')
const moment = require('moment');

module.exports = class extends think.Controller {
  __before() {
    this.header("Access-Control-Allow-Origin","*")
    //首先检查账号是否激活
    const curAction = this.ctx.controller+'/'+this.ctx.action
    //不需要验证的api
    const noverifyAction = this.config('noverify')
    if(!noverifyAction.includes(curAction)){
      //检查当前的请求方式
      const postaction = this.config('postaction')
      if(postaction.includes(curAction) && !this.isPost){
        this.returnRequestError()
      }
    }
    //token
    const token = this.cookie("token")
    console.log("token:"+token)
    this.ctx.state.token = token
  }

  /**
   * 获取学校id
   * @returns {Promise<undefined|void|*>}
   */
  async getUserinfo() {
    const token = this.ctx.state.token
    if (token) {
      const _service = this.service('token', '')
      const sid = await _service.getSchoolId(token)
      const uid = await _service.getUserId(token)
      return {sid: sid, uid: uid}
    }
    return undefined
  }


  /**
   * 获取时间格式
   */
  getDateFormat(){
    let date = new Date();
    return moment(date.toGMTString()).format('YYYY-MM-DD HH:mm:ss');
  }

  /**
   *  获取年月日格式的日期
   * @returns {string}
   */
  getDateYMDFormat(){
    let date = new Date();
    return moment(date.toGMTString()).format('YYYY-MM-DD');
  }

  /**
   * 返回View
   * @param _view
   * @returns {*}
   */
  async returnView(_view){
    if(_view == undefined){
      return this.display()
    }
    const info = await this.getUserinfo()
    if(info){
      this.assign("sid",info.sid)
    }
    return this.display(_view)
  }

  /**
   * 返回结果
   * @param result
   */
  returnResult(result){
    this.session("token","123456")
    this.success(result)
  }

  /**
   * 返回json数据
   * @param result
   */
  returnJson(result){
    this.ctx.json(result)
  }

  /**
   * 删除班级失败
   */
  returnDelClassError(){
    this.fail(_const.CODE_ERR_CLASSMEMBER,_const.MSG_CLASSMEMBER,{})
  }

  /**
   * 请求方式出错
   */
  returnRequestError(){
    this.fail(_const.CODE_ERR_REQUEST,_const.MSG_REQUEST,{})
  }

  /**
   * 登录错误
   */
  returnLoginError(){
    this.fail(_const.CODE_ERR_LOGIN,_const.MSG_LOGIN,{})
  }

  /**
   * 操作错误
   */
  returnError(){
    this.fail(_const.CODE_ERR,_const.MSG_ERR,{})
  }

};
