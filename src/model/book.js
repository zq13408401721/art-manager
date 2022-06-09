/**
 * 书籍图库相关
 */
module.exports = class extends think.Model {

    /**
     * 创建标签
     * @param  option 
     * @returns 
     */
    async createMark(option){
        return await this.mode("bookmark").thenAdd(option,{schoolid:option.schoolid,name:option.name})
    }

    /**
     * 删除标签
     * @param  option 
     * @returns 
     */
    async deleteMark(option){
        return await this.mode("bookmark").where({schoolid:option.schoolid,id:option.id}).delete()
    }

    /**
     * 查询标签
     * @param {} option 
     */
    async queryMark(option){
        return await this.mode("bookmark").where({schoolid:option.schoolid}).select()
    }

    /**
     * 创建学校资源分类
     * @param {} option 
     */
    async addBookResClassify(option){
        return await this.mode("bookres_classify").thenAdd(option,{schoolid:option.schoolid,name:option.name})
    }


    /**
     * 查询学校图片分类
     * @param {*} option 
     */
    async queryBookResClassifyBySchoolid(option){
        return await this.mode("bookres_classify").where({schoolid:option.schoolid}).select()
    }

    /**
     * 根据对应的父节点查询对应的子分类
     * @param {*} option 
     */
    async queryBookResClassifyByPid(option){
        return await this.mode("bookres_classify").where({pid:option.pid}).select()
    }

    /**
     * 删除对应id的分类对应学校和对应id
     * @param {id/pid,schoolid} option 
     * @returns 
     */
    async deleteBookResClassifyByOption(option){
        return await this.mode("bookres_classify").where(option).delete()
    }

    /**
     * 对应类型下的图片
     * @param {classifyid,schoolid} option 
     */
    async queryImagesByClassifyId(option){
        //分页查询
        return await this.mode("bookres_relation").where({classifyid:option.classifyid,schoolid:option.schoolid})
        .page({page:option.page,size:option.size}).select()
    }

    /**
     * 查询对应标签的图片数据
     * @param {schoolid,markids} option 
     */
    async queryImagesByMarks(option){
        //分页查询
        return await this.mode("boolres_markrelation").where({markid:["in",option.markids],schoolid:option.schoolid})
        .page({page:option.page,size:option.size}).select()
    }

    /**
     * 通过资源类型删除资源关联数据 实际图片数据没有删除
     * @param {schoolid,id} option 
     */
    async deleteBookResRelationByClassify(option){
        return await this.mode("bookres_relation").where({schoolid:option.schoolid,id:option.id}).delete()
    }

    /**
     * 删除书籍资源标签关联的图片数据 实际图片数据没有删除
     * @param {} option 
     */
    async deleteBookResMarkRelationByMark(option){
        return await this.mode("bookres_markrelation").where({schoolid:option.schoolid,markid:option.markid}).delete()
    }

    /**
     * 创建书包
     * @param {} option 
     */
    async addBookbag(option){
        return await this.mode("bookbag").thenAdd(option,{name:option.name,schoolid:option.schoolid})
    }

    /**
     * 更新书包 包含更新信息和发布，取消发布 添加书本
     * @param {*} option 
     */
    async updateBookbag(option){
        return await this.mode("bookbag").where({schoolid:option.schoolid,id:option.id}).update(option)
    }

    /**
     * 删除书包
     * @param {*} option 
     */
    async deleteBookbag(option){
        return await this.mode("bookbag").where({schoolid:option.schoolid,id:option.id}).delete()
    }

    /**
     * 修改书籍总页数
     * @param {*} option 
     */
    async updateBookPages(option){
        return await this.mode("book").where({id:option.id}).update({pages:option.pages})
    }

    /**
     * 添加书籍对应的图片
     * @param {*} option 
     */
    async addBookImage(option){
        return await this.mode("book_image").thenAdd(option,{bookid:option.bookid,resourceid:option.resourceid})
    }

    /**
     * 更新书的图片排序
     * @param {*} option 
     */
    async updateBookImage(option){
        return await this.mode("book_image").where({bookid:option.bookid,resourceid:option.resourceid}).update({sort:option.sort})
    }

    /**
     * 查询书籍图片数据
     * @param {*} option 
     */
    async queryBookImage(option){
        return await this.mode("book_image").where({bookid:option.bookid}).page({page:option.page,size:option.size}).select()
    }

    
}