<template>
  <q-dialog v-model="clickedIssue.clicked" persistent>
    <q-card>
      <q-card-section class="row items-center">
        <h4>{{ clickedIssue.id }}</h4>
      </q-card-section>
      <q-card-section class="row items-center">
        <h5>subject: {{ clickedIssue.subject }}</h5>
        <div>created on: {{ clickedIssue.created_on }}</div>
        <div>updated on: {{ clickedIssue.updated_on }}</div>
        <div>priority: {{ clickedIssue.priority.name }}</div>
        <div>project: {{ clickedIssue.project.name }}</div>
        <div>status: {{ clickedIssue.status.name }}</div>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn @click="open()" label="Open ticket in redmine" color="primary" v-close-popup />
        <q-btn label="Close popup" color="red" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<style>
</style>

<script>
import { onMounted, ref } from "vue"
import RedmineService from '@/services/RedmineService.js'

export default {
  name: 'PopupIssue',
  props: {
    issue: {
      type: Object
    }
  },
  setup(props) {
    const clickedIssue = ref(props.issue)
    async function open() {
      const response = await RedmineService.getRedmineUrl()
      window.open(response.data + 'issues/' + clickedIssue.value.id, '_blank');
    }

    onMounted(() => {
      console.log("data from parent : ", props.issue)
    })

    return {
      open
    }
  }
}
</script>
