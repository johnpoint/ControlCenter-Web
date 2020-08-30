<template>
  <div>
    <el-card>
      <div slot="header">
        <span>Configuration Import</span>
      </div>
      <el-form v-model="form" :rules="rules">
        <el-form-item label="name" prop="mustEnter">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="path" prop="mustEnter">
          <el-input v-model="form.path"></el-input>
        </el-form-item>
        <el-form-item label="type" prop="mustEnter">
          <el-input v-model="form.type"></el-input>
        </el-form-item>
        <el-form-item label="value" prop="mustEnter">
          <el-input
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 10}"
              placeholder="value"
              v-model="form.value">
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
        type: '',
        value: '',
        path: '',
      },
      rules: {
        mustEnter: [
          {required: true, message: 'Must be entered', trigger: 'blur'},
        ]
      }
    }
  },
  methods: {
    pushNewCer: function () {
      this.$http.put(config.apiAddress + "/web/Configuration", this.form, {
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