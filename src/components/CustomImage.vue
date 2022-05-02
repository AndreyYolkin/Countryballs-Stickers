<template>
  <v-card>
    <v-card-actions>
      <v-spacer />
      <v-btn icon @click="$emit('closeDialog')">
        <v-icon>
          {{ mdiClose }}
        </v-icon>
      </v-btn>
    </v-card-actions>
    <v-card-text class="overflow-y-hidden dialog__list">
      <Cropper
        v-if="showCropper && !isCamera"
        ref="cropper"
        :src="image"
        :auto-zoom="true"
        :transitions="true"
        :stencil-component="stencil"
        @change="onChange"
      />
    </v-card-text>
    <v-card-actions>
      <v-btn color="primary" icon @click="$refs.file.click()">
        <v-icon>
          {{ mdiFileUpload }}
        </v-icon>
      </v-btn>
      <input
        ref="file"
        class="tw-hidden"
        type="file"
        accept="image/*"
        @change="loadImage($event)"
      >
      <v-spacer />
      <v-btn color="success" text @click="uploadImage()">
        {{ $t('app.save') }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { Cropper } from 'vue-advanced-cropper'
import { mdiClose, mdiFileUpload } from '@mdi/js'
import 'vue-advanced-cropper/dist/style.css'
import CircleStencil from './CircleStencil.vue'
import SquareStencil from './SquareStencil.vue'
import { useStore } from '../store'

export default {
  components: {
    Cropper
  },
  props: {
    type: {
      type: String,
      default: ''
    },
  },
  setup() {
    const store = useStore()
    return { store }
  },
  data() {
    return ({
      coordinates: {},
      image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAtAAAALQAQMAAACDmdXfAAAAA1BMVEX///+nxBvIAAAAYklEQVR42uzBgQAAAACAoP2pF6kCAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOD24EAAAAAAQJC/9SBXAAAAAEsB//AAASF4jxUAAAAASUVORK5CYII=',
      croppedImage: null,
      showCropper: true,
      isCamera: false,
      isPhotoTaken: false,
      mdiClose,
      mdiFileUpload
    })
  },
  computed: {
    touch() {
      return matchMedia('(hover: none), (pointer: coarse)').matches
    },
    stencil() {
      if (this.type === 'flag') {
        return CircleStencil
      }
      if (this.type === 'back') {
        return SquareStencil
      }
      return undefined
    }
  },
  watch: {
    openhash: {
      handler(newVal, oldVal) {
        this.showCropper = false
        this.getImage()
      },
    }
  },
  // mounted() {
  //   this.getImage()
  // },
  methods: {
    getImage () {
      // let temp_image = null
      // const reader = new FileReader()
      /* this.$getPersonPhoto(this.person.id)
        .then(response => {
          temp_image = response.data
          reader.readAsDataURL(temp_image)
          reader.onload = e => {
            this.image' = e.target.result)
            this.showCropper = true
          }
        }) */
    },
    onChange({ coordinates, canvas, }) {
      this.coordinates = coordinates
      this.croppedImage = canvas.toDataURL()
    },
    loadImage(event) {
      const input = event.target
      if (input.files && input.files[0]) {
        const reader = new FileReader()
        reader.onload = (e) => {
          this.image = e.target.result
          input.value = ''
          const { cropper } = this.$refs
          const center = {
            left: cropper.coordinates.left + cropper.coordinates.width / 2,
            top: cropper.coordinates.top + cropper.coordinates.height / 2,
          }
          cropper.setCoordinates([
            ({ coordinates, imageSize }) => ({
              width: imageSize.width,
              height: imageSize.height,
            }),
            ({ coordinates, imageSize }) => ({
              left: center.left - coordinates.width / 2,
              top: center.top - coordinates.height / 2,
            }),
          ])
        }
        reader.readAsDataURL(input.files[0])
      }
    },
    uploadImage() {
      if (this.type === 'flag') {
        this.$emit('setflag', { url: this.croppedImage })
      }
      if (this.type === 'back') {
        this.$emit('setback', { url: this.croppedImage })
      }
      this.$emit('closeDialog')
    },
    deleteImage() {
      this.$emit('closeDialog')
    },
    createCameraElement() {
      this.isLoading = true

      const constraints = (window.constraints = {
        audio: false,
        video: true
      })

      if (!navigator.mediaDevices) {
        this.toggleCamera()
        this.store.setSnackbar({ text: 'Ошибка: браузер не разрешает пользоваться камерой', status: 'error' })
        return
      }

      navigator.mediaDevices &&
      navigator.mediaDevices
        .getUserMedia(constraints)
        .then(stream => {
          this.$refs.camera.srcObject = stream
        }).catch((err) => {
          console.log(err)
          if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
            this.store.setSnackbar({ text: 'Probably there is no camera', status: 'error' })
          } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
            this.store.setSnackbar({ text: 'Probably camera is used in another app', status: 'error' })
          } else if (err.name === 'OverconstrainedError' || err.name === 'ConstraintNotSatisfiedError') {
            this.store.setSnackbar({ text: 'Camera error', status: 'error' })
          } else if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
            this.store.setSnackbar({ text: 'Please allow to use camera', status: 'error' })
          } else if (err.name === 'TypeError' || err.name === 'TypeError') {
            this.store.setSnackbar({ text: 'Camera error', status: 'error' })
          } else {
            this.store.setSnackbar({ text: 'Camera error', status: 'error' })
          }
          this.toggleCamera()
        })
    },
    stopCameraStream() {
      if (this.$refs.camera && this.$refs.camera.srcObject) {
        const tracks = this.$refs.camera.srcObject.getTracks()
        tracks.forEach(track => {
          track.stop()
        })
      }
      this.isCamera = false
      this.isPhotoTaken = false
    },

    takePhoto() {
      this.isPhotoTaken = !this.isPhotoTaken
      this.$nextTick(() => {
        const context = this.$refs.canvas.getContext('2d')
        context.drawImage(this.$refs.camera, 0, 0, 640, 480)
      })
    },
    acceptPhoto() {
      this.isPhotoTaken = !this.isPhotoTaken
      this.isCamera = false
      this.showCropper = true
      this.image = this.$refs.canvas.toDataURL()
    },
    toggleCamera() {
      if (this.isCamera) {
        this.isCamera = false
        this.isPhotoTaken = false
        this.stopCameraStream()
      } else {
        this.isCamera = true
        this.createCameraElement()
      }
    }
  },
}
</script>

<style lang="scss">
.vue-advanced-cropper {
  max-height: 400px;
}
.cropper {
  &__image {
    opacity: 0.3;
  }
}
.vue-advanced-cropper__background, .vue-advanced-cropper__foreground {
  background: rgb(255, 255, 255);
}
</style>
