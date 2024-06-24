<template>
  <div>
    <v-card class="pa-0 pb-2" style="background-color: transparent" flat color="transparent">
      <v-container fluid fill-height class="px-0 py-2">
        <v-row class="pa-0" no-gutters align="center">
          <v-list-item class="px-0">
              <span class="py-0 kep_title text-capitalize text-center">
               {{ $t('Category') }}
              </span>
            <v-spacer/>
          </v-list-item>
        </v-row>
      </v-container>
      <v-divider class="py-0"/>
    </v-card>
    <v-row class="py-10">

      <v-col cols="6" sm="6" md="6">
        <v-text-field
          rounded
          background-color="white"
          :placeholder="$t('Search')"
          hide-details="auto"
          required
          single-line
          append-icon="mdi-magnify"
          type="text"
          v-model="search"
          dense
          clearable
          outlined
        ></v-text-field>
      </v-col>
      <v-spacer v-show="bp.mdAndUp"></v-spacer>
      <v-col cols="6" align-self="end" align="right" class="justify-end align-self-end align-center">
        <v-btn rounded depressed class="secondary px-8 justify-center" @click="openDialog" dark>
          <v-icon left small dense>
            mdi-plus-box-outline
          </v-icon>
          {{ $t('Add New') }}
        </v-btn>
      </v-col>
    </v-row>
    <v-skeleton-loader
      v-if="loading"
      type="table"
    ></v-skeleton-loader>
    <v-data-table
      v-else
      :headers="headers"
      :items="items"
      item-key="name"
      class="elevation-1"
      :search="search"
      :page.sync="paginationMetadata.current_page"
      :items-per-page="paginationMetadata.per_page"
      hide-default-footer
      align="center"
      @page-count="paginationMetadata.total_page = $event"
    >
      <template #item.status="{item}">
        <v-chip small>
          Active
        </v-chip>
      </template>
      <template #item.image="{item}">
        <v-card flat class="py-2" max-width="100">
          <v-img
            height="100"
            width="100"
            :src="item.image"
            lazy-src="https://cdn.vuetifyjs.com/images/cards/cooking.png"
            style="border-radius: 0"
          ></v-img>
        </v-card>

      </template>
      <template #item.action="{item}">
        <v-btn icon color="info" depressed @click.prevent="editItem(item)">
          <v-img contain :src="editIcon" aspect-ratio="2"/>
        </v-btn>
        <v-btn icon color="danger" depressed @click="openDeleteDialog(item)">
          <v-img contain :src="trashIcon" aspect-ratio="2"/>
        </v-btn>
      </template>
    </v-data-table>
    <v-card class="pa-0 pb-5 mt-4" style="background-color: transparent" flat color="transparent">
      <v-row class="px-5">
        <PaginationClientSide :items-length="items.length" :per-page.sync="paginationMetadata.per_page" :current-page.sync="paginationMetadata.current_page"/>
      </v-row>
    </v-card>
    <v-dialog v-model="dialog" max-width="600">
      <v-card>
        <v-card-title class="headline">{{ formTitle }}</v-card-title>
        <v-card-text>
          <v-form ref="form" v-model="valid" lazy-validation>
            <v-container>
              <!-- Category Name -->
              <v-text-field v-model="editedItem.name" label="Category Name" outlined
                            :rules="formRules.name"></v-text-field>

              <!-- Category Image -->
              <v-file-input prepend-icon="" append-icon="mdi-file" v-model="editedItem.image" label="Category Image"
                            outlined :rules="formRules.image"></v-file-input>
            </v-container>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="closeDialog">Cancel</v-btn>
          <v-btn color="primary" v-show="editedIndex === -1" :loading="loadingSaveData" text @click="saveCategory">Save</v-btn>
          <v-btn color="primary" v-show="editedIndex !== -1" :loading="loadingSaveData" text @click="updateCategory">Update</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="dialogDelete"
      persistent
      max-width="390"
    >
      <v-card align="center">
        <v-card-text class="text-center pa-5 pp-body-reg-2">
          You are about to delete this, do you want to proceed?
        </v-card-text>
        <v-card-actions class="pb-5">
          <v-spacer></v-spacer>
          <v-btn
            color="secondary"
            outlined
            rounded
            class="px-5"
            @click="closeDeleteDialog"
          >
            {{ $t('No') }}
          </v-btn>
          <v-btn
            class="primary px-5"
            rounded
            :loading="btnLoading"
            @click="makeDelete"
          >
            {{ $t('yes') }}
          </v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import editIcon from "static/icons/editInfoColor.png";
import trashIcon from "static/icons/trashInfo.png";
import PaginationClientSide from "@/components/Common/PaginationClientSide";

