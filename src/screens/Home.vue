<template>
  <div class="main-page h-screen flex flex-col justify-center items-center">
    <div class="floating-action text-right pt-6 pr-6">
      <a-button type="ghost" shape="round" @click="setSettingsModalVisible(true)">
        <template #icon>
          <v-icon name="bi-gear-fill" color="#fff"></v-icon>
        </template>
        Settings
      </a-button>
    </div>
    <h2 class="text-3xl font-bold">ShareRoom</h2>
    <img src="../assets/icon.png" class="logo mb-16 mt-4" alt="">
    <div class="actions flex flex-col gap-4">
      <a-button type="primary" shape="round" size="large" @click="modalVisible = true">
        <template #icon>
          <v-icon name="hi-view-grid-add"/>
        </template>
        Create ShareRoom
      </a-button>

      <a-button type="ghost" shape="round" size="large" @click="$router.push('/join-room')">
        <template #icon>
          <v-icon name="bi-ui-checks-grid"/>
        </template>
        Join ShareRoom
      </a-button>
    </div>

    <a-modal
        v-model:visible="modalVisible"
        title="Create ShareRoom"
        width="500px"
        centered
    >
      <a-form
          ref="formRef"
          :model="formState"
          name="room_form"
          layout="vertical"
      >
        <a-form-item
            label="ShareRoom name"
            name="name"
            :rules="[{ required: true, message: 'Please specify a ShareRoom name' }]"
        >
          <a-input placeholder="Enter room name" v-model:value="formState.name"/>
        </a-form-item>

        <a-collapse :bordered="false">
          <a-collapse-panel key="1" header="Advanced">
            <a-form-item
                label="Maximun number of participants"
                name="maxParticipants"
                :rules="[{ required: formState.maxParticipants, message: 'Please specify the maximum connections' }]"
            >
              <a-input v-model:value="formState.maxParticipants"/>
            </a-form-item>
          </a-collapse-panel>
        </a-collapse>
      </a-form>

      <template #footer>
        <a-button @click="modalVisible = false">Close</a-button>
        <a-button type="primary" :loading="loading" @click="createRoom">Create</a-button>
      </template>
    </a-modal>
    <!--  Settings  -->
    <a-modal
        v-model:visible="settingsModalVisible"
        title="Settings"
        width="500px"
        centered
    >
      <a-form
          ref="settingsRef"
          :model="settingsState"
          name="settings"
          layout="vertical"
      >
        <a-form-item
            label="Device name"
            name="name"
            :rules="[{ required: true, message: 'Please specify your device name' }]"
        >
          <a-input placeholder="Enter your device's name" v-model:value="settingsState.name"/>
        </a-form-item>

        <a-form-item
            label="Maximun number of participants"
            name="maxParticipants"
            :rules="[{ required: settingsState.maxParticipants, message: 'Please specify the maximum connections' }]"
        >
          <a-input v-model:value="settingsState.maxParticipants"/>
        </a-form-item>

        <a-form-item
            label="Destination path"
            name="destinationDir"
            :rules="[{ required: settingsState.destinationDir, message: 'Please choose a path' }]"
        >
          <a-input-group compact>
            <a-input readonly v-model:value="settingsState.destinationDir" style="width: calc(100% - 32px)"/>
            <a-tooltip title="Select folder">
              <a-button @click="selectDir">
                <template #icon>
                  <v-icon name="bi-folder"/>
                </template>
              </a-button>
            </a-tooltip>
          </a-input-group>
        </a-form-item>
      </a-form>

      <template #footer>
        <a-button @click="settingsModalVisible = false">Close</a-button>
        <a-button type="primary" :loading="loading" @click="saveSettings">Save</a-button>
      </template>
    </a-modal>
  </div>
</template>

<script lang="ts">
import {defineComponent, reactive, ref, watch} from "vue";
import {FormInstance} from "ant-design-vue";
import {fetchMain} from "../utils/ipc-render";
import {ConfigModel, DeviceModel} from "../models";
import {io} from "socket.io-client";
import {mapMutations} from "vuex";
import {notification} from 'ant-design-vue';

interface FormState {
  name: string;
  maxParticipants: number
}

interface SettingsFormState {
  name: string;
  maxParticipants: number,
  destinationDir: string
}

export default defineComponent({
  setup() {
    const formRef = ref<FormInstance>();
    const settingsRef = ref<FormInstance>();
    return {
      formRef,
      settingsRef,
    };
  },
  data() {
    const deviceInfo: DeviceModel = (this as any).$settings.get('deviceInfo') as DeviceModel;
    const configInfo: ConfigModel = (this as any).$settings.get('config') as ConfigModel;

    const modalVisible = ref<boolean>(false);
    const settingsModalVisible = ref<boolean>(false);

    const setModalVisible = (visible: boolean) => {
      modalVisible.value = visible;
    };

    const setSettingsModalVisible = (visible: boolean) => {
      settingsModalVisible.value = visible;
    };

    const settingsState = reactive<SettingsFormState>({
      name: deviceInfo.name,
      maxParticipants: configInfo.maxParticipants,
      destinationDir: configInfo.destinationDir
    })

    const formState = reactive<FormState>({
      name: '',
      maxParticipants: configInfo.maxParticipants
    });

    return {
      modalVisible,
      setModalVisible,
      settingsModalVisible,
      setSettingsModalVisible,
      formState,
      loading: false,
      deviceInfo,
      configInfo,
      settingsState
    };
  },
  methods: {
    ...mapMutations(['setSocket', 'setActiveShareRoom']),
    async createRoom() {
      try {
        // @ts-ignore
        await this.formRef?.validateFields();
        this.loading = true;
        fetchMain('create-room', this.formState)
            .then(async (data: any) => {
              console.log(data)
              this.setActiveShareRoom(data);

              // const deviceInfo: DeviceModel = (this as any).$settings.get('deviceInfo') as DeviceModel;
              // // Connect to socket
              // const socket = io('ws://127.0.0.1:2391', {
              //   auth: {
              //     passcode: data.passcode
              //   },
              //   query: {
              //     device: JSON.stringify(deviceInfo)
              //   }
              // });
              // @ts-ignore
              this.$emitter.emit('init-sockets', {passcode: data.passcode, route: false});
              // Route to room scanner
              this.$router.push('/room-radar');

            })
            .catch(err => {
              console.error(err);
              notification.warn({
                message: 'Unable to create a ShareRoom',
                description: 'There was a problem creating the a share room. If the issue persist, Please restart the application'
              });
            })
            .finally(() => (this.loading = false))
      } catch (e) {
        console.error(e)
      }
    },
    selectDir() {
      fetchMain<string>('select-dir')
          .then(dir => this.settingsState.destinationDir = dir)
    },
    async saveSettings() {
      try {
        await this.settingsRef?.validateFields();
        // @ts-ignore
        this.$settings.set('deviceInfo', {
          ...this.deviceInfo,
          name: this.settingsState.name
        });
        // update create share room form with new setting val
        this.formState.maxParticipants = this.settingsState.maxParticipants
        // @ts-ignore
        this.$settings.set('config', {
          ...this.configInfo,
          maxParticipants: this.settingsState.maxParticipants,
          destinationDir: this.settingsState.destinationDir,
        });

        this.settingsModalVisible = false;

        notification.success({
          message: 'Settings saved!',
          description: 'Some changes might take effect when you restart the app'
        });
      } catch (e) {
        console.error(e)
      }
    }
  },
});
</script>

<style lang="scss">
.main-page {
  background: linear-gradient(to bottom, #002e31, #001b2c);
}

.logo {
  height: 200px;
}

.floating-action {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
}
</style>