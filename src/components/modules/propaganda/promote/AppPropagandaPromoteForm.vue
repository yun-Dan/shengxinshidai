<template>
  <div class="app-propaganda-promote-form" v-loading="loading">
    <el-form
      ref="form"
      size="small"
      :model="form"
      label-width="200px"
      style="text-align: left"
      class="el-form submit-el-form"
    >
      <el-form-item v-if="query['2']" label="审核状态：" :rules="[{required: !query['2']}]">
        <span v-if="showData.status === 1" class="warning">待审核</span>
        <span v-if="showData.status === 2" class="danger">审核不通过</span>
        <span v-if="showData.status === 3" class="success">审核通过</span>
      </el-form-item>
      <el-form-item
        v-if="query['2'] && showData.status == 2"
        label="不通过说明："
        :rules="[{required: !query['2']}]"
      >
        <template v-if="showData.status === 2">{{ showData.status_content2 }}</template>
        <template v-if="showData.status === 3">{{ showData.status_content1 }}</template>
      </el-form-item>
      <el-form-item v-if="query['2'] && showData.code" label="编号：">{{ showData.code }}</el-form-item>
      <el-form-item label="推广项目：" :rules="[{required: !query['2']}]">
        <span v-if="query['2']">{{ showData.pro_name }}</span>
        <template v-else>
          <el-select
            v-model="form.pro_id"
            placeholder="请选择（输入关键字查询）"
            :disabled="query['2']"
            filterable
          >
            <template v-for="(item, index) in projectList">
              <el-option
                v-if="!item.promote_id || item.id == query['6']"
                :key="index"
                :label="item.pro_name"
                :value="item.id"
              >
                <span style="float: left">{{ item.pro_name }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">{{ item.college }}</span>
              </el-option>
            </template>
          </el-select>
        </template>
      </el-form-item>
      <el-form-item label="推广类型：" :rules="[{required: !query['2']}]">
        <template v-if="proConfig.promote_type">
          <span v-if="query['2']">{{ proConfig.promote_type[showData.type] }}</span>
          <template v-else>
            <el-select v-model="form.type" placeholder="请选择" :disabled="query['2']">
              <el-option
                v-for="(item, key) in proConfig.promote_type"
                :key="key"
                :label="item"
                :value="key-0"
              ></el-option>
            </el-select>
          </template>
        </template>
      </el-form-item>
      <template v-if="form.type === 1">
        <el-form-item label="网络推广类型：" :rules="[{required: !query['2']}]">
          <template v-if="query['2']">
            <el-checkbox-group v-model="form.network_type" :disabled="query['2']">
              <el-checkbox :label="1" v-if="form.network_type.indexOf(1) !==-1">网络广告</el-checkbox>
              <el-checkbox :label="2" v-if="form.network_type.indexOf(2) !==-1">电子邮件列表</el-checkbox>
              <el-checkbox :label="3" v-if="form.network_type.indexOf(3) !==-1">搜索引擎</el-checkbox>
            </el-checkbox-group>
          </template>
          <template v-else>
            <el-checkbox-group v-model="form.network_type" :disabled="query['2']">
              <el-checkbox :label="1">网络广告</el-checkbox>
              <el-checkbox :label="2">电子邮件列表</el-checkbox>
              <el-checkbox :label="3">搜索引擎</el-checkbox>
            </el-checkbox-group>
          </template>
        </el-form-item>
        <template v-if="form.network_type">
          <template v-if="form.network_type.indexOf(1) !== -1">
            <el-form-item label="网络广告网站：" :rules="[{required: !query['2']}]">
              <span v-if="query['2']">{{ form.network_site }}</span>
              <el-input v-else v-model.trim="form.network_site" :disabled="query['2']"></el-input>
            </el-form-item>
            <el-form-item label="网络广告网址：" :rules="[{required: !query['2']}]">
              <span v-if="query['2']">{{ form.network_url }}</span>
              <el-input v-else v-model.trim="form.network_url" :disabled="query['2']"></el-input>
            </el-form-item>
          </template>
          <el-form-item
            v-if="form.network_type.indexOf(2) !== -1"
            label="电子邮件列表Excel表格："
            :rules="[{required: !query['2']}]"
          >
            <template v-if="query['2']">
              <el-button type="text" @click="handleDownloadExcel(form.email_excel)">下载Excel</el-button>
            </template>
            <template v-else>
              <div class="upload-box">
                <el-upload
                  class="upload"
                  :action="uploadExcelUrl"
                  :before-upload="beforeUploadExcel"
                  :on-success="handleSuccessExcel1"
                  :on-remove="handleRemoveExcel1"
                  :headers="headers"
                  :with-credentials="true"
                  name="attachment"
                  accept=".xls, .xlsx, .XLS, .XLSX"
                  :file-list="fileList_excel1"
                  :limit="1"
                  :auto-upload="true"
                >
                  <el-button
                    :key="1"
                    type="primary"
                    plain
                    size="mini"
                    icon="el-icon-upload el-icon--right"
                  >Excel上传（限 xls / xlsx 文件）</el-button>
                </el-upload>
              </div>
            </template>
          </el-form-item>
          <el-form-item
            v-if="form.network_type.indexOf(2) !== -1"
            label="邮箱地址："
            :rules="[{required: !query['2']}]"
          >
            <span v-if="query['2']">{{ form.email }}</span>
            <el-input v-else v-model.trim="form.email" :disabled="query['2']"></el-input>
          </el-form-item>
          <template v-if="form.network_type.indexOf(3) !== -1">
            <el-form-item label="搜索引擎名称：" :rules="[{required: !query['2']}]">
              <span v-if="query['2']">{{ form.search_name }}</span>
              <el-input v-else v-model.trim="form.search_name" :disabled="query['2']"></el-input>
            </el-form-item>
            <el-form-item label="搜索引擎关键词：" :rules="[{required: !query['2']}]">
              <span v-if="query['2']">{{ form.search_kew }}</span>
              <el-input v-else v-model.trim="form.search_kew" :disabled="query['2']"></el-input>
            </el-form-item>
            <el-form-item label="搜索引擎地址：" :rules="[{required: !query['2']}]">
              <span v-if="query['2']">{{ form.search_address }}</span>
              <el-input v-else v-model.trim="form.search_address" :disabled="query['2']"></el-input>
            </el-form-item>
          </template>
        </template>
      </template>
      <template v-if="form.type === 2">
        <el-form-item label="报刊杂志广告名称：" :rules="[{required: !query['2']}]">
          <span v-if="query['2']">{{ form.periodicals_name }}</span>
          <el-input v-else v-model.trim="form.periodicals_name" :disabled="query['2']"></el-input>
        </el-form-item>
        <el-form-item label="报刊杂志广告介绍：" :rules="[{required: !query['2']}]">
          <span v-if="query['2']">{{ form.periodicals_introduce }}</span>
          <el-input
            v-else
            v-model.trim="form.periodicals_introduce"
            type="textarea"
            rows="3"
            maxlength="200"
            show-word-limit
            :disabled="query['2']"
          ></el-input>
        </el-form-item>
      </template>
      <template v-if="form.type === 3">
        <el-form-item label="户外媒体广告具体形式：" :rules="[{required: !query['2']}]">
          <template v-if="proConfig.outdoor_name">
            <span v-if="query['2']">{{ proConfig.outdoor_name[form.outdoor_name] }}</span>
            <template v-else>
              <el-select
                v-model="form.outdoor_name"
                placeholder="请选择"
                multiple
                :disabled="query['2']"
              >
                <el-option
                  v-for="(item, key) in proConfig.outdoor_name"
                  :key="key"
                  :label="item"
                  :value="key-0"
                ></el-option>
              </el-select>
            </template>
          </template>
        </el-form-item>
        <el-form-item label="户外媒体广告介绍：" :rules="[{required: !query['2']}]">
          <span v-if="query['2']">{{ form.outdoor_introduce }}</span>
          <el-input
            v-else
            v-model.trim="form.outdoor_introduce"
            type="textarea"
            rows="3"
            maxlength="200"
            show-word-limit
            :disabled="query['2']"
          ></el-input>
        </el-form-item>
      </template>
      <template v-if="form.type === 4">
        <el-form-item label="短信广告内容：" :rules="[{required: !query['2']}]">
          <span v-if="query['2']">{{ form.communication_dx }}</span>
          <el-input
            v-else
            v-model.trim="form.communication_dx"
            type="textarea"
            rows="3"
            maxlength="200"
            show-word-limit
            :disabled="query['2']"
          ></el-input>
        </el-form-item>
        <el-form-item label="彩信广告内容：" :rules="[{required: !query['2']}]">
          <span v-if="query['2']">{{ form.communication_cx }}</span>
          <el-input
            v-else
            v-model.trim="form.communication_cx"
            type="textarea"
            rows="3"
            maxlength="200"
            show-word-limit
            :disabled="query['2']"
          ></el-input>
        </el-form-item>
        <el-form-item label="备注：" :rules="[{required: !query['2']}]">
          <span v-if="query['2']">{{ form.communication_note }}</span>
          <el-input
            v-else
            v-model.trim="form.communication_note"
            type="textarea"
            rows="3"
            maxlength="200"
            show-word-limit
            :disabled="query['2']"
          ></el-input>
        </el-form-item>
        <el-form-item label="通讯媒体广告Excel表格：" :rules="[{required: !query['2']}]">
          <template v-if="query['2']">
            <el-button type="text" @click="handleDownloadExcel(form.communication_excel)">下载Excel</el-button>
          </template>
          <template v-else>
            <div class="upload-box">
              <el-upload
                class="upload"
                :action="uploadExcelUrl"
                :before-upload="beforeUploadExcel"
                :on-success="handleSuccessExcel2"
                :on-remove="handleRemoveExcel2"
                :headers="headers"
                :with-credentials="true"
                name="attachment"
                accept=".xls, .xlsx, .XLS, .XLSX"
                :file-list="fileList_excel2"
                :limit="1"
                :auto-upload="true"
              >
                <el-button
                  :key="1"
                  type="primary"
                  plain
                  size="mini"
                  icon="el-icon-upload el-icon--right"
                >Excel上传（限 xls / xlsx 文件）</el-button>
              </el-upload>
            </div>
          </template>
        </el-form-item>
      </template>
      <template v-if="form.type === 5">
        <el-form-item label="广告微信名称：" :rules="[{required: !query['2']}]">
          <span v-if="query['2']">{{ form.media_wx }}</span>
          <el-input v-else v-model.trim="form.media_wx" :disabled="query['2']"></el-input>
        </el-form-item>
        <el-form-item label="广告微博名称：" :rules="[{required: !query['2']}]">
          <span v-if="query['2']">{{ form.media_wb }}</span>
          <el-input v-else v-model.trim="form.media_wb" :disabled="query['2']"></el-input>
        </el-form-item>
        <el-form-item label="广告App名称：" :rules="[{required: !query['2']}]">
          <span v-if="query['2']">{{ form.media_app }}</span>
          <el-input v-else v-model.trim="form.media_app" :disabled="query['2']"></el-input>
        </el-form-item>
      </template>
      <el-form-item
        v-if="form.type === 6"
        label="函件发放目标Excel表格："
        :rules="[{required: !query['2']}]"
      >
        <template v-if="query['2']">
          <el-button type="text" @click="handleDownloadExcel(form.correspondence)">下载Excel</el-button>
        </template>
        <template v-else>
          <div class="upload-box">
            <el-upload
              class="upload"
              :action="uploadExcelUrl"
              :before-upload="beforeUploadExcel"
              :on-success="handleSuccessExcel3"
              :on-remove="handleRemoveExcel3"
              :headers="headers"
              :with-credentials="true"
              name="attachment"
              accept=".xls, .xlsx, .XLS, .XLSX"
              :file-list="fileList_excel3"
              :limit="1"
              :auto-upload="true"
            >
              <el-button
                :key="1"
                type="primary"
                plain
                size="mini"
                icon="el-icon-upload el-icon--right"
              >Excel上传（限 xls / xlsx 文件）</el-button>
            </el-upload>
          </div>
        </template>
      </el-form-item>
      <el-form-item label="目标链接：" :rules="[{required: !query['2']}]">
        <span v-if="query['2']">{{ form.chain }}</span>
        <el-input v-else v-model.trim="form.chain" :disabled="query['2']"></el-input>
      </el-form-item>
      <el-form-item label="广告图片：" :rules="[{required: !query['2']}]">
        <template v-if="query['2']">
          <el-image  style="width: 128px; height: 128px" :src="`${lookUrl}/${form.img}`"  :preview-src-list="[`${lookUrl}/${form.img}`]"></el-image>
          <!-- <img :src="`${lookUrl}/${form.img}`" alt style="width: 128px; height: 128px"> -->
        </template>
        <div v-else class="upload-box">
          <el-upload
            class="avatar-uploader"
            :action="uploadExcelUrl1"
            :on-success="handleSuccessImg"
            :on-remove="handleRemoveImg"
            :before-upload="beforeUploadImg"
            :headers="headers"
            :with-credentials="true"
            name="attachment"
            accept=".JPG, .jpg, .png, .PNG"
            :file-list="fileList_img"
            :limit="1"
            :auto-upload="true"
          >
            <el-button
              :key="1"
              type="primary"
              plain
              size="mini"
              icon="el-icon-upload el-icon--right"
            >附件上传（限 JPG / PNG 文件）</el-button>
          </el-upload>
        </div>
      </el-form-item>
      <el-form-item label="广告视频：" class="video-box">
        <template v-if="query['2']">
          <video
            v-if="form.video"
            :src="`${lookUrl}/${form.video}`"
            class="avatar"
            controls="controls"
            style="width: 300px; height: 200px"
          >您的浏览器不支持视频播放</video>
          <template v-else>（无）</template>
        </template>
        <template v-else>
          <div class="tip">请保证视频格式正确，且不超过20M</div>
          <div class="upload-box">
            <el-upload
              class="avatar-uploader el-upload--text"
              :action="uploadExcelUrl_video"
              :headers="headers"
              :with-credentials="true"
              name="attachment"
              :show-file-list="false"
              :file-list="fileList_video"
              :before-upload="beforeUploadVideo"
              :on-success="handleVideoSuccess"
              :on-progress="uploadVideoProcess"
            >
              <video
                v-if="videoSrc !='' && videoFlag == false"
                :src="videoSrc"
                class="avatar"
                controls="controls"
                style="width: 178px; height: 178px"
              >您的浏览器不支持视频播放</video>
              <i
                v-else-if="videoSrc =='' && videoFlag == false"
                class="el-icon-plus avatar-uploader-icon"
              ></i>
              <el-progress
                v-if="videoFlag == true"
                type="circle"
                :percentage="videoUploadPercent"
                style="margin-top:30px;"
              ></el-progress>
            </el-upload>
          </div>
        </template>
      </el-form-item>
      <el-form-item :label="`${createTime > versionTime_4 ? '广告媒体' : '广告服务商'}：`" :rules="[{required: !query['2']}]">
        <span v-if="query['2']">{{ form.putin }}</span>
        <el-input v-else v-model.trim="form.putin" :disabled="query['2']"></el-input>
      </el-form-item>
      <el-form-item label="广告时间：" :rules="[{required: !query['2']}]">
        <div
          v-if="query['2']"
        >{{ form.sta_time | TimestampChangeFilter }} 至 {{ form.end_time | TimestampChangeFilter }}</div>
        <el-row v-else :gutter="0">
          <el-col :span="11">
            <el-date-picker
              v-model="form.sta_time"
              :disabled="query['2']"
              type="date"
              value-format="timestamp"
              placeholder="开始日期"
            ></el-date-picker>
          </el-col>
          <el-col :span="2" class="text-align-center">
            <span>-</span>
          </el-col>
          <el-col :span="11">
            <el-date-picker
              v-model="form.end_time"
              :disabled="query['2']"
              type="date"
              value-format="timestamp"
              placeholder="结束日期"
            ></el-date-picker>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="广告金额（元）：" :rules="[{required: !query['2']}]">
        <span v-if="query['2']">{{ form.amount }} 元</span>
        <el-input-number
          v-else
          v-model="form.amount"
          :min="0"
          :precision="2"
          controls-position="right"
          :disabled="query['2']"
        ></el-input-number>
      </el-form-item>
      <template v-if="query['4'] && userInfo.role === 1">
        <el-form-item label="审核状态：" :rules="[{required: true}]">
          <el-radio-group v-model="form_check.status" style="margin-left: 20px">
            <el-radio :label="3">通过</el-radio>
            <el-radio :label="2">不通过</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="form_check.status === 2" label="不通过说明：" :rules="[{required: true}]">
          <el-input
            v-model.trim="form_check.status_content"
            type="textarea"
            rows="2"
            :maxlength="50"
            show-word-limit
            placeholder="审核不通过说明"
          ></el-input>
        </el-form-item>
      </template>
      <el-form-item class="text-align-center">
        <template v-if="query['2']">
          <el-button
            v-if="query['4'] && userInfo.role === 1"
            type="primary"
            @click="handleCheckTrue"
          >确 定</el-button>
        </template>
        <template v-if="!query['2'] && !query['4']">
          <el-button type="primary" @click.native=" handleTrue(0)">保 存</el-button>
          <el-button type="primary" @click.native=" handleTrue(1)">保存并提交</el-button>
        </template>
        <el-button @click.native="handleBack">返 回</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
export default {
  name: "app-propaganda-promote-form",
  data() {
    return {
      loading: false,
      proConfig: JSON.parse(localStorage.getItem("pro_config")) || {},
      query: {
        "1": -1, // key（标记为新增或编辑：-1新增，0编辑）
        "2": false, // look （ true查看、false新增或编辑）
        "3": 0, // id
        "4": false, // is_check
        "5": 0, // uid
        "6": 0 // pro_id
      },
      showData: {},
      form: {
        uid: 0,
        pro_id: null,
        type: null, // 推广类型：1 网络推广 2 报刊杂志广告 3 户外媒体广告 4 通讯媒体广告 5 新媒体广告 6 函件 7 辅助单位广告
        network_type: [], // 网络推广类型： 1网络广告 2电子邮件列表 3搜索引擎（type=1）
        network_url: "", //网络广告网址（type=1 && network_type=[1, ...]）
        network_site: "", //网络广告网站（type=1 && network_type=[1, ...]）
        email_excel: "", //电子邮件列表excel表格（type=1 && network_type=[2, ...]）
        email: "", //邮箱地址（type=1 && network_type=[2, ...]）
        search_name: "", //搜索引擎名称（type=1 && network_type=[3, ...]）
        search_kew: "", //搜索引擎关键词（type=1 && network_type=[3, ...]）
        search_address: "", //搜索引擎地址（type=1 && network_type=[3, ...]）
        periodicals_name: "", // 报刊杂志广告名称（type=2）
        periodicals_introduce: "", // 报刊杂志广告介绍（type=2）
        outdoor_name: [], // 户外媒体广告具体形式（户外媒体广告名称）（type=3）
        outdoor_introduce: "", // 户外媒体广告介绍（type=3）
        communication_dx: "", // 通讯媒体广告短信（type=4）
        communication_cx: "", // 通讯媒体广告彩信（type=4）
        communication_note: "", // 通讯媒体广告备注（type=4）
        communication_excel: "", // 通讯媒体广告excel表格（type=4）
        media_wx: "", // 新媒体广告微信（type=5）
        media_wb: "", // 新媒体广告微博（type=5）
        media_app: "", // 新媒体广告app（type=5）
        correspondence: "", // 函件（type=6）上传的excel
        // fz_advertising: '', // 辅助单位广告（type=7）
        chain: "", // 文字链
        img: "", // 广告图片
        video: "", // 广告视频
        putin: "", // 投放形式
        amount: "", // 广告金额
        sta_time: null, // 开始时间
        end_time: null // 结束时间
      },
      //  上传
      headers: {},
      fileList_excel1: [], // “电子邮件列表excel表格” 上传列表
      fileList_excel2: [], // “通讯媒体广告excel表格” 上传列表
      fileList_excel3: [], // "函件"excel上传列表
      fileList_img: [], // “广告图片” 上传列表
      fileList_video: [], // “广告视频” 上传列表
      //  视频
      videoFlag: false,
      videoUploadPercent: 0,
      videoSrc: "",
      // 审核
      dialogVisible_check: false,
      dialog_loading_check: false,
      form_check: {
        id: null,
        status: 3, // 2审核不通过 3审核通过
        status_content: "" // 审核不通过原因
      },
      //项目列表
      projectList: [],
      // 创建日期
      createTime: new Date().getTime()
    };
  },
  computed: {
    ...mapState([
      "URL",
      "uploadExcelUrl1",
      "uploadExcelUrl",
      "uploadExcelUrl_video",
      "lookUrl",
      'userInfo',
      'versionTime_4'
    ])
  },
  methods: {
    ...mapActions([
      "getPropagandaPromoteList",
      "addPropagandaPromote",
      "editPropagandaPromote",
      "checkPropagandaPromote",
      "getPropagandaPromoteProjectList"
    ]),
    initData() {
      let query = this.$route.query;
      this.query = Object.assign({}, query, {
        "2":
          this.$route.query["2"] === true || this.$route.query["2"] === "true",
        "4":
          this.$route.query["4"] === true || this.$route.query["4"] === "true"
      });
      if (this.query["5"]) {
        this.getPro();
      }
      this.loading = true;
      if (this.query[1] == -1) {
        this.loading = false;
      } else {
        if (this.loading) {
          this.getPropagandaPromoteList({
            data: {
              id: this.query["3"]
            }
          }).then(data => {
            if (data.data.code === 200) {
              const Data = data.data.data;
              let list = Data.list || [];
              if (list && list.length) {
                this.showData = list[0];
                for (let key in this.form) {
                  if (key === "type") {
                    this.$set(this.form, key, this.showData["type"] - 0);
                  } else if (key === "network_type") {
                    let network_type = this.showData["network_type"]
                      .split(",")
                      .map(item => {
                        return item - 0;
                      });
                    this.$set(this.form, key, network_type);
                  } else if (key === "outdoor_name") {
                    let outdoor_name = this.showData["outdoor_name"]
                      .split(",")
                      .map(item => {
                        return item - 0;
                      });
                    this.$set(this.form, key, outdoor_name);
                  } else if (key === "sta_time" || key === "end_time") {
                    this.$set(this.form, key, this.showData[key] * 1000);
                  } else {
                    this.$set(this.form, key, this.showData[key]);
                    if (key === "email_excel" && this.showData[key]) {
                      this.fileList_excel1 = [
                        {
                          name: this.showData[key],
                          response: {
                            code: 200,
                            data: {
                              code: this.showData[key]
                            }
                          }
                        }
                      ];
                    } else if (
                      key === "communication_excel" &&
                      this.showData[key]
                    ) {
                      this.fileList_excel2 = [
                        {
                          name: this.showData[key],
                          response: {
                            code: 200,
                            data: {
                              code: this.showData[key]
                            }
                          }
                        }
                      ];
                    } else if (key === "correspondence" && this.showData[key]) {
                      this.fileList_excel3 = [
                        {
                          name: this.showData[key],
                          response: {
                            code: 200,
                            data: {
                              code: this.showData[key]
                            }
                          }
                        }
                      ];
                    } else if (key === "img" && this.showData[key]) {
                      this.fileList_img = [
                        {
                          name: this.showData[key],
                          response: {
                            code: 200,
                            data: {
                              code: this.showData[key]
                            }
                          }
                        }
                      ];
                    } else if (key === "video" && this.showData[key]) {
                      this.fileList_video = [
                        {
                          name: this.showData[key],
                          response: {
                            code: 200,
                            data: {
                              code: this.showData[key]
                            }
                          }
                        }
                      ];
                      this.videoSrc = `${this.lookUrl}/${this.showData[key]}`;
                    }
                  }
                }
                for (let key in this.form) {
                  if (!this.$options.data().form.hasOwnProperty(key)) {
                    this.$delete(this.form, key);
                  }
                }
                this.createTime = this.showData.create_time * 1000 || new Date().getTime()
              }
              this.loading = false;
            } else {
              this.$notify.error({
                title: "错误",
                message: data.data.error
              });
            }
          });
        }
      }
    },
    getPro() {
      this.getPropagandaPromoteProjectList({
        data: {
          page: 1,
          limit: 999999999
        }
      }).then(data => {
        if (data.data.code === 200) {
          this.projectList = data.data.data.list || [];
        }
      });
    },
    handleTrue(is_published) {
      // 确认修改当前编辑
      let Params = JSON.parse(JSON.stringify(this.form));
      let Obj = {
        uid: this.query["5"],
        is_published: is_published
      };
      if (!Params.pro_id) {
        this.$message({
          type: "warning",
          message: "请选择推广项目！"
        });
        return false;
      } else {
        Object.assign(Obj, {
          pro_id: Params.pro_id
        });
      }
      if (Params.type) {
        Object.assign(Obj, {
          type: Params.type
        });
        let Type = Params.type;
        if (Type === 1) {
          if (!Params.network_type.length) {
            this.$message({
              type: "warning",
              message: "请选择网络推广类型！"
            });
            return false;
          } else {
            Object.assign(Obj, {
              network_type: Params.network_type
            });
            if (Params.network_type.indexOf(1) !== -1) {
              if (!Params.network_site) {
                this.$message({
                  type: "warning",
                  message: "请输入网络广告网站！"
                });
                return false;
              } else {
                Object.assign(Obj, {
                  network_site: Params.network_site
                });
              }
              if (!Params.network_url) {
                this.$message({
                  type: "warning",
                  message: "请输入网络广告网址！"
                });
                return false;
              } else {
                Object.assign(Obj, {
                  network_url: Params.network_url
                });
              }
            }
            if (Params.network_type.indexOf(2) !== -1) {
              if (!Params.email_excel) {
                this.$message({
                  type: "warning",
                  message: "请上传电子邮件列表Excel表格！"
                });
                return false;
              } else {
                Object.assign(Obj, {
                  email_excel: Params.email_excel
                });
              }
              if (!Params.email) {
                this.$message({
                  type: "warning",
                  message: "请输入邮箱地址！"
                });
                return false;
              } else {
                Object.assign(Obj, {
                  email: Params.email
                });
              }
            }
            if (Params.network_type.indexOf(3) !== -1) {
              if (!Params.search_name) {
                this.$message({
                  type: "warning",
                  message: "请输入搜索引擎名称！"
                });
                return false;
              } else {
                Object.assign(Obj, {
                  search_name: Params.search_name
                });
              }
              if (!Params.search_kew) {
                this.$message({
                  type: "warning",
                  message: "请输入搜索引擎关键词！"
                });
                return false;
              } else {
                Object.assign(Obj, {
                  search_kew: Params.search_kew
                });
              }
              if (!Params.search_address) {
                this.$message({
                  type: "warning",
                  message: "请输入搜索引擎地址！"
                });
                return false;
              } else {
                Object.assign(Obj, {
                  search_address: Params.search_address
                });
              }
            }
          }
        } else if (Type === 2) {
          if (!Params.periodicals_name) {
            this.$message({
              type: "warning",
              message: "请输入报刊杂志广告名称！"
            });
            return false;
          } else {
            Object.assign(Obj, {
              periodicals_name: Params.periodicals_name
            });
          }
          if (!Params.periodicals_introduce) {
            this.$message({
              type: "warning",
              message: "请输入报刊杂志广告介绍！"
            });
            return false;
          } else {
            Object.assign(Obj, {
              periodicals_introduce: Params.periodicals_introduce
            });
          }
        } else if (Type === 3) {
          if (!Params.outdoor_name) {
            this.$message({
              type: "warning",
              message: "请选择户外媒体广告具体形式！"
            });
            return false;
          } else {
            Object.assign(Obj, {
              outdoor_name: Params.outdoor_name.join(",")
            });
          }
          if (!Params.outdoor_introduce) {
            this.$message({
              type: "warning",
              message: "请输入户外媒体广告介绍！"
            });
            return false;
          } else {
            Object.assign(Obj, {
              outdoor_introduce: Params.outdoor_introduce
            });
          }
        } else if (Type === 4) {
          if (!Params.communication_dx) {
            this.$message({
              type: "warning",
              message: "请输入短信广告内容！"
            });
            return false;
          } else {
            Object.assign(Obj, {
              communication_dx: Params.communication_dx
            });
          }
          if (!Params.communication_cx) {
            this.$message({
              type: "warning",
              message: "请输入彩信广告内容！"
            });
            return false;
          } else {
            Object.assign(Obj, {
              communication_cx: Params.communication_cx
            });
          }
          if (!Params.communication_note) {
            this.$message({
              type: "warning",
              message: "请输入备注！"
            });
            return false;
          } else {
            Object.assign(Obj, {
              communication_note: Params.communication_note
            });
          }
          if (!Params.communication_excel) {
            this.$message({
              type: "warning",
              message: "请上传通讯媒体广告Excel表格！"
            });
            return false;
          } else {
            Object.assign(Obj, {
              communication_excel: Params.communication_excel
            });
          }
        } else if (Type === 5) {
          if (!Params.media_wx) {
            this.$message({
              type: "warning",
              message: "请输入新媒体广告微信！"
            });
            return false;
          } else {
            Object.assign(Obj, {
              media_wx: Params.media_wx
            });
          }
          if (!Params.media_wb) {
            this.$message({
              type: "warning",
              message: "请输入新媒体广告微博！"
            });
            return false;
          } else {
            Object.assign(Obj, {
              media_wb: Params.media_wb
            });
          }
          if (!Params.media_app) {
            this.$message({
              type: "warning",
              message: "请输入新媒体广告app！"
            });
            return false;
          } else {
            Object.assign(Obj, {
              media_app: Params.media_app
            });
          }
        } else if (Type === 6) {
          if (!Params.correspondence) {
            this.$message({
              type: "warning",
              message: "请上传函件发放目标Excel表格！！"
            });
            return false;
          } else {
            Object.assign(Obj, {
              correspondence: Params.correspondence
            });
          }
        } else if (Type === 7) {
          // if (!Params.fz_advertising) {
          //     this.$message({
          //         type:'warning',
          //         message:'请输入辅助单位广告！',
          //     });
          //     return false;
          // } else {
          //     Object.assign(Obj, {
          //         fz_advertising: Params.fz_advertising
          //     });
          // }
        }
      } else {
        this.$message({
          type: "warning",
          message: "请选择推广类型！"
        });
        return false;
      }
      if (!Params.chain) {
        this.$message({
          type: "warning",
          message: "请输入目标链接！"
        });
        return false;
      } else {
        Object.assign(Obj, {
          chain: Params.chain
        });
      }
      if (!Params.img) {
        this.$message({
          type: "warning",
          message: "请上传广告图片！"
        });
        return false;
      } else {
        Object.assign(Obj, {
          img: Params.img
        });
      }
      // if (!Params.video) {
      //     this.$message({
      //         type:'warning',
      //         message:'请上传广告视频！',
      //     });
      //     return false;
      // } else {
      //     Object.assign(Obj, {
      //         video: Params.video
      //     });
      // }
      Object.assign(Obj, {
        video: Params.video
      });
      if (!Params.putin) {
        this.$message({
          type: "warning",
          message: `请输入${this.createTime > this.versionTime_4 ? '广告媒体' : '广告服务商'}！`
        });
        return false;
      } else {
        Object.assign(Obj, {
          putin: Params.putin
        });
      }
      if (!Params.sta_time) {
        this.$message({
          type: "warning",
          message: "开始日期不能为空！"
        });
        return false;
      } else {
        Object.assign(Obj, {
          sta_time: parseInt(Params.sta_time / 1000)
        });
      }
      if (!Params.end_time) {
        this.$message({
          type: "warning",
          message: "结束日期不能为空！"
        });
        return false;
      } else {
        Object.assign(Obj, {
          end_time: parseInt(Params.end_time / 1000)
        });
      }
      if (!Params.amount) {
        this.$message({
          type: "warning",
          message: "请输入广告金额！"
        });
        return false;
      } else {
        Object.assign(Obj, {
          amount: Params.amount
        });
      }
      this.loading = true;
      if (this.loading) {
        if (this.query["1"] == -1) {
          // 新增
          this.addPropagandaPromote({
            data: Obj
          }).then(data => {
            if (data.data.code === 200) {
              this.$message({
                message: data.data.data,
                type: "success"
              });
              this.handleBack();
            } else {
              this.$notify.error({
                title: "错误",
                message: data.data.error,
                onClose: () => {
                  this.loading = false;
                }
              });
            }
          });
        } else {
          // 编辑
          this.editPropagandaPromote({
            data: Obj,
            id: this.query["3"]
          }).then(data => {
            if (data.data.code === 200) {
              this.$message({
                message: data.data.data,
                type: "success"
              });
              this.handleBack();
            } else {
              this.$notify.error({
                title: "错误",
                message: data.data.error,
                onClose: () => {
                  this.loading = false;
                }
              });
            }
          });
        }
      }
    },
    handleCheck(val) {
      Object.assign(this.form_check, this.$options.data().form_check, {
        id: val.id
      });
      this.dialog_loading_check = false;
      this.dialogVisible_check = true;
    },
    handleCheckTrue() {
      let Params = {
        id: this.query["3"] - 0,
        status: this.form_check.status
      };
      if (this.form_check.status === 2 && !this.form_check.status_content) {
        this.$message({
          message: "“审核不通过说明”不能为空！",
          type: "warning"
        });
        return false;
      }
      if (Params.status === 2) {
        Object.assign(Params, {
          status_content1: "",
          status_content2: this.form_check.status_content
        });
      } else if (Params.status === 3) {
        Object.assign(Params, {
          // status_content1: this.form_check.status_content,
          status_content1: '',
          status_content2: ""
        });
      }
      this.dialog_loading_check = true;
      if (this.dialog_loading_check) {
        this.checkPropagandaPromote({
          data: Params
        }).then(data => {
          if (data.data.code === 200) {
            this.$message({
              type: "success",
              message: data.data.data
            });
            this.dialogVisible_check = false;
            this.handleBack();
          } else {
            this.$notify.error({
              title: "错误",
              message: data.data.error,
              onClose: () => {
                this.dialog_loading_check = false;
              }
            });
          }
        });
      }
    },
    beforeUploadImg(file) {
      const isTYPE =
        file.type === "image/jpg" ||
        file.type === "image/png" ||
        file.name.indexOf(".jpg") !== -1;
      const isLtM = file.size / 1024 / 1024 < 8;
      if (!isTYPE) {
        this.$message.error("上传文件只能是 JPG/ PNG 格式!");
      }
      if (!isLtM) {
        this.$message.error("上传文件大小不能超过 8MB!");
      }
      return isTYPE && isLtM;
    },
    handleSuccessImg(response, file, fileList) {
      // 上传成功的回调
      if (response.code === 200) {
        this.$set(this.form, "img", response.data.code);
      } else {
        this.$notify.error({
          title: "错误",
          message: response.error
        });
        this.$set(this.form, "img", "");
        this.fileList_img = [];
      }
    },
    handleRemoveImg(file, fileList) {
      this.$set(this.form, "img", "");
      this.fileList_img = [];
    },
    handleDownloadExcel(code) {
      // Excel下载。
      window.open(`${this.lookUrl}/${code}`);
    },
    beforeUploadExcel(file) {
      // .xls, .xlsx, .XLS, .XLSX
      let format = file.name.substring(file.name.lastIndexOf(".") + 1);
      const passed =
        format === "xls" ||
        format === "xlsx" ||
        format === "XLS" ||
        format === "XLSX";
      if (!passed) {
        this.$message.error("文件上传只能是 xls / xlsx 格式!");
      }
      return passed;
    },
    handleSuccessExcel1(response, file, fileList) {
      // 上传成功的回调  personsImport
      if (response.code === 200) {
        this.$set(this.form, "email_excel", response.data.code);
      } else {
        this.$notify.error({
          title: "错误",
          message: response.error
        });
        this.$set(this.form, "email_excel", "");
        this.fileList_excel1 = [];
      }
    },
    handleRemoveExcel1(file, fileList) {
      this.$set(this.form, "email_excel", "");
      this.fileList_excel1 = [];
    },
    handleSuccessExcel2(response, file, fileList) {
      // 上传成功的回调  personsImport
      if (response.code === 200) {
        this.$set(this.form, "communication_excel", response.data.code);
      } else {
        this.$notify.error({
          title: "错误",
          message: response.error
        });
        this.$set(this.form, "communication_excel", "");
        this.fileList_excel2 = [];
      }
    },
    handleRemoveExcel2(file, fileList) {
      this.$set(this.form, "communication_excel", "");
      this.fileList_excel2 = [];
    },
    handleSuccessExcel3(response, file, fileList) {
      // 上传成功的回调  personsImport
      if (response.code === 200) {
        this.$set(this.form, "correspondence", response.data.code);
      } else {
        this.$notify.error({
          title: "错误",
          message: response.error
        });
        this.$set(this.form, "correspondence", "");
        this.fileList_excel2 = [];
      }
    },
    handleRemoveExcel3(file, fileList) {
      this.$set(this.form, "correspondence", "");
      this.fileList_excel3 = [];
    },
    beforeUploadVideo(file) {
      const isLt10M = file.size / 1024 / 1024 < 20;
      if (
        [
          "video/mp4",
          "video/ogg",
          "video/flv",
          "video/avi",
          "video/wmv",
          "video/rmvb"
        ].indexOf(file.type) === -1
      ) {
        this.$message.error("请上传正确的视频格式！");
        return false;
      }
      if (!isLt10M) {
        this.$message.error("上传视频大小不能超过20MB！");
        return false;
      }
    },
    uploadVideoProcess(event, file, fileList) {
      this.videoFlag = true;
      this.videoUploadPercent = file.percentage.toFixed(2) - 0 || 0;
    },
    handleVideoSuccess(res) {
      this.videoFlag = false;
      this.videoUploadPercent = 0;
      if (res.code == 200) {
        this.videoSrc = `${this.lookUrl}/${res.data.code}`;
        this.$set(this.form, "video", res.data.code);
      } else {
        this.$message.error("视频上传失败，请重新上传！");
        this.videoSrc = "";
        this.$set(this.form, "video", "");
        this.fileList_video = [];
      }
    },
    handleBack() {
      this.$router.go(-1);
    }
  },
  created () {
    this.headers = JSON.parse(this.$cookie.get("headers"))
  },
  mounted() {
    this.initData();
  }
};
</script>

<style scoped>
.app-propaganda-promote-form {
  min-width: 680px;
  max-width: 800px;
  margin: 0 auto;
  padding: 50px;
}
</style>
