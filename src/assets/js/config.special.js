
export const COLLEGE = [
  {
    name: '苏州研究院',
    project_sign: true, // 项目管理：签章
    assist_noSign: true, // 微系统-辅助协议：不使用电子签章
    certificate_download: true, // 证书申领：可导出证书
    s_s: true // 苏州/深圳
  },
  {
    name: '深圳研究院',
    project_sign: true,
    assist_noSign: true,
    certificate_download: true,
    s_s: true
  },
  {
    name: '教育培训中心',
    assist_noSign: true,
    project_noFinance: true // 项目管理：审核时不推送至财务
  },
  {
    name: '继续教育学院'
  },
  {
    name: '网络教育部'
  },
  {
    name: '律师学院'
  }
]

export function MATE (key, value) {
  if (key && value) {
    return COLLEGE.filter(item => item[key]).map(item => item.name).some(item => value.indexOf(item) !== -1)
  } else {
    return false
  }
}
