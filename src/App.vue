<template>
  <v-app id="app" class="tw-h-screen" data-app>
    <v-container class="tw-p-0 tw-h-full">
      <div
        class="tw-grid md:tw-grid-cols-2 md:tw-gap-4 tw-grid-cols-1
        tw-grid-rows-auto tw-w-full tw-h-full tw-max-h-screen tw-auto-rows-fr"
      >
        <div class="tw-col-span-1 tw-self-center">
          <div class="tw-aspect-w-1 tw-aspect-h-1 tw-w-full tw-shadow">
            <v-badge
              color="pink"
              class="tw-text-white"
              :content="$t('app.beta')"
              :model-value="true"
              offset-x="90"
              offset-y="28"
            >
              <Canvas ref="canvas" />
            </v-badge>
          </div>
        </div>
        <div class="tw-col-span-1">
          <Tabs
            class="tw-h-full tw-max-h-screen tw-flex tw-flex-col"
            @rerender="$refs.canvas.rerender($event)"
            @setback="$refs.canvas.setBack($event)"
            @setflag="$refs.canvas.setFlag($event)"
            @seteye="$refs.canvas.setEye($event)"
            @addaccessory="$refs.canvas.addAccessory($event)"
            @setstroke="$refs.canvas.setStroke($event)"
            @createtextfield="$refs.canvas.createTextField($event)"
            @seteyesposition="$refs.canvas.setEyesPosition($event)"
            @custom="openCustomDialog($event)"
          />
        </div>
      </div>
    </v-container>
    <v-fab-transition>
      <v-btn
        v-if="selected"
        icon
        fixed
        left
        bottom
        color="red darken-1"
        class="tw-fixed tw-bottom-[20px] text-white"
        @click="$refs.canvas.deleteAccessories()"
      >
        <v-icon color="white">
          {{ mdiDelete }}
        </v-icon>
      </v-btn>
    </v-fab-transition>
      <v-btn
        icon
        right
        bottom
        fixed
        color="#5567EC"
        class="tw-fixed tw-bottom-[40px] text-white"
        @click="$refs.canvas.downloadImage(), randomShowInerstitital()"
      >
        <v-icon>{{ mdiDownload }}</v-icon>
      </v-btn>
      <v-btn
        icon
        right
        bottom
        fixed
        color="#5567EC"
        class="tw-fixed tw-bottom-[20px] text-white"
        @click="$refs.canvas.shareImage(), randomShowInerstitital()"
      >
        <v-icon>{{ mdiShareVariant }}</v-icon>
      </v-btn>
    <v-dialog
      max-width="600"
      v-model="customDialog"
      @click:outside="updatePhoto(), $refs.customDialog && $refs.customDialog.stopCameraStream()"
    >
      <CustomImage
        ref="customDialog"
        :type="customType"
        @setflag="$refs.canvas.setFlag($event)"
        @setback="$refs.canvas.setBack($event)"
        @closeDialog="customDialog=false, updatePhoto(), $refs.customDialog && $refs.customDialog.stopCameraStream()"
      />
    </v-dialog>
    <v-dialog v-model="dialog" max-width="400" scrollable>
      <v-card>
        <v-card-title>{{ $t('poster.title') }}</v-card-title>
        <v-card-text v-html="$t('poster.text')" />
        <v-card-actions>
          <v-spacer />
          <v-btn text color="success" @click="dialog = false">
            {{ $t('poster.action') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-snackbar
      v-model="snackbar.active"
      top
    >
      {{ snackbar.text }}

      <template v-slot:action="{ attrs }">
        <v-btn
          v-bind="attrs"
          :color="snackbar.status"
          text
          @click="snackbar.active = false"
        >
          {{ $t('app.close') }}
        </v-btn>
      </template>
    </v-snackbar>
  </v-app>
</template>

<script>
import { mdiClose, mdiContentSave, mdiDownload, mdiShareVariant, mdiDelete, mdiOpenInNew } from '@mdi/js'
import Tabs from '@/components/Tabs'
import CustomImage from '@/components/CustomImage'
import Canvas from '@/components/Canvas'
import { mapState } from 'vuex'
import { AdMob, InterstitialAdPluginEvents, BannerAdSize, BannerAdPosition, BannerAdPluginEvents } from '@capacitor-community/admob'
import { Storage } from '@capacitor/storage'

export default {
  name: 'App',
  components: {
    Tabs,
    Canvas,
    CustomImage,
  },
  data() {
    return {
      fab: false,
      dialog: false,
      agree: false,
      snackbar: {
        active: false,
        text: '',
        status: ''
      },
      customDialog: false,
      customType: '',

      mdiClose,
      mdiContentSave,
      mdiDownload,
      mdiShareVariant,
      mdiDelete,
      mdiOpenInNew
    }
  },
  computed: {
    ...mapState({
      selected: state => state.selected.active
    })
  },
  async created () {
    this.$store.watch(state => state.snackbar.text, () => {
      const msg = this.$store.state.snackbar.text
      if (msg !== '') {
        this.snackbar.active = true
        this.snackbar.text = this.$store.state.snackbar.text
        this.snackbar.status = this.$store.state.snackbar.status
        this.$store.commit('setSnackbar', { text: '' })
      }
    })
    const cookieLanguage = (await Storage.get({ key: 'language' })).value
    if (cookieLanguage) {
      this.$root.$i18n.locale = cookieLanguage
    }
  },
  mounted() {
    setTimeout(this.showInterstitial, 15000)
    AdMob.addListener(InterstitialAdPluginEvents.Loaded, (info) => {
      console.log('prepared')
    })
    AdMob.addListener(BannerAdPluginEvents.Loaded, (info) => {
      this.showBanner()
    })
  },
  methods: {
    log(...data) {
      console.log('data:', ...data)
    },
    saveAgreement() {
      Storage.set({ key: 'privacy', value: 'true' })
    },
    randomShowInerstitital() {
      Math.random() > 0.6 && this.showInterstitial()
    },
    showInterstitial() {
      const options = {
        adId: 'ca-app-pub-6875602682263539/7868651203',
      }
      AdMob.prepareInterstitial(options).then(() => {
        AdMob.showInterstitial()
      })
    },
    showBanner() {
      const options = {
        adId: 'ca-app-pub-6875602682263539/5091811600',
        adSize: BannerAdSize.ADAPTIVE_BANNER,
        position: BannerAdPosition.BOTTOM_CENTER,
      }
      AdMob.showBanner(options)
    },
    openCustomDialog(type) {
      this.customType = type
      this.customDialog = true
    },
    updatePhoto() {
      return null
    }
  },
}
</script>

<style>
.layout {
  padding: 0 0px;
  height: 100vh;
}

@media (min-width: 575.98px) {
  .layout {
    padding: 0 calc(50% - 270px);
  }
}

@media (min-width: 767.98px) {
  .layout {
    padding: 0 calc(50% - 360px);
  }
}

@media (min-width: 991.98px) {
  .layout {
    padding: 0 calc(50% - 480px);
  }
}

@media (min-width: 1199.98px) {
  .layout {
    padding: 0 calc(50% - 590px);
  }
}
</style>
