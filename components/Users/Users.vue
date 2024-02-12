<template>
  <div>
    <v-card class="pa-0 pb-2" style="background-color: transparent" flat color="transparent">
      <v-container fluid fill-height class="px-0 py-2">
        <v-row class="pa-0" no-gutters align="center">
          <v-list-item class="px-0">
        <span class="py-0 kep_title text-capitalize text-center">
         {{ $t('User List') }}
        </span>
            <v-spacer/>
          </v-list-item>
        </v-row>
      </v-container>
      <v-divider class="py-0"/>

    </v-card>

    <v-row class="mb-3">
      <v-col cols="12" md="6" lg="6"
             class="mt-2 pb-0">

      </v-col>
      <v-col cols="12" md="6" lg="6" class="pt-0 mt-0">
        <v-text-field
          rounded
          color="secondary"
          background-color="white"
          :placeholder="$t('Filter')"
          hide-details="auto"
          required
          single-line
          append-icon=""
          type="text"
          v-model="filterName"
        >
          <template v-slot:append>
            <v-btn icon text small @click.prevent="initialize(true)">
              <v-icon color="secondary">
                mdi-magnify
              </v-icon>
            </v-btn>
            <v-btn icon text small v-show="filterMode" @click.prevent="clearFilter">
              <v-icon color="red">
                mdi-close
              </v-icon>
            </v-btn>

          </template>
        </v-text-field>
        <!--        <v-btn small rounded>-->
        <!--          <v-icon left>-->
        <!--            mdi-magnify-->
        <!--          </v-icon>-->
        <!--          search-->
        <!--        </v-btn>-->
      </v-col>
    </v-row>
    <v-skeleton-loader
      v-if="loading"
      type="table"
    ></v-skeleton-loader>
    <v-data-table
      v-else
      :headers="headers"
      :items="this.filterMode ? tempItems : items"
      item-key="name"
      class="elevation-1"
      :search="search"
      :page.sync="page"
      :items-per-page="itemsPerPage"
      hide-default-footer
      align="center"
    >


      <template #item.action="{item}">
        <v-btn icon color="info" depressed >
          <v-img contain :src="editIcon" aspect-ratio="2"/>
        </v-btn>
        <v-btn icon color="danger" depressed @click="openDeleteDialog(item)">
          <v-img contain :src="trashIcon" aspect-ratio="2"/>
        </v-btn>
      </template>
    </v-data-table>

    <v-card class="pa-0 pb-5 mt-4" style="background-color: transparent" flat color="transparent">
      <v-row>
        <v-col cols="12" md="5" sm="12" class="">
         <span :class="bp.mdAndUp ? 'mr-4 grey--text' : 'mr-4 grey--text caption text-start'">
            {{ $t('Showing ') }} {{ items.length }} {{ $t('of') }} {{ totalCount }}
           <v-menu offset-y left>
            <template v-slot:activator="{ on, attrs }">
              <v-chip
                close-icon="mdi-delete"
                pill
                small
                dark
                v-bind="attrs" v-on="on"
                color="high"
              >
                {{ paginate }}
                <v-icon color="white" class="pl-2">mdi-menu-down</v-icon>
              </v-chip>
            </template>
            <v-list>
              <v-list-item
                v-for="(title, index) in itemsPerPageArray"
                :key="index"
                class="black--text small"
                selectable
              >
                <v-list-item-title class="black--text small"  v-model="paginate"
                                   @click="setPagination(title)">{{ title }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
           {{ $t('Rows per page') }}
          </span>
        </v-col>
        <v-spacer></v-spacer>
        <v-col cols="12" sm="6" md="5" :align="bp.mdAndUp ? 'right' : 'left'">
          <span :class="bp.mdAndUp ? 'mr-4 grey--text' : 'mr-4 grey--text caption text-start'">
            {{ $t('Showing page') }} {{ page }} {{ $t('of') }} {{ totalPage }}
          </span>
          <v-chip
            close-icon="mdi-delete"
            class="rounded-br-0 rounded-tr-0"
            pill
            :small="bp.mdAndUp"
            :x-small="bp.smAndDown"
            color="white black--text"
            @click="gotoPreviousPage"
          >
            <v-icon color="black">mdi-chevron-left</v-icon>
          </v-chip>
          <v-chip
            close-icon="mdi-delete"
            class="rounded-l-0 rounded-r-0 px-4 mx-0"
            pill
            :small="bp.mdAndUp"
            :x-small="bp.smAndDown"
            dark
            color="white black--text"
          >
            {{ page }}
          </v-chip>
          <v-chip
            close-icon="mdi-delete"
            class="rounded-l-0 rounded-r-0 mx-0"
            :small="bp.mdAndUp"
            :x-small="bp.smAndDown"
            dark
            color="white black--text"
            @click="gotoNextPage"
          >
            <v-icon color="black">mdi-chevron-right</v-icon>
          </v-chip>
          <v-menu offset-y left>
            <template v-slot:activator="{ on, attrs }">
              <v-chip
                close-icon="mdi-delete"
                class="rounded-bl-0 rounded-tl-0 mx-0"
                pill
                :small="bp.mdAndUp"
                :x-small="bp.smAndDown"
                dark
                v-bind="attrs" v-on="on"
                color="white black--text"
              >
                {{ paginate }}
                <v-icon color="black" class="pl-2">mdi-menu-down</v-icon>
              </v-chip>
            </template>
            <v-list>
              <v-list-item
                v-for="(title, index) in itemsPerPageArray"
                :key="index"
                class="black--text small"
              >
                <v-list-item-title class="black--text small" v-model="paginate" @click="setPagination(title)">{{
                    title
                  }}
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-col>
      </v-row>
    </v-card>

    <v-dialog
      v-model="dialog"
      max-width="650px"
      persistent
    >
      <v-card flat light rounded>
        <v-card-title class="pt-3 pb-0 h_primary">
          <span class="kep_title_2">{{ formTitle}}</span>
        </v-card-title>
        <v-container grid-list-sm class="pt-0">
          <v-divider/>
          <v-row no-gutters class="pa-0">
            <v-col cols="12" md="6" class="pa-2">
              <label class="title">{{ $t('First Name')}}</label>
              <v-text-field
                outlined
                v-model="editedItem.first_name"
                dense
                hide-details="auto"
              />
            </v-col>
            <v-col cols="12" md="6" class="pa-2">
              <label class="title">{{ $t('Last Name')}}</label>
              <v-text-field
                outlined
                v-model="editedItem.last_name"
                dense
                hide-details="auto"
              />
            </v-col>

            <v-col cols="12" class="pa-2">
              <label class="title">{{ $t('Mobile')}}</label>
              <v-text-field
                outlined
                v-model="editedItem.mobile"
                dense
                type="numeric"
                hide-details="auto"
              />
            </v-col>
            <v-col cols="12" md="6" class="pa-2">
              <label class="title">{{ $t('Select Gender')}}</label>
              <v-select
                :items="['Male', 'Female']"
                hide-details="auto"
                item-text="name"
                ref="sub_district"
                dense
                item-value="id"
                return-id
                outlined
                v-model="editedItem.gender"
              />
            </v-col>
            <v-col cols="12" md="6" class="pa-2">
              <label class="title">{{ $t('Street Address')}}</label>

              <v-text-field
                hide-details="auto"
                v-model="editedItem.address"
                outlined
                dense
              />
            </v-col>
            <v-col cols="12" md="6" class="pa-2">
              <label class="title">{{ $t('District')}}</label>
              <SelectDistrict
                ref="distr"
                hide-details="auto"
                outlined
                :label="$t('District')"
                v-model="editedItem.district_id"
                @setSelectedDistrict="getSelectedDistrict"
                @setSubs="getSubs"
                dense
              />
            </v-col>
            <v-col cols="12" md="6" class="pa-2">
              <label class="title">{{ $t('Thana')}}</label>
              <v-autocomplete
                :items="sub_districts"
                hide-details="auto"
                item-text="name"
                ref="sub_district"
                dense
                item-value="id"
                no-data-text="No Sub District Found"
                return-id
                outlined
                :loading="subDistLoading"
                v-model="subDistVal"
                @change="setSubDistId"
              />
            </v-col>
            <v-divider />
            <v-list-item-title class="px-2">
              Login Credentials *
            </v-list-item-title>
            <v-col cols="12" class="pa-2">
              <label class="title">{{ $t('Email')}}</label>
              <v-text-field
                outlined
                v-model="editedItem.email"
                dense
                hide-details="auto"
                type="email"
              />
            </v-col>
            <v-col cols="12" md="12" class="pa-2">
              <label class="title">{{ $t('Password')}}</label>
              <v-text-field
                outlined
                v-model="editedItem.password"
                dense
                type="email"
                hide-details="auto"
              />
            </v-col>

          </v-row>
          <v-divider class="mb-5"/>
          <v-col cols="12" align="right" class="pa-2">

            <v-btn outlined class="px-7" rounded depressed :loading="loadingSaveData"  v-show="editedIndex !== -1" @click="updateUser">
              {{ $t('Update')}}
            </v-btn>
            <v-btn outlined class="px-7" rounded depressed :loading="loadingSaveData" :disabled="loadingSaveData" v-show="editedIndex === -1"  @click="saveUser">
              {{ $t('Save')}}
            </v-btn>
            <v-btn outlined class="px-7" rounded depressed  @click="closeView">
              {{ $t('Close')}}
            </v-btn>

          </v-col>
        </v-container>
      </v-card>

    </v-dialog>
    <v-dialog
      v-model="dialogDelete"
      persistent
      max-width="390"
    >
      <v-card align="center">
        <v-card-text class="text-center pa-5 pp-body-reg-2">
          You are about to delete {{ editedItem.name }}, do you want to proceed?
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
            {{ $t('No')}}
          </v-btn>
          <v-btn
            class="primary px-5"
            rounded
            :loading="btnLoading"
            @click="makeDelete"
          >
            {{ $t('yes')}}
          </v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import editIcon from "static/icons/editInfoColor.png";
import trashIcon from "static/icons/trashInfo.png";

export default {
  data() {
    return {
      editIcon,
      trashIcon,
      title: null,
      search: '',
      filterName:null,
      calories: '',
      dialog: false,
      itemsPerPageArray: [5, 10, 15, 20, 25, 50],
      filter: {},
      sortDesc: false,
      page: 1,
      itemsPerPage: 10,
      items: [
        { user_id: 1, name: 'John Doe', registered: 'Admin', mobile: '1234567890', location: 'New York', sms: 'Yes', action: 'Edit' },
        { user_id: 2, name: 'Jane Smith', registered: 'User', mobile: '9876543210', location: 'Los Angeles', sms: 'No', action: 'Delete' },
      ],
      tempItems: [],
      subDistVal: null,
      sub_districts: [],
      filteredItems: [],
      sortIconFor: '',
      sortIcons: false,
      active: 'Enable',
      activeList: ['Enable', 'Disable'],
      loading: false,
      btnLoading: false,
      subDistLoading: false,
      loadingSaveData: false,
      usersMetadata: {
        count: 10,
        current_page: 1,
        last_page: 1,
        next_page: 1,
        next_page_url: null,
        per_page: "10",
        prev_page: 0,
        prev_page_url: null,
        total: 10,
        total_page: 1,
      },
      dialogDelete: false,
      editedIndex: null,
      locations: [],
      totalPage: 1,
      nextPageUrl: null,
      previousPageUrl: null,
      paginate: 10,
      currentPage: null,
      nextPage: null,
      prevPage: null,
      totalCount: 0,
      filterMode: false,
      editedItem: {
        first_name: null,
        last_name: null,
        mobile: null,
        email: null,
        gender: null,
        district_id: null,
        sub_district_id: null,
        address: null,
      },
      defaultItem: {
        first_name: null,
        last_name: null,
        mobile: null,
        email: null,
        gender: null,
        district_id: null,
        sub_district_id: null,
        address: null,
      },
      dialogItems: {
        first_name: null,
        last_name: null,
        mobile: null,
        email: null,
        gender: null,
        district_id: null,
        sub_district_id: null,
        address: null,
      },
    }
  },
  computed: {
    headers() {
      return [
        {text: this.$t('User ID'), value: 'user_id', class: 'accentlight',},
        {
          text: this.$t('Name'),
          sortable: true,
          value: 'name',
          class: 'accentlight text-capitalized',
          sortIcon: 'mdi-menu-up',
          align: 'center'
        },
        {
          text: this.$t('User Category'),
          sortable: true,
          value: 'registered',
          class: 'accentlight text-capitalized',
          sortIcon: 'mdi-menu-up',
          align: 'center'
        },
        {
          text: this.$t('Mobile'),
          value: 'mobile',
          class: 'accentlight',
        },
        {text: this.$t('Location'), value: 'location', class: 'accentlight',},
        {text: this.$t('Action'), value: 'action', class: 'accentlight',},
      ]
    },
    formTitle() {
      return this.editedIndex === -1 ? 'Add New' : 'Edit'
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

    this.initialize(this.filterMode)
  },
  methods: {
    initialize(item) {
      this.loading = true
      setTimeout(() => (this.loading = false), 1500)

    },
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

  }
}
</script>

<style scoped>

</style>
