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
              :content="$t('app.alpha')"
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
            @setbg="log($event), $refs.canvas.setBg($event)"
            @setflag="log($event), $refs.canvas.setFlag($event)"
            @seteye="log($event), $refs.canvas.setEye($event)"
            @addaccessory="log($event), $refs.canvas.addAccessory($event)"
          />
        </div>
      </div>
    </v-container>
    <v-fab-transition>
      <v-btn
        v-if="selected"
        fab
        fixed
        left
        bottom
        color="red darken-1"
        @click="$refs.canvas.deleteAccessories()"
      >
        <v-icon color="white">
          {{ mdiDelete }}
        </v-icon>
      </v-btn>
    </v-fab-transition>
    <v-speed-dial
      v-model="fab"
      right
      bottom
      fixed
      direction="top"
      transition="slide-y-reverse-transition"
    >
      <template v-slot:activator>
        <v-btn v-model="fab" color="primary" fab>
          <v-icon v-if="fab">
            {{ mdiClose }}
          </v-icon>
          <v-icon v-else>
            {{ mdiContentSave }}
          </v-icon>
        </v-btn>
      </template>
      <v-btn
        fab
        dark
        small
        color="light-green lighten-1"
        @click="$refs.canvas.downloadImage(), randomShowInerstitital()"
      >
        <v-icon>{{ mdiDownload }}</v-icon>
      </v-btn>
      <v-btn
        fab
        dark
        small
        color="indigo lighten-1"
        @click="$refs.canvas.shareImage(), randomShowInerstitital()"
      >
        <v-icon>{{ mdiShareVariant }}</v-icon>
      </v-btn>
    </v-speed-dial>
    <v-dialog v-model="dialog" max-width="400" scrollable>
      <v-card>
        <v-card-title>{{ $t('poster.title') }}</v-card-title>
        <v-card-text v-html="$t('poster.text')" />
        <v-card-actions>
          <v-btn
            text
            href="https://drive.google.com/file/d/1xfQT3GeHURunc-CQmO_2SXM4ZYSJ5df0/view?usp=sharing"
          >
            Privacy policy
          </v-btn>
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
          :color="snackbar.status"
          text
          v-bind="attrs"
          @click="snackbar.active = false"
        >
          {{ $t('app.close') }}
        </v-btn>
      </template>
    </v-snackbar>
  </v-app>
</template>

<script>
import { mdiClose, mdiContentSave, mdiDownload, mdiShareVariant, mdiDelete } from '@mdi/js'
import Tabs from '@/components/Tabs'
import Canvas from '@/components/Canvas'
import { mapState } from 'vuex'
import { AdMob, InterstitialAdPluginEvents } from '@capacitor-community/admob'

export default {
  name: 'App',
  components: {
    Tabs,
    Canvas,
  },
  data() {
    return {
      fab: false,
      dialog: true,
      snackbar: {
        active: false,
        text: '',
        status: ''
      },
      mdiClose,
      mdiContentSave,
      mdiDownload,
      mdiShareVariant,
      mdiDelete
    }
  },
  computed: {
    ...mapState({
      selected: state => state.selected.active
    })
  },
  created () {
    this.$store.watch(state => state.snackbar.text, () => {
      const msg = this.$store.state.snackbar.text
      if (msg !== '') {
        this.snackbar.active = true
        this.snackbar.text = this.$store.state.snackbar.text
        this.snackbar.status = this.$store.state.snackbar.status
        this.$store.commit('setSnackbar', { text: '' })
      }
    })
  },
  mounted() {
    setTimeout(this.showInterstitial, 15000)
    AdMob.addListener(InterstitialAdPluginEvents.Loaded, (info) => {
      console.log('prepared')
    })
  },
  methods: {
    log(...data) {
      console.log('data:', ...data)
    },
    randomShowInerstitital() {
      Math.random() > 0.6 && this.showInterstitial()
    },
    showInterstitial() {
      const options = {
        adId: 'ca-app-pub-6875602682263539/7868651203',
        // adId: 'ca-app-pub-3940256099942544/1033173712',
      }
      AdMob.prepareInterstitial(options).then(() => {
        AdMob.showInterstitial()
      })
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
