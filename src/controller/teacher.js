const Base = require("./base.js");
const moment = require('moment');



module.exports = class extends Base{

    /**
     * 老师管理页面
     * @returns {Promise<*>}
     */
    async teachermanagerAction(){
        this.assign("titlename","老师管理")
        this.assign("currentmenu","teachermanager")
        const info = await this.getUserinfo()
        if(info != undefined){
            const activenum = await this.model("index").queryMemberState({sid:info.sid,active:1,role:1})
            const activednum = await this.model("index").queryMemberState({sid:info.sid,active:2,role:1})
            const unactivenum = await this.model("index").queryMemberState({sid:info.sid,active:0,role:1})
            const total = await this.model('index').countUserBySid({sid:info.sid,role:1})
            this.assign("member", {total:total,activenum:activenum,activednum:activednum,unactivenum:unactivenum})
        }
        return this.returnView("m_teacher.html")
    }

    /**
     * 绑定老师到班级页面
     * @returns {Promise<void>}
     */
    async teacherclassViewAction(){
        this.assign("titlename","老师班级绑定")
        this.assign("currentmenu","teacherclassView")
        const info = await this.getUserinfo()
        if(info != undefined){
            const classes = await this.model("index").queryClassBySid({sid:info.sid,active:1})
            this.assign("classes",classes)
            if(classes && classes.length > 0){
                this.assign("defaultname",classes[0].name)
                this.assign("defaultid",classes[0].id)
            }
        }
        return this.returnView("m_teacherclass.html")
    }

    /**
     * 绑定用户进入班级
     * @returns {Promise<void>}
     */
    async bindMemberAction(){
        const uid = this.post("uid")
        const role = this.post("role")
        const classid = this.post("classid")
        const option = {
            uid:uid,
            role:role,
            classid:classid,
            date:this.getDateFormat()
        }
        const result = await this.model("index").joinClass(option)
        this.returnResult(result)
    }

    /**
     * 绑定所有账号到班级
     * @returns {Promise<void>}
     */
    async bindManyMemberAction(){
        const uids = this.post("uids")
        const role = this.post("role")
        const classid = this.post("classid")
        if(uids){
            const uidArr = uids.split(",")
            for(var i=0; i<uidArr.length; i++){
                var option = {
                    uid:uidArr[i],
                    role:role,
                    classid:classid,
                    date:this.getDateFormat()
                }
                //单挑插入，避免重复
                await this.model("index").joinClass(option)
            }
            this.returnResult({result:true})
        }else{
            return this.returnError()
        }
    }

    /**
     * 从班级里面解绑
     * @returns {Promise<void>}
     */
    async unBindMemberAction(){
        const uid = this.post("uid")
        const classid = this.post("classid")
        const option = {
            uid:uid,
            classid:classid
        }
        const result = await this.model("index").outClass(option)
        this.returnResult(result)
    }

    /**
     * 解绑更多班级成员
     * @returns {Promise<void>}
     */
    async unBindManyMemberAction(){
        const uids = this.post("uids")
        const classid = this.post("classid")
        const option = {
            uids:uids.split(','),
            classid:classid
        }
        const result = await this.model("index").outManyClass(option)
        this.returnResult(result)
    }

    /**
     * 老师列表
     * @returns {Promise<void>}
     */
    async teacherlistAction(){
        const info = await this.getUserinfo()
        const page = this.post("page")
        const size = this.post("size")
        if(info){
            const result = await this.model("index").queryMemberBySid({sid:info.sid,role:1,page:page,size:size})
            const total = await this.model("index").countUserBySid({sid:info.sid,role:1})
            const teachers = []
            for(var i=0; i<result.length; i++){
                teachers.push({
                    username:result[i].username,
                    nickname:result[i].nickname,
                    initialpw:result[i].passwordtxt == undefined ? "" : result[i].passwordtxt,
                    isreset:(result[i].initialpw != undefined && result[i].initialpw != result[i].passwordtxt) ? true : false,
                    uid:result[i].uid,
                    schoolid:result[i].schoolid,
                    endtime: (result[i].endtime != undefined && result[i].endtime != null) ? moment(new Date(result[i].endtime).toGMTString()).format('YYYY-MM-DD') : "",
                    active:result[i].active
                })
            }
            return this.ctx.json({total:total,data:teachers})
        }
    }

    /**
     * 老师绑定班级列表
     * @returns {Promise<void>}
     */
    async bindTeacherClassAction(){
        const cid = this.post("cid") //班级id
        const page = this.post("page")
        const size = this.post("size")
        const info = await this.getUserinfo()
        if(info){
            //分页获取老师list
            const teachers = await this.model("index").queryMemberBySid({sid:info.sid,role:1,page:page,size:size})
            //获取班级里面老师
            const members = await this.model("index").queryClassMemberList({cid:cid,role:1})
            const total = await this.model("index").countUserBySid({sid:info.sid,role:1})
            const result = []
            for(var i=0; i<teachers.length; i++){
                result.push({
                    username:teachers[i].username,
                    nickname:teachers[i].nickname,
                    uid:teachers[i].uid,
                    classid:this.isInClass(teachers[i].uid,members) ? cid : 0
                })
            }
            return this.ctx.json({total:total,data:result})
        }else{
            return this.returnError()
        }
    }

    /**
     * 查看用户是否在班级中
     * @param uid
     * @param members
     */
    isInClass(uid,members){
        for(var i=0; i<members.length; i++){
            if(members[i].uid === uid){
                return true;
            }
        }
        return false;
    }

    /**
     * 修改老师昵称
     * @returns {Promise<void>}
     */
    async editorTeacherNameAction(){
        const name = this.post("name")
        const uid = this.post("uid")
        const info = await this.getUserinfo()
        if(info){
            const result = await this.model("index").editorMemberNickName({sid:info.sid,nickname:name,uid:uid})
            if(result > 0){
                return this.returnResult(result)
            }
            return this.returnError()
        }
    }

}