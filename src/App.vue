<template>
  <div>
    <main>
      <div class="max-w-7xl mx-auto sm:px-6 lg:px-8 bg-gray-100">
        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="bg-gray-50 overflow-hidden sm:rounded-lg">
            <div class="px-4 py-5 sm:p-6">
              <div class="px-4 py-5 sm:p-6 max-w-md items-center mx-auto">
                <qrcode-stream
                  :camera="camera"
                  @decode="onDecode"
                  @init="onInit"
                  class="border-solid border-8 border-green-500 rounded-lg"
                >
                  <div v-if="validationSuccess" class="validation-success">This is a valid ticket</div>

                  <div
                    v-if="validationFailure"
                    class="validation-failure"
                  >This is NOT a valid ticket!</div>

                  <div v-if="validationPending" class="validation-pending">Validating...</div>
                </qrcode-stream>
              </div>
              <div>
                <p class="decode-result">
                  Last result:
                  <b>{{ result }}</b>
                </p>
                <ul role="list" class="divide-y divide-gray-200">
                  <li v-for="(item, index) in scans" :key="index" class="py-4">{{ item }}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import { QrcodeStream } from 'vue-qrcode-reader'

export default {

  components: { QrcodeStream },

  data() {
    return {
      isValid: undefined,
      camera: 'auto',
      result: null,
      scans: []
    }
  },

  computed: {
    validationPending() {
      return this.isValid === undefined
        && this.camera === 'off'
    },

    validationSuccess() {
      return this.isValid === true
    },

    validationFailure() {
      return this.isValid === false
    }
  },

  methods: {

    onInit(promise) {
      promise
        .catch(console.error)
        .then(this.resetValidationState)
    },

    resetValidationState() {
      this.isValid = undefined
    },

    async onDecode(content) {
      this.result = content
      this.turnCameraOff()

      // pretend it's taking really long
      await this.timeout(1000)
      this.isValid = content.startsWith('T')

      this.scans.push(content)

      // some more delay, so users have time to read the message
      await this.timeout(2000)

      this.turnCameraOn()
    },

    turnCameraOn() {
      this.camera = 'auto'
    },

    turnCameraOff() {
      this.camera = 'off'
    },

    timeout(ms) {
      return new Promise(resolve => {
        window.setTimeout(resolve, ms)
      })
    }
  }
}
</script>

<style scoped>
.validation-success,
.validation-failure,
.validation-pending {
  position: absolute;
  width: 100%;
  height: 100%;

  background-color: rgba(255, 255, 255, 0.8);
  text-align: center;
  font-weight: bold;
  font-size: 1.4rem;
  padding: 10px;

  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
}
.validation-success {
  color: green;
}
.validation-failure {
  color: red;
}
</style>