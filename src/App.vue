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
              content="alpha version"
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
            @deleteaccessories="log($event), $refs.canvas.deleteAccessories()"
          />
        </div>
      </div>
    </v-container>
    <v-speed-dial
      v-model="fab"
      right
      bottom
      fixed
      direction="top"
      transition="slide-y-reverse-transition"
    >
      <template v-slot:activator>
        <v-btn v-model="fab" color="primary" dark fab>
          <v-icon v-if="fab">
            mdi-close
          </v-icon>
          <v-icon v-else>
            mdi-content-save
          </v-icon>
        </v-btn>
      </template>
      <v-btn
        fab
        dark
        small
        color="green"
        @click="$refs.canvas.saveImage()"
      >
        <v-icon>mdi-download</v-icon>
      </v-btn>
      <v-btn
        fab
        dark
        small
        color="blue darken-3"
        @click="$refs.canvas.shareImage()"
      >
        <v-icon>mdi-share-variant</v-icon>
      </v-btn>
    </v-speed-dial>
    <v-dialog v-model="dialog" max-width="400" scrollable>
      <v-card>
        <v-card-title> This is the alpha version </v-card-title>
        <v-card-text>
          Yes, it's happenning. After 3 years I found a time to deal with this
          application. This is the <b>first public version</b> with base
          mechanics, like selecting countries, eyes, accessories and saving them
          all.
          <br>
          <br>
          There are a lot of things I need to implement, so I will be glad,
          if you write me on e-mail listed in google play and give any usefull feedback.
          Also if you can draw really beatiful accessories, write me too:)
        </v-card-text>
        <v-card-actions>
          <v-btn text color="success" @click="dialog = false">
            Let's go!
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script>
import Tabs from '@/components/Tabs'
import Canvas from '@/components/Canvas'
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
    }
  },
  mounted() {
    setTimeout(this.showInterstitial, 15000)
  },
  methods: {
    log(...data) {
      console.log('data:', ...data)
    },
    showInterstitial() {
      AdMob.addListener(InterstitialAdPluginEvents.Loaded, (info) => {
        console.log('prepared')
      })
      const options = {
        adId: 'ca-app-pub-6875602682263539/7868651203',
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
