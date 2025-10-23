<template>
    <div class="help">
        <img class="help-icon" src="../assets/images/help-icon.jpg" alt="">
        <div class="flex help-content">
            <div class="help-left">
                <p class="en-width" :class="{'active': active == 1}" @click="swichType(1)">{{$t('help.fee-descriptions')}}</p>
                <p class="en-width" :class="{'active': active == 2}" @click="swichType(2)">Privacy Policy</p>
                <!-- <p class="en-width" :class="{'active': active == 3}" @click="swichType(3)">{{$t('help.refund-policay')}}</p> -->
                <p class="en-width" :class="{'active': active == 4}" @click="swichType(4)">{{$t('help.user')}}</p>
                <p class="en-width" :class="{'active': active == 5}" @click="swichType(5)">{{$t('help.about-us')}}</p>
                <p class="en-width" :class="{'active': active == 6}" @click="swichType(6)">{{$t('help.website')}}</p>
            </div>
            <div class="help-right">
                <div class="color-333" v-if="active == 1">
                    <p class="mt30">The services we provide to you are free of charge, but the fees you pay for each service to the relevant third party service provider (including but not limited to cancellations that have been posted on hitransfers software and products due to exceeding the specified time) The cost of the vehicle demand information will be calculated and notified by hitransfers software and products automatically in accordance with the terms of the hitransfers user terms of use. </p>
                    <p class="mt30"> You will pay the service fee directly to the third party service provider through the designated third party payment platform.</p>
                </div>
                <div class="color-333" v-if="active == 2">
                    <p class="mt30 fw600">Personal Information Protection Policy</p>
                    <p class="mt30">Hong Kong Hi Transfers Limited (the "Company") highly values the confidentiality and security of users' personal data. The Company will handle and protect the personal information provided by users in accordance with the Hong Kong Personal Data (Privacy) Ordinance and other relevant legal provisions.</p>
                    <p class="mt30 fw600">1. Data Security Measures</p>
                    <p class="mt30">The Company has implemented strict technical and administrative measures to prevent the theft, loss, leakage, alteration, or unauthorized use of personal data.</p>
                    <p class="mt30 fw600">2. Use of Data and Third-Party Sharing</p>
                    <p class="mt30">To improve services and enhance product features, the Company may provide the collected data to third parties for statistical analysis or use third-party products or services in the course of service provision. Such third parties will only have access to personal data to the extent necessary and are bound by confidentiality agreements with the Company.</p>
                    <p class="mt30 fw600">3. Disclosure Required by Law</p>
                    <p class="mt30">Where required by applicable laws and regulations of the Hong Kong Special Administrative Region, or pursuant to lawful requests from government departments, judicial authorities, or other law enforcement agencies, the Company may be obliged to disclose the data in its possession to the relevant authorities.</p>
                    <p class="mt30 fw600">4. User Rights</p>
                    <p class="mt30">You have the right to access and correct your personal data in accordance with the law. If you have any questions regarding this Policy, please contact the Company for further assistance.</p>
                </div>
                <div class="color-333" v-if="active == 4">
                    <p>{{$t('p.user-tip1')}}</p>
          <p class="fw600">{{$t('p.user-tip2')}}</p>
          <p>{{$t('p.user-tip3')}}</p>
          <p>{{$t('p.user-tip4')}}</p>
          <p>{{$t('p.user-tip5')}}</p>
          <p>{{$t('p.user-tip6')}}</p>
          <p class="fw600">{{$t('p.user-tip7')}}</p>
          <p>{{$t('p.user-tip8')}}</p>
          <p class="fw600">{{$t('p.user-tip9')}}</p>
          <p>{{$t('p.user-tip10')}}</p>
          <p>{{$t('p.user-tip11')}}</p>
          <p>{{$t('p.user-tip12')}}</p>
          <p>{{$t('p.user-tip13')}}</p>
          <p>{{$t('p.user-tip14')}}</p>
          <p>{{$t('p.user-tip15')}}</p>
          <p class="fw600">{{$t('p.user-tip16')}}</p>
          <p>{{$t('p.user-tip17')}}</p>
          <p>{{$t('p.user-tip18')}}</p>
          <p>{{$t('p.user-tip19')}}</p>
          <p>{{$t('p.user-tip20')}}</p>
          <p class="fw600">{{$t('p.user-tip21')}}</p>
          <p>{{$t('p.user-tip22')}}</p>
          <p>{{$t('p.user-tip23')}}</p>
          <p>{{$t('p.user-tip24')}}</p>
          <p class="fw600">{{$t('p.user-tip25')}}</p>
          <p>{{$t('p.user-tip26')}}</p>
          <p>{{$t('p.user-tip27')}}</p>
          <p>{{$t('p.user-tip28')}}</p>
          <p>{{$t('p.user-tip29')}}</p>
          <p>{{$t('p.user-tip30')}}</p>
          <p>{{$t('p.user-tip31')}}</p>
          <p>{{$t('p.user-tip32')}}</p>
          <p>{{$t('p.user-tip33')}}</p>
          <p>{{$t('p.user-tip34')}}</p>
          <p>{{$t('p.user-tip35')}}</p>
          <p class="fw600">{{$t('p.user-tip36')}}</p>
          <p>{{$t('p.user-tip37')}}</p>
          <p>{{$t('p.user-tip38')}}</p>
          <p>{{$t('p.user-tip39')}}</p>
          <p>{{$t('p.user-tip40')}}</p>
          <p class="fw600">{{$t('p.user-tip41')}}</p>
          <p>{{$t('p.user-tip42')}}</p>
          <p>{{$t('p.user-tip43')}}</p>
          <p>{{$t('p.user-tip44')}}</p>
          <p>{{$t('p.user-tip45')}}</p>
          <p>{{$t('p.user-tip46')}}</p>
          <p>{{$t('p.user-tip47')}}</p>
          <p>{{$t('p.user-tip48')}}</p>
          <p>{{$t('p.user-tip49')}}</p>
          <p class="fw600">{{$t('p.user-tip50')}}</p>
          <p>{{$t('p.user-tip51')}}</p>
          <p>{{$t('p.user-tip52')}}</p>
          <p>{{$t('p.user-tip53')}}</p>
          <p class="fw600">{{$t('p.user-tip54')}}</p>
          <p>{{$t('p.user-tip55')}}</p>
          <p>{{$t('p.user-tip56')}}</p>
          <p>{{$t('p.user-tip57')}}</p>
          <p>{{$t('p.user-tip58')}}</p>
          <p>{{$t('p.user-tip59')}}</p>
          <p>{{$t('p.user-tip60')}}</p>
          <p>{{$t('p.user-tip61')}}</p>
          <p>{{$t('p.user-tip62')}}</p>
          <p>{{$t('p.user-tip63')}}</p>
                </div>
                <div class="color-333" v-if="active == 5">
                    <p>Hitransfers is a reliable application that provides transportation orders for drivers worldwide. The transportation services include airport transfer services and chauffeur services. </p>
                    <p class="mt30">Hitransfers is  available in more than 1000 cities worldwide-download the app and make money driving.</p>
                    <p class="mt30 fw600">How to use Hitransfers:</p>
                    <p class="mt30">-Open the app and choose to become a driver</p>
                    <p class="mt30">-Write down the information of your driver license and car details</p>
                    <p class="mt30">-Successfully become the driver of Hitransfers</p>
                    <p class="mt30">-Accept orders and start making money</p>
                </div>
                <div class="color-333" v-if="active == 6">
                    <p class="mt30">By accessing the hitransfers website and registering and using the hitransfers software and products, you agree that this Agreement is governed by the laws of the People's Republic of China and you agree to be subject to the jurisdiction of the courts of the People's Republic of China. The access to the hitransfers website and the disputes arising from the registration, use of the hitransfers software and products or the acceptance of the services shall be settled through negotiation. If the negotiation fails, both parties agree to submit the dispute to the court of competent jurisdiction in China for resolution.</p>
                    <p class="mt30">Changes: We reserve the right to modify or replace the terms and conditions of this Agreement or to change, suspend or terminate the Services at any time. At that time, we only need to entrust the Hong Kong Rocket Travel Company to issue a notice or send a notice through the hitransfers software and product, and the above changes will be effective when the hitransfers website and/or the hitransfers software and products are issued for our notice. If you do not agree to such modification or replacement of this Agreement, you may terminate this Agreement in accordance with Section 8.2 of this Agreement. Your continued use of the hitransfers software and products will be deemed to have been agreed to the above modifications or replacements to this Agreement.</p>
                    <p class="mt30">Text: This Agreement is written in Chinese and English. If the Chinese and English versions are inconsistent, the Chinese version shall prevail.</p>
                    <p class="mt30">Severability: The invalidity and unenforceability of any terms and conditions shall not affect the validity of the other terms and conditions of this Agreement.</p>
                </div>
                <!-- <div v-if="active != 1">暂无数据...</div> -->
            </div>
        </div><br><br><br>
    </div>
</template>
<script>
import { mapState } from "vuex";
export default {
    name: 'help',
    data() {
        return {
            active: 1
        }
    },
    computed: {
    ...mapState({
      lang: state => state.lang
    }),
  },
    methods: {
        swichType(type) {
            this.active = type;
        }
    },
    mounted() {
        if (this.$route.query.active) {
            this.active = this.$route.query.active;
        }else {
            this.active = 1;
        }
        window.scrollTo(0,0);
    }
}
</script>
<style lang="scss" scoped>
    .help {
        .help-icon {
            height: 300px;
            width: 100%;
        }
        .help-content {
            width: 1200px;
            margin: auto;
            .help-left {
                width: 350px;
                margin-top: 15px;
                .zh-width {
                    width: 120px;
                }
                .en-width {
                    width: 220px;
                }
                p {
                    cursor: pointer;
                    font-size: 16px;
                    color: #333333;
                    font-weight: 550;
                    line-height: 34px;
                    height: 34px;
                    text-align: center;
                }
                .active {
                    background: linear-gradient(#328C6E, #4B9D63);
                    color: #fff;
                    border-radius: 17px;
                }
            }
            .help-right {
                width: 850px;
                margin-top: 10px;
                min-height: 720px;
            }
        }
    }
</style>


