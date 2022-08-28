<template>
  <section class="app-container">
    <h6>{{ $t("notFound") }}</h6>
  </section>
</template>

<script>
export default {
  name: 'NotFound',
  data() {
    return {

    };
  },
};
</script>

<style>
.app-container {
  display: inline-block;
  border-radius: 10px;
  padding: 20px;
  margin: 5rem;
}

img {
  position:relative;
  width:100%;
  height: 100%
}

h1 {
  margin-bottom: 25px;
}
</style>
