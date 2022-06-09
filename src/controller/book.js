const Base = require('./base.js');
const _mconst = require('../common/mconst.js')

module.exports = class extends Base{
    
    /**
     * 学校图库
     */
    async schoolgalleryAction(){
        this.assign('titlename',"学校图库");
        return this.returnView('m_galleryupload.html');
    }

    /**
     * 学校书架
     * @returns
     */
    async schoolbookbagAction(){
        this.assign('titlename',"学校书架");
        return this.returnView('m_bookbag.html');
    }

    /**
     * 共享图片库
     */
    async sharegalleryAction(){
        this.assign('titlename',"共享图片库");
        return this.returnView('m_galleryupload.html');
    }

    /**
     * 共享书架管理 官方帐号操作
     */
    async sharebookbagAction(){
        this.assign('titlename',"共享书架");
        return this.returnView('m_sharebookbagmanager.html');
    }

    /**
     * 图库图片上传
     */
     async galleryuploadAction(){
        this.assign('titlename',"图片上传");
        return this.returnView('m_galleryupload.html');
    }


    /**
     * 标签管理
     */
     async markmanagerAction(){
        this.assign('titlename',"标签管理");
        //查询学校对应的标签
        const info = await this.getUserinfo()
        if(info){
            const result = await this.model.queryMark({schoolid:info.sid})
            this.assign('marks',result)
        }
        return this.returnView('m_markmanager.html');
    }

    /**
     * 创建书架
     * @returns 
     */
    async createbookbagAction(){
        this.assign('titlename',"创建书架");
        return this.returnView('m_bookbag.html');
    }

    /**
     * 从共享书架创建书籍 学校使用
     * @returns
     */
    async addbookfrombookbagAction(){
        this.assign('titlename',"从共享书架创建书籍");
        return this.returnView('m_sharebookbag.html');
    }


    /**********action**************/


    /**
     * 添加mark
     */
    async addmarkAction(){
        const mark = this.post("mark")
        const info = await this.getUserinfo()
        if(info){
            const result = await this.model.createMark({schoolid:info.sid,name:mark})
            return this.returnJson({data:result})
        }else{
            return this.returnError()
        }
    }

    /**
     * 删除mark
     */
    async deletemarkAction(){
        const id = this.post("id")
        const info = await this.getUserinfo()
        if(info){
            const result = await this.model.deleteMark({schoolid:info.sid,id:id})
            return this.returnJson({data:result})
        }else{
            return this.returnError()
        }
    }

}