<template>
  <div class="h-screen flex flex-col justify-center items-center">
    <h2 class="text-2xl">ShareRoom</h2>
    <div class="actions flex gap-4">
      <a-button type="primary" shape="round" size="large" @click="modal2Visible = true">
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
        v-model:visible="modal2Visible"
        title="Vertically centered modal dialog"
        centered
        @ok="modal2Visible = false"
    >
      <p>some contents...</p>
      <p>some contents...</p>
      <p>some contents...</p>
    </a-modal>
  </div>
</template>

<style lang="scss">

</style>

<script lang="ts">
import {ref} from "vue";

export default {
  setup() {
    const modal1Visible = ref<boolean>(false);
    const modal2Visible = ref<boolean>(false);

    const setModal1Visible = (visible: boolean) => {
      modal1Visible.value = visible;
    };
    return {
      modal1Visible,
      modal2Visible,
      setModal1Visible,
    };
  },
  data() {
    return {
    }
  },
  mounted() {
    // console.log('here')

  },
  computed: {
  },
  methods: {
  },
}
</script>