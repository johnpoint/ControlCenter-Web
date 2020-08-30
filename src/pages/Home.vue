<template>
  <div>
    <mainLayout :router="pageName"></mainLayout>
    <el-main>
      <el-row>
        <el-col v-for="card in cards" :key="card.index" :lg="6">
          <div @click="goTo(card.title)">
            <el-card class="box-card" shadow="hover">
              <div slot="header" class="clearfix">
                <span>{{ card.title }}</span>
              </div>
              <div class="text item">
                {{ card.num == 0 ? "-" : card.num }}
              </div>
            </el-card>
          </div>
        </el-col>
      </el-row>
    </el-main>
  </div>
</template>

<script>
import mainLayout from '../layouts/mainLayout.vue'
import router from "@/router";
import config from "@/config";

export default {
  components: {
    mainLayout
  },
  data() {
    return {
      cards: [
        {title: "Server", num: 0},
        {title: "Certificate", num: 0},
        {title: "Configuration", num: 0}
      ],
      pageName: ["Home"]
    }
  },
  mounted() {
    this.getServerNum();
    this.getCerNum();
    this.getConfNum();
  },
  methods: {
    goTo: function (target) {
      router.push("/" + target)
    },
    getServerNum: function () {
      this.$http.get(config.apiAddress + "/web/ServerInfo", {
        headers: {
          'Authorization': "Bearer " + this.$store.state.jwt,
          'Accept': 'application/json'
        }
      }).then(function (res) {
        this.cards[0].num = res.body.length
      }, function () {
        this.$notify({
          title: 'Server Warning',
          message: "登录会话可能已经过期，请尝试重新登录",
          type: 'warning'
        })
      })
    },
    getCerNum: function () {
      this.$http.get(config.apiAddress + "/web/Certificate", {
        headers: {
          'Authorization': "Bearer " + this.$store.state.jwt,
          'Accept': 'application/json'
        }
      }).then(function (res) {
        this.cards[1].num = res.body.length
      }, function () {
        this.$notify({
          title: 'Server Warning',
          message: "登录会话可能已经过期，请尝试重新登录",
          type: 'warning'
        })
      })
    },
    getConfNum: function () {
      this.$http.get(config.apiAddress + "/web/Configuration", {
        headers: {
          'Authorization': "Bearer " + this.$store.state.jwt,
          'Accept': 'application/json'
        }
      }).then(function (res) {
        this.cards[2].num = res.body.length
      }, function () {
        this.$notify({
          title: 'Server Warning',
          message: "登录会话可能已经过期，请尝试重新登录",
          type: 'warning'
        })
      })
    }
  }
}
</script>

<style scoped>
.box-card {
  width: 95%;
}

.text.item {
  font-size: 60px;
  text-align: center;
}
</style>
