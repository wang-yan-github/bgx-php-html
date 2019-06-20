var fileHost = "https://baogongxia1.oss-cn-shenzhen.aliyuncs.com/"
var config = {
  //aliyun OSS config
  uploadImageUrl: `${fileHost}`, //默认存在根目录，可根据需求改
  AccessKeySecret: 'I0G7yoFsdvSvfYLCLS6g94umfGExWr',
  OSSAccessKeyId: 'LTAIiuxSM3dx0EcG',
  timeout: 87600 //这个是上传文件时Policy的失效时间
};
module.exports = config
