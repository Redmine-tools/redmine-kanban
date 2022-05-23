<template>
  <div class="kanban">
    <div class="" v-for="status in columnConfig" :id="status.id" :key="status.id">
      <h6 class="status-name">{{ status.name }} <p> {{ issuesByStatus[status.name].length }} </p></h6>
      <div class="kanban-col">
        <draggable
                class="list-group"
                :list="issuesByStatus[status.name]"
                @add="add"
                itemKey="id"
                group="issues"
                v-bind:id="status.name"
        >
          <template #item="{ element }">
            <div class="list-item" v-bind:id="element.id" @click="openTicket(element)">
              <div class="title">#{{ element.id }}</div>
              <div class="title">{{ element.subject }}</div>
              <div class="author">Szerző: {{ element.author.name }} </div>
              <div v-if="element?.assigned_to?.name">Felelős: {{ element.assigned_to.name }} </div>
            </div>
          </template>
        </draggable>
      </div>
    </div>
  </div>
</template>

<style>
</style>

<script>
export default {
  name: 'KanbanIssues'
}
</script>
