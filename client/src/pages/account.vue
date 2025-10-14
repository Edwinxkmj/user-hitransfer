<template>
  <div class="account flex">
    <div class="left-account">
      <div class="head-img">
        <el-upload
          class="avatar-uploader"
          :action="setHeadimg"
          :headers="myHeaders"
          :show-file-list="false"
          :on-success="handleAvatarSuccess">
          <img v-if="imageUrl" v-lazy="imageUrl" class="avatar">
        </el-upload>
        <!-- <img src="../assets/images/user@2x.png" alt /> -->
        <div
          class="mt90"
          :class="{'yellow':clientInfo.status==0||clientInfo.status==1,'green':clientInfo.status==2,'red': clientInfo.status==3, 'zh-w': lang == 'zh', 'en-w': lang == 'en'}"
        >{{clientInfo.status_text}}</div>
      </div>
      <div class="btn">
        <p @click="swichType(1)" :class="{'active': active == 1}">
          {{$t('account.profile')}}
          <br />
          <!-- <span class="fz14 color-orange">待修改</span> -->
        </p>
        <p @click="swichType(2)" :class="{'active': active == 2}">{{$t('account.business-details')}}</p>
        <p @click="swichType(3)" :class="{'active': active == 3}">{{$t('account.banking-details')}}</p>
      </div>
    </div>
    <div class="right-account">
      <div v-if="active == 1">
        <h2 v-if="lang == 'zh'">个人资料</h2>
        <div class="form">
          <div class="flex-between mt30 item-center tel">
            <span class="fz16 color-333">{{$t('m.phone-number')}}</span>
            <el-input v-model="clientForm.mobile" :placeholder="$t('yz.null-phone')" @keyup.native="clientForm.mobile = clientForm.mobile.replace(/[^\d]/g,'')" class="input-with-select">
              <el-select v-model="clientForm.area_code" slot="prepend" placeholder="请选择">
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
          <div class="flex-between mt30 item-center">
            <span class="fz16 color-333">{{$t('account.email1')}}</span>
            <el-input v-model="clientForm.email" :placeholder="$t('account.email')" disabled></el-input>
          </div>
          <div
            class="flex-between mt30 item-center"
            v-for="(item, index) in nofityEmails"
            :key="index"
          >
            <span style="width: 700px;"></span>
            <el-input  style="width: 3300px;" v-model="nofityEmails[index]" :placeholder="$t('account.other-email')" @blur="isEmail(nofityEmails[index], index)"></el-input>
            <span class="fz14 color-green cursor" @click="deleteNofityEmail(index)">{{$t('account.delete')}}</span>
          </div>
          <div class="flex mt30 item-center p-relative">
            <span></span>
            <label class="fz14 color-green ml10 cursor" @click="addEmail">+ {{$t('account.send-email')}}</label>
            <label
              class="fz14 color-green cursor p-absolute"
              v-if="clientForm.change_pwd == 0"
              @click="clientForm.change_pwd = 1"
            >
              <i class="el-icon-edit-outline"></i> {{$t('account.change-password')}}
            </label>
            <label
              class="fz14 color-green cursor p-absolute"
              v-if="clientForm.change_pwd == 1"
              @click="clientForm.change_pwd = 0"
            >
              <i class="el-icon-edit-outline"></i> {{$t('account.cancel-change')}}
            </label>
          </div>
          <div v-if="clientForm.change_pwd == 1">
            <div class="flex-between mt30 item-center">
              <span class="fz16 color-333">{{$t('account.verify-password')}}</span>
              <el-input v-model="clientForm.old_pwd" :placeholder="$t('account.verify-password-pl')" show-password></el-input>
            </div>
            <div class="flex-between mt30 item-center">
              <span class="fz16 color-333">{{$t('account.new-password2')}}</span>
              <el-input v-model="clientForm.password" :placeholder="$t('account.new-password-pl')" show-password></el-input>
            </div>
            <div class="flex-between mt30 item-center">
              <span class="fz16 color-333">{{$t('account.confirm-password')}}</span>
              <el-input
                v-model="clientForm.password_confirmation"
                :placeholder="$t('account.confirm-password-pl')"
                show-password
              ></el-input>
             
            </div>
          </div>
          <p class="save-btn cursor mt80" @click="saveClientInfo">{{$t('account.save')}}</p>
        </div>
      </div>
      <div v-if="active == 2">
        <h2 v-if="lang == 'zh'">公司信息</h2>
        <div class="form">
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
              <el-select @change="getCity" v-model="country_id" filterable :placeholder="$t('account.select-input')">
                <el-option
                  clearable="true"
                  v-for="item in companyInfo.country"
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
                <el-option
                  v-for="item in cities"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
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
          <div class="flex-between mt30 item-center">
            <span>{{$t('account.business-registration')}}</span>
            <el-input v-model="companyForm.business_reg_no" :placeholder="$t('account.business-number')"> </el-input>
          </div>
          <div class="flex upload-abn mt20">
            <img class="abn" src="../assets/images/abn.png" alt="" v-if="!reg_img_path">
            <img class="abn" v-lazy="reg_img_path" alt="" v-if="reg_img_path">
            <div class="upload-btn">
             <el-upload
                class="upload-demo p-relative"
                ref="upload"
                :action="uploadImg"
                :headers="myHeaders"
                :show-file-list="false"
                :on-error="uploadError"
                :on-success="uploadSuccess"
                :auto-upload="true">
                <img class="ml10" src="../assets/images/upload-img.png" alt="">
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
              <el-select v-model="scaleValue" placeholder="">
                  <el-option
                  v-for="(item,index) in companyInfo.scale"
                  :key="index"
                  :label="item+$t('account.people')"
                  :value="index">
                </el-option>
              </el-select>
            </div>
            <div class="inline-input">
              <span>{{$t('account.currency')}}</span>
              <el-input v-model="companyForm.currency" placeholder="" disabled></el-input>
            </div>
          </div>
          <div class="flex">
            <p style="width: 550px;"></p>
            <p class="fz14 color-666">{{$t('account.cannot-change-tips')}}</p>
          </div>
          <p class="save-btn cursor mt80" @click="saveCompanyInfo">{{$t('account.save')}}</p>
          <p class="fz14 color-333 text-center">
            {{$t('account.save-tips1')}}
            <br /> {{$t('account.save-tips2')}}
          </p>
        </div>
      </div>
      <div v-if="active == 3">
        <h2 v-if="lang == 'zh'">账户信息</h2>
        <div class="account-form" v-if="companyForm.currency != 'CNY'">
          <div class="flex-between mt30 item-center">
            <span class="fz16 color-333">Account Name</span>
            <el-input v-model="bankForm.bank_info0" :placeholder="$t('account.same-company-name')"></el-input>
          </div>
          <div class="flex-between mt30 item-center">
            <span class="fz16 color-333">Bank Name</span>
            <el-input v-model="bankForm.bank_info1"></el-input>
          </div>
          <div class="flex-between mt30 item-center">
            <span class="fz16 color-333">BSB Number</span>
            <el-input v-model="bankForm.bank_info2"></el-input>
          </div>
          <div class="flex-between mt30 item-center">
            <span class="fz16 color-333">Account Number</span>
            <el-input v-model="bankForm.bank_info3"></el-input>
          </div>
          <p class="save-btn cursor mt80" @click="saveBankInfo">{{$t('account.save')}}</p>
          <p class="fz14 color-333 text-center">
               {{$t('account.save-tips1')}}
            <br /> {{$t('account.save-tips2')}}
          </p>
        </div>
        <div class="account-form" v-if="companyForm.currency == 'CNY'">
          <div class="flex-between mt30 item-center">
            <span class="fz16 color-333">{{$t('wallet.bank-name')}}</span>
            <el-input v-model="bankForm.bank_info0" :placeholder="$t('account.same-company-name')"></el-input>
          </div>
          <div class="flex-between mt30 item-center">
            <span class="fz16 color-333">{{$t('wallet.account-name2')}}</span>
            <el-input v-model="bankForm.bank_info1"></el-input>
          </div>
          <div class="flex-between mt30 item-center">
            <span class="fz16 color-333">{{$t('wallet.account-address')}}</span>
            <el-input v-model="bankForm.bank_info2"></el-input>
          </div>
          <div class="flex-between mt30 item-center">
            <span class="fz16 color-333">{{$t('wallet.account-number')}}</span>
            <el-input v-model="bankForm.bank_info3"></el-input>
          </div>
          <p class="save-btn cursor mt80" @click="saveBankInfo">{{$t('account.save')}}</p>
          <p class="fz14 color-333 text-center">
               {{$t('account.save-tips1')}}
            <br /> {{$t('account.save-tips2')}}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapMutations } from "vuex";
