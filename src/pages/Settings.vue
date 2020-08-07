<template>
  <div>
    <mainLayout :router="pageName"></mainLayout>
    <el-card class="row">
      <el-tabs v-model="activeName">
        <el-tab-pane label="Account" name="account">
          <el-row class="row">
            <el-col :lgt="12" class="row">
              <el-card shadow="always" style="text-align: left">
                <div slot="header" class="clearfix">
                  <span>Account Info</span>
                </div>
                <el-form :inline="true" :model="emailForm" class="demo-form-inline">
                  <el-form-item label="Email">
                    <el-input v-model="emailForm.email" placeholder="Email" :disabled="!emailForm.edit"></el-input>
                  </el-form-item>
                  <el-form-item>
                    <el-button :type="emailForm.edit?'':'primary'" @click="emailForm.edit=(emailForm.edit?false:true)"
                               plain>{{ emailForm.edit ? 'Cancel' : 'Edit' }}
                    </el-button>
                    <el-button v-if="emailForm.edit" type="warning" plain>Update</el-button>
                  </el-form-item>
                </el-form>
              </el-card>
            </el-col>
          </el-row>
        </el-tab-pane>
        <el-tab-pane label="Security" name="security">
          <el-row>
            <el-col :lg="12" class="row">
              <el-card shadow="always">
                <div slot="header" class="clearfix">
                  <span>Token</span>
                  <el-button style="float: right; padding: 3px 0" @click="generates" type="text">Generates</el-button>
                </div>
                <div>
                  <code>{{ token }}</code>
                </div>
              </el-card>
            </el-col>
            <el-col :lg="12" class="row">
              <el-card>
                <div slot="header" class="clearfix">
                  <span>Password</span>
                </div>
                <el-form :model="passwordForm" status-icon :rules="rules" ref="ruleForm"
                         class="demo-ruleForm">
                  <el-form-item label="Old Password" prop="oldpass">
                    <el-input type="password" v-model="passwordForm.oldpass" autocomplete="off"></el-input>
                  </el-form-item>
                  <el-form-item label="New Password" prop="pass">
                    <el-input type="password" v-model="passwordForm.pass" autocomplete="off"></el-input>
                  </el-form-item>
                  <el-form-item label="Confirm Password" prop="checkPass">
                    <el-input type="password" v-model="passwordForm.checkPass" autocomplete="off"></el-input>
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" @click="submitPassword">提交</el-button>
                  </el-form-item>
                </el-form>
              </el-card>
            </el-col>
            <el-col :lg="12" class="row">
              <el-card v-loading="true" element-loading-text="即将推出">
                <div slot="header" class="clearfix">
                  <span>Two-factor authentication</span>
                </div>
                <el-form status-icon :rules="rules" ref="ruleForm" label-width="100px"
                         class="demo-ruleForm">
                  <el-form-item label="密码">
                    <el-input type="password" autocomplete="off"></el-input>
                  </el-form-item>
                  <el-form-item label="确认密码">
                    <el-input type="password" autocomplete="off"></el-input>
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary">提交</el-button>
                  </el-form-item>
                </el-form>
              </el-card>
            </el-col>
          </el-row>
        </el-tab-pane>
        <el-tab-pane label="Notification" name="notification">Notification</el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
import mainLayout from "@/layouts/mainLayout";
import config from "@/config";

export default {
  name: "Settings",
  components: {
    mainLayout,
  },
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('Password must be entered'));
      } else {
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('Please enter the password again'));
      } else if (value !== this.passwordForm.pass) {
        callback(new Error('The two passwords do not match'));
      } else {
        callback();
      }
    };
    return {
      pageName: ['Settings'],
      activeName: 'account',
      token: 'token',
      rules: {
        pass: [
          {validator: validatePass, trigger: 'blur'}
        ],
        checkPass: [
          {validator: validatePass2, trigger: 'blur'}
        ],
        oldpass: [
          {validator: validatePass, trigger: 'blur'}
        ]
      },
      passwordForm: {
        pass: '',
        checkPass: '',
        oldpass: ''
      },
      emailForm: {
        email: '',
        edit: false,
      }
    }
  },
  mounted() {
    this.getToken();
    this.emailForm.email = this.$store.state.userInfo.mail;
  },
  methods: {
    getToken: function () {
      this.$http.get(config.apiAddress + "/web/UserInfo/Token", {
        headers: {
          'Authorization': "Bearer " + this.$store.state.jwt,
          'Accept': 'application/json'
        }
      }).then(function (res) {
        if (res.body.Code == 200) {
          this.token = res.body.Info;
        } else {
          this.$notify({
            title: 'Server Warning',
            message: res.body.Info,
            type: 'warning'
          })
        }
      }, function () {
        this.$notify({
          title: 'Server Warning',
          message: "登录会话可能已经过期，请尝试重新登录",
          type: 'warning'
        })
      })
    },
    generates: function () {
      this.$http.put(config.apiAddress + "/web/UserInfo/Token", {}, {
        headers: {
          'Authorization': "Bearer " + this.$store.state.jwt,
          'Accept': 'application/json'
        }
      }).then(function (res) {
        if (res.body.Code == 200) {
          this.$notify({
            title: 'Success',
            type: 'success'
          })
          this.getToken();
        } else {
          this.$notify({
            title: 'Server Warning',
            message: res.body.Info,
            type: 'warning'
          })
        }
      }, function () {
        this.$notify({
          title: 'Server Warning',
          message: "登录会话可能已经过期，请尝试重新登录",
          type: 'warning'
        })
      })
    },
    submitPassword: function () {
      this.$http.post(config.apiAddress + "/web/UserInfo/Password", {
        oldpass: this.passwordForm.oldpass,
        newpass: this.passwordForm.pass
      }, {
        headers: {
          'Authorization': "Bearer " + this.$store.state.jwt,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      }).then(function (res) {
        if (res.body.Code == 200) {
          this.$notify({
            title: 'Success',
            type: 'success'
          })
          this.getToken();
        } else {
          this.$notify({
            title: 'Server Warning',
            message: res.body.Info,
            type: 'warning'
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