<template>
  <view class="content">
    <u-form :model="form" ref="uForm" label-width="160">
      <u-form-item label="门店名称" prop="name">
        <u-input v-model="form.name"/>
      </u-form-item>

      <u-form-item label="联系电话" prop="phone">
        <u-input v-model="form.phone" type="number"/>
      </u-form-item>

      <u-form-item label="联系人" prop="contactPerson">
        <u-input v-model="form.contactPerson"/>
      </u-form-item>

      <u-form-item label="门店地址" right-icon="map" prop="address">
        <u-input v-model="form.address" disabled @click="toMap" />
      </u-form-item>

      <u-form-item label="行业分类">
        <!-- <u-input
          v-model="form.type"
          type="select"
          @click="showCategory = true"
        /> -->
        <u-checkbox-group @change="checkboxTypeChange">
          <u-checkbox 
            v-model="item.checked" 
            v-for="(item, index) in typeList" :key="index" 
            :name="item.name"
          >{{item.name}}</u-checkbox>
        </u-checkbox-group>
      </u-form-item>

      <u-form-item label="人均消费" prop="consumption">
        <u-input v-model="form.consumption"/>
      </u-form-item>

      <u-form-item label="备注信息" prop="extra">
        <u-input v-model="form.extra"/>
      </u-form-item>

      <u-form-item label="商家账号" prop="username">
        <u-input v-model="form.username"/>
      </u-form-item>

      <u-form-item label="商家密码" prop="password">
        <u-input v-model="form.password" type="password" password-icon/>
      </u-form-item>

    </u-form>
    <u-button @click="onSubmit">提交</u-button>

    <!-- <u-picker
      mode="selector"
      v-model="showCategory"
      :range="selector"
      range-key="label"
      @confirm="onCategory"
    /> -->

    <u-toast ref="uToast" />
  </view>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator"

import { shopsApply } from '@/api/register'
import { ApplyReq } from '@/types/register'
import { Type, labelTypeMap, TypeMap, typeValueMap } from '@/types/shop'

// @Component 修饰符注明了此类为一个 Vue 组件
@Component({})
export default class Index extends Vue {

  private loading = false
  private form: ApplyReq = {
    name: '', // 商铺名称
    address: '', // 商铺地址
    phone: null, // 商家手机号
    type: [], // 商家所属行业分类
    consumption: '', // 人均消费
    extra: '', // 备注信息
    username: '', // 登录账号
    password: '', // 登录密码
    cost: 0, // 入住费用
    latitude: 0, // 维度
    longitude: 0, // 经度
    contactPerson: '' // 联系人
  }

  private showCategory = false;
  private selector = TypeMap;

  private typeList: any[] = []

  private rules = {
    name: [
      {
        required: true,
        message: "请输入商铺名字",
        // 可以单个或者同时写两个触发验证方式
        trigger: ["change", "blur"]
      },
    ],
    address: [
      {
        required: true,
        message: "商铺地址不能为空",
        // 可以单个或者同时写两个触发验证方式
        trigger: ["change", "blur"]
      },
    ],
    phone: [
      {
        required: true,
        message: "请输入商家手机号",
        // 可以单个或者同时写两个触发验证方式
        trigger: ["change", "blur"]
      },
    ],
    contactPerson: [
      {
        required: true,
        message: "请输入联系人",
        // 可以单个或者同时写两个触发验证方式
        trigger: ["change", "blur"]
      },
    ],
    type: [
      {
        required: true,
        message: "请选择所属行业",
        // 可以单个或者同时写两个触发验证方式
        trigger: ["change", "blur"]
      },
    ],
    consumption: [
      {
        required: true,
        message: "请输入人均消费",
        // 可以单个或者同时写两个触发验证方式
        trigger: ["change", "blur"]
      },
    ],
    extra: [
      {
        required: true,
        message: "请输入备注",
        // 可以单个或者同时写两个触发验证方式
        trigger: ["change", "blur"]
      },
    ],
    username: [
      {
        required: true,
        message: "请输入商家账号",
        // 可以单个或者同时写两个触发验证方式
        trigger: ["change", "blur"]
      },
    ],
    password: [
      {
        required: true,
        message: "请输入商家密码",
        // 可以单个或者同时写两个触发验证方式
        trigger: ["change", "blur"]
      },
    ]
  }

  private uForm: any;

  created() {
    TypeMap.forEach(item => {
      this.typeList.push({
        name: item.label,
        value: item.value,
        checked: false,
        disabled: false
      })
    })
  }
  
  onShow() {
    uni.$on("changeAddress", (res: {address: string, longitude: number, latitude: number}) => {
      if (this.form) {
        this.form.address = res.address
        this.form.longitude = res.longitude
        this.form.latitude = res.latitude
      }
     

      // 清除监听
      // uni.$off('changeAddress');
    })
  }

  checkboxTypeChange(arr: string[]) {
    this.form.type = []
    arr.forEach(typeName => {
      (this.form.type as Type[]).push(typeValueMap[typeName])
    })
    console.log(this.form.type)
  }

  onSubmit() {
    this.uForm.validate((valid: any) => {
      if (valid) {
        const form = JSON.parse(JSON.stringify(this.form))

        this.loading = true
        shopsApply(form).then(() => {
          this.showToast()
        }).catch().finally(() => {
          this.loading = false
        })
      } else {
        console.log("验证失败");
      }
    });
  }

  showToast() {
    (this.$refs.uToast as any).show({
      title: '申请成功',
      type: 'success',
      back: true
    })
  }

  onCategory(e: Type[]) {
    const label = labelTypeMap[e[0]]
    this.form.type = label
  }


  // 跳转到
  toMap() {
    if (this.form) {
      uni.navigateTo({
        url: `/pages/map/index?address=${this.form.address}&longitude=${this.form.longitude}&latitude=${this.form.latitude}`
      });
    }
  }


  onReady() {
    this.uForm = this.$refs.uForm;
    this.uForm.setRules(this.rules);
  }
}
</script>

<style>
.content {
  padding: 40rpx;
}
</style>
