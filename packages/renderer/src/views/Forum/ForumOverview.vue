<template>
  <n-card>
    <n-grid>
      <n-gi :span="4">
        <n-h2>
          <n-text type="primary"> 最近讨论 </n-text>
        </n-h2>
      </n-gi>
      <n-gi :span="12" :offset="3">
        <n-input-group>
          <n-button type="primary" class="label">查找帖子</n-button>
          <n-input :style="{ width: '50%' }" />
          <n-button type="primary" ghost>搜索</n-button>
        </n-input-group>
      </n-gi>
    </n-grid>
    <n-grid>
      <n-gi :span="16">
        <n-grid :x-gap="12" :y-gap="8" :cols="1">
          <n-gi v-for="i in [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]">
            <n-card>
              <n-layout has-sider>
                <n-layout-sider bordered :width="80">
                  <n-avatar
                    round
                    :size="60"
                    src="https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg"
                  />
                </n-layout-sider>
                <n-layout>
                  <n-layout-content>
                    <n-text @click="handleClick">
                      第 {{ i }} 个人的帖子标题
                    </n-text>
                    <br />
                    <n-text> 第 {{ i }} 个人的名字 </n-text>
                    <br />
                    <n-text>
                      Last Mentioned in: 这玩意最后一次被回复 / 提及的时间
                    </n-text>
                  </n-layout-content>
                </n-layout>
              </n-layout>
            </n-card>
          </n-gi>
        </n-grid>
      </n-gi>
      <n-gi :span="7" :offset="1">
        <n-card>
          <n-h2>
            <n-text type="primary"> 选择组织 </n-text>
          </n-h2>
          <n-space>
            <n-gi :span="5">
              <n-space>
                <n-select
                  v-model:value="organization"
                  filterable
                  placeholder="努力寻找ing"
                  :options="options"
                />
              </n-space>
            </n-gi>
          </n-space>
          <n-h2>
            <n-text type="primary"> 进入板块 </n-text>
          </n-h2>
          <n-space>
            <n-button strong secondary round type="primary">
              可以这里聊点学术问题
            </n-button>
            <n-button strong secondary round type="primary">
              大家平时都会灌水的吧
            </n-button>
            <n-button strong secondary round type="primary">
              课程有啥公告都在这里
            </n-button>
            <n-button strong secondary round type="primary">
              软件有了bug快来反馈
            </n-button>
          </n-space>
        </n-card>
      </n-gi>
    </n-grid>
  </n-card>
</template>

<script setup lang="ts">
import {
  NCard,
  NGrid,
  NLayout,
  NText,
  NLayoutContent,
  NButton,
  NInput,
  NInputGroup,
  NH2,
  NAvatar,
  NLayoutSider,
  NGi,
  NSpace,
  NSelect
} from 'naive-ui'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { getUserOrganization } from '../../api/user'

const router = useRouter()
const organization = ref<any>(null)
const options = ref<Array<any>>([])

function handleClick() {
  router.push('/forum/1')
}

onMounted(() => {
  getUserOrganization()
    .then((res: any) => {
      organization.value = res.data.organization[0].orgID
      res.data.organization.forEach((value: any) => {
        console.log(value)
        options.value.push({
          label: value.orgName,
          value: value.orgID
        })
      })
      console.log(options.value)
    })
    .catch((res: any) => {
      window.$message.error('网络故障, 请检查网络连接')
    })
})
</script>

<style scoped></style>
