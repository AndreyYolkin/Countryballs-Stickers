<template>
  <v-card>
    <v-card-text class="overflow-y-hidden dialog__list">
      <Cropper
        v-if="showCropper && !isCamera"
        ref="cropper"
        :src="image"
        :auto-zoom="true"
        :transitions="true"
        :stencil-props="{
          aspectRatio: 3/4,
          minAspectRatio:3/4,
          maxAspectRatio:9/16,
          resizable: true,
          class: 'cropper-stencil cropper-stencil--dragging',
          previewClass: 'cropper-stencil__preview',
          handlersClasses: {
            default: 'cropper-handler',
            eastNorth: 'cropper-handler--east-north',
            westNorth: 'cropper-handler--west-north',
            eastSouth: 'cropper-handler--east-south',
            westSouth: 'cropper-handler--west-south',
          },
          handlersWrappersClasses: {
            default: 'cropper-handler-wrapper',
            eastNorth: 'cropper-handler-wrapper--east-north',
            westNorth: 'cropper-handler-wrapper--west-north',
            eastSouth: 'cropper-handler-wrapper--east-south',
            westSouth: 'cropper-handler-wrapper--west-south',
          },
        }"
        @change="onChange"
      />
      <v-container v-if="isCamera">
        <v-row align="center" justify="center">
          <v-col cols="auto">
            <video
              v-show="!isPhotoTaken"
              id="camVideo"
              ref="camera"
              :width="640"
              :height="480"
              autoplay
            />
            <canvas
              v-show="isPhotoTaken"
              ref="canvas"
              :width="640"
              :height="480"
            />
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>
    <v-card-actions v-if="isCamera">
      <v-btn color="secondary" text @click="toggleCamera()">
        Выключить камеру
      </v-btn>
      <v-spacer v-if="!isPhotoTaken" />
      <v-btn v-if="!isPhotoTaken" color="success" text @click="takePhoto">
        Сделать фото
      </v-btn>
      <v-spacer v-if="isPhotoTaken" />
      <v-btn
        v-if="isPhotoTaken"
        color="primary"
        text
        @click="isPhotoTaken =! isPhotoTaken"
      >
        Сбросить
      </v-btn>
      <v-spacer v-if="isPhotoTaken" />
      <v-btn v-if="isPhotoTaken" color="success" text @click="acceptPhoto()">
        Продолжить
      </v-btn>
    </v-card-actions>
    <v-card-actions v-if="!isCamera">
      <v-btn color="primary" text @click="$refs.file.click()">
        Загрузить
      </v-btn>
      <input
        ref="file"
        class="tw-hidden"
        type="file"
        accept="image/*"
        @change="loadImage($event)"
      >
      <Confirm
        text="Вы действительно хотите удалить фото?"
        confirm-text="Удалить"
        confirm-color="remove white--text"
        @confirm="deleteImage()"
      >
        <v-btn color="remove" text>
          Удалить фото
        </v-btn>
      </Confirm>
      <v-spacer />
      <v-btn color="primary" text @click="$emit('closeDialog')">
        Закрыть
      </v-btn>
      <v-btn color="success" text @click="uploadImage()">
        Сохранить
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { Cropper } from 'vue-advanced-cropper'
import { mapActions, mapMutations } from 'vuex'
import 'vue-advanced-cropper/dist/style.css'
import Confirm from './Confirm.vue'

export default {
  components: {
    Cropper,
    Confirm,
  },
  props: {
    type: {
      type: String,
      default: ''
    },
  },
  data: () => ({
    coordinates: {},
    image: null,
    croppedImage: null,
    showCropper: false,
    isCamera: false,
    isPhotoTaken: false,
  }),
  computed: {
    touch() {
      return matchMedia('(hover: none), (pointer: coarse)').matches
    }
  },
  watch: {
    openhash: {
      immediate: true,
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
    ...mapMutations({
      $setSnackbar: 'setSnackbar',
    }),
    ...mapActions({
      $uploadImage: 'people/uploadImage',
    }),
    getImage () {
      // let temp_image = null
      // const reader = new FileReader()
      /* this.$getPersonPhoto(this.person.id)
        .then(response => {
          temp_image = response.data
          reader.readAsDataURL(temp_image)
          reader.onload = e => {
            this.$set(this, 'image', e.target.result)
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
        this.$setSnackbar({ text: 'Ошибка: браузер не разрешает пользоваться камерой', status: 'error' })
        return
      }

      navigator.mediaDevices &&
      navigator.mediaDevices
        .getUserMedia(constraints)
        .then(stream => {
          this.$refs.camera.srcObject = stream
        }).catch((err) => {
          console.log(err) /* handle the error */
          if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
            this.$setSnackbar({ text: 'Возможно не подключена камера', status: 'error' })
          } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
            this.$setSnackbar({ text: 'Возможно камера используется в другом приложении', status: 'error' })
          } else if (err.name === 'OverconstrainedError' || err.name === 'ConstraintNotSatisfiedError') {
            this.$setSnackbar({ text: 'Ошибка камеры', status: 'error' })
          } else if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
            this.$setSnackbar({ text: 'Разрешите использовать камеру', status: 'error' })
          } else if (err.name === 'TypeError' || err.name === 'TypeError') {
            this.$setSnackbar({ text: 'Ошибка камеры', status: 'error' })
          } else {
            this.$setSnackbar({ text: 'Ошибка камеры', status: 'error' })
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
.cropper {
  &__image {
    opacity: 0.3;
  }
}

.cropper-stencil {
  &__preview {
    &:after,
    &:before {
      content: "";
      opacity: 0;
      transition: opacity 0.25s;
      position: absolute;
      pointer-events: none;
      z-index: 1;
    }

    &:after {
      border-left: solid 1px white;
      border-right: solid 1px white;
      width: 33%;
      height: 100%;
      transform: translateX(-50%);
      left: 50%;
      top: 0;
    }

    &:before {
      border-top: solid 1px white;
      border-bottom: solid 1px white;
      height: 33%;
      width: 100%;
      transform: translateY(-50%);
      top: 50%;
      left: 0;
    }
  }

  &--dragging {
    .cropper-stencil__preview {
      &:after,
      &:before {
        opacity: 1;
      }
    }
  }
}

.cropper-line {
  border-color: rgba(white, 1);
}

.cropper-handler-wrapper {
  width: 24px;
  height: 24px;
  &--west-north {
    transform: translate(0, 0);
  }
  &--east-south {
    transform: translate(-100%, -100%);
  }
  &--west-south {
    transform: translate(0, -100%);
  }
  &--east-north {
    transform: translate(-100%, 0);
  }
}

.cropper-handler {
  display: block;
  position: relative;
  flex-shrink: 0;
  transition: opacity 0.5s;
  border: none;
  background: white;
  height: 4px;
  width: 4px;
  opacity: 0;
  top: auto;
  left: auto;

  &--west-north,
  &--east-south,
  &--west-south,
  &--east-north {
    display: block;
    height: 16px;
    width: 16px;
    background: none;
    opacity: 0.7;
  }

  &--west-north {
    border-left: solid 2px white;
    border-top: solid 2px white;
  }

  &--east-south {
    border-right: solid 2px white;
    border-bottom: solid 2px white;
  }

  &--west-south {
    border-left: solid 2px white;
    border-bottom: solid 2px white;
  }

  &--east-north {
    border-right: solid 2px white;
    border-top: solid 2px white;
  }

  &--hover {
    opacity: 1;
  }
}
</style>
