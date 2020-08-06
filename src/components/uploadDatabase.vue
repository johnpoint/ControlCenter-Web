<template>
  <el-upload
      drag
      :action="uploadUrl"
      :headers="uploadHeaders"
      :on-success="uploadSuccess"
      :on-progress="uploadProgress"
      multiple>
    <i class="el-icon-upload"></i>
    <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
  </el-upload>
</template>

<script>
import config from "@/config";

export default {
  name: "uploadDatabase",
  methods: {
    uploadSuccess: function () {
      this.$notify({
        title: 'Success',
        message: 'Successful Upload',
        type: 'success'
      });
    },
    uploadProgress: function () {
      this.$notify({
        title: 'Info',
        message: 'Uploading',
        type: 'info'
      });
    }
  },
  mounted() {
    this.uploadUrl = config.apiAddress + "/web/backup"
    this.uploadHeaders = {
      'Authorization': "Bearer " + this.$store.state.jwt,
      'Accept': 'application/json'
    }
  },
  data() {
    return {
      uploadUrl: '',
      uploadHeaders: null,
    }
  }
}
</script>

<style scoped>

</style>