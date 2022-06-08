const Base = require("./base.js")
const moment = require('moment')

module.exports = class extends Base{

    /**
     * 学生管理页面
     * @returns {Promise<*>}
     */
    async studentmanagerAction(){
        this.assign("titlename","学生管理")
        this.assign("currentmenu","studentmanager")
        const info = await this.getUserinfo()
        if(info){
            const activenum = await this.model("index").queryMemberState({sid:info.sid,active:1,role:2})
            const activednum = await this.model("index").queryMemberState({sid:info.sid,active:2,role:2})
            const unactivenum = await this.model("index").queryMemberState({sid:info.sid,active:0,role:2})
            const total = await this.model('index').countUserBySid({sid:info.sid,role:2})
            this.assign("member", {total:total,activenum:activenum,activednum:activednum,unactivenum:unactivenum})
        }
        return this.returnView("m_student.html")
    }

    /**
     * 学生绑定班级
     * @returns {Promise<void>}
     */
    async studentclassViewAction(){
        this.assign("titlename","学生绑定班级")
        this.assign("currentmenu","studentclassView")
        const info = await this.getUserinfo()
        if(info != undefined){
            const classes = await this.model("index").queryClassBySid({sid:info.sid,active:1})
            this.assign("classes",classes)
            if(classes && classes.length > 0){
                this.assign("defaultname",classes[0].name)
                this.assign("defaultid",classes[0].id)
            }
        }
        return this.returnView("m_studentclass.html")
    }

    /**
     * 绑定学生班级
     * @returns {Promise<void|any>}
     */
    async bindStudentClassAction(){
        const cid = this.post("cid") //班级id
        const page = this.post("page")
        const size = this.post("size")
        const info = await this.getUserinfo()
        if(info){
            //分页获取老师list
            const students = await this.model("index").queryMemberBySid({sid:info.sid,role:2,page:page,size:size})
            //获取班级里面学生
            const members = await this.model("index").queryClassMemberList({cid:cid,role:2})
            const total = await this.model("index").countUserBySid({sid:info.sid,role:2})
            const result = []
            for(var i=0; i<students.length; i++){
                result.push({
                    username:students[i].username,
                    nickname:students[i].nickname,
                    uid:students[i].uid,
                    classid:this.isInClass(students[i].uid,members) ? cid : 0
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
     * 学生列表
     * @returns {Promise<void>}
     */
    async studentlistAction(){
        const info = await this.getUserinfo()
        const page = this.post("page")
        const size = this.post("size")
        if(info){
            const result = await this.model("index").queryMemberBySid({sid:info.sid,role:2,page:page,size:size})
            const total = await this.model("index").countUserBySid({sid:info.sid,role:2})
            const students = []
            for(var i=0; i<result.length; i++){
                students.push({
                    username:result[i].username,
                    nickname:result[i].nickname,
                    initialpw:result[i].passwordtxt == undefined ? "" : result[i].passwordtxt,
                    isreset:(result[i].initialpw != undefined && result[i].initialpw != result[i].passwordtxt) ? true : false,
                    uid:result[i].uid,
                    schoolid:result[i].schoolid,
                    endtime:(result[i].endtime != undefined && result[i].endtime != null) ? moment(new Date(result[i].endtime).toGMTString()).format('YYYY-MM-DD') : "",
                    active:result[i].active
                })
            }
            return this.ctx.json({total:total,data:students})
        }
    }

    /**
     * 修改学生名字
     * @returns {Promise<void>}
     */
    async editorStudentNameAction(){
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