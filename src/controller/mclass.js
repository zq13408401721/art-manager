const Base = require('./base.js');

module.exports = class extends Base{

    /**
     * 获取班级管理页面
     * @returns {Promise<*>}
     */
    async classmanagerAction(){
        this.assign('titlename','班级管理')
        /*var info = await this.getUserinfo()
        if(info){
            var list = await this.model("index").queryClassBySid({sid:info.sid})
            //查询当前用户班级信息
            this.assign("classinfo",list)
        }*/
        this.assign("currentmenu","classmanager")
        return this.returnView('m_class.html')
    }

    /**
     * 班级列表
     * @returns {Promise<void>}
     */
    async classlistAction(){
        const page = this.post("page")
        const size = this.post("size")
        var info = await this.getUserinfo()
        if(info){
            var list = await this.model("index").queryClassBySid({sid:info.sid,page:page,size:size,active:1})
            var total = await this.model("index").queryClassNumBySid({sid:info.sid,active:1})
            return this.ctx.json({total:total,data:list})
        }else{
            return this.ctx.json({total:0,data:[]})
        }
    }

    /**
     * 创建班级
     * @returns {Promise<void>}
     */
    async createClassAction(){
        let info = await this.getUserinfo()
        let name = this.post("name")
        let date = await this.getDateFormat()
        let max = 500
        let option={
            sid:info.sid,
            name:name,
            date:date,
            active:1,
            maxnum:max,
            createuid:info.uid
        }

        let result = await this.model('index').createClass(option)
        if(result){
            if(result.type == "exist"){
                this.fail(_const.CODE_ERR_CLASSEXIST,_const.MSG_CLASSEXIST,{})
            }else{
                option.id = result.id
                this.success(option)
            }
        }else{
            this.fail(_const.CODE_ERR,_const.MSG_ERR,{})
        }
        return this.returnResult({data:"成功"})
    }

    /**
     * 修改班级名称
     * @returns {Promise<void>}
     */
    async editorClassNameAction(){
        const _classid = this.post("classid")
        const _classname = this.post("classname")
        const info = await this.getUserinfo()
        if(info){
            const result = await this.model("index").updateClassInfo({id:_classid,name:_classname,sid:info.sid})
            return this.ctx.json(result)
        }
    }

    /**
     * 删除班级
     * @returns {Promise<void>}
     */
    async deleteClassAction(){
        const _classid = this.post("classid")
        const info = await this.getUserinfo()
        if(info){
            //检查班级中是否有成员
            const no = await this.model("index").classMemberNo({classid:_classid})
            if(no > 0){
                return this.returnDelClassError()
            }else{
                //删除班级数据
                const _delClass = await this.model("index").deleteClass({sid:info.sid,id:_classid,active:0})
                return this.success(_delClass)
            }
        }else{
            this.returnError()
        }
    }

}