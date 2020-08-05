<template>
  <el-container v-on:keyup.enter="submitForm('ruleForm')">
    <el-main v-loading.fullscreen.lock="loading">
      <div class="login">
        <h1>Login</h1>
        <div style="margin: 20px;"></div>
        <el-form ref="ruleForm" :label-position="labelPosition" :model="ruleForm" :rules="rules"
                 :hide-required-asterisk=true>
          <el-form-item label="EMail" prop="email">
            <el-input v-model="ruleForm.email"></el-input>
          </el-form-item>
          <el-form-item label="Password" prop="password">
            <el-input v-model="ruleForm.password" type="password"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('ruleForm')">OK</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-main>
  </el-container>
</template>

<script>
import config from "@/config";
import router from "@/router";

export default {
  name: "Login",
  data() {
    return {
      labelPosition: 'right',
      ruleForm: {
        email: '',
        password: '',
        loading: false
      },
      rules: {
        email: [
          {required: true, message: '请输入 Email', trigger: 'blur'},
          {min: 3, message: '长度大于 3 个字符', trigger: 'blur'}
        ],
        password: [
          {required: true, message: '请输入 Password', trigger: 'blur'},
        ]
      }
    };
  },
  mounted() {
    clearInterval(this.$store.state.timer);
    this.checkLogin();
  },
  methods: {
    checkLogin: function () {
      if (localStorage.getItem("isLogin") === "true") {
        this.$store.commit('setjwt', localStorage.getItem("jwt"))
        this.$store.commit('setStatus', true)
        router.push("/")
      }
    },
    submitForm(name) {
      this.loading = true;
      this.$refs[name].validate((valid) => {
        if (valid) {
          let formData = new FormData();
          for (let key in this.ruleForm) {
            formData.append(key, this.ruleForm[key]);
          }
          this.$http.post(config.apiAddress + '/user/auth/login', formData,
              {'Content-Type': 'multipart/form-data;charset=utf-8'}).then(function (res) {
            var data = res.body
            if (data.Code == 200) {
              this.$notify({
                title: 'Success',
                message: 'Successful login',
                type: 'success'
              });
              this.$store.commit('setjwt', data.Info)
              this.$store.commit('setStatus', true)
              localStorage.setItem("isLogin", "true")
              localStorage.setItem("jwt", data.Info)
              router.push("/")
            } else {
              this.$notify.error({
                title: 'Error',
                message: data.Info
              });
            }
            this.loading = false;
          }, function (res) {
            this.$notify.error({
              title: 'Error',
              message: res.status
            });
            this.loading = false;
          })
        } else {
          this.$notify.error({
            title: 'Warning',
            type: 'warning'
          });
          this.loading = false;
          return false;
        }
      });
    },
  }
}
</script>

<style scoped>
body {
  background-color: #8c939d;
}

.login {
  align-items: center;
  position: absolute;
  top: 30%;
  left: 30%;
  width: 40%;
  padding: 25px;
  box-shadow: 0 0 20px 0px rgb(140, 197, 255);
}
</style>