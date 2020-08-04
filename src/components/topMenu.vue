<template>
  <el-menu
      v-loading="loading"
      :default-active="activeIndex"
      class="topMenu"
      :router=true
      mode="horizontal"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b">
    <el-menu-item v-for="(item) in menuList" v-bind:index="item.url" :key="item.index">{{
        item.title
      }}
    </el-menu-item>
    <el-submenu index="." v-if="userStatus" style="float: right">
      <template slot="title">{{ username }}</template>
      <el-menu-item index="2-1">Setting</el-menu-item>
      <el-menu-item index="2-1">System console</el-menu-item>
      <el-menu-item @click="logout">Log out</el-menu-item>
    </el-submenu>
    <el-menu-item v-else style="float: right" index="/Login">Login</el-menu-item>
  </el-menu>
</template>
<script>
import config from "@/config";
import router from "@/router";

export default {
  name: 'topMenu',
  props: {},
  data() {
    return {
      username: '',
      userStatus: this.$store.state.isLogin,
      activeIndex: this.$route.path,
      menuList:config.menu,
      loading: false
    };
  },
  mounted() {
    this.getUser()
  },
  methods: {
    getUser: function () {
      if (!this.$store.state.isLogin) {
        this.$notify.error({
          title: 'Error',
          message: "Please sign in"
        });
        router.push("/Login");
      }else {
        this.$http.get(config.apiAddress + "/web/UserInfo", {
          headers: {
            'Authorization': "Bearer " + this.$store.state.jwt,
            'Accept': 'application/json'
          }
        }).then(function (res) {
          this.$store.commit('setUserInfo', res.body)
          this.username = this.$store.state.userInfo.name
        }, function () {
          this.$notify.error({
            title: 'Error',
            message: "Can't Connect Server"
          });
        })
      }
    },
    logout:function (){
      this.$store.commit('setStatus',false);
      this.$notify({
        title: 'Success',
        message: 'Successful Log Out',
        type: 'success'
      });
      localStorage.removeItem("jwt");
      localStorage.removeItem("isLogin");
      router.push("/Login")
    }
  }
}
</script>
