<template>
  <el-container>
    <el-header>
      <h2>系统后台</h2>
      <el-button type="warning">订单管理</el-button>
    </el-header>
    <el-main>
      <Mobile />
    </el-main>
  </el-container>
</template>

<script>
// import { onMounted, ref } from 'vue'
// import { AJAX, PATH } from "../../config";
import Mobile from './cps/Mobile'

export default {
  name: 'manage',
  components: {
    Mobile
  },
  setup() {
    
  }
}
</script>
<style lang="scss">
  @import "@/assets/css/common.scss";
  .el-header{
    background-color: $themeColor;
    display: flex;
    align-items: center;
    justify-content: space-between;
    h2{
      color: #fff;
    }
  }
</style>