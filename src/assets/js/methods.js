import state from '../../store'
export default {
  assignObjPublic(obj1, obj2) {
    const Obj = {};
    for (let key in obj2) {
      if (obj1.hasOwnProperty(key)) {
        Object.assign(Obj, {
          [key]: obj2[key]
        })
      }
    }
    return Obj
  },
  pageChangePublic({
    form,
    key,
    value = 10,
    fn
  }) {
    Object.assign(form || this.getForm, {
      [key]: value
    });
    if (fn) {
      fn()
    } else {
      this.initData()
    }
  },
  searchChangePublic({
    form,
    formName = 'getForm',
    pageName = 'page',
    limitName = 'limit',
    fn
  }, reset = false) {
    if (reset) {
      Object.assign(form || this.getForm, this.$options.data()[formName])
    } else {
      Object.assign(form || this.getForm, {
        [pageName]: this.$options.data()[formName][pageName],
        [limitName]: this.$options.data()[formName][limitName]
      })
    }

    if (fn) {
      fn()
    } else {
      this.initData()
    }
  },
  initDataPublic({
    url,
    loading = 'loading',
    axiosHttp = 'axiosHttp',
    getForm = 'getForm',
    tableData = 'tableData',
    total = 'total',
    resList = 'data',
    resTotal = 'total',
    resCodeName = 'errno',
    resCodeValue = 0,
    resError = 'errmsg',
    resType = true 
  }) {
    this[loading] = true
    if (this[loading]) {
      this[axiosHttp]({
        url,
        data: this[getForm]
      }).then(data => {
        if (data.data[resCodeName] === resCodeValue) {
          const Data = data.data.data
          this[tableData] = resType ? Data[resList] : Data
          this[total] = Data[resTotal]
          this[loading] = false
        } else {
          this.$notify.error({
            title: '错误',
            message: data.data[resError]
          })
        }
      })
    }
  },
  handleDeletePublic({
    that,
    url,
    axiosHttp = 'axiosHttp',
    type = 'delete',
    callBack,
    params = {},
    resCodeName = 'errno',
    resCodeValue = 0,
    resError = 'errmsg'
  }) {
    that.$confirm('是否继续执行该项删除操作?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      that[axiosHttp]({
        url,
        type: type,
        data: params
      }).then(data => {
        if (data.data[resCodeName] === resCodeValue) {
          that.$message({
            type: 'success',
            message: '删除成功!'
          })
          if (callBack) {
            callBack()
          } else {
            that.initData()
          }
        } else {
          that.$notify.error({
            title: '错误',
            message: data.data[resError]
          })
        }
      })
    }).catch(() => {
      that.$message({
        type: 'info',
        message: '已取消删除'
      })
    })
  },
  handleHttpPublic({
    that,
    url,
    type = 'get',
    params = {},
    axiosHttp = 'axiosHttp',
    callBack,
    resCodeName = 'errno',
    resCodeValue = 0,
    resError = 'errmsg'
  }) {
    that[axiosHttp]({
      url,
      type: type,
      data: params
    }).then(data => {
      if (data.data[resCodeName] === resCodeValue) {
        that.$message({
          type: 'success',
          message: '操作成功!'
        })
        if (callBack) {
          callBack()
        } else {
          that.initData()
        }
      } else {
        that.$notify.error({
          title: '错误',
          message: data.data[resError]
        })
      }
    })
  },
  getAttributeCountPublic(obj) {
    var count = 0
    for (let i in obj) {
      if (obj.hasOwnProperty(i)) {
        count++
      }
    }
    return count
  },
  secondMillisecondPublic(time) {
    let len = `${time}`.length;
    if (len < 11) {
      return time * 1000
    } else {
      return parseInt(time / 1000)
    }
  },
  keepGetFormPublic(status, module = 0) {
    if (status === 1) {
      let current = this.$route;
      let keyName = module ? `keepPath${module}` : 'keepPath';
      let name = current.meta[keyName];
      let local = state.state.getForms;
      if (local.name === name && local.form) {
        this.getForm = local.form
      } else {
        state.commit('editGetForms', {
          name: ``,
          form: null
        })
      }
    } else if (status === 2) {
      let current = this.$route;
      let keyName = module ? `keepPath${module}` : 'keepPath';
      let name = current.meta[keyName];
      state.commit('editGetForms', {
        name: name,
        form: this.getForm
      })
    }
  },
  vifAOrBPublic(value, values = [], type = 1) {
    if (type === 1) {
      return values.some(item => {
        return value === item
      })
    } else if (type === 2) {
      if (value && (typeof value === 'object')) {
        return value.some(item => {
          return values.indexOf(item.path) > -1;
        });
      } else {
        return false;
      }
    }
  },
  randomNumPublic(x, y) {
    return Math.round(Math.random() * (y - x) + x);
  },
  isYXBPublic() {
    return (sessionStorage.getItem('CK-T') || sessionStorage.getItem('CK')) === '2' || this.$route.path.indexOf('/yxb/') !== -1
  },
  phonePublic (phone, text = '') {
    if (!(/^1[3456789]\d{9}$/.test(phone))) {
      return `“${text || '手机号码'}”有误，请重填！`
    }
  },
  chuNamePublic (params = {}) {
    let { type = 1, time = null, users = '', isHtml = false} = params
    time = time || new Date().getTime()
    /**
     * time: 时间戳（ms）
     * type：
          1: 时间 > 20210201 ? '乔鹏' : '支晓强',
          2: '杨青'
       users: 如：'张三,李四,乔鹏,王五'
     */
    if (users) {
      return type == 1 ? (users.indexOf('支晓强') != -1 || users.indexOf('乔鹏') != -1) : type == 2 ? users.indexOf('杨青') != -1 : false
    } else {
      return type == 1 ? time > 1612108800000 ? isHtml ? '乔&nbsp;&nbsp; 鹏' : '乔鹏' : '支晓强' : type == 2 ? isHtml ? '杨&nbsp;&nbsp; 青' : '杨青' : ''
    }
  }
}
