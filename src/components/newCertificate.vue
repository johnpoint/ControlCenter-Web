<template>
  <div>
    <el-card>
      <div slot="header">
        <span>Certificate Import</span>
      </div>
      <el-form v-model="form" :rules="rules">
        <el-form-item label="name" prop="mustEnter">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="Fullchain" prop="mustEnter">
          <el-input
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 10}"
              placeholder="Fullchain"
              v-model="form.fullchain">
          </el-input>
        </el-form-item>
        <el-form-item label="Private Key" prop="mustEnter">
          <el-input
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 10}"
              placeholder="Private Key"
              v-model="form.key">
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="pushNewCer" style="float: right" type="primary" plain>
            OK
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import config from "@/config";

export default {
  name: "newCertificate",
  data() {
    return {
      form: {
        name: '',
        fullchain: '',
        key: '',
      },
      rules: {
        mustEnter:[
          { required: true, message: 'Must be entered', trigger: 'blur' },
        ]
      }
    }
  },
  methods: {
    pushNewCer: function () {
      this.$http.put(config.apiAddress + "/web/Certificate", {
        name: this.form.name,
        fullchain: this.form.fullchain,
        key: this.form.key
      }, {
        headers: {
          'Authorization': "Bearer " + this.$store.state.jwt,
          'Accept': 'application/json'
        }
      }).then(function (res) {
        if (res.body.Code == 200) {
          this.$notify({
            type: 'success',
            title: 'Success'
          })
        } else {
          this.$notify({
            type: 'error',
            title: 'Error',
            message: res.body.Info,
          })
        }
      }, function (res) {
        this.$notify({
          title: 'Server Warning',
          message: res.status,
          type: 'warning'
        })
      })
    }
  }
}
</script>

<style scoped>

</style>