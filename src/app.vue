<template>
  <div id="app">
    <tableList></tableList>
    <el-button @click="showQrGoodDialog = true">选择商品</el-button>
    <goodsDialog v-model="showQrGoodDialog" @singleChoosed="onQrGoodSelected"/>
  </div>
</template>

<script>
import tableList from '@src/views/scene-list/index.vue'
import goodsDialog from '@src/views/goodsList/index.vue'
export default {
  name: 'App',
  components: {
    tableList,
    goodsDialog
  },
  data () {
    return {
      showQrGoodDialog: false
    }
  },
  methods: {
    onQrGoodSelected (val) {
      console.log(val, 'onQrGoodSelected');
    }
  }
}
</script>

<style>

</style>