<template>

</template>

<script lang="ts">
import {mapState} from "vuex";
import {defineComponent} from "vue";

export default defineComponent({
  name: "JoinRoom",
  computed: {
    ...mapState(['activeShareRoom'])
  }
})
</script>