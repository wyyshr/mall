<template>
  <div class="Mobile">
    <!-- 搜索 -->
    <div class="search_nav">
      <el-button type="danger" @click="handleNew">新增</el-button>
      <el-select v-model="query.brand" placeholder="请选择品牌">
        <el-option
          v-for="item in brands"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <el-input v-model="query.mobileName" placeholder="请输入手机名称"></el-input>
      <el-button type="warning" plain @click="getList">查询</el-button>
      <el-button type="info" plain @click="handleReset">重置</el-button>
    </div>
    <!-- 数据表 -->
    <el-table :data="list" border>
      <el-table-column 
        v-for="item in columns" 
        :key="item.label"
        :label="item.label" 
        :prop="item.prop"
      >
        <template v-if="!item.prop" #default="scope">
          <div v-if="item.label == '操作'">
            <el-button @click="handleEditor(scope.row)" type="text" >编辑</el-button>
            <el-popconfirm title="确定删除该手机吗？" @confirm="handleDel(scope.row.id)" cancel-button-text="取消" confirm-button-text="确定">
              <template #reference>
                <el-button type="text" >删除</el-button>
              </template>
            </el-popconfirm>
          </div>
          <el-image 
            v-if="item.type == 'img'"
            :src="scope.row.img"
            :preview-src-list="[scope.row.img]"
          />
        </template>
      </el-table-column>
    </el-table>
    <!-- 新增弹窗 -->
    <el-dialog :title="title" v-model="isAddModelShow">
      <el-form :model="addData">
        <el-form-item label="品牌/分类" label-width="120px">
          <el-cascader :props="{ expandTrigger: 'hover' }" :options="mobJson" v-model="addData.brand_type" placeholder="请选择品牌和分类"></el-cascader>
        </el-form-item>
        <el-form-item label="型号" label-width="120px">
          <el-input v-model="addData.mobileName" placeholder="请输入手机型号" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="图片" label-width="120px">
          <el-upload
            :show-file-list="false"
            :action="uploadPath"
            :on-success="handleUpload"
            :before-upload="beforeUpload"
          >
            <img v-if="addData.img" :src="addData.img" class="mob_img">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="颜色" label-width="120px">
          <el-input v-model="addData.color" placeholder="请输入颜色"></el-input>
          <div class="tip">（多个颜色用英文逗号隔开）</div>
        </el-form-item>
        <el-form-item label="内存" label-width="120px">
          <el-input v-model="addData.ram" placeholder="请输入内存"></el-input>
          <div class="tip">（多个内存用英文逗号隔开）</div>
        </el-form-item>
        <el-form-item label="价格" label-width="120px">
          <el-input-number v-model="addData.price" placeholder="请输入手机价格" :min="0"></el-input-number>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="isAddModelShow = false;isEditor = false">取 消</el-button>
          <el-button type="primary" @click="handleAdd">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { onMounted, reactive, ref, toRefs } from 'vue'
import { AJAX, PATH, host } from "@/config";
import { ElMessage } from 'element-plus';

export default {
  name: "Mobile",
  setup() {
    const columns = ref([
      {
        prop: 'brand',
        label: '品牌'
      },
      {
        prop: 'type',
        label: '分类'
      },
      {
        type: 'img',
        label: '图片'
      },
      {
        prop: 'mobileName',
        label: '型号'
      },
      {
        prop: 'color',
        label: '颜色'
      },
      {
        prop: 'ram',
        label: '内存'
      },
      {
        prop: 'price',
        label: '价格'
      },
      {
        label: '操作'
      }
    ])
    const uploadPath = ref(`${host}${PATH.upload}`)
    const data = reactive({
      list: [],
      query: {
        brand: '',
        mobileName: ''
      },
      brands: [],
      isAddModelShow: false,
      mobJson: [],
      addData: {
        brand_type: [],
        mobileName: '',
        img: '',
        color: '',
        ram: '',
        price: 0
      },
      title: "新增手机",
      editorId: 0,
      handleNew: () => {
        data.isAddModelShow = true;
        data.title = '新增手机'
        data.editorId = 0
        data.addData = {
          brand_type: [],
          mobileName: '',
          img: '',
          color: '',
          ram: '',
          price: 0
        }
      }
    })

    // 获取数据
    const getList = async () => {
      const { query } = data
      !query.brand && delete query.brand
      !query.mobileName && delete query.mobileName
      const res = await AJAX.get(PATH.getMob, { isAdmin: true, ...query })
      if(res.success) data.list = res.data || []
    }
    // 获取品牌分类
    const getBrand = async () => {
      const res = await AJAX.get(PATH.mobJson)
      if(res.success) {
        const brands = res.data.map(v => {
          return {
            value: v.value,
            label: v.label
          }
        })
        data.mobJson = res.data
        data.brands = brands
      }
    }
    // 删除
    const handleDel = async id => {
      const res = await AJAX.post(`${PATH.delMob}/${id}`)
      if(res.success) getList()
    }
    // 上传图片
    const beforeUpload = file => {
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/webp';
      if (!isJpgOrPng) {
        ElMessage.error('请上传正确格式的图片!');
      }
      const isLt5M = file.size / 1024 / 1024 < 5;
      if (!isLt5M) {
        ElMessage.error('上传图片大小不能超过 5MB!')
      }
      return isJpgOrPng && isLt5M;
    }
    const handleUpload = async (res, file) => {
      const formData = new FormData()
      formData.append('file', file.raw)
      const result = await AJAX.post(PATH.upload, formData)
      if(result.success) data.addData.img = result.data
    }

    // 重置
    const handleReset = () => {
      data.query.brand = ''
      data.query.mobileName = ''
      getList()
    }
    // 编辑
    const handleEditor = (row) => {
      data.title = "编辑手机"
      const selMob = {...row}
      delete selMob.id
      data.addData = {...selMob, brand_type: [selMob.brand, selMob.type]}
      data.isAddModelShow = true
      data.editorId = row.id
    }

    // 添加
    const handleAdd = async () => {
      const { addData, editorId } = data
      const params = {...addData}
      const types = [...params.brand_type]
      params.brand = types[0]
      params.type = types[1]
      if(editorId) {
        params.id = editorId
      }
      delete params.brand_type
      const res = await AJAX.get(PATH.addMob, {...params})
      if(res.success) {
        data.isAddModelShow = false
        getList()
      }
    }
    onMounted(() => {
      getList()
      getBrand()
    })
    const refData = toRefs(data)
    return {
      ...refData,
      uploadPath,
      columns,
      handleDel,
      handleUpload,
      beforeUpload,
      handleAdd,
      handleEditor,
      getList,
      handleReset
    }
  }
}
</script>
<style lang="scss">
  .Mobile{
    .search_nav{
      display: flex;
      padding: 20px 0;
      .el-button--danger{
        margin-right: 20px;
      }
      .el-input{
        width: 300px;
        margin-right: 20px;
      }
    }
    .el-table{
      margin-top: 10px;
      // box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
      tbody tr td,thead th{
        text-align: center;
      }
      .el-image{
        width: 50%;
      }
    }
    .el-dialog{
      .el-form-item__content{
        text-align: left;
        width: 70%;
      }
      .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
        &:hover{
          border-color: #409EFF;
        }
      }
      .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 150px;
        height: 150px;
        line-height: 150px;
        text-align: center;
      }
      .mob_img{
        width: 150px;
      }
      .tip{
        color: #ccc;
        font-size: 14px;
      }
    }
  }
</style>