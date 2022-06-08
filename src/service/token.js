const jwt = require('jsonwebtoken');
const secret = 'SLDLKKDS323ssdd@#@@gf';

module.exports = class extends think.Service {
  /**
   * 根据header中的X-Nideshop-Token值获取用户id
   */
  async getUserId(token) {
    if (!token) {
      return 0;
    }

    const result = await this.parse(token);
    if (think.isEmpty(result) || result.user_id <= 0) {
      return 0;
    }

    return result.user_id;
  }

  /**
   * 获取学校ID
   * @param token
   * @returns {Promise<void>}
   */
  async getSchoolId(token){
    if(!token) return 0;
    const result = await this.parse(token);
    if(think.isEmpty(result) || think.isEmpty(result.schoolid)){
      return 0;
    }
    return result.schoolid;
  }

  /**
   * 获取用户的身份
   * @param token
   * @returns {Promise<number|*>}
   */
  async getUserRole(token){
    if(!token) return 0;
    const result = await this.parse(token);
    if(think.isEmpty(result) || think.isEmpty(result.role)){
      return 0;
    }
    return result.role;
  }

  /**
   * 检测token是否过期
   * @param token
   * @returns {Promise<boolean>}
   * -1 token无效需要重新登录  0token时间到期可以刷新  1token正常
   */
  async checkTokenExpired(token) {
    if(!token){
      return -1;
    }
    const result = await this.parse(token);
    if(think.isEmpty(result) || result.iat <= 0){
      return -1;
    }
    let time = parseInt(Date.now() / 1000)-result.iat;
    // 一个小时过期 过期以后要么重新登录，要么刷token 如果token超时大于24小时重新登录
    if(time >= 3600*24){
      return -1;
    }
    return 1;
  }

  async create(userInfo) {
    const token = jwt.sign(userInfo, secret);
    return token;
  }

  async parse(token) {
    if (token) {
      try {
        return jwt.verify(token, secret);
      } catch (err) {
        return null;
      }
    }
    return null;
  }

  async verify(token) {
    const result = await this.parse(token);
    if (think.isEmpty(result)) {
      return false;
    }

    return true;
  }
};
