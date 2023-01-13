<template>
  <div class="h-screen flex flex-col justify-center items-center">
    <h2 class="text-2xl">ShareRoom</h2>
    <div class="actions flex gap-4">
      <a-button type="primary" shape="round" size="large" @click="modalVisible = true">
        <template #icon>
          <v-icon name="hi-view-grid-add" />
        </template>
        Create ShareRoom
      </a-button>

      <a-button shape="round" size="large" @click="$router.push('/join-room')">
        <template #icon>
          <v-icon name="bi-ui-checks-grid" />
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
      <a-form ref="formRef" :model="formState" name="room_form" layout="vertical">
        <a-form-item
            label="ShareRoom name"
            name="name"
            :rules="[{ required: true, message: 'Please specify a ShareRoom name' }]"
        >
          <a-input placeholder="Enter room name" v-model:value="formState.name" />
        </a-form-item>

        <a-form-item
            label="Maximun number of participants"
            name="maxParticipants"
            :rules="[{ required: formState.name, message: 'Please specify the maximum connections' }]"
        >
          <a-input v-model:value="formState.maxParticipants" />
        </a-form-item>
      </a-form>

      <template #footer>
        <a-button @click="modalVisible = false">Close</a-button>
        <a-button type="primary" :loading="loading" @click="createRoom">Create</a-button>
      </template>
    </a-modal>
  </div>
</template>

<style lang="scss">

</style>

<script lang="ts">
import {defineComponent, reactive, ref, watch} from "vue";
import {FormInstance} from "ant-design-vue";
import {fetchMain} from "../utils/ipc-render";
import {DeviceModel} from "../models";
import {io} from "socket.io-client";
import {mapMutations} from "vuex";

interface FormState {
  name: string;
  maxParticipants: number
}

export default defineComponent({
  setup() {
    const modalVisible = ref<boolean>(false);

    const setModalVisible = (visible: boolean) => {
      modalVisible.value = visible;
    };

    const formRef = ref<FormInstance>();
    const formState = reactive<FormState>({
      name: '',
      maxParticipants: 20
    });
    watch(
        () => formState.name,
        () => {
          formRef?.value?.validateFields(['name']);
        },
        { flush: 'post' },
    );

    return {
      modalVisible,
      setModalVisible,
      formState,
      formRef,
    };
  },
  data() {
    return {
      loading: false
    }
  },
  mounted() {
    // console.log('here')

  },
  computed: {
  },
  methods: {
    ...mapMutations(['setSocket', 'setActiveShareRoom']),
    async createRoom() {
      try {
        // @ts-ignore
        await this.formRef.validateFields();
        this.loading = true;
        fetchMain('create-room', this.formState)
            .then(async (data: any) => {
              console.log(data)
              this.setActiveShareRoom(data);

              const deviceInfo: DeviceModel = (this as any).$settings.get('deviceInfo') as DeviceModel;
              // Connect to socket
              const socket = io('ws://127.0.0.1:2391', {
                auth: {
                  passcode: data.passcode
                },
                query: {
                  device: JSON.stringify(deviceInfo)
                }
              });
              // update socket var in state
              this.setSocket(socket);
              // Route to room scanner
              this.$router.push('/room-radar');

            })
            .catch(console.error)
        .finally(() => (this.loading = false))
      } catch (e) {
        console.error(e)
      }
    }
  },
});
</script>