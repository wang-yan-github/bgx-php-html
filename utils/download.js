/**
 * 下载管理器
 * Created by 全科 on 2018/1/27.
 */

/**
 * 下载保存一个文件
 */
function downloadSaveFile(obj) {
  let that = this;
  let success = obj.success;
  let fail = obj.fail;
  let id = "";
  let url = obj.url;
  if (obj.id) {
    id = obj.id;
  } else {
    id = url;
  }

  // console.info("%s 开始下载。。。", obj.url);
  wx.downloadFile({
    url: obj.url,
    success: function (res) {
      wx.saveFile({
        tempFilePath: res.tempFilePath,
        success: function (result) {
          result.id = id;
          if (success) {
            success(result);
          }
        },
        fail: function (e) {
          console.info("保存一个文件失败");
          if (fail) {
            fail(e);
          }
        }
      })

    },
    fail: function (e) {
      console.info("下载一个文件失败");
      if (fail) {
        fail(e);
      }

    }
  })
}
/**
 * 多文件下载并且保存，强制规定，必须所有文件下载成功才算返回成功
 */
function downloadSaveFiles(obj) {
  // console.info("准备下载。。。");
  let that = this;
  let success = obj.success; //下载成功
  let fail = obj.fail; //下载失败
  let urls = obj.urls;  //下载地址 数组，支持多个 url下载 [url1,url2]
  let savedFilePaths = new Map();
  let urlsLength = urls.length;  // 有几个url需要下载

  for (let i = 0; i < urlsLength; i++) {
    downloadSaveFile({
      url: urls[i],
      success: function (res) {
        console.dir(res);
        //一个文件下载保存成功
        let savedFilePath = res.savedFilePath;

        savedFilePaths.set(res.id, res);
        console.info("savedFilePath:%s", savedFilePath);
        if (savedFilePaths.size == urlsLength) { //如果所有的url 才算成功
          if (success) {
            success(savedFilePaths)
          }

        }
      },
      fail: function (e) {
        console.info("下载失败");
        if (fail) {
          fail(e);
        }

      }
    })

  }

}
module.exports = {
  downloadSaveFiles: downloadSaveFiles,
  downloadSaveFile: downloadSaveFile
}