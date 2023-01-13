<template>

</template>

<script lang="ts">
import {mapState} from "vuex";

export default {
  name: "JoinRoom",
  computed: {
    ...mapState(['activeShareRoom'])
  }
}
</script>