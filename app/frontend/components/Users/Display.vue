<template>
  <div v-if="user">
    <div class="d-flex align-center py-4">
      <div>
        <v-img :src="'/avatars/' + user.id + '.png'" width="45px" class="rounded-circle img-fluid"></v-img>
      </div>

      <div class="ml-5">
        <h4 class="d-block">{{ user.lastname }} {{ user.firstname }}</h4>
        <span class="subtitle-2 font-weight-regular">{{ user.email }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  user: {
    type: Object,
    required: true
  }
})
</script>
