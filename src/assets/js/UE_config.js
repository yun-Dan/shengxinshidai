/** 编辑器 **/
export default {
  options: {
    UEDITOR_HOME_URL: '/static/ueditor/', //
    initialFrameHeight: 350, 
    enableAutoSave: false, 
    toolbars: [
      [
        'undo', //撤销
        'redo', //重做
        '|',
        'bold', //加粗
        'indent', //首行缩进
        'italic', //斜体
        'fontborder', //字符边框
        'underline', //下划线
        'strikethrough', //删除线
        'subscript', //下标
        'superscript', //上标
        'spechars', //特殊字符
        '|',
        'cleardoc', //清空文档
        'removeformat', //清除格式
        'formatmatch', //格式刷
        'pasteplain', //纯文本粘贴模式
        '|',
        'forecolor', //字体颜色
        'backcolor', //背景色
        '|',
        'touppercase', //字母大写
        'tolowercase', //字母小写
        '|',
        'insertorderedlist', //有序列表
        'insertunorderedlist', //无序列表
        'justifyleft', //居左对齐
        'justifyright', //居右对齐
        'justifycenter', //居中对齐
        'justifyjustify', //两端对齐
        'fontfamily', //字体
        'fontsize', //字号
        'paragraph', //段落格式
        '|',
        'inserttable', //插入表格
        'deletetable', //删除表格
        'insertrow', //前插入行
        'insertcol', //前插入列
        'mergecells', //合并多个单元格
        'deleterow', //删除行
        'deletecol', //删除列
        'splittocells', //完全拆分单元格
        'insertparagraphbeforetable', //"表格前插入行"
      ]
    ]
  },
  options2: {
    UEDITOR_HOME_URL: '/static/ueditor/',
    initialFrameWidth: 644,
    initialFrameHeight: 250,
    enableAutoSave: false,
    retainOnlyLabelPasted: true,
    pasteplain: false,
    toolbars: [
      [
        'removeformat', //清除格式
        'pasteplain', //纯文本粘贴模式
        'indent', //首行缩进
        '|',
        'justifyleft', //居左对齐
        'justifyright', //居右对齐
        'justifycenter', //居中对齐
        'justifyjustify', //两端对齐
      ]
    ]
  },
  options_pro: {
    UEDITOR_HOME_URL: '/static/ueditor/', // 
    initialFrameHeight: 350,
    enableAutoSave: false, //  {Boolean} 
    retainOnlyLabelPasted: true, // {Boolean} 
    pasteplain: false, //    {Boolean} 
    toolbars: [
      [
        // 'source', //源代码
        'removeformat', //清除格式
        // 'pasteplain', //纯文本粘贴模式
        'indent', //首行缩进
        '|',
        'bold', //加粗
        '|',
        // 'insertorderedlist', //有序列表
        // 'insertunorderedlist', //无序列表
        'justifyleft', //居左对齐
        'justifyright', //居右对齐
        'justifycenter', //居中对齐
        'justifyjustify', //两端对齐
        '|',
        'inserttable', //插入表格
        'deletetable', //删除表格
        'insertrow', //前插入行
        'insertcol', //前插入列
        'mergecells', //合并多个单元格
        'deleterow', //删除行
        'deletecol', //删除列
        'splittocells', //完全拆分单元格
        'insertparagraphbeforetable', //"表格前插入行"
      ]
    ]
  },
  options_document: {
    UEDITOR_HOME_URL: '/static/ueditor/', // 
    initialFrameHeight: 350,
    enableAutoSave: false, //  {Boolean}
    retainOnlyLabelPasted: true, // {Boolean} 
    pasteplain: false, //    {Boolean} 
    toolbars: [
      [
        'removeformat', //清除格式
        'pasteplain', //纯文本粘贴模式
        'indent', //首行缩进
        '|',
        'justifyleft', //居左对齐
        'justifyright', //居右对齐
        'justifycenter', //居中对齐
        'justifyjustify', //两端对齐
      ]
    ]
  }
}