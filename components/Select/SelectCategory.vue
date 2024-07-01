<template>
  <div>
    <v-autocomplete
      v-model="selected"
      v-debounce:800ms="debouncedInitData"
      :items="items"
      :no-data-text="noDataText"
      :loading="loading"
      :search-input.sync="name"
      :debounce-events="['onclick', 'oninput', 'onkeydown']"
      v-bind="$attrs"
      hide-details="auto"
      :item-text="`name`"
      item-value="id"
      return-id
      outlined
      label="Select Category"
      hide-selected
      multiple
      @change="onChangeSelectedItem(selected)"
    >

    </v-autocomplete>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  export default {
    name: 'SelectCategory',
    props: {
      initLists: {
        type: Boolean,
        required: false,
        default () {
          return true
        }
      },
      category: {
        type: Boolean,
        required: false,
        default () {
          return true
        }
      }
    },

    data () {
      return {
        selected: null,
        name: null,
        items: [],
        loading: false
      }
    },

    computed: {
      // ...mapGetters({
      //   branchList: 'branch/getBranches'
      // }),

      searchQuery () {
        return (
          `${this.name !== '' && this.name !== null ? '?query=' + this.name : ''}`
        )
      },

      noDataText () {
        let text = ''
        if (this.loading) {
          text = 'Data is Loading...'
        } else {
          text = 'No data available'
        }
        return text
      }
    },


    created () {
      this.initialize()
    },

    methods: {
      onChangeSelectedItem (item) {
        this.$emit('setSelectedItem', item)
      },

      initialize () {
        this.loading = true
        this.$axios.get('categories?per_page=100')
          .then((response) => {
            this.items = response.data.data.categories
          })
          .catch((error) => {
          })
          .finally(() => {
            this.loading = false
          })
      },

      debouncedInitData (v) {
        this.name = v
        this.initialize()
      },

      setId (id) {
        const found = this.items.find(el => el.id === id)
        if (found) {
          this.selected = parseInt(id, 10)
        } else {
          this.initialize('?id=' + id)
          this.selected = parseInt(id, 10)
        }
      },

      save(item) {
        this.setId(item.id)
      },

      update(item) {
        this.setId(item.id)
      },
    }
  }
</script>
