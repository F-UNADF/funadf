<template>
  <v-btn icon class="me-3" color="info" @click="downloadCSV">
    <v-icon>mdi-download</v-icon>
  </v-btn>
</template>

<script>
export default {
  props  : {
    data   : {
      type    : Array,
      required: true
    },
    headers: {
      type    : Array,
      required: true
    },
    name   : {
      type    : String,
      required: true
    }
  },
  methods: {
    convertToCSV(objArray) {
      const array = typeof objArray !== 'object' ? JSON.parse(objArray) : objArray;
      let str = '';

      // Add headers
      for (let i = 0; i < this.headers.length; i++) {
        if (i > 0) str += ';';
        str += this.headers[i].title;
      }
      str += '\r\n';

      // Add data rows
      for (let i = 0; i < array.length; i++) {
        let line = '';
        for (let j = 0; j < this.headers.length; j++) {
          if (line !== '') line += ';';
          line += array[i][this.headers[j].field];
        }
        str += line + '\r\n';
      }
      return str;
    },
    downloadCSV() {
      console.log(this.data);
      const csv = this.convertToCSV(this.data);
      const blob = new Blob([csv], {type: 'text/csv'});
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = this.name + '.csv';
      link.click();
    }
  }
}
</script>
