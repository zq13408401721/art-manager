const Base = require('./base.js');
const _mconst = require('../common/mconst.js')

module.exports = class extends Base{


    async brochureViewAction(){
        this.assign("titlename","学校图标")
        this.assign("currentmenu","brochureview")
        return this.returnView("m_brochure.html")
    }

    /**
     * 创建Tab
     * @returns {Promise<void>}
     */
    async createTabAction(){
        const info = await this.getUserinfo()
        if(info){
            const title = this.post("title")
            const label = this.post("label")
            const option = {
                schoolid:info.sid,
                title:title,
                label:label
            }
            const result = await this.model("index").createBrochure(option)
            return this.returnResult(result)
        }else{
            return this.returnError()
        }
    }

    /**
     * 学校图标列表
     * @returns {Promise<void>}
     */
    async brochureListAction(){
        const info = await this.getUserinfo()
        if(info){
            const result = await this.model("index").brochureList({schoolid:info.sid})
            const total = await this.model("index").brochureCount({schoolid:info.sid})
            return this.returnJson({total:total,data:result})
        }else{
            return this.returnError()
        }
    }

    /**
     * 上传文件
     * @returns {Promise<void>}
     */
    async uploadFileAction(){

    }


}