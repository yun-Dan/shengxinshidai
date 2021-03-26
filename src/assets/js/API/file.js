
// 文件的上传、下载、导入/导出、查看等

const ROOT_URL = process.env.VUE_APP_BASE_URL;
// 培训系统
const admin = {
  EWM: `${ROOT_URL}/attachment/qrcode/tp`, // 二维码查看
  lookUrl: ROOT_URL + '/attachment/download/code', // 附件查看地址
  uploadExcelUrl1: ROOT_URL + '/admin/upload',
  uploadExcelUrl: ROOT_URL + '/admin/upload/upfile',
  uploadExcelUrl_video: ROOT_URL + '/admin/upload/upfile', // 视频上传
  fzExportUrl: '/admin/protocoldown/downfz', //导出辅助协议PDF
  wtExportUrl: '/admin/protocoldown/downentrust', //导出委托协议PDF
  hzExportUrl: '/admin/protocoldown/downhz', //导出合作协议PDF
  certificateExorpUrl: '/admin/downcommon/downcert', // 证书导出（新版）
  certificateExorpOldUrl: '/admin/downcommon/downcertold', // 证书导出（旧版）
  assessReportExportUrl: '/admin/questionnaire/export', // 课程评估报告统计导出Excel
  dataExorpUrl: '/admin/stats/export', // 数据统计管理导出Excel
  financeAccountFileUrl: '/attachment/download/code/', // 结算管理-附件查看
}

const yxb = {
  EWM: `${ROOT_URL}/attachment/yxb_qrcode/tp`, // 二维码查看
  lookUrl: ROOT_URL + '/attachment/yxb_download/code', // 附件查看地址
  uploadExcelUrl1: ROOT_URL + '/yxb/upload',
  uploadExcelUrl: ROOT_URL + '/yxb/upload/upfile',
  uploadExcelUrl_video: ROOT_URL + '/yxb/upload/upfile', // 视频上传
  fzExportUrl: '/yxb/protocoldown/downfz', //导出辅助协议PDF
  wtExportUrl: '/yxb/protocoldown/downentrust', //导出委托协议PDF
  hzExportUrl: '/yxb/protocoldown/downhz', //导出合作协议PDF
  certificateExorpUrl: '/yxb/downcommon/downcert', // 证书导出（新版）
  certificateExorpOldUrl: '/yxb/downcommon/downcertold', // 证书导出（旧版）
  assessReportExportUrl: '/yxb/questionnaire/export', // 课程评估报告统计导出Excel
  dataExorpUrl: '/yxb/stats/export', // 数据统计管理导出Excel
  financeAccountFileUrl: '/attachment/yxb_download/code/', // 结算管理-附件查看
}
const isYXB = (sessionStorage.getItem('CK-T') || sessionStorage.getItem('CK')) === '2'
const urls = isYXB ? yxb : admin
export default {
  mp4: 'http://xygl.peixun.ruc.edu.cn/static/images/login_movie3.mp4',
  ...urls
}