import { areaCodeList } from "../assets/js/areaCode";
export default {
  name: "account",
  data() {
    return {
      active: 1,
      clientInfo: "",
      areaCode: [],
      nofityEmails: [],
      country_id: "",
      cities: [],
      province: "",
      fileList: [],
      imageUrl: '',
      scaleValue: '',
      companyInfo: {},
      clientForm: {
        area_code: "",
        mobile: "",
        email: "",
        nitify_email: [],
        change_pwd: 0,
        old_pwd: "",
        password: "",
        password_confirmation: ""
      },
      companyForm: {
        company_name: "",
        address: "",
        city_id: "",
        postcode: "",
        business_reg_no: "",
        reg_img_id: "",
        scale: '',
        currency: "",
        tax_no: ""
      },
      bankForm: {
        bank_info0: "",
        bank_info1: "",
        bank_info2: "",
        bank_info3: ""
      },
      myHeaders: {Authorization: ''},
      setHeadimg: '',
      uploadImg: '',
      reg_img_path: ''
    };
  },
  computed: {
    ...mapState({
       lang: state => state.lang,
       userInfo: "userInfo",
    })
  },
  inject: ["reload"],
  mounted() {
    this.imageUrl = this.userInfo ? this.userInfo.img : '';
    this.getClientInfo();
    this.getCompanyInfo();
    this.areaCode = areaCodeList(this.$t('m.china'), this.$t('m.australia'), this.$t('m.new-zealand'), this.$t('m.hong-kong'));

    // this.uploadImg = `http://client.skycar-ride.com/${this.lang}/upload-img`;
    // this.setHeadimg = `http://client.skycar-ride.com/${this.lang}/client/set-headimg`;
    this.uploadImg = `http://client.hi-transfer.com/${this.lang}/upload-img`;
    this.setHeadimg = `http://client.hi-transfer.com/${this.lang}/client/set-headimg`;
    this.myHeaders.Authorization = this.$cookie.get('access_token');
  },
  methods: {
    ...mapMutations({
      setUserInfo: 'SET_USER_INFO',
    }),
    handleAvatarSuccess(res, file) {
        if (res.status == 1) {
           this.imageUrl = URL.createObjectURL(file.raw);
           this.userInfo.img = this.imageUrl;
           this.setUserInfo(this.userInfo)
        }else {
          this.$message.warning(res.message);
        }
    },
    swichType(type) {
      this.active = type;
      if (type == 3) {
        this.getBankInfo();
      } else if (type == 2) {
        this.getCompanyInfo();
      }
    },
    getClientInfo() {
      this.$axios.get(this.lang+"/client/info").then(res => {
        this.clientInfo = res.data.data;
        this.clientForm.area_code = res.data.data.area_code;
        this.clientForm.mobile = res.data.data.mobile;
        this.clientForm.email = res.data.data.email;
        
        if (res.data.data.nitify_email) {
          if (res.data.data.nitify_email.length == 1 && res.data.data.nitify_email[0]) {
            this.clientForm.nitify_email = res.data.data.nitify_email;
            this.nofityEmails = res.data.data.nitify_email;
          }
        }
      });
    },
    deleteNofityEmail(index) {
      this.nofityEmails.splice(index, 1);
    },
    getCompanyInfo() {
      this.$axios.get(this.lang+"/client/company").then(res => {
        let info = res.data.data.info;
        this.companyInfo = res.data.data;

        this.companyForm.company_name = info.company_name;
        this.companyForm.address = info.address;
        this.companyForm.postcode = info.postcode;
        this.companyForm.business_reg_no = info.business_reg_no;
        this.companyForm.reg_img_id = info.reg_img_id;
        this.companyForm.currency = info.currency;
        this.companyForm.tax_no = info.tax_no;
        this.reg_img_path = info.reg_img_path;
     
        this.getCity(info.country_id, info.city_id);

        this.companyForm.scale = info.scale;
        this.scaleValue = info.scale_text + this.$t('account.people');
        this.country_id = info.country_id;
      });
    },
    getBankInfo() {
      this.$axios.get(this.lang+"/client/bank").then(res => {
        this.bankInfo = res.data;

        this.bankForm.bank_info0 = res.data.data.account_name || res.data.data[0];
        this.bankForm.bank_info1 = res.data.data.bank_name || res.data.data[1];
        this.bankForm.bank_info2 = res.data.data.bsb || res.data.data[2];
        this.bankForm.bank_info3 = res.data.data.account_no || res.data.data[3];
      });
    },
    getCity(value, city_id) {
      let _this = this;
      _this.cities = "";

      this.$axios.get(this.lang+"/tools/country-city?id=" + value).then(rsp => {
        _this.cities = rsp.data.data;
        _this.companyForm.city_id = city_id;
        _this.getProvince(city_id);
      });
    },
    getProvince(value) {
      let nowCity = this.cities.filter(item => item.id == value);
      this.province = nowCity[0].state;
    },
    uploadSuccess(response, file, list) {
      this.fileList = [list[list.length-1]];

      if (response.status == 1) {
        this.companyForm.reg_img_id = response.data.id;
        this.reg_img_path = response.data.link;
      }else {
        this.$message.error(response.message);
      }  
    },
    uploadError(err,file) {
       this.$message.error(this.$t('account.upload-error'));
    },
    addEmail() {
      if (this.nofityEmails.length < 10 - this.clientForm.nitify_email.length) {
        this.nofityEmails.push("");
      } else {
        this.$message.warning(this.$t('account.add-up'));
      }
    },

    isEmail(value) {
      let reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
      if (value) {
        if (!reg.test(value)) {
          this.$message.warning(this.$t('yz.email-error'));
          return false;
        } else {
          return true;
        }
      }
    },
    saveClientInfo() {
      let _this = this,
        paramet = {};
      if (!this.clientForm.area_code) {
        this.$message.warning(this.$t('yz.null-area-code'));
        return;
      } else if (!this.clientForm.mobile) {
        this.$message.warning(this.$t('yz.null-phone'));
        return;
      }
      paramet = {
        area_code: this.clientForm.area_code,
        mobile: this.clientForm.mobile,
        change_pwd: this.clientForm.change_pwd
      };
      if (this.nofityEmails.length == 0) {
        paramet[`notify_email[0]`] = '';
      }
     
      for (let i = 0; i < this.nofityEmails.length; i++) {
        if (_this.nofityEmails[i]) {
           if (this.isEmail(_this.nofityEmails[i])) {
            paramet[`notify_email[${i}]`] = _this.nofityEmails[i];
          } else {
            return;
          }
        }else {
          if (this.nofityEmails.length == 1) {
            paramet[`notify_email[${i}]`] = '';
          }
        }
      }

      if (paramet.change_pwd == 1) {
        if (!this.clientForm.old_pwd) {
          this.$message.warning(this.$t('account.verify-password-pl'));
          return;
        } else if (!this.clientForm.password) {
          this.$message.warning(this.$t('account.new-password-pl'));
          return;
        } else if (!this.clientForm.password_confirmation) {
          this.$message.warning(this.$t('account.confirm-password-pl'));
          return;
        } else if (
          this.clientForm.password != this.clientForm.password_confirmation
        ) {
          this.$message.warning(this.$t('account.new-password-error'));
          return;
        }
        paramet.old_pwd = this.clientForm.old_pwd;
        paramet.password = this.clientForm.password;
        paramet.password_confirmation = this.clientForm.password_confirmation;
      }
      this.$axios.post(this.lang+"/client/info", paramet).then(res => {
        if (paramet.change_pwd == 1) {
          _this.$cookie.remove('access_token');
          _this.$router.push({ 'path': '/index/user', 'query': {type: 'login'}})
          _this.reload()
        }else {
           _this.$message.success(this.$t('account.save-success'));
           _this.getClientInfo();
        }
      });
    },

    saveCompanyInfo() {
        let _this = this;
        
      if (!this.companyForm.company_name) {
        this.$message.error(this.$t('yz.null-company-name'));
        return;
      }else if (!this.companyForm.address) {
        this.$message.error(this.$t('yz.null-company-address'));
        return;
      }else if (!this.companyForm.city_id) {
        this.$message.error(this.$t('m.select-cities'));
        return;
      }else if (!this.companyForm.postcode) {
        this.$message.error(this.$t('yz.null-postcode'));
        return;
      }else if (!this.companyForm.business_reg_no) {
        this.$message.error(this.$t('yz.null-business-reg'));
        return;
      }else if(!this.companyForm.scale) {
        this.$message.error(this.$t('yz.null-agency-size'));
        return;
      }else if(!this.companyForm.currency) {
        this.$message.error(this.$t('yz.null-currency'));
        return;
      }else if (!this.companyForm.reg_img_id) {
        this.$message.error(this.$t('yz.null-img'));
        return;
      }
      
      this.scaleValue.length == 1 ? this.companyForm.scale : '';
      this.$axios.post(this.lang+'/client/company', this.companyForm).then(res => {
         _this.$message.success(this.$t('account.save-success'));  
      })
    },

    saveBankInfo() {
      let _this = this, params = {};
      if (!this.bankForm.bank_info0) {
        this.$message.warning(this.$t('yz.null-account-name'));
        return;
      } else if (!this.bankForm.bank_info1) {
        this.$message.warning(this.$t('yz.null-bank'));
        return;
      } else if (!this.bankForm.bank_info2) {
        this.$message.warning(this.$t('yz.null-bsb'));
        return;
      } else if (!this.bankForm.bank_info3) {
        this.$message.warning(this.$t('yz.null-acount-number'));
        return;
      }

      params[`bank_info[account_name]`] = this.bankForm.bank_info0;
      params[`bank_info[bank_name]`] = this.bankForm.bank_info1;
      params[`bank_info[bsb]`] = this.bankForm.bank_info2;
      params[`bank_info[account_no]`] = this.bankForm.bank_info3;

      this.$axios.post(this.lang+"/client/bank", params).then(res => {
        _this.$message.success(this.$t('account.save-success'));
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.account {
  width: 1200px;
  margin: 30px auto;
  .left-account {
    width: 280px;
    text-align: center;
    margin-top: 20px;
  }

   .upload-abn {
    .abn {
      margin-left: 172px;
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
  
  .head-img {
    text-align: center;
      .avatar {
        height: 100px;
        width: 100px;
        border-radius: 100%;
      }

     .zh-w {
        width: 100px;
     }
     .en-w {
        width: 150px;
     }
    div {
      margin: 5px auto 0 auto;
      height: 22px;
      line-height: 22px;
      font-size: 16px;
    }
    .yellow {
      color: #f9bd4f;
      border: 1px solid rgba(249, 189, 79, 1);
    }
    .green {
      color: #38846a;
      border: 1px solid #38846a;
    }
    .red {
      color: #f1604f;
      border: 1px solid #f1604f;
    }
  }

  .btn {
    margin-top: 65px;
    p {
      width: 150px;
      height: 34px;
      line-height: 34px;
      margin: 40px auto;
      cursor: pointer;
      font-size: 16px;
    }
    .active {
      border-radius: 17px;
      background: linear-gradient(#328c6e, #4b9d63);
      color: #fff;
    }
    span {
      position: relative;
      top: -6px;
    }
  }
  .right-account {
    width: 900px;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);
    border-radius: 2px;
    min-height: 780px;
    padding: 20px 40px;
    h2 {
      font-size: 26px;
      font-weight: normal;
      margin: 0;
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
    .form {
      .flex-between span,
      .flex span {
        display: inline-block;
        width: 180px;
        text-align: right;
      }
      .el-input {
        margin-left: 30px;
      }
      .inline-input {
        span {
          width: 145px;
        }
        .el-select .el-input__inner {
          width: 240px !important;
        }
        .el-input,
        .el-select {
          width: 240px;
          margin-left: 26px;
          display: inline-block;
        }
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
  }

  /deep/ {
    .el-upload {
      cursor: pointer;
      position: relative;
      right: 2px !important;
    }
    .el-input__inner:focus {
        border: 1px solid #4B9D63;
    }
    .tel .el-select .el-input {
      width: 100px;
    }
    .input-with-select .el-input-group__prepend {
      background-color: #fff;
    }
     .upload .el-input__inner,
    .el-input-group__prepend {
      border-top-right-radius: 0 !important;
      border-bottom-right-radius: 0 !important;
    }
    .upload-demo .el-button {
      border-top-left-radius: 0 !important;
      border-bottom-left-radius: 0 !important;
      border-left: 0;
      height: 40px;
    }

    .upload-demo .el-upload-list {
      position: absolute;
      top: 30px;
    }
  }
}
</style>


