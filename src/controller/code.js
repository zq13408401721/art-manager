const Base = require("./base.js")
const _mconst = require('../common/mconst.js')

module.exports = class extends Base{

    /**
     * 激活码页面
     * @returns {Promise<*>}
     */
    async codeviewAction(){
        this.assign("titlename","激活码管理")
        this.assign("currentmenu","codeview")
        const info = await this.getUserinfo()
        if(info){
            const total = await this.model("index").codeCount({schoolid:info.sid})
            const activenum = await this.model("index").codeCountActive({sid:info.sid,active:1})
            const unactivenum = await this.model("index").codeCountActive({sid:info.sid,active:0})
            this.assign("total",total)
            this.assign("activenum",activenum)
            this.assign("unactivenum",unactivenum)
        }
        return this.returnView("m_code.html")
    }

    /**
     * 学校管理
     * @returns {Promise<void>}
     */
    async schoolmanagerAction(){
        this.assign("titlename","学校管理")
        this.assign("currentmenu","schoolmanager")
        return this.returnView("m_codemanager.html")
    }

    /**
     * 激活码激活
     * @returns {Promise<void>}
     */
    async codeListAction(){
        const page = this.post("page")
        const size = this.post("size")
        //当前激活码状态
        const active = this.post("active")
        const info = await this.getUserinfo()
        if(info){
            const option = {
                schoolid:info.sid
            }
            if(active != 999){
                option.active = active
            }
            const result = await this.model("index").queryCodeList(option,page,size)
            const total = await this.model("index").codeCount(option)
            return this.ctx.json({total:total,data:result})
        }else{
            return this.returnError()
        }
    }

    /**
     * 官方创建激活码创建功能
     * @returns {Promise<void>}
     */
    async schoolListAction(){
        const page = this.post("page")
        const size = this.post("size")
        const schools = await this.model("index").schoolList({page:page,size:size})
        const total = await this.model("index").schoolNumber()
        return this.ctx.json({total:total,data:schools})
    }

    /**
     * 创建账号
     * @returns {Promise<void>}
     */
    async createMemberAction(){
        const _head = this.post("head")
        const _role = this.post("role")
        const _no = parseInt(this.post("no"))
        const _schoolname = this.post("schoolname")
        const _schoolid = this.post("schoolid")
        //初始密码
        const _initialpw = this.post("initialpw")
        var data = []
        var _time = parseInt(new Date().getTime()/1000)
        for(var i=1; i<_no+1; i++){
            var _n;
            if(i < 10){
                _n = "0"+i
            }else if(i < 100){
                _n = "0"+i
            }else if(i < 1000){
                _n = "0"+i
            }
            //后台管理员
            if(_role == 9){
                data.push({
                    id:new Date().getTime().toString(),
                    school_id:_schoolid,
                    name:_schoolname,
                    username:_head+_n,
                    password:think.md5(_initialpw),
                    passwordtxt:_initialpw,
                    type:2,
                    role:3
                })
            }else{
                data.push({
                    username:_head+_n,
                    passwordtxt:_initialpw,
                    password:think.md5(_initialpw),
                    role:_role,
                    date:_time,
                    schoolid:_schoolid,
                    active:0,
                    uid:think.uuid("v4")
                })
            }
        }
        var result
        if(_role == 9){
            result = await this.model("index").createManagerMember(data)
        }else{
            result = await this.model("index").createMember(data)
        }
        return this.returnResult(result)
    }

    /**
     * 创建激活码
     * @returns {Promise<void>}
     */
    async createCodeAction(){
        const _num = this.post("num")
        const _schoolid = this.post("schoolid")
        const _type = this.post("type")
        //var _time = parseInt(new Date().getTime()/1000)
        var _time = 0;
        if(_type == 1){
            _time += 30*24*3600;
        }else if(_type == 2){
            _time += 30*3*24*3600;
        }else if(_type == 3){
            _time += 30*6*24*3600;
        }else if(_type == 4){
            _time += 30*12*24*3600;
        }else if(_type == 5){
            _time += 30*24*24*3600;
        }else if(_type == 6){
            _time += 3*24*3600;
        }else if(_type == 7){
            _time += 300;
        }
        const _createtime = this.getDateFormat()
        const data = []
        for(var i=0; i<_num; i++){
            const _code = _mconst.randomCode(8)
            data.push({
                code:_code,
                duration:_time,
                active:0,
                createtime:_createtime,
                schoolid:_schoolid,
                type:_type
            })
        }
        const result = await this.model("index").createCode(data)
        return this.returnResult(result)
    }

    /**
     * 学校管理员列表数据
     * @returns {Promise<void>}
     */
    async managerListAction(){
        const schoolid = this.post("schoolid")
        const option = {
            school_id:schoolid
        }
        const result = await this.model("index").schoolManagerList(option)
        return this.returnResult({data:result})

    }

}