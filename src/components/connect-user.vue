<template>
  <div>
    <label>My name is: </label>
    <input v-model="username"></input>
    <button @click="createConnection">Create Connection</button>
  </div>
</template>

<script>

export default {
  name: 'online-users',
  props: ['socket'],
  data: function() {
    return {
      username: '',
      waiting: false
    }
  },
  methods: {
    createConnection: function() {
      var component = this;
      // TODO refactor into service
      this.socket.emit('userconnected', {
        name: this.username
      });

      this.socket.on('waitforusers', function() {
        component.$emit('waitforusers');
      });
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
