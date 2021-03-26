<template>
  <div
    class="app-project-index"
    ref="aaa"
    v-loading="loading2"
    element-loading-text="加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0)" >
    <el-card class="box-card">
      <div slot="header" class="clearfix" v-cloak>
        <div class="fl">
          <el-button-group style="margin-bottom: 10px">
            <template v-if="switcher">
              <el-button v-if="isYXB" @click="goWrap" type="info" icon="el-icon-d-arrow-left">专业列表</el-button>
              <el-button v-if="!isYXB && sceCollege" @click.native="handleAdd" type="primary" icon="el-icon-plus">新增</el-button>
              <el-button
                v-if="userInfo.role===2"
                @click.native="handleSwitcher(1)"
                type="primary"
                icon="el-icon-delete"
                plain
              >回收站</el-button>
              <el-button @click.native="handleAll" type icon="el-icon-menu">全部</el-button>
              <el-button v-if="ids.length" @click.native="handleB" type="warning" icon="el-icon-refresh-left">批量退回</el-button>
            </template>
            <template v-else>
              <el-button
                @click.native="handleSwitcher(0)"
                type="primary"
                icon="el-icon-d-arrow-left"
              >返 回</el-button>
              <!-- <el-button
                v-if="showDelete"
                @click.native="handleStatus(0,false)"
                type
                icon="el-icon-refresh"
              >恢 复</el-button> -->
              <el-button @click.native="handleAll" type="primary" icon="el-icon-menu" plain>全部</el-button>
            </template>
          </el-button-group>
        </div>
        <div class="fr query-box" @keyup.enter="handleSearch">
          <el-form inline @submit.native.prevent>
            <el-form-item>
              <el-select
                v-if="switcher && !pxlx9"
                v-model="getForm.status"
                placeholder="请选择"
                @change="handleSelect"
              >
                <el-option label="-- 全部项目--" value="0,2"></el-option>
                <el-option label="正常项目" :value="0"></el-option>
                <el-option label="报废项目" :value="2"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-select
                v-if="userInfo.role===1&&!pro_ss && !isYXB"
                v-model="getForm.college"
                placeholder="请选择"
                @change="handleSelect"
              >
                <el-option label="-- 不限学院 --" :value="null"></el-option>
                <el-option
                  v-for="(item,index) in collegeList"
                  :label="item.name"
                  :value="item.id"
                  :key="index"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-select
                v-if="userInfo.role===1&&!pro_ss && !isYXB"
                v-model="getForm.structure"
                placeholder="请选择"
                @change="handleSelect"
              >
                <el-option label="-- 不限部门 --" :value="null"></el-option>
                <el-option
                  v-for="(item,index) in structuresList"
                  :label="item.name"
                  :value="item.id"
                  :key="index"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-select v-model="getForm.province" placeholder="请选择" @change="handleSelectProvince">
                <el-option label="-- 不限省份 --" :value="null"></el-option>
                <el-option
                  v-for="(item,index) in provincesList"
                  :label="item.name"
                  :value="item.id"
                  :key="index"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-select v-model="getForm.city" placeholder="请选择" @change="handleSelect">
                <el-option label="-- 不限城市 --" :value="null"></el-option>
                <el-option
                  v-for="(item,index) in cityList"
                  :label="item.name"
                  :value="item.id"
                  :key="index"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-select v-model="getForm.xklb" placeholder="请选择" @change="handleSelect">
                <el-option label="-- 不限类别 --" :value="''"></el-option>
                <el-option
                  v-for="(item,key,index) in proConfig.xklb"
                  :label="item"
                  :value="key"
                  :key="index"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-select
                v-if="!pxlx9"
                v-model="getForm.pxlx"
                placeholder="请选择"
                @change="handleSelect"
              >
                <el-option label="-- 不限类型 --" :value="''"></el-option>
                <el-option
                  v-for="(item,key,index) in proConfig.pxlx"
                  :label="item"
                  :value="key"
                  :key="index"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item v-if="userInfo.role===2">
              <el-select v-model="getForm.sea_field" placeholder="请选择">
                <el-option label="项目编号" value="pro_code"></el-option>
                <el-option label="项目名称" value="pro_name"></el-option>
                <el-option label="联系人姓名" value="user"></el-option>
                <el-option label="联系方式" value="tel"></el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <el-form inline class="fr" @submit.native.prevent>
            <el-form-item v-if="userInfo.role===1">
              <el-select v-model="getForm.sea_field" placeholder="请选择">
                <el-option label="项目编号" value="pro_code"></el-option>
                <el-option label="项目名称" value="pro_name"></el-option>
                <el-option label="联系人姓名" value="user"></el-option>
                <el-option label="联系方式" value="tel"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-input
                placeholder="搜索关键字"
                v-model.trim="getForm.keywords"
                class="input-with-select"
                clearable
              >
                <el-button @click.native="handleSearch" slot="append" icon="el-icon-search"></el-button>
              </el-input>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div>
        <el-table
          :data="projectsData.list"
          style="width: 100%;margin-top: 0px"
          :default-expand-all="true"
          :header-cell-style="{backgroundColor:'#fafafa'}"
          @selection-change="handleSelectionChange"
        >
          <el-table-column v-if="switcher && isYXB && this.userInfo.role === 1" align="center" type="selection" width="50"
            :selectable="selectable"></el-table-column>
          <el-table-column type="expand" width="1">
            <template slot-scope="props">
              <ul>
                <template v-if="props.row.status!==2">
                  <li v-for="(item,index) in props.row.history" :key="index">
                    <template v-if="item.his_type===1">
                      <span class="danger">未通过原因【{{ item.create_time | TimestampChangeFilter }}】：</span>
                      {{ item.content }}
                    </template>
                    <template v-else>
                      <span class="success">修改回复【{{ item.create_time | TimestampChangeFilter }}】：</span>
                      {{ item.content }}
                    </template>
                  </li>
                </template>
              </ul>
            </template>
          </el-table-column>
          <el-table-column align="center" label="序号" width="50">
            <template slot-scope="scope">
              <span>{{ (getForm.page-1)*getForm.limit+(scope.$index+1) }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="pro_name" label="项目名称">
            <template slot-scope="scope">
              <template v-if="scope.row.status===2">
                <el-tag type="danger" size="mini">已报废</el-tag>
                <el-tag v-if="scope.row.gl_type === 5" type="primary" effect="plain" size="mini">预立项</el-tag>
                <span style="color:#909399;">{{ scope.row.pro_name }}</span>
              </template>
              <template v-else>
                <el-tag v-if="scope.row.gl_type === 5" type="primary" effect="plain" size="mini">预立项</el-tag>
                <span>{{ scope.row.pro_name }}</span>
              </template>
            </template>
          </el-table-column>
          <el-table-column align="center" label="项目编号">
            <template slot-scope="scope">
              <div v-if="scope.row.status===2" style="color:#909399;">
                <span v-if="scope.row.pro_code">{{ scope.row.pro_code }}</span>
                <span v-else>未分配</span>
              </div>
              <template v-else>
                <span v-if="scope.row.pro_code">{{ scope.row.pro_code }}</span>
                <span v-else style="color: #ff0000">未分配</span>
              </template>
            </template>
          </el-table-column>
          <el-table-column align="center" label="主办学院">
            <template slot-scope="scope">
              <div v-if="scope.row.status===2" style="color: #909399">
                <div>{{ scope.row.college }}</div>
                <div v-if="scope.row.structure" style="line-height: 20px">{{ scope.row.structure }}</div>
                <div style="line-height: 20px">{{ scope.row.realname }}</div>
              </div>
              <template v-else>
                <div>{{ scope.row.college }}</div>
                <div
                  v-if="scope.row.structure"
                  style="color: #5E7E9F;line-height: 20px"
                >{{ scope.row.structure }}</div>
                <div style="color: #199f93;line-height: 20px">{{ scope.row.realname }}</div>
              </template>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="user" label="联系人姓名" width="80">
            <template slot-scope="scope">
              <el-tooltip :content="`电话：${scope.row.tel}`" placement="bottom" effect="light">
                <span
                  v-if="scope.row.status===2"
                  style="color: #909399; cursor: pointer"
                >{{ scope.row.user }}</span>
                <span v-else style="cursor: pointer">{{ scope.row.user }}</span>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column v-if="!isYXB" align="center" label="委托单位">
            <template slot-scope="scope">
              <div :style="{color: scope.row.status===2 ? '#909399' : ''}">
                <template v-if="scope.row.jf_dwmc && scope.row.jf_dwmc.length">
                  <span v-for="(item, index) in scope.row.jf_dwmc" :key="index">
                    <template v-if="index">、</template>{{ item }}
                  </span>
                </template>
                <template v-else>无</template>
              </div>
            </template>
          </el-table-column>
          <el-table-column align="center" label="辅助单位">
            <template slot-scope="scope">
              <div v-if="scope.row.status===2" style="color: #909399">
                <span v-if="scope.row.yf_dwmc">{{ scope.row.yf_dwmc }}</span>
                <span v-else>无</span>
              </div>
              <div v-else>
                <span v-if="scope.row.yf_dwmc">{{ scope.row.yf_dwmc }}</span>
                <span v-else>无</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="pxlx" label="培训类型">
            <template slot-scope="scope">
              <div v-if="scope.row.status===2" style="color: #909399">
                <span v-if="scope.row.pxlx===0">未分配</span>
                <template v-for="(val,key,index) in proConfig.pxlx">
                  <span v-if="scope.row.pxlx==key" :key="index">{{ val}}</span>
                </template>
              </div>
              <template v-else>
                <span v-if="scope.row.pxlx===0" style="color: #ff0000">未分配</span>
                <template v-for="(val,key,index) in proConfig.pxlx">
                  <span v-if="scope.row.pxlx==key" :key="index">{{ val}}</span>
                </template>
              </template>
            </template>
          </el-table-column>
          <el-table-column align="center" label="申报日期" min-width="82">
            <template slot-scope="scope">
              <span
                v-if="scope.row.status===2"
                style="color: #909399"
              >{{ scope.row.create_time | TimestampChangeFilter }}</span>
              <span v-else>{{ scope.row.create_time | TimestampChangeFilter }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="举办时间" min-width="82">
            <template slot-scope="scope">
              <div v-if="scope.row.status===2" style="color: #909399">
                <div>{{ scope.row.px_start_time | TimestampChangeFilter }}</div>
                <div>至</div>
                <div>{{ scope.row.px_end_time | TimestampChangeFilter }}</div>
              </div>
              <div v-else>
                <div>{{ scope.row.px_start_time | TimestampChangeFilter }}</div>
                <div>至</div>
                <div>{{ scope.row.px_end_time | TimestampChangeFilter }}</div>
              </div>
            </template>
          </el-table-column>
          <el-table-column align="center" label="状态" min-width="40">
            <template slot-scope="scope">
              <div v-if="scope.row.status===0||scope.row.status===1">
                <span v-if="scope.row.pro_status===0">未提交</span>
                <span v-if="scope.row.pro_status===1" style="color: #e6a23c">待审核</span>
                <span
                  v-if="scope.row.pro_status===2||scope.row.pro_status===4"
                  style="color: #f56c6c"
                >不通过</span>
                <span v-if="scope.row.pro_status===3" style="color: #67c23a">通过</span>
              </div>
              <div v-if="scope.row.status===2" style="color:#909399;">
                <span v-if="scope.row.pro_status===0">未提交</span>
                <span v-if="scope.row.pro_status===1">待审核</span>
                <span v-if="scope.row.pro_status===2||scope.row.pro_status===4">不通过</span>
                <span v-if="scope.row.pro_status===3">通过</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作" width="130px">
            <template slot-scope="scope">
              <template v-if="scope.row.status===0||scope.row.status===1">
                <template v-if="switcher">
                  <template v-if="userInfo.role===1">
                    <template v-if="scope.row.gl_type === 5">
                      <template v-if="scope.row.pro_status===1">
                        <el-button @click.native="handleCheck(scope.row)" type="text" size="mini">审核</el-button>
                        <el-button type="text" size="mini" @click.native="handleEdit(scope.row)">编辑</el-button>
                        <el-button @click.native="handleStatus(2,scope.row.id)" type="text">报废</el-button>
                      </template>
                      <template v-if="scope.row.pro_status===2||scope.row.pro_status===4">
                        <el-button type="text" size="mini" @click.native="handleEdit(scope.row)">编辑</el-button>
                        <el-button @click.native="handleStatus(2,scope.row.id)" type="text">报废</el-button>
                        <el-button
                          @click.native="handleCheck(scope.row)"
                          type="text"
                          size="mini"
                        >重新审核</el-button>
                      </template>
                      <template v-if="scope.row.pro_status===3">
                        <div>
                          <el-button
                            @click.native="handleCheck(scope.row)"
                            type="text"
                            size="mini"
                          >重新审核</el-button>
                          <el-button
                            @click.native="handleStatus(2,scope.row.id)"
                            type="text"
                            size="mini"
                          >报废</el-button>
                        </div>
                        <div>
                          <el-button
                            type="text"
                            size="mini"
                            @click.native="handleInform(scope.row)"
                          >打印立项通知书</el-button>
                        </div>
                        <div>
                          <el-button
                            v-if="scope.row.has_mod"
                            type="text"
                            @click.native="handleModifyHistory(scope.row,true)"
                            size="mini"
                            style="color: #E6A23C"
                          >申请修改审核</el-button>
                          <el-button
                            v-if="scope.row.has_mod_done"
                            type="text"
                            @click.native="handleModifyHistory(scope.row)"
                            size="mini"
                          >申请修改历史</el-button>
                        </div>
                        <div>
                          <template v-if="scope.row.pxlx==9">
                            <template v-if="userInfo.role===1">
                              <el-switch
                                @change="handlePublishChange(scope.row)"
                                v-model="scope.row.is_published"
                                :active-value="1"
                                :inactive-value="0"
                                :disabled="userInfo.role===1?false:true"
                              ></el-switch>
                            </template>
                            <span v-if="scope.row.is_published ==1" style="color: #409EFF">发布</span>
                            <span v-if="scope.row.is_published ==0" style="color: #909399">未发布</span>
                          </template>
                        </div>
                      </template>
                      <template v-if="scope.row.zsjz_wd&&scope.row.pro_status===3">
                        <a target="_blank" :href=" lookUrl+ '/'+scope.row.zsjz_wd">
                          <el-button type="text" size="mini">招生简章附件</el-button>
                        </a>
                      </template>
                      <template v-if="scope.row.adm_major&&scope.row.pro_status===3">
                        <el-button type="text" size="mini" @click="handleZsjz(scope.row)">招生简章</el-button>
                      </template>
                    </template>
                    <template v-else>
                      <template v-if="scope.row.pro_status===1">
                        <el-button @click.native="handleCheck(scope.row)" type="text" size="mini">审核</el-button>
                        <el-button type="text" size="mini" @click.native="handleEdit(scope.row)">编辑</el-button>
                        <el-button @click.native="handleStatus(2,scope.row.id)" type="text">报废</el-button>
                      </template>
                      <template v-if="scope.row.pro_status===2||scope.row.pro_status===4">
                        <el-button type="text" size="mini" @click.native="handleEdit(scope.row)">编辑</el-button>
                        <el-button @click.native="handleStatus(2,scope.row.id)" type="text">报废</el-button>
                        <el-button
                          @click.native="handleCheck(scope.row)"
                          type="text"
                          size="mini"
                        >重新审核</el-button>
                      </template>
                      <template v-if="scope.row.pro_status===3">
                        <div>
                          <el-button
                            type="text"
                            size="mini"
                            @click.native="handleCode(scope.row)"
                          >生成项目二维码</el-button>
                        </div>
                        <div>
                          <el-button
                            type="text"
                            size="mini"
                            @click.native="handleInform(scope.row)"
                          >打印立项通知书</el-button>
                        </div>
                        <div>
                          <el-button
                            @click.native="handleCheck(scope.row)"
                            type="text"
                            size="mini"
                          >重新审核</el-button>
                          <el-button
                            @click.native="handleStatus(2,scope.row.id)"
                            type="text"
                            size="mini"
                          >报废</el-button>
                        </div>
                        <div>
                          <el-button
                            v-if="scope.row.has_mod"
                            type="text"
                            @click.native="handleModifyHistory(scope.row,true)"
                            size="mini"
                            style="color: #E6A23C"
                          >申请修改审核</el-button>
                          <el-button
                            v-if="scope.row.has_mod_done"
                            type="text"
                            @click.native="handleModifyHistory(scope.row)"
                            size="mini"
                          >申请修改历史</el-button>
                        </div>
                        <div>
                          <template v-if="scope.row.pxlx==9">
                            <template v-if="userInfo.role===1">
                              <el-switch
                                @change="handlePublishChange(scope.row)"
                                v-model="scope.row.is_published"
                                :active-value="1"
                                :inactive-value="0"
                                :disabled="userInfo.role===1?false:true"
                              ></el-switch>
                            </template>
                            <span v-if="scope.row.is_published ==1" style="color: #409EFF">发布</span>
                            <span v-if="scope.row.is_published ==0" style="color: #909399">未发布</span>
                          </template>
                        </div>
                      </template>
                      <template v-if="scope.row.zsjz_wd&&scope.row.pro_status===3">
                        <a target="_blank" :href=" lookUrl+ '/'+scope.row.zsjz_wd">
                          <el-button type="text" size="mini">招生简章附件</el-button>
                        </a>
                      </template>
                      <template v-if="scope.row.adm_major&&scope.row.pro_status===3">
                        <el-button type="text" size="mini" @click="handleZsjz(scope.row)">招生简章</el-button>
                      </template>
                    </template>
                  </template>
                  <template v-if="userInfo.role===2">
                    <template v-if="scope.row.gl_type === 5">
                      <template v-if="scope.row.pro_status===0">
                        <div v-if="is_ss&&is_ss_auth">
                          <el-button
                            type="text"
                            size="mini"
                            @click.native="handleInfo(scope.row,true)"
                          >签章并提交</el-button>
                        </div>
                        <el-button v-if="sceCollege" type="text" size="mini" @click.native="handleEdit(scope.row)">编辑</el-button>
                        <el-button
                          @click.native="handleStatus(1,scope.row.id)"
                          type="text"
                          size="mini"
                        >删除</el-button>
                        <div v-if="is_ss">
                          <el-button
                            type="text"
                            size="mini"
                            @click.native="handleInfo(scope.row)"
                          >打印预立项申报书</el-button>
                        </div>
                      </template>
                      <template v-else>
                        <template v-if="scope.row.pro_status===1">
                          <div>
                            <el-button
                              type="text"
                              size="mini"
                              @click.native="handleInfo(scope.row)"
                            >打印预立项申报书</el-button>
                          </div>
                        </template>
                        <template v-if="scope.row.pro_status===2||scope.row.pro_status===4">
                          <el-button v-if="sceCollege"
                            type="text"
                            size="mini"
                            @click.native="handleEdit(scope.row)"
                          >编辑</el-button>
                          <el-button
                            @click.native="handleStatus(1,scope.row.id)"
                            type="text"
                            size="mini"
                          >删除</el-button>
                        </template>
                        <template v-if="scope.row.pro_status===3">
                          <div v-if="is_ss || show2020(scope.row.pro_code) || isYXB">
                            <el-button
                              v-if="scope.row.is_sign_lix===2||scope.row.id<813"
                              type="text"
                              size="mini"
                              @click.native="handleInform(scope.row)"
                            >打印立项通知书</el-button>
                          </div>
                          <div>
                            <el-button
                              type="text"
                              size="mini"
                              @click.native="handleInfo(scope.row)"
                            >打印预立项申报书</el-button>
                          </div>
                          <div>
                            <el-button
                              v-if="scope.row.preliminary && scope.row.preliminary.length"
                              type="text"
                              size="mini"
                              @click="handleYlx(scope.row)"
                            >打印介绍信</el-button>
                          </div>
                        </template>
                        <template>
                          <template v-if="scope.row.zsjz_wd&&scope.row.pro_status===3">
                            <a target="_blank" :href=" lookUrl+ '/'+scope.row.zsjz_wd">
                              <el-button type="text" size="mini">招生简章附件</el-button>
                            </a>
                          </template>
                          <template v-if="scope.row.adm_major&&scope.row.pro_status===3">
                            <el-button type="text" size="mini" @click="handleZsjz(scope.row)">招生简章</el-button>
                          </template>
                        </template>
                      </template>
                    </template>
                    <template v-else>
                      <template v-if="scope.row.pro_status===0">
                        <div v-if="is_ss&&is_ss_auth">
                          <el-button
                            type="text"
                            size="mini"
                            @click.native="handleInfo(scope.row,true)"
                          >签章并提交</el-button>
                        </div>
                        <el-button v-if="sceCollege" type="text" size="mini" @click.native="handleEdit(scope.row)">编辑</el-button>
                        <el-button
                          @click.native="handleStatus(1,scope.row.id)"
                          type="text"
                          size="mini"
                        >删除</el-button>
                        <el-button v-if="isYXB" type="text" size="mini" @click="handleCopy(scope.row)">复制</el-button>
                        <div v-if="is_ss">
                          <el-button
                            type="text"
                            size="mini"
                            @click.native="handleInfo(scope.row)"
                          >打印项目申报书</el-button>
                        </div>
                      </template>
                      <template v-else>
                        <template v-if="scope.row.pro_status===1">
                          <div>
                            <el-button
                              type="text"
                              size="mini"
                              @click.native="handleInfo(scope.row)"
                            >打印项目申报书</el-button>
                          </div>
                          <el-button v-if="isYXB" type="text" size="mini" @click="handleCopy(scope.row)">复制</el-button>
                        </template>
                        <template v-if="scope.row.pro_status===2||scope.row.pro_status===4">
                          <el-button v-if="sceCollege"
                            type="text"
                            size="mini"
                            @click.native="handleEdit(scope.row)"
                          >编辑</el-button>
                          <el-button
                            @click.native="handleStatus(1,scope.row.id)"
                            type="text"
                            size="mini"
                          >删除</el-button>
                          <el-button v-if="isYXB" type="text" size="mini" @click="handleCopy(scope.row)">复制</el-button>
                        </template>
                        <template v-if="scope.row.pro_status===3">
                          <div v-if="is_ss || show2020(scope.row.pro_code) || isYXB">
                            <el-button
                              v-if="scope.row.is_sign_lix===2 || scope.row.id<813"
                              type="text"
                              size="mini"
                              @click.native="handleInform(scope.row)"
                            >打印立项通知书</el-button>
                          </div>
                          <div>
                            <el-button
                              type="text"
                              size="mini"
                              @click.native="handleInfo(scope.row)"
                            >打印项目申报书</el-button>
                          </div>
                          <div>
                            <el-button
                              type="text"
                              size="mini"
                              @click.native="handleCode(scope.row)"
                            >生成项目二维码</el-button>
                          </div>
                          <el-button
                            v-if="is_ss && is_ss_auth && scope.row.has_wait"
                            type="text"
                            @click.native="handleSubSignM(scope.row)"
                            size="mini"
                          >
                            <span style="color: #E6A23C">签章并提交修改</span>
                          </el-button>
                          <template v-if="scope.row.has_mod">
                            <div>
                              <el-button
                                type="text"
                                @click.native="handleModifyHistory(scope.row)"
                                size="mini"
                                :disabled="false"
                              >
                                <span style="color: #E6A23C">打印项目修改申请</span>
                              </el-button>
                            </div>
                          </template>
                          <template>
                            <div>
                              <el-button v-if="isYXB" type="text" size="mini" @click="handleCopy(scope.row)">复制</el-button>
                              <el-button
                                v-if="!scope.row.has_mod"
                                type="text"
                                @click.native="handleMod(scope.row)"
                                size="mini"
                                :disabled="false"
                              >申请修改</el-button>
                            </div>
                            <div v-if="scope.row.has_mod_done">
                              <el-button
                                type="text"
                                @click.native="handleModifyHistory(scope.row)"
                                size="mini"
                                :disabled="false"
                              >申请修改历史</el-button>
                            </div>
                          </template>
                        </template>
                        <template>
                          <template v-if="scope.row.zsjz_wd&&scope.row.pro_status===3">
                            <a target="_blank" :href=" lookUrl+ '/'+scope.row.zsjz_wd">
                              <el-button type="text" size="mini">招生简章附件</el-button>
                            </a>
                          </template>
                          <template v-if="scope.row.adm_major&&scope.row.pro_status===3">
                            <el-button type="text" size="mini" @click="handleZsjz(scope.row)">招生简章</el-button>
                          </template>
                        </template>
                      </template>
                    </template>
                    <el-button type="text" size="mini" @click.native="handleInfo(scope.row, false, 1)">查看详情</el-button>
                  </template>
                </template>
                <template v-if="!switcher">
                  <el-button type="text" @click.native="handleStatus(0,scope.row.id)">还原</el-button>
                  <el-button type="text" size="mini" @click.native="handleInfo(scope.row, false, 1)">查看详情</el-button>
                </template>
              </template>
              <template v-if="scope.row.status===2">
                <div>
                  <el-button type="text" size="mini" @click.native="handleInfo(scope.row, false, 1)">查看详情</el-button>
                </div>
                <div v-if="userInfo.role===1">
                  <el-button @click.native="handleStatus(0,scope.row.id)" type="text">解除报废</el-button>
                </div>
              </template>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="page-box" v-if="projectsData.dataCount < $options.data().projectsData.dataCount">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :page-count="5"
          :current-page="getForm.page"
          :page-size="getForm.limit"
          layout="total, sizes, prev, pager, next, jumper"
          :total="projectsData.dataCount"
        ></el-pagination>
      </div>
    </el-card>
    <el-dialog
      title="向继教处报送申报书"
      :visible.sync="dialogVisibleSbs"
      :append-to-body="true"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      center
      width="340px"
    >
      <div>
        <el-upload
          class="upload"
          :action="uploadExcelUrl1"
          :on-success="handleSuccess"
          :on-remove="handleRemove"
          :before-upload="beforeUpload"
          :headers="headers"
          name="attachment"
          accept=".pdf, .PDF"
          :file-list="fileList"
          :auto-upload="true"
        >
          <el-button type size="small" icon="el-icon-upload">上传文件</el-button>
          <div slot="tip" class="el-upload__tip">* 只能上传PDF格式文件，且不超过8MB</div>
        </el-upload>
      </div>
      <div slot="footer" class="dialog-footer" v-loading="loadingSbs">
        <el-button @click="dialogVisibleSbs = false">取 消</el-button>
        <el-button type="primary" @click="handleSbsTrue">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog
      :visible.sync="dialogVisible_zsjz_look"
      width="900px"
      center
      append-to-body
      :close-on-press-escape="false"
    >
      <div style="width: 760px; margin: 0 auto">
        <div class="zsjz-look-head">
          <div v-if="!isYXB">
            <template v-if="zsjzForm.create_time * 1000 > zsjz_divide_4">
              {{ (zsjzForm.px_start_time || zsjzForm.create_time) | TimestampChangeFilter(false, false, true) }}年中国人民大学{{ zsjzForm.college }}
            </template>
            <template v-else>
              中国人民大学{{ zsjzForm.college }} {{ (zsjzForm.px_start_time || zsjzForm.create_time) | TimestampChangeFilter(false, false, true) }} 年
            </template>
          </div>
          <div>{{ zsjzForm.pro_name }}</div>
          <div>招生简章</div>
        </div>
        <div class="zsjz-look-content">
          <div v-for="(item, key) in content" :key="key">
            <template v-if="item.divide && zsjzForm.create_time * 1000 > zsjz_divide">
              <div style="font-weight: bold; line-height: 2em">{{ item.order }}、{{ item.else_label }}</div>
            </template>
            <template v-else>
              <div style="font-weight: bold; line-height: 2em">{{ item.order }}、{{ item.label }}</div>
            </template>
            <template v-if="zsjzForm[key]">
              <div v-html="zsjzForm[key]" :class="`zsjz-look-content-${key}`"></div>
            </template>
            <template v-else>
              <div v-if="item.content" v-html="item.content" :class="`zsjz-look-content-${key}`"></div>
              <div v-else>
                <template v-if="zsjzForm.create_time * 1000 > zsjz_divide">
                  <template v-if="zsjzForm.college.indexOf('苏州研究院')!==-1">
                    <p>通过单位或个人银行账户办理银行汇款缴费。</p>
                    <p>户 名：中国人民大学{{ zsjzForm.college }}</p>
                    <p>开户行：交通银行股份有限公司苏州科技支行</p>
                    <p>收款帐号：3256 0500 0018 0101 2098 2</p>
                    <p>
                      特别说明：汇款时“收款人（单位）”一栏均只填“中国人民大学
                      <span v-if="zsjzForm.college">{{ zsjzForm.college }}</span>”十五字，在“用途/摘要”栏里填上“
                      <span v-if="zsjzForm.college">{{ zsjzForm.college }}</span>
                      <span v-else>XXX学院</span>
                      <span v-if="zsjzForm.pro_name">{{ zsjzForm.pro_name }}课程</span>
                      <span v-else>XXX课程</span>XXX(学员姓名)培训费”。汇款后请将银行汇款凭单提交至
                      <span v-if="zsjzForm.college">{{ zsjzForm.college }}</span>
                      <span v-else>XXX学院</span>。
                    </p>
                  </template>
                  <template v-else-if="zsjzForm.college.indexOf('深圳研究院')!==-1">
                    <p>通过单位或个人银行账户办理银行汇款缴费。</p>
                    <p>户 名：中国人民大学{{ zsjzForm.college }}</p>
                    <p>开户行：中国平安银行深圳高新技术区支行</p>
                    <p>收款帐号：0412 1001 9211 2</p>
                    <p>
                      特别说明：汇款时“收款人（单位）”一栏均只填“中国人民大学
                      <span v-if="zsjzForm.college">{{ zsjzForm.college }}</span>”十一字，在“用途/摘要”栏里填上“
                      <span v-if="zsjzForm.college">{{ zsjzForm.college }}</span>
                      <span v-else>XXX学院</span>
                      <span v-if="zsjzForm.pro_name">{{ zsjzForm.pro_name }}课程</span>
                      <span v-else>XXX课程</span>XXX(学员姓名)培训费”。汇款后请将银行汇款凭单提交至
                      <span v-if="zsjzForm.college">{{ zsjzForm.college }}</span>
                      <span v-else>XXX学院</span>。
                    </p>
                  </template>
                  <template v-else-if="zsjzForm.college.indexOf('教育培训中心')!==-1">
                    <p>通过单位或个人银行账户办理银行汇款缴费。</p>
                    <p>户 名：中国人民大学{{ zsjzForm.college }}</p>
                    <p>开户行：中国工商银行股份有限公司北京紫竹院支行</p>
                    <p>收款帐号：0200 0076 0920 1130 889</p>
                    <p>
                      特别说明：汇款时“收款人（单位）”一栏均只填“中国人民大学
                      <span v-if="zsjzForm.college">{{ zsjzForm.college }}</span>”十二字，在“用途/摘要”栏里填上“
                      <span v-if="zsjzForm.college">{{ zsjzForm.college }}</span>
                      <span v-else>XXX学院</span>
                      <span v-if="zsjzForm.pro_name">{{ zsjzForm.pro_name }}课程</span>
                      <span v-else>XXX课程</span>XXX(学员姓名)培训费”。汇款后请将银行汇款凭单提交至
                      <span v-if="zsjzForm.college">{{ zsjzForm.college }}</span>
                      <span v-else>XXX学院</span>。
                    </p>
                  </template>
                  <template v-else-if="zsjzForm.college.indexOf('网络教育部')!==-1">
                    <p>通过单位或个人银行账户办理银行汇款缴费。</p>
                    <p>户 名：中国人民大学网络教育学院</p>
                    <p>开户行：工行北京北沙滩支行</p>
                    <p>收款帐号：0200 3455 2910 0037 477</p>
                    <p>
                      特别说明：汇款时“收款人（单位）”一栏均只填“中国人民大学网络教育学院”十二字，在“用途/摘要”栏里填上“
                      <span v-if="zsjzForm.college">网络教育学院</span>
                      <span v-else>XXX学院</span>
                      <span v-if="zsjzForm.pro_name">{{ zsjzForm.pro_name }}课程</span>
                      <span v-else>XXX课程</span>XXX(学员姓名)培训费”。汇款后请将银行汇款凭单提交至
                      <span v-if="zsjzForm.college">网络教育学院</span>
                      <span v-else>XXX学院</span>。
                    </p>
                  </template>
                  <template v-else>
                    <div v-if="(zsjzForm.create_time * 1000 > zsjz_divide_4) || isYXB" style="text-indent: 2em;">
                      <p>
                        （一）个人账户缴费：点击“人大培训网”发布简章的缴费链接，通过学校电子收费系统缴费。
                        <template v-if="zsjzForm.fee_url && (zsjzForm.create_time * 1000 > versionTime_4)">
                          （收费地址：<span class="primary">{{ zsjzForm.fee_url }}</span>）
                        </template>
                      </p>
                      <p>
                        学员通过点击简章页面发布的“报名缴费”按钮，可直接打开“中国人民大学通用收费系统”中该课程班的对应收费页面，注册并填报个人身份信息和票据信息后，通过系统缴费。
                      </p>
                      <p>
                        郑重提醒：学员如果遇到招生人员以参加本{{isYXB ? '课程培训班' : '课程班培训'}}为由，要求学员缴纳任何公示培训费之外的费用，可向学校有关部门举报违规行为。举报电话：010-82507931。
                      </p>
                      <p>（二）单位账户缴费：通过单位银行账户办理银行汇款缴费。</p>
                      <p>户&nbsp;&nbsp;名：中国人民大学</p>
                      <p>开户行：中国工商银行北京紫竹院支行</p>
                      <p>帐&nbsp;&nbsp;号：0200 0076 0902 6400 244</p>
                      <p>
                        特别说明：汇款时“收款人（单位）”一栏均只填“中国人民大学”六字，在“用途/摘要”栏里填上“
                        <span v-if="zsjzForm.college">{{ zsjzForm.college }}</span>
                        <span v-else>XXX学院</span>
                        <span v-if="zsjzForm.pro_name">{{ zsjzForm.pro_name }}课程</span>
                        <span v-else>XXX课程</span>XXX(学员姓名)培训费”，汇款后请将银行汇款凭单提交至
                        <span v-if="zsjzForm.college">{{ zsjzForm.college }}</span>
                        <span v-else>XXX学院</span>有关负责老师处确认。
                      </p>
                    </div>
                    <template v-else>
                      <p>
                        1、个人账户缴费：通过人大培训网发布简章的缴费链接缴费。
                        <template v-if="zsjzForm.fee_url && (zsjzForm.create_time * 1000 > versionTime_4)">
                          （收费地址：<span class="primary">{{ zsjzForm.fee_url }}</span>）
                        </template>
                      </p>
                      <p>2、单位账户缴费：通过单位或个人银行账户办理银行汇款缴费。</p>
                      <p>户 名：中国人民大学</p>
                      <p>开户行：中国工商银行北京紫竹院支行</p>
                      <p>收款帐号：0200 0076 0902 6400 244</p>
                      <p>
                        特别说明：汇款时“收款人（单位）”一栏均只填“中国人民大学”六字，在“用途/摘要”栏里填上“
                        <span v-if="zsjzForm.college">{{ zsjzForm.college }}</span>
                        <span v-else>XXX学院</span>
                        <span v-if="zsjzForm.pro_name">{{ zsjzForm.pro_name }}课程</span>
                        <span v-else>XXX课程</span>XXX(学员姓名)培训费”。汇款后请将银行汇款凭单提交至
                        <span v-if="zsjzForm.college">{{ zsjzForm.college }}</span>
                        <span v-else>XXX学院</span>。
                      </p>
                    </template>
                  </template>
                </template>
                <template v-else>
                  <p>
                    1、个人账户缴费：通过人大培训网发布简章的缴费链接缴费。
                    <template v-if="zsjzForm.fee_url && (zsjzForm.create_time * 1000 > versionTime_4)">
                      （收费地址：<span class="primary">{{ zsjzForm.fee_url }}</span>）
                    </template>
                  </p>
                  <p>2、单位账户缴费：通过单位或个人银行账户办理银行汇款缴费。</p>
                  <p>收款单位：中国人民大学</p>
                  <p>收款帐号：0200 0076 0902 6400 244</p>
                  <p>
                    特别说明：汇款时“收款人（单位）”一栏均只填“中国人民大学”六字，在“用途/摘要”栏里填上“
                    <span v-if="zsjzForm.college">{{ zsjzForm.college }}</span>
                    <span v-else>XXX学院</span>
                    <span v-if="zsjzForm.pro_name">{{ zsjzForm.pro_name }}课程</span>
                    <span v-else>XXX课程</span>XXX(学员姓名)培训费”。汇款后请将银行汇款凭单提交至
                    <span v-if="zsjzForm.college">{{ zsjzForm.college }}</span>
                    <span v-else>XXX学院</span>。
                  </p>
                </template>
              </div>
            </template>
          </div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible_zsjz_look = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from "vuex";
import { MATE } from '@/assets/js/config.special.js'

const urls = {
  copy: '/yxb/projects/copyPro',
  b: '/yxb/projects/batchreview'
}

export default {
  name: "app-project-index",
  data() {
    return {
      loading2: false,
      projectsData: {
        list: [],
        dataCount: 999999999
      },
      headers: {},
      switcher: true, 
      showDelete: false,
      getForm: {
        status: "0,2", 
        ispub: null, 
        xklb: "", 
        pxlx: "", 
        college: null, 
        structure: null, 
        special: null, 
        province: null, 
        city: null, 
        sea_field: "pro_code", 
        keywords: "",
        page: 1, 
        limit: 20 
      },
      pro_ss: false, 
      proConfig: JSON.parse(localStorage.getItem("pro_config")) || {},
      collegeList: [],
      structuresList: [],
      provincesList: [],
      cityList: [],
      ids: [],
      status: 0,
      is_ss: false,
      is_ss_auth: false,
      dialogVisibleSbs: false,
      loadingSbs: false,
      sbsForm: {
        id: 0,
        sbs: ""
      },
      fileList: [],
      pxlx9: false,
      dialogVisible_zsjz_look: false,
      content: {
        adm_major: {
          content: "",
          label: "学院及专业优势简介",
          order: "一",
          show: true
        },
        adm_course: { content: "", label: "课程安排", order: "二", show: true },
        adm_teaching: {
          content: "",
          label: "教学办法",
          order: "三",
          show: true
        },
        adm_study_time: {
          content: "",
          label: "学习期限",
          order: "四",
          show: true
        },
        adm_requirement: {
          content: "",
          label: "报名条件",
          order: "五",
          show: true
        },
        adm_attention: {
          content: "",
          label: "注意事项",
          else_label: "报名流程和联系方式",
          divide: true,
          order: "六",
          show: true
        },
        adm_charging: {
          content: "",
          label: "收费标准",
          order: "七",
          show: true
        },
        ssfs: {
          show: false,
          label: "收费方式",
          order: "八"
        },
        adm_certificate: { content: "", label: "证书", order: "九", show: true }
      },
      zsjzForm: {
        create_time: null,
        zs_start_time: null,
        college: "",
        pro_name: "",
        adm_major: "",
        adm_course: "",
        adm_teaching: "",
        adm_study_time: "",
        adm_requirement: "",
        adm_attention: "",
        adm_charging: "",
        ssfs: "",
        adm_certificate: "",
        fee_url: ''
      },
      isYXB: false
    };
  },
  computed: {
    ...mapState([
      "URL",
      "uploadExcelUrl1",
      "lookUrl",
      "windowUrl",
      'windowUrl_yxb',
      "zsjz_divide",
      'userInfo',
      'versionTime_4',
      'zsjz_divide_4',
      'sce_college'
    ]),
    sceCollege () {
      let C = this.userInfo.college
      let N = this.userInfo.username
      return C && (C.indexOf(this.sce_college) == -1 || N == '19890037')
    }
  },
  methods: {
    ...mapMutations(["editCrumbs"]),
    ...mapActions([
      'axiosHttp',
      "getProjectsData",
      "getStructures",
      "getAreaList",
      "changeProjectStatus",
      "AddProjectSbs",
      "getProModifyList",
      "deleteProModify",
      "projectPublish"
    ]),
    initData() {
      if (sessionStorage.getItem("PRO_IS_SS")) {
        this.pro_ss = true;
        this.$set(this.getForm, "special", 3);
        this.$set(this.getForm, "status", 0);
      }
      if (sessionStorage.getItem("PRO_IS_PXLX")) {
        this.pxlx9 = true;
        this.$set(this.getForm, "pxlx", "9");
        this.$set(this.getForm, "ispub", 0);
        this.$set(this.getForm, "status", 0);
      }
      this.loading2 = true;
      if (this.$route.name === "projectRecycle") {
        this.$set(this.getForm, "status", 1);
        this.switcher = false;
      } else {
        this.switcher = true;
      }
      if (this.loading2) {
        this.getProjectsData({
          data: this.getForm
        }).then(data => {
          if (data.data.code === 200) {
            this.projectsData = data.data.data;
          } else {
            this.$notify.error({
              title: "错误",
              message: data.data.error
            });
          }
          this.loading2 = false;
        });
      }
    },
    handleSearch() {
      if (!this.getForm.keywords) {
        this.$message({
          message: "请输入搜索关键字！",
          type: "warning"
        });
      } else {
        this.$set(this.getForm, "page", 1);
        this.initData();
      }
    },
    handleSelect() {
      Object.assign(this.getForm, {
        page: 1,
        limit: 20
      });
      this.getProjectsData({
        data: this.getForm
      }).then(data => {
        if (data.data.code === 200) {
          this.projectsData = data.data.data;
        } else {
          this.$notify.error({
            title: "错误",
            message: data.data.error
          });
        }
      });
    },
    handleSelectProvince() {
      this.handleSelect();
      this.$set(this.getForm, "city", null);
      if (true) {
        this.getAreaList({
          data: {
            pid: this.getForm.province
          }
        }).then(data => {
          if (data.data.code === 200) {
            const Data = data.data.data;
            this.cityList = Data.list;
          }
        });
      }
    },
    handleSwitcher(key = 0) {
      const query = this.$route.query
      if (key) {
        this.$router.push({
          path: "/home/project/index/recycle",
          query
        });
      } else {
        this.$router.push({
          path: "/home/project/index/list",
          query
        });
      }
    },
    handleAll() {
      this.pro_ss = false;
      this.$cookie.set("crumbs", ["项目管理"]);
      this.editCrumbs(["项目管理"]);
      sessionStorage.removeItem("PRO_IS_SS");
      this.pro_ss = false;
      sessionStorage.removeItem("PRO_IS_PXLX");
      this.pxlx9 = false;
      Object.assign(this.getForm, this.$options.data().getForm);
      this.initData();
    },
    handleAdd() {
      sessionStorage.removeItem("PRO_STEP");
      sessionStorage.removeItem("PRO");
      this.$router.push({
        path: '/home/project/add',
        query: this.$route.query.class_major_name ? {
          major_name_fixed: this.$route.query.class_major_name
        } : {}
      })
    },
    handleEdit(val) {
      sessionStorage.removeItem("PRO_STEP");
      sessionStorage.setItem("Edit_ProData", JSON.stringify(val));
      this.$router.push({
        path: '/home/project/edit',
        query: this.$route.query.class_major_name ? {
          major_name_fixed: this.$route.query.class_major_name
        } : {}
      })
    },
    handleStatus(status, id) {
      this.status = status;
      let list = [];
      if (id) {
        list.push(id);
      } else {
        list = this.ids;
      }
      if (status === 1) {
        this.$confirm("删除的项目可在回收站找回，是否继续删除?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
            this.changeProjectStatus({
              data: {
                ids: list,
                status: this.status
              }
            }).then(data => {
              if (data.data.code === 200) {
                this.initData();
                this.$message({
                  type: "success",
                  message: "删除成功!"
                });
              } else {
                this.$notify.error({
                  title: "错误",
                  message: data.data.error
                });
              }
            });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除"
            });
          });
      }else if (status === 2) {
        this.$confirm("报废后的项目将停止使用，是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.changeProjectStatus({
              data: {
                ids: list,
                status: this.status
              }
            }).then(data => {
              if (data.data.code === 200) {
                this.initData();
                this.$message({
                  type: "success",
                  message: "项目已报废!"
                });
              } else {
                this.$notify.error({
                  title: "错误",
                  message: data.data.error
                });
              }
            });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除"
            });
          });
      } else {
        this.changeProjectStatus({
          data: {
            ids: list,
            status: this.status
          }
        }).then(data => {
          if (data.data.code === 200) {
            this.initData();
          } else {
            this.$notify.error({
              title: "错误",
              message: data.data.error
            });
          }
        });
      }
    },
    handleSelectionChange(val) {
      if (val.length) {
        this.showDelete = true;
      } else {
        this.showDelete = false;
      }
      this.ids = val.map(item => {
        return item.id;
      });
    },
    handleCheck(val, isCheck = 1) {
      sessionStorage.setItem("checkPro", JSON.stringify(val));
      this.$router.push({
        path: '/home/project/check',
        query: this.$route.query.class_major_name ? {
          major_name_fixed: this.$route.query.class_major_name,
          role: this.userInfo.role,
          randome: this.$md5(`${this.userInfo.role}-${isCheck}`)
        } : {
          role: this.userInfo.role,
          randome: this.$md5(`${this.userInfo.role}-${isCheck}`)
        }
      })
    },
    handleInfo(val, sign, type = 0) { 
      if (type === 1) {
        this.handleCheck(val, 0)
      } else {
        if (sign) {
          this.$router.push("/home/project/preview/" + val.id);
        } else {
          sessionStorage.setItem("pro_declare", val.id);
          this.$router.push("/home/project/declare/" + val.id);
        }
      }
    },
    handleInform(val) {
      const time = new Date().getTime();
      const miwen = time + "shengxing";
      let key = this.$md5(miwen);
      let hrf =
        this.URL +
        (this.isYXB ? this.windowUrl_yxb : this.windowUrl) +
        "?authkey=" +
        this.headers.authkey +
        "&sessionid=" +
        this.headers.sessionid +
        "&pro_id=" +
        val.id +
        "&time=" +
        time +
        "&key=" +
        key;
      window.open(hrf);
    },
    handleCode(val) {
      let data = {
        pro_id: val.pro_id,
        pro_name: val.pro_name,
        pro_code: val.pro_code
      };
      sessionStorage.setItem("pro_data", JSON.stringify(data));
      this.$router.push({
        path: "/home/project/code",
        query: {
          pro_code: val.pro_code
        }
      });
    },
    handleSbsLook(val) {},
    handleSbs(val) {
      this.$set(this.sbsForm, "id", val.id);
      this.fileList = [];
      this.loadingSbs = false;
      this.dialogVisibleSbs = true;
    },
    handleSbsTrue() {
      const Obj = Object.assign({}, this.sbsForm);
      if (!Obj.sbs) {
        this.$message({
          type: "warning",
          message: "请上传PDF版申报书"
        });
        return false;
      }
      this.loadingSbs = true;
      if (this.loadingSbs) {
        this.AddProjectSbs({
          data: Obj
        }).then(data => {
          if (data.data.code === 200) {
            this.dialogVisibleSbs = false;
            this.initData();
          } else {
            this.$notify.error({
              title: "错误",
              message: data.data.error,
              onClose: () => {
                this.loadingSbs = false;
              }
            });
          }
        });
      }
    },
    handlePublishChange(val) {
      this.projectPublish({
        data: {
          id: val.id,
          val: val.is_published
        }
      }).then(data => {
        if (data.data.code === 200) {
          this.$message({
            type: "success",
            message: data.data.data
          });
          this.initData();
        } else {
          this.$notify.error({
            title: "错误",
            message: data.data.error
          });
        }
      });
    },
    beforeUpload(file) {
      const isTYPE =
        file.type === "application/pdf" || file.type.indexOf("pdf") !== -1;
      const isLtM = file.size / 1024 / 1024 < 8;
      if (!isTYPE) {
        this.$message({
          type: "warning",
          message: "上传的申报书只能是PDF格式"
        });
      }
      if (!isLtM) {
        this.$message({
          type: "warning",
          message: "上传文件大小不能超过 8MB!"
        });
      }
      return isTYPE && isLtM;
    }, 
    handleSuccess(response, file, fileList) {
      if (response.code === 200) {
        this.$set(this.sbsForm, "sbs", response.data.code);
      } else {
        this.$notify.error({
          title: "错误",
          message: response.error
        });
      }
    },
    handleRemove(file, fileList) {
      this.$set(this.sbsForm, "sbs", "");
    },
    handleMod(val) {
      this.getProModifyList({
        data: {
          pro_id: val.id
        }
      }).then(data => {
        if (data.data.code === 200) {
          const Data = data.data.data;
          let title = "";
          let cont = null; 
          let mod_id = null;
          if (Data && Data.length) {
            title = "是否继续上一次的申请修改？";
            cont = 1;
            mod_id = Data[0].mod_id;
          }
          this.handleOpen(title, val.id, cont, mod_id);
        } else {
          this.$notify.error({
            title: "错误",
            message: data.data.error
          });
        }
      });
    },
    handleOpen(title, pro_id, cont, mod_id) {
      this.$confirm(title, "项目申请修改", {
        confirmButtonText: "继续",
        cancelButtonText: "取消",
        type: "warning",
        center: true,
        closeOnClickModal: false,
        showClose: false
      })
        .then(() => {
          const Params = {
            pro_id: pro_id,
            cont: cont,
            mod_id: mod_id
          };
          sessionStorage.setItem("proModInfo", JSON.stringify(Params)); 
          sessionStorage.setItem("PRO_STEP", 0);
          this.$router.push({
            path: `/home/project/modify/${pro_id}`,
            query: this.$route.query.class_major_name ? {
              major_name_fixed: this.$route.query.class_major_name
            } : {}
          })
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消申请！"
          });
        });
    },
    handleModifyHistory(val, list_is_ss) {
      if (list_is_ss) {
        if (MATE('s_s', val.college)) {
          sessionStorage.setItem("list_is_ss", "1");
        }
      }
      sessionStorage.setItem("PRO_Name", val.pro_name);
      this.$router.push("/home/project/modifyList/" + val.id);
    },
    handleSubSignM(val) {
      let Pro = {
        mod_id: null
      };
      const PRO_ID = val.id;
      if (PRO_ID) {
        this.getProModifyList({
          data: {
            pro_id: PRO_ID
          }
        }).then(data => {
          if (data.data.code === 200) {
            const Data = data.data.data;
            if (Data && Data.length) {
              Object.assign(Pro, {
                mod_id: Data[0].mod_id
              });
            }
            sessionStorage.setItem("Pro_declare_modify", JSON.stringify(Pro));
            sessionStorage.setItem("pro_declare", PRO_ID);
            this.$router.push("/home/project/declare_modify/" + PRO_ID);
          } else {
            this.$notify.error({
              title: "错误",
              message: data.data.error
            });
          }
        });
      }
    },
    handleSizeChange(pageSize) {
      this.$set(this.getForm, "limit", pageSize);
      this.initData();
    },
    handleCurrentChange(currentPage) {
      this.$set(this.getForm, "page", currentPage);
      this.initData();
      this.$nextTick(() => {
        this.$el.offsetParent.offsetParent.scrollTop = 0;
      });
    },
    handleZsjz(val) {
      for (let key in this.zsjzForm) {
        this.$set(this.zsjzForm, key, val[key]);
        this.dialogVisible_zsjz_look = true;
      }
    },
    handleYlx(val) {
      this.$router.push({
        name: "AppProjectYlx",
        query: {
          id: val.id,
          code: val.pro_code,
          name: val.pro_name,
          college: val.college,
          user: val.user,
          ylx: val.ylx_number,
          preliminary: val.preliminary ? val.preliminary.join() : ""
        }
      });
    },
    show2020(code) {
      return `${code}`.substring(0, 4) > 2019;
    },
    handleCopy (val) {
      this.$confirm('是否复制该项目信息?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.axiosHttp({
          url: urls.copy,
          type: 'post',
          data: {
            pro_id: val &&val.id
          }
        }).then(data => {
          if (data.data.code === 200) {
            this.$message.success('复制成功！')
            this.initData()
          } else {
            this.$notify.error({
              title: '错误',
              message: data.data.error
            })
          }
        })
      })
    },
    handleB () {
      this.$prompt('是否将已选项目退回至审核不通过状态?', '批量退回', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPlaceholder: '请输入不通过原因',
        closeOnClickModal: false,
        closeOnPressEscape: false,
        type: 'warning',
        inputPattern: /\S/,
        inputErrorMessage: '审核不通过原因不能为空！',
        center: true
      }).then(({ value }) => {
         this.axiosHttp({
          url: urls.b,
          type: 'post',
          data: {
            ids: this.ids,
            content: value
          }
        }).then(data => {
          if (data.data.code === 200) {
            this.$message.success('操作成功！')
            this.initData()
          } else {
            this.$notify.error({
              title: '错误',
              message: data.data.error
            })
          }
        })
      })


      // this.$confirm('是否将已选项目退回至不通过状态?', '提示', {
      //   confirmButtonText: '确定',
      //   cancelButtonText: '取消',
      //   type: 'warning'
      // }).then(() => {
      //   this.axiosHttp({
      //     url: urls.b,
      //     type: 'post',
      //     data: {
      //       ids: this.ids
      //     }
      //   }).then(data => {
      //     if (data.data.code === 200) {
      //       this.$message.success('操作成功！')
      //       this.initData()
      //     } else {
      //       this.$notify.error({
      //         title: '错误',
      //         message: data.data.error
      //       })
      //     }
      //   })
      // })
    },
    selectable(row, index) {
      return row.pro_status == 3 || row.pro_status == 1
    },
    goWrap () {
      this.$router.push({
        path: '/home/project/index/list/wrap',
        query: this.getForm.ispub == 0 ? {
          ispub: -1
        } : {}
      })
    }
  },
  created() {
    this.isYXB = this.isYXBPublic()
    this.keepGetFormPublic(1);
  },
  beforeMount() {
    if (this.userInfo.role === 2 && this.userInfo.college) {
      if (MATE('project_sign', this.userInfo.college)) {
        this.is_ss = true;
        if (this.userInfo.auth_college) {
          this.is_ss_auth = true;
        }
      }
    }
    this.headers = JSON.parse(this.$cookie.get("headers"))
    this.initData()
    if (this.userInfo.role === 1) {
      this.getStructures({
        data: {}
      }).then(data => {
        if (data.data.code === 200) {
          const Data = data.data.data;
          Data.forEach(item => {
            if (item.level === 1) {
              this.collegeList.push(item);
            } else if (item.level === 2) {
              this.structuresList.push(item);
            }
          });
        }
      });
    }
    this.getAreaList({
      data: {
        pid: 0
      }
    }).then(data => {
      if (data.data.code === 200) {
        const Data = data.data.data;
        this.provincesList = Data.list;
      }
    })
  },
  beforeDestroy() {
    sessionStorage.removeItem("PRO_IS_SS");
    sessionStorage.removeItem("PRO_IS_PXLX");
    this.keepGetFormPublic(2);
  },
  watch: {
    $route() {
      Object.assign(this.getForm, this.$options.data().getForm);
      this.initData();
    }
  }
};
</script>

<style scoped>
.edit-select {
  color: #409eff;
  font-size: 12px;
  cursor: pointer;
}
.danger {
  color: #f56c6c;
}
.success {
  color: #67c23a;
}
</style>
