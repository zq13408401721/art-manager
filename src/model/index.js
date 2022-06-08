module.exports = class extends think.Model {

    /**
     * 登录
     * @param option
     * @returns {Promise<any>}
     */
    async login(option){
        return await this.model("admin").where({username:option.username,password:option.password}).find()
    }

    /**
     * 重置密码
     * @param option
     * @returns {Promise<void>}
     */
    async resetpw(option){
        return await this.model("user").where({uid:option.uid}).update({passwordtxt:option.passwordtxt,password:option.password})
    }

    /**
     * 查询admin后台账号信息
     * @param option
     * @returns {Promise<any>}
     */
    async queryAdmin(option){
        return await this.model("admin").where(option).find()
    }

    /**
     * 更新管理员信息
     * @param option
     * @returns {Promise<void>}
     */
    async updateAdminInfo(option){
        return await this.model("admin").where({id:option.id,password:option.oldpw}).update({password:option.password,passwordtxt:option.passwordtxt})
    }

    /**
     * 学校菜单列表
     * @param option
     * @returns {Promise<void>}
     */
    async menuList(option){
        return await this.model("admin_menu").where({schoolid:option.schoolid}).select()
    }

    /**
     * 创建班级
     * @param option
     * @returns {Promise<object>}
     */
    async createClass(option){
        return await this.model("class").thenAdd(option,{name:option.name,sid:option.sid})
    }

    /**
     * 查询班级  sid
     * @param option
     * @returns {Promise<object>}
     */
    async queryClassBySid(option){
        return await this.model("class").where({sid:option.sid,active:option.active}).page(option.page,option.size).select()
    }

    /**
     * 分页获取学校班级列表
     * @param option
     * @returns {Promise<void>}
     */
    async queryClassPageBySid(option){
        return await this.model("class").where({sid:option.sid}).page(option.page,option.size).select()
    }

    /**
     * 查询学校班级数量
     * @param option
     * @returns {Promise<void>}
     */
    async queryClassNumBySid(option){
        return await this.model("class").where(option).count()
    }

    /**
     * 跟新班级信息
     * @param option
     * @returns {Promise<any>}
     */
    async updateClassInfo(option){
        return await this.model("class").where({id:option.id,sid:option.sid}).update(option)
    }

    /**
     * 删除
     * @param option
     * @returns {Promise<void>}
     */
    async deleteClass(option){
        return await this.model("class").where({sid:option.sid,id:option.id}).update(option)
    }

    /**
     * 班级成员数量
     * @param option
     * @returns {Promise<void>}
     */
    async classMemberNo(option){
        return await this.model("class_member").where({classid:option.classid}).count("id")
    }

    /**
     * 加入班级
     * @param option
     * @returns {Promise<void>}
     */
    async joinClass(option){
        return await this.model("class_member").thenAdd(option,{uid:option.uid,classid:option.classid})
    }

    /**
     * 加入更多成员到班级
     * @param option
     * @returns {Promise<object>}
     */
    async joinManyClass(option){
        return await this.model("class_member").addMany(option,{ignore:true})
    }

    /**
     * 从班级中删除
     * @param option
     * @returns {Promise<void>}
     */
    async outClass(option){
        return await this.model("class_member").where({uid:option.uid,classid:option.classid}).delete()
    }

    /**
     * 从班级中删除更多成员
     * @param option
     * @returns {Promise<void>}
     */
    async outManyClass(option){
        return await this.model("class_member").where({uid:["in",option.uids],classid:option.classid}).delete()
    }

    /**
     * 获取账号状态
     * @param option
     * @returns {Promise<void>}
     */
    async queryMemberState(option){
        return await this.model("user").where({active:option.active,schoolid:option.sid,role:option.role}).count("id")
    }

    /**
     * 查询学校所有老师账号
     * @param option
     * @returns {Promise<void>}
     */
    async queryMemberBySid(option){
        return await this.model("user").where({schoolid:option.sid,role:option.role})
            .field("username,nickname,initialpw,passwordtxt,uid,schoolid,endtime,active")
            .page(option.page,option.size).select()
    }

    /**
     * 班级老师列表
     * @returns {Promise<void>}
     */
    async queryClassMemberList(option){
        return await this.model("class_member").where({classid:option.cid,role:option.role}).field("uid").select()
    }

    /**
     * 统计学校用户总数
     * @param option
     * @returns {Promise<void>}
     */
    async countUserBySid(option){
        return await this.model("user").where({schoolid:option.sid,role:option.role}).count("id")
    }

    /**
     * 查询学校学生账号
     * @param option
     * @returns {Promise<any>}
     */
    async queryStudentBySid(option){
        return await this.model("user").where({schoolid:option.sid,role:2,active:1}).field("username,nickname,passwordtxt,uid,schoolid,endtime").select()
    }

    /**
     * 修改学校成员昵称
     * @param option
     * @returns {Promise<void>}
     */
    async editorMemberNickName(option){
        return await this.model("user").where({schoolid:option.sid,uid:option.uid}).update({nickname:option.nickname})
    }

    /**
     * 激活码列表
     * @param option
     * @returns {Promise<void>}
     */
    async queryCodeList(option,page,size){
        return await this.model("activecode").where(option).page(page,size).select()
    }



    /**
     * 统计激活码数量
     * @param option {schoolid,active}
     * @returns {Promise<void>}
     */
    async codeCount(option){
        return await this.model("activecode").where(option).count()
    }

    /**
     *
     * @param option
     * @returns {Promise<void>}
     */
    async codeCountActive(option){
        return await this.model("activecode").where({schoolid:option.sid,active:option.active}).count()
    }

    /**
     * 学校列表
     * @param option
     * @returns {Promise<void>}
     */
    async schoolList(option){
        return await this.model("school").alias("a").field(
            "a.*,(select count(*) from art_user where schoolid=a.sid) as members,"+
            "(select count(*) from art_activecode where schoolid=a.sid) as codes"
        ).page(option.page,option.size).select()
    }

    /**
     * 学校的总数量
     * @param option
     * @returns {Promise<number>}
     */
    async schoolNumber(){
        return await this.model("school").count("id")
    }

    /**
     * 创建账号
     * @returns {Promise<Array<number>>}
     */
    async createMember(option){
        return await this.model("user").addMany(option)
    }

    /**
     * 创建管理员账号
     */
    async createManagerMember(option){
        return await this.model("admin").addMany(option)
    }

    /**
     * 创建激活码
     * @param option
     * @returns {Promise<void>}
     */
    async createCode(option){
        return await this.model("activecode").addMany(option)
    }

    /**
     * 获取学校还没激活的账号
     * @param option
     * @returns {Promise<void>}
     */
    async unuseMemberBySchool(option){
        return await this.model("user").where(option).field("username,passwordtxt,role").select()
    }

    /**
     * 学校还没激活的激活码
     * @param option
     * @returns {Promise<void>}
     */
    async unuseCodeBySchool(option){
        return await this.model("activecode").where(option).field("code").select()
    }

    /**
     * 获取班级信息
     * @param option
     * @returns {Promise<void>}
     */
    async queryClass(option){
        return await this.model("class").where(option).select()
    }

    /**
     * 创建学校
     * @param option
     * @returns {Promise<void>}
     */
    async createSchool(option){
        return await this.model("school").thenAdd(option,{name:option.name,sid:option.sid})
    }

    /**
     * 学校管理员
     * @param option
     * @returns {Promise<void>}
     */
    async schoolManagerList(option){
        return await this.model("admin").where(option).select()
    }

    /**
     * 学校图标
     * @param option
     * @returns {Promise<void>}
     */
    async brochureList(option){
        return await this.model("brochure").where(option).select()
    }

    /**
     * 学校图标数量
     * @param option
     * @returns {Promise<number>}
     */
    async brochureCount(option){
        return await this.model("brochure").where(option).count("id")
    }

    /**
     * 创建图标
     * @param option
     * @returns {Promise<void>}
     */
    async createBrochure(option){
        return await this.model("brochure").thenAdd(option,{schoolid:option.schoolid,label:option.label})
    }

};
