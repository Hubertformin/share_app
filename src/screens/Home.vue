<template>
  <div class="h-screen flex flex-col justify-center items-center">
    <h2 class="text-2xl">ShareRoom</h2>
    <div class="actions flex gap-4">
      <a-button type="primary" shape="round" size="large" @click="joinShareRoom">
        <template #icon>
          <v-icon name="hi-view-grid-add" />
        </template>
        Create ShareRoom
      </a-button>

      <a-button shape="round" size="large" @click="joinShareRoom">
        <template #icon>
          <v-icon name="bi-ui-checks-grid" />
        </template>
        Join ShareRoom
      </a-button>
    </div>
  </div>
</template>

<style lang="scss">

</style>

<script lang="ts">
export default {
  data() {
    return {
    }
  },
  computed: {
  },
  methods: {
    joinShareRoom() {
      this.$router.push('/share-room')
    }
  },
}
</script>