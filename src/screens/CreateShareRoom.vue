<template>
<div class="px-4 pt-8">
  <h2 class="text-xl">Create Room</h2>
</div>
</template>

<script>
export default {
  name: "CreateShareRoom.vue",
  setup() {
    const formRef = ref<FormInstance>();
    const formState = reactive<FormState>({
      username: '',
      nickname: '',
      checkNick: false,
    });
    watch(
        () => formState.checkNick,
        () => {
          formRef.value.validateFields(['nickname']);
        },
        { flush: 'post' },
    );
    const onCheck = async () => {
      try {
        const values = await formRef.value.validateFields();
        console.log('Success:', values);
      } catch (errorInfo) {
        console.log('Failed:', errorInfo);
      }
    };
    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 8 },
    };
    const formTailLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 8, offset: 4 },
    };
    return {
      formState,
      formItemLayout,
      formTailLayout,
      onCheck,
      formRef,
    };
  },
}
</script>

<style scoped>

</style>