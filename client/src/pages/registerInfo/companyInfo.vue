<template>
  <div class="company box">
    <div class="steps">
      <el-steps :active="active" finish-status="success">
        <el-step :title="$t('account.business-details')"></el-step>
        <el-step :title="$t('account.banking-details')"></el-step>
        <el-step :title="$t('account.contact')"></el-step>
        <el-step :title="$t('m.done')"></el-step>
      </el-steps>
    </div>
    <div class="form" v-if="active == 0">
      <div class="flex-between mt30 item-center">
        <span class="fz16 color-333">{{$t('account.business-name')}}</span>
        <el-input v-model="companyForm.company_name"></el-input>
      </div>
      <div class="flex-between mt30 item-center">
        <span class="fz16 color-333">{{$t('account.street-address')}}</span>
        <el-input v-model="companyForm.address"></el-input>
      </div>
      <div class="flex-between mt30 item-center">
        <div class="inline-input">
          <span class="fz16 color-333">{{$t('account.country')}}</span>
          <el-select
            @change="getCity"
            v-model="country_id"
            filterable
            :placeholder="$t('account.select-input')"
          >
            <el-option
              clearable="true"
              v-for="item in country"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </div>
        <div class="inline-input">
          <span class="fz16 color-333">{{$t('account.city')}}</span>
          <el-select
            @change="getProvince"
            v-model="companyForm.city_id"
            filterable
            :placeholder="$t('account.select-input')"
          >
            <el-option v-for="item in cities" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </div>
      </div>
      <div class="flex-between mt30 item-center">
        <div class="inline-input">
          <span class="fz16 color-333">{{$t('account.state')}}</span>
          <el-input v-model="province" disabled></el-input>
        </div>
        <div class="inline-input">
          <span class="fz16 color-333">{{$t('account.postcode')}}</span>
          <el-input v-model="companyForm.postcode"></el-input>
        </div>
      </div>
      <div class="flex-between mt30 item-center upload">
        <span>{{$t('account.business-registration')}}</span>
        <el-input
          v-model="companyForm.business_reg_no"
          :placeholder="$t('account.business-number')"
        ></el-input>
        <!-- <el-upload
          class="upload-demo p-relative"
          ref="upload"
          :action="uploadImg"
          :headers="myHeaders"
          :file-list="fileList"
          :on-error="uploadError"
          :on-success="uploadSuccess"
          :auto-upload="true">
          <el-button slot="trigger" size="medium " icon="el-icon-upload2" class="fz16 color-green">{{$t('account.upload')}}</el-button>
        </el-upload>-->
      </div>

      <div class="flex upload-abn mt20">
        <img class="abn" src="../../assets/images/abn.png" alt v-if="!reg_img_path" />
        <img class="abn" v-lazy="reg_img_path" alt v-if="reg_img_path" />
        <div class="upload-btn">
          <el-upload
            class="upload-demo p-relative"
            ref="upload"
            :action="uploadImg"
            :headers="myHeaders"
            :show-file-list="false"
            :on-error="uploadError"
            :on-success="uploadSuccess"
            :auto-upload="true"
          >
            <img class="ml10" src="../../assets/images/upload-img.png" alt />
            <label class="fz16 color-green">{{$t('account.upload')}}</label>
          </el-upload>
        </div>
      </div>

      <div class="flex-between mt30 item-center">
        <span>{{$t('account.tax-number')}}</span>
        <el-input v-model="companyForm.tax_no" :placeholder="$t('account.optional')"></el-input>
      </div>
      <div class="flex-between mt30 item-center">
        <div class="inline-input">
          <span>{{$t('account.agency-size')}}</span>
          <el-select v-model="companyForm.scale" placeholder>
            <el-option
              v-for="(item,index) in scale"
              :key="index"
              :label="item+$t('account.people')"
              :value="index"
            ></el-option>
          </el-select>
        </div>
        <div class="inline-input">
          <span>{{$t('account.currency')}}</span>
          <el-select v-model="companyForm.currency" placeholder>
            <el-option
              v-for="(item, index) in currency"
              :key="index"
              :label="item.name"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>
      </div>
      <div class="flex">
        <p style="width: 515px;"></p>
        <p class="fz14 color-666">{{$t('account.cannot-change-tips')}}</p>
      </div>
      <p class="save-btn cursor mt80" @click="next(1)">{{$t('m.next')}}</p>
    </div>
    <div class="form" v-if="active == 1">
      <div class="account-form" v-if="regCurrency == 'CNY'">
        <div class="flex-between mt30 item-center">
          <span class="fz16 color-333">{{$t('wallet.bank-name')}}</span>
          <el-input v-model="bankForm.bank_info0" placeholder></el-input>
        </div>
        <div class="flex-between mt30 item-center">
          <span class="fz16 color-333">{{$t('wallet.account-name2')}}</span>
          <el-input v-model="bankForm.bank_info1" :placeholder="$t('account.same-company-name')"></el-input>
        </div>
        <div class="flex-between mt30 item-center">
          <span class="fz16 color-333">{{$t('wallet.account-address')}}</span>
          <el-input v-model="bankForm.bank_info2" placeholder></el-input>
        </div>
        <div class="flex-between mt30 item-center">
          <span class="fz16 color-333">{{$t('wallet.account-number')}}</span>
          <el-input v-model="bankForm.bank_info3" placeholder></el-input>
        </div>
        <p class="save-btn cursor mt80" @click="next(2)">{{$t('m.next')}}</p>
      </div>
      <div class="account-form" v-else>
        <div class="flex-between mt30 item-center">
          <span class="fz16 color-333">Bank Name</span>
          <el-input v-model="bankForm.bank_info0" placeholder></el-input>
        </div>
        <div class="flex-between mt30 item-center">
          <span class="fz16 color-333">Account Name</span>
          <el-input v-model="bankForm.bank_info1" :placeholder="$t('account.same-company-name')"></el-input>
        </div>
        <div class="flex-between mt30 item-center">
          <span class="fz16 color-333">BSB Number</span>
          <el-input v-model="bankForm.bank_info2" placeholder></el-input>
        </div>
        <div class="flex-between mt30 item-center">
          <span class="fz16 color-333">Account Number</span>
          <el-input v-model="bankForm.bank_info3" placeholder></el-input>
        </div>
        <p class="save-btn cursor mt80" @click="next(2)">{{$t('m.next')}}</p>
      </div>
    </div>
    <div v-if="active == 2">
      <div class="concact">
        <div class="title fz26 color-333">{{$t('m.phone-number')}}</div>
        <div class="fz16">{{$t('account.sms-tips')}}</div>
        <div class="flex-between mt30 item-center tel-input">
          <el-input
            v-model="contactForm.mobile"
            @keyup.native="contactForm.mobile = contactForm.mobile.replace(/[^\d]/g,'')"
            :placeholder="$t('m.phone-number')"
            class="input-with-select"
          >
            <el-select
              v-model="contactForm.area_code"
              slot="prepend"
              :placeholder="$t('account.select2')"
            >
              <el-option
                v-for="item in areaCode"
                :key="item.value"
                :label="item.value"
                :value="item.value"
              >
                <span style="float: left">{{ item.label }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">{{ item.value }}</span>
              </el-option>
            </el-select>
          </el-input>
        </div>
        <div class="title fz26 color-333">{{$t('account.email')}}</div>
        <div class="fz16">
          {{$t('account.send-mailbox-tips')}}{{userInfo.email}}，
          <br />
          {{$t('account.notify')}}
        </div>
        <el-input
          v-model="contactForm.nofity_emial0"
          @blur="isEmail(contactForm.nofity_emial0)"
          class="mt20"
          :placeholder="$t('account.optional')"
        ></el-input>
        <el-input
          v-model="contactForm.nofity_emial1"
          @blur="isEmail(contactForm.nofity_emial1)"
          class="mt20"
        ></el-input>
        <el-input
          class="mt20"
          v-model="nofityEmails[index]"
          @blur="isEmail(nofityEmails[index])"
          v-for="(item, index) in nofityEmails"
          :key="index"
        ></el-input>
        <p class="fz16 color-green cursor" @click="addEmail">+ {{$t('account.add-other-email')}}</p>

        <p class="save-btn cursor mt80" @click="next(3)">{{$t('m.done')}}</p>
      </div>
    </div>
    <div v-if="active == 3">
      <div class="text">
        <img class="mt40" src="../../assets/images/success.png" alt />
        <h3 class="mt20 color-333">{{$t('account.register-success')}}</h3>
        <!-- <h3 class="mt5 color-333">{{$t('account.register-tips1')}}</h3> -->
        <div class="color-999 fz16 tip-info mt40">
          <p>{{$t('account.register-tips1')}}</p>
          <p>{{$t('account.register-tips2')}}</p>
          <p>{{$t('account.register-tips3')}}</p>
        </div>
        <el-button class="home-btn fz16 color-333 mt40" @click="goHome">{{$t('m.homepage')}}</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";
import { areaCodeList } from "../../assets/js/areaCode";
export default {
  name: "company",
  data() {
    return {
      active: 0,
      country: [],
      cities: [],
      scale: [],
      currency: [],
      regCurrency: "",
      fileList: [],
      nofityEmails: [],
      seletCountry: {},
      areaCode: [],
      province: "",
      country_id: "",
      uploadImg: "",
      myHeaders: { Authorization: "" },
      companyForm: {
        company_name: "",
        address: "",
        city_id: "",
        postcode: "",
        business_reg_no: "",
        reg_img_id: "",
        scale: "",
        currency: "",
        tax_no: ""
      },
      bankForm: {
        bank_info0: "",
        bank_info1: "",
        bank_info2: "",
        bank_info3: ""
      },
      contactForm: {
        area_code: "",
        mobile: "",
        nofity_emial0: "",
        nofity_emial1: ""
      },
      reg_img_path: ''
    };
  },
  computed: {
    ...mapState({
      userInfo: "userInfo",
      lang: state => state.lang
    })
  },
  mounted() {
    this.getCompanyInfo();
    this.areaCode = areaCodeList(
      this.$t("m.china"),
      this.$t("m.australia"),
      this.$t("m.new-zealand"),
      this.$t("m.hong-kong")
    );
    if (JSON.stringify(this.$route.query) != "{}") {
       if (this.$route.query.step == 1 || this.$route.query.step == 0) {
        this.active = 0;
      } else if (this.$route.query.step == 2) {
        this.active = 1;
      } else if (this.$route.query.step == 3){
        this.active = 2;
      }else {
        this.active = 3;
      }
      this.regCurrency = this.$route.query.currency;
    }

    // this.uploadImg = `http://client.skycar-ride.com/${this.lang}/upload-img`;
    this.uploadImg = `http://client.hi-transfer.com/${this.lang}/upload-img`;
    this.myHeaders.Authorization = this.$cookie.get("access_token");
  },
  methods: {
    next(num) {
      if (num == 1) {
        this.submitCompanyInfo();
      } else if (num == 2) {
        this.submitBankInfo();
      } else if (num == 3) {
        this.submitContact();
      }
    },
    goHome() {
      this.$router.push({ name: "home" });
    },
    getCompanyInfo() {
      let _this = this;
      this.$axios.get(this.lang + "/info").then(rsp => {
        _this.country = rsp.data.data.country;
        _this.scale = rsp.data.data.scale;
        _this.currency = rsp.data.data.currency;
      });
    },
    getCity(value) {
      let _this = this;
      _this.cities = "";
      this.companyForm.city_id = "";
      this.province = "";

      this.$axios
        .get(this.lang + "/tools/country-city?id=" + value)
        .then(rsp => {
          _this.cities = rsp.data.data;
        });
    },
    getProvince(value) {
      let nowCity = this.cities.filter(item => item.id == value);
      this.province = nowCity[0].state;
    },
    uploadSuccess(response, file, list) {
      this.fileList = [list[list.length - 1]];
      if (response.status == 1) {
        this.companyForm.reg_img_id = response.data.id;
        this.reg_img_path = response.data.link;
      } else {
        this.$message.error(response.message);
      }
    },
    uploadError(err, file) {
      this.$message.error(this.$t("account.upload-error"));
    },
    /**
     * 提交公司信息
     */
    submitCompanyInfo() {
      let _this = this;
      this.seletCountry = this.getSelectCountry();

      if (!this.companyForm.company_name) {
        this.$message.error(this.$t("yz.null-company-name"));
        return;
      } else if (!this.companyForm.address) {
        this.$message.error(this.$t("yz.null-company-address"));
        return;
      } else if (!this.companyForm.city_id) {
        this.$message.error(this.$t("m.select-cities"));
        return;
      } else if (!this.companyForm.postcode) {
        this.$message.error(this.$t("yz.null-postcode"));
        return;
      } else if (!this.companyForm.business_reg_no) {
        this.$message.error(this.$t("yz.null-business-reg"));
        return;
      } else if (!this.companyForm.scale) {
        this.$message.error(this.$t("yz.null-agency-size"));
        return;
      } else if (!this.companyForm.currency) {
        this.$message.error(this.$t("yz.null-currency"));
        return;
      } else if (!this.companyForm.reg_img_id) {
        this.$message.error(this.$t("yz.null-img"));
        return;
      }

      this.$axios.post(this.lang + "/info", this.companyForm).then(res => {
        _this.active = 1;
        this.regCurrency = this.companyForm.currency;
        this.$router.push({path: "/index/companyInfo",query: {step: 1,currency: this.companyForm.currency }});
      });
    },

    getSelectCountry() {
      return this.country.filter(item => item.id == this.country_id)[0];
    },

    /**
     * 添加邮箱
     */
    addEmail() {
      if (this.nofityEmails.length < 8) {
        this.nofityEmails.push("");
      } else {
        this.$message.warning(this.$t("account.add-up"));
      }
    },

    isEmail(value) {
      let reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
      if (value) {
        if (!reg.test(value)) {
          this.$message.warning(this.$t("yz.email-error"));
          return;
        }
      }
    },

    /**
     * 银行信息
     */
    submitBankInfo() {
      let _this = this,
        paramet = {};

      if (!this.bankForm.bank_info0) {
        this.$message.warning(this.$t("yz.null-account-name"));
        return;
      } else if (!this.bankForm.bank_info1) {
        this.$message.warning(this.$t("yz.null-bank"));
        return;
      } else if (!this.bankForm.bank_info2) {
        this.$message.warning(this.$t("yz.null-bsb"));
        return;
      } else if (!this.bankForm.bank_info3) {
        this.$message.warning(this.$t("yz.null-acount-number"));
        return;
      }
      paramet = {
        "bank_info[0]": this.bankForm.bank_info0,
        "bank_info[1]": this.bankForm.bank_info1,
        "bank_info[2]": this.bankForm.bank_info2,
        "bank_info[3]": this.bankForm.bank_info3
      };

      this.$axios.post(this.lang + "/bank", paramet).then(res => {
        _this.active = 2;
        this.$router.push({path: "/index/companyInfo",query: {step: 3 }});
      });
    },

    /**
     * 提交联系信息
     */
    submitContact() {
      let _this = this,
        paramet = {};

      if (!this.contactForm.area_code) {
        this.$message.error(this.$t("yz.null-area-code"));
        return;
      } else if (!this.contactForm.mobile) {
        this.$message.error(this.$t("yz.null-phone"));
        return;
      }

      paramet = {
        area_code: this.contactForm.area_code,
        mobile: this.contactForm.mobile
      };

      if (this.contactForm.nofity_emial0) {
        paramet["nofity_emial[0]"] = this.contactForm.nofity_emial0;
      }
      if (this.contactForm.nofity_emial1) {
        paramet["nofity_emial[1]"] = this.contactForm.nofity_emial1;
      }

      if (this.nofityEmails.length > 0) {
        if (this.contactForm.nofity_emial0 && this.contactForm.nofity_emial1) {
          for (let i = 0; i < this.nofityEmails.length; i++) {
            paramet[`nofity_emial[${2 + i}]`] = this.nofityEmails[i];
          }
        } else if (
          this.contactForm.nofity_emial0 ||
          this.contactForm.nofity_emial1
        ) {
          for (let i = 0; i < this.nofityEmails.length; i++) {
            paramet[`nofity_emial[${1 + i}]`] = this.nofityEmails[i];
          }
        } else {
          for (let i = 0; i < this.nofityEmails.length; i++) {
            paramet[`nofity_emial[${i}]`] = this.nofityEmails[i];
          }
        }
      }

      this.$axios.post(this.lang + "/contact", paramet).then(res => {
        _this.active = 3;
        this.$router.push({path: "/index/companyInfo",query: {step: 4 }});
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.box {
  width: 1200px;
  margin: auto;
  padding: 40px 0;
  .steps {
    width: 800px;
    margin: auto;
  }

  .upload-abn {
    .abn {
      margin-left: 200px;
      height: 120px;
      width: 120px;
    }
    .upload-btn {
      width: 160px;
      img,
      label {
        margin-top: 98px;
        cursor: pointer;
      }
    }
  }

  .form {
    width: 750px;
    margin: 50px auto;
    .flex-between span,
    .flex span {
      display: inline-block;
      width: 240px;
      text-align: right;
    }
    .el-input {
      margin-left: 30px;
    }
    .inline-input {
      span {
        width: 170px;
      }
      .el-select .el-input__inner {
        width: 170px !important;
      }
      .el-input,
      .el-select {
        width: 170px;
        margin-left: 30px;
        display: inline-block;
      }
    }
  }
  .account-form {
    .flex-between span {
      display: inline-block;
      width: 170px;
      text-align: right;
    }
    .el-input {
      margin-left: 30px;
    }
  }

  .concact {
    width: 565px;
    margin: 60px auto;
    .title {
      margin: 50px 0 12px 0;
    }
  }

  .text {
    text-align: center;
    img {
      width: 83px;
      height: 83px;
    }
    h3 {
      margin: 0;
    }
    .tip-info p {
      margin: 0 0 5px 0;
    }
    .home-btn {
      color: #333;
      width: 188px;
      height: 48px;
      text-align: center;
      border-radius: 24px;
      border: 1px solid #328c6e;
      margin-bottom: 80px;
    }
  }

  .save-btn {
    width: 160px;
    height: 48px;
    line-height: 48px;
    text-align: center;
    background: linear-gradient(#328c6e, #4b9d63);
    border-radius: 24px;
    color: #fff;
    font-size: 16px;
    margin: auto;
  }

  /deep/ {
    .el-input__inner:focus {
      border: 1px solid #4b9d63;
    }
    .el-select .is-focus .el-input__inner:focus {
      border: 1px solid #ccc;
    }
    ::-webkit-input-placeholder,
    ::-moz-placeholder,
    :-ms-input-placeholder {
      color: #999999 !important;
      font-size: 16px !important;
      color: #328c6e;
    }
    .date .el-input__inner {
      padding-left: 9px !important;
    }
    .el-step__title {
      font-size: 12px;
    }
    .el-step__title.is-process {
      font-weight: normal;
      color: #38846a;
    }
    .el-step__title.is-success,
    .el-step__head.is-success,
    .el-step__head.is-process,
    .el-checkbox {
      color: #38846a;
    }
    .el-step__head.is-success,
    .el-step__head.is-process {
      border-color: #4b9d63;
    }
    .el-step__icon.is-text {
      width: 30px;
      height: 30px;
    }
    .is-wait .el-step__icon.is-text {
      background: #999999;
      color: #fff;
      border-color: transparent;
    }
    .is-success .el-step__icon.is-text,
    .is-process .el-step__icon.is-text {
      background: linear-gradient(#328c6e, #4b9d63);
      color: #fff;
    }
    .el-input .el-input__inner,
    .radius .el-textarea__inner {
      border-radius: 12px;
      padding-left: 20px;
    }
    .radius .el-textarea__inner {
      height: 72px;
    }
    .tel-input .el-input__inner {
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
    }
    .tel-input .el-select .el-input {
      width: 130px;
    }
    .input-with-select .el-input-group__prepend {
      background-color: #fff;
    }
    .date .el-input__inner {
      padding-left: 20px !important;
    }

    .drop-box .el-input-number .el-input-number__increase,
    .drop-box .el-input-number__decrease,
    .drop-box .el-input__inner {
      border: none;
    }

    .drop-box .el-input-number .el-input-number__decrease,
    .drop-box .el-input-number .el-input-number__increase {
      background: transparent;
      width: 22px;
      height: 22px;
      line-height: 22px;
      border-radius: 50%;
      margin-left: 50px;
      color: #38846a;
      border: 1px solid #38846a;
    }
    .drop-box .el-input {
      padding: 0;
      margin-top: -6px;
      width: 200px;
    }

    .drop-box .el-input .el-input__inner {
      width: 80px;
      margin-left: 100px;
    }

    // .upload-demo .el-button {
    //   border-left: 0;
    //   height: 40px;
    // }

    // .upload-demo .el-upload-list {
    //   position: absolute;
    //   top: 30px;
    // }
  }
}
</style>


