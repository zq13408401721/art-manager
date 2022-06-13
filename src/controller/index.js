const Base = require('./base.js');
const _mconst = require('../common/mconst.js')

const xlsx = require('node-xlsx');
const fs = require("fs");

//本地static目录绝对路径
const PUBLIC_PATH = "/home/server/manager/server/www/static/";
//const PUBLIC_PATH = "/Users/zhangquan/work/art/school/server/server/";

module.exports = class extends Base {

  /**
   * 登录接口方法
   * @returns {Promise<void>}
   */
  async loginAction(){
    if(this.isGet){
      return this.returnView("login.html")
    }else{
      const _username = this.post("username")
      const _pw = this.post("password")
      const result = await this.model("index").login({username:_username,password:_pw})
      if(result != undefined && result.id != undefined){
        const TokenSerivce = this.service('token', '');
        const sessionKey = await TokenSerivce.create({user_id:result.id,schoolid:result.school_id});
        const cookie = this.cookie('token',sessionKey)
        console.log("cookie:"+cookie)
        //await this.session(result.uid,)
        //menu
        //const menu = await this.model("index").menuList({schoolid:result.school_id})

        this.returnResult({url:"http://127.0.0.1:12006/mclass/classmanager",name:result.name})
        //this.returnResult({url:"http://res.yimios.com:9080/mclass/classmanager",name:result.name})
      }else{
        this.returnLoginError()
      }
    }
  }

  async indexAction() {
    return this.returnView("login.html")
  }

  /**
   * 重置用户密码
   * @returns {Promise<void>}
   */
  async resetUserPasswordAction(){
    const uid = this.post("uid")
    const initialpw = this.post("initialpw")
    if(uid){
      const pw = think.md5(initialpw)
      const result = await this.model("index").resetpw({uid:uid,passwordtxt:initialpw,password:pw})
      return this.returnResult(result)
    }else{
      return this.returnError()
    }
  }

  /**
   * 生成学校excel账号表提供下载
   * @returns {Promise<void>}
   */
  async schoolMembersExcelAction(){
    const info = await this.getUserinfo()
    if(info){
      let xlsxObj = [{
        name:"账号",
        //二维数组 1列名  2行数据
        data:[["班级","账号","密码","姓名","身份","激活码"]]
      }]

      //查询学校还未激活的账号
      const schooluser = await this.model("index").unuseMemberBySchool({schoolid:info.sid,active:0})
      //查询学校还未激活的激活码
      const schoolcode = await this.model("index").unuseCodeBySchool({schoolid:info.sid,active:0})
      if(schooluser == undefined || schooluser.length == 0){
        return this.fail(_mconst.CODE_ERR_NOMEMBER,_mconst.MSG_NOMEMBER)
      }
      if(schoolcode == undefined || schoolcode.length == 0){
        return this.fail(_mconst.CODE_ERR_NOACTIVECODE,_mconst.MSG_NOMEMBER)
      }
      //查询学校班级
      const classinfo = await this.model("index").queryClass({sid:info.sid,active:1})
      const lg = Math.min(schooluser.length,schoolcode.length)
      for(var i=0; i<lg; i++){
        var arr = []
        if(classinfo && i < classinfo.length){
          arr.push(classinfo[i].name)
        }else{
          arr.push("")
        }
        arr.push(schooluser[i].username)
        arr.push(schooluser[i].passwordtxt)
        arr.push(schooluser[i].nickname == undefined ? "" : schooluser[i].nickname)
        arr.push(schooluser[i].role == 1 ? "老师" : "学生")
        arr.push(schoolcode[i].code)
        xlsxObj[0].data.push(arr)
      }

      let buffer = xlsx.build(xlsxObj)
      await fs.writeFileSync(PUBLIC_PATH+'/excel/'+info.sid+"-账号.xlsx",buffer)
      return this.success({downurl:"http://res.yimios.com:9080/static/excel/"+info.sid+"-账号.xlsx"})
    }
  }

  /**
   * 创建学校
   * @returns {Promise<void>}
   */
  async createSchoolAction(){
    const name = this.post("name")
    const schoolid = _mconst.schoolIdCode(9)
    const time = this.getDateFormat()
    const option = {
      name:name,
      sid:schoolid,
      time:time,
      active:1,
      vip:1,
      activedate:time
    }
    const result = await this.model("index").createSchool(option)
    if(result){
      return this.returnResult(result)
    }
  }

  /**
   * 管理员信息页面
   * @returns {Promise<void>}
   */
  async admininfoViewAction(){
    this.assign("titlename","管理员信息")
    this.assign("currentmenu","admininfo")
    return this.returnView("m_userinfo.html")
  }

  /**
   * 后台管理修改密码
   * @returns {Promise<void>}
   */
  async editorPwAction(){
    const info = await this.getUserinfo()
    if(info){
      //现在的密码
      const oldpw = await this.post("oldpw")
      //新密码
      const newpw = await this.post("newpw")
      const option = {
        id:info.uid,
        oldpw:think.md5(oldpw),
        password:think.md5(newpw),
        passwordtxt:newpw
      }
      const result = await this.model("index").updateAdminInfo(option)
      if(result > 0){
        return this.returnResult(result)
      }else{
        return this.fail(_mconst.CODE_ERR_PASSWORD,_mconst.MSG_PASSWORD,{})
      }
    }else{
      return this.returnError()
    }
  }

};