export default {
  name: 'Category',
  components: {PaginationClientSide},
  data() {
    return {
      editIcon,
      trashIcon,
      dialog: false,
      valid: false,
      title: null,
      search: '',
      filter: {},
      items: [],
      active: 'Enable',
      activeList: ['Active', 'Inactive'],
      loading: false,
      btnLoading: false,
      loadingSaveData: false,
      logoPreviewURL: false,
      paginationMetadata: {
        count: 10,
        current_page: 1,
        last_page: 1,
        next_page: 1,
        next_page_url: null,
        per_page: 10,
        prev_page: 0,
        prev_page_url: null,
        total: 10,
        total_page: 1,
      },
      dialogDelete: false,
      editedIndex: -1,
      editedItem: {
        id: null,
        name: '',
        image: '',
        active: null
      },
      defaultItem: {
        id: null,
        name: '',
        image: '',
        active: null
      },
      nameRules: [
        v => !!v || this.$t('Category name is required')
      ]
    }
  },
  computed: {
    headers() {
      return [
        {
          text: this.$t('Image'),
          value: 'image',
          class: 'accentlight',
        },
        {text: this.$t('Category Name'), value: 'name', class: 'accentlight',},
        {text: this.$t('Status'), value: 'status', class: 'accentlight',},
        {text: this.$t('Action'), value: 'action', class: 'accentlight',},
      ]
    },
    formTitle() {
      return this.editedIndex === -1 ? 'Add New' : 'Edit'
    },
    formRules() {
      // Define dynamic validation rules for the form
      return {
        name: [
          v => !!v || this.$t('Category name is required')
        ],
        image: [
          // Make the image field required only for new categories
          v => !this.editedItem.id || !!v || 'Image is required'
        ]
      };
    },
  },
  created() {
    // this.$root.$on('filterUserData', () => {
    //   this.dashboardFilterMode = true
    // })
    // this.$root.$on('clearFilterMode', () => {
    //   this.dashboardFilterMode = false
    //   this.$store.commit('user/setFilteredUsers', [])
    // })

    this.getCategory()
  },
  methods: {
    openDeleteDialog(item) {
      this.editedIndex = this.items.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialogDelete = true
    },
    closeDeleteDialog() {
      this.editedIndex = -1
      this.editedItem = Object.assign({}, this.defaultItem)
      this.dialogDelete = false
    },
    makeDelete() {
      if (!this.editedItem.id) {
        return this.$toast.error('Something went wrong! Try Again')
      }
      this.btnLoading = true
      this.$axios.delete('categories/' + this.editedItem.id)
        .then((response) => {
          this.$toast.success(response.data.message)
          this.items.splice(this.editedIndex, 1)
        })
        .catch((error) => {
          this.$toast.error(error.response.data.message)
        })
        .finally(() => {
          this.btnLoading = false
          this.closeDeleteDialog()
        })
    },
    openDialog() {
      this.dialog = true;
    },
    closeDialog() {
      this.dialog = false;
      this.$refs.form.reset();
      this.editedItem.name = '';
      this.editedItem.image = null;
      this.editedItem.id = null;
      this.editedItem.active = null;
      this.editedIndex = -1;
      this.valid = false;
    },
    saveCategory() {
      if (this.$refs.form.validate()) {
        this.loadingSaveData = true
        let formData = new FormData()
        formData.append('name', this.editedItem.name)
        formData.append('image', this.editedItem.image)
        this.$axios.post('categories', formData)
          .then((response) => {
            this.$toast.success(response.data.message)
            this.items.push(response.data.data)

          })
          .catch((error) => {
            this.$toast.error(error.response.data.message)
          })
          .finally(() => {
            this.closeDialog();
            this.loadingSaveData = false
          })
      }
    },
    editItem(item) {
      this.editedItem.id = item.id
      this.editedItem.name = item.name
      this.logoPreviewURL = item.image ? item.image : null
      this.editedIndex = this.items.indexOf(item)
      this.dialog = true
    },
    updateCategory() {
      if (!this.editedItem.id) {
        return this.$toast.error('Something went wrong! Try Again')
      }
      this.loadingSaveData = true
      let formData = new FormData()
      formData.append('_method', 'put')
      formData.append('name', this.editedItem.name)
      this.editedItem.image && formData.append('image', this.editedItem.image)
      this.$axios.post('categories/' + this.editedItem.id, formData)
        .then((response) => {
          this.$toast.success(response.data.message)
          Object.assign(this.items[this.editedIndex], response.data.data)

        })
        .catch((error) => {
          this.$toast.error(error.response.data.message)
        })
        .finally(() => {
          this.closeDialog();
          this.loadingSaveData = false
        })
    },
    getCategory() {
      this.loading = true
      this.$axios.get('categories')
        .then((response) => {
          this.items = response.data.data.categories
          this.paginationMetadata = response.data.data.pagination
        })
        .catch((error) => {
        })
        .finally(() => {
          this.loading = false
        })
    }
  },
}
</script>

<style scoped>

</style>
