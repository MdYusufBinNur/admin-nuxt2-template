<template>
  <div>
    <v-app-bar
      style="; z-index: 99"
      flat
      app
      class="white"
      fixed
    >
      <v-app-bar-nav-icon @click="openDrawer" style="margin-left: -40px; z-index: 99" class="px-0" :ripple="false">
        <template v-slot:default>
          <v-btn icon v-show="mini" :ripple="false">
            <MenuLeftSVG/>
          </v-btn>
          <v-btn icon v-show="!mini" :ripple="false">
            <MenuRightSVG/>
          </v-btn>
        </template>
      </v-app-bar-nav-icon>
      <v-toolbar-items v-show="bp.mdAndUp">
      </v-toolbar-items>
      <v-spacer></v-spacer>
      <v-spacer></v-spacer>
      <v-menu offset-y left transition="slide-y-transition">
        <template v-slot:activator="{ on, attrs }">
          <v-btn text plain small rounded v-bind="attrs" class="px-0" v-on="on" style="background-color: transparent">
            <v-avatar size="30" v-show="bp.mdAndUp">
              <v-img :src="'https://cdn.vuetifyjs.com/images/john.png'"></v-img>
            </v-avatar>
            <v-list-item-content v-show="bp.mdAndUp" class="px-0">

            <span class="pa-0 px-2 caption text-left text-capitalize">
              {{ username }}
            </span>
            </v-list-item-content>
            <v-icon left>
              mdi-menu-down
            </v-icon>
          </v-btn>

        </template>
        <v-card style="border-radius: 10px" max-width="200px">
          <v-list dense>
            <v-list-item
              class="black--text small"
              dense
              selectable
            >
              <v-avatar size="40" v-show="bp.mdAndUp">
                <v-img :src="'https://cdn.vuetifyjs.com/images/john.png'"></v-img>
              </v-avatar>
              <v-list-item-content v-show="bp.mdAndUp">
                <v-card-subtitle class="pa-0 px-2">
                  {{ username }}
                </v-card-subtitle>
                <span class="pa-0 px-2 caption">
                {{ userRole ? userRole : '-' }}
              </span>
              </v-list-item-content>

            </v-list-item>
            <v-divider/>
            <v-list-item dense @click="logout">
              <v-list-item-avatar size="20">
                <v-img :src="logoutIcon" contain/>
              </v-list-item-avatar>
              <v-list-item-title class="text-capitalize">
                <v-btn text small plain :loading="loading">
                  logout
                </v-btn>
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-card>

      </v-menu>
      <v-dialog
        v-model="dialog"
        max-width="650px"
      >
        <v-card flat light rounded>
          <v-row align="center" no-gutters>
            <v-col cols="8">
              <v-card-title class="py-3 pb-0 h_primary">
                <span class="kep_title">Notification</span>
              </v-card-title>
            </v-col>
            <v-col cols="4" class="pa-2 text-right">
              <v-switch
                v-model="switch1"
                flat
                color="info"
                label="Only show unread"
              ></v-switch>
            </v-col>
          </v-row>
          <v-divider/>
          <v-form ref="form">
            <v-row no-gutters class="pa-2">
              Notification
            </v-row>
            <v-divider class="mb-2"/>
            <v-row no-gutters class="pa-2">
              <v-col cols="12" align="right" class="pa-2 pt-0">

              </v-col>
            </v-row>
          </v-form>
        </v-card>

      </v-dialog>
    </v-app-bar>
    <v-navigation-drawer v-model="drawer" class="grey lighten-5"
                         :mini-variant.sync="mini"
                         permanent fixed app>
      <v-list-item
        class="pa-5 pb-1"
        active-class="white"
        color="white"
      >
        <v-list-item-title class="text-md-h5 black--text">
          Admin Panel
        </v-list-item-title>
      </v-list-item>
      <v-list rounded dense class="px-0">
        <NavigationItems
          v-for="(item, i) in navItems"
          :items="item.items"
          :title="item.title"
          :path="item.to"
          :prepend-icon="item.icon"
          :key="i"
        />
      </v-list>
    </v-navigation-drawer>

  </div>
</template>

<script>
import logoutIcon from 'static/icons/Logout.png';
import ac from 'static/icons/ac.png';
import NavigationItems from "@/components/Common/NavigationItems";
import MenuRightSVG from "@/components/icons/MenuRightSVG";
import MenuLeftSVG from "@/components/icons/MenuLeftSVG";

export default {
  name: "Nav",
  components: {NavigationItems, MenuRightSVG, MenuLeftSVG},
  data() {
    return {
      loadingState: false,
      loading: false,
      show: false,
      ac,
      logoutIcon,
      profileImg: null,
      userRole: null,
      date: '',
      menu2: false,
      adminMenu: false,
      dialog: false,
      drawer: true,
      username: '',
      userImage: '',
      switch1: true,
      navItems: [
        {title: 'Dashboard', icon: 'mdi-home', to: '/', items: null},
        {title: 'Users', icon: 'mdi-account', to: '/users', items: null},
        {title: 'Category', icon: 'mdi-more', to: '/category', items: null},
        {
          title: 'Location',
          path: null,
          icon: 'mdi-google-maps',
          items: [
            {title: 'District', icon: 'mdi-pencil', to: '/location'},
            {title: 'Sub District', icon: 'mdi-close', to: '/sub'},
          ]
        },
        {title: 'Sub Category', icon: 'mdi-file', to: '/sub-category', items: null},
        {title: 'Wallet', icon: 'mdi-credit-card-plus', to: '/account', items: null},
        {title: 'All Ad', icon: 'mdi-autorenew', to: '/ad', items: null},

        // {
        //   title: 'Order',
        //   path: null,
        //   icon: 'mdi-google-maps',
        //   items: [
        //     {title: 'All', icon: 'mdi-pencil', to: '#'},
        //     {title: 'Pending', icon: 'mdi-close', to: '#'},
        //     {title: 'Cancelled', icon: 'mdi-close', to: '#'},
        //   ]
        // },
      ]
    }
  },
  created() {
    this.initUser()
  },
  computed: {
    mini() {
      return this.$vuetify.breakpoint.mobile
    }
  },
  methods: {
    close() {
      this.dialog = false
    },
    initUser() {
      this.username = this.$auth.user.data.username
    },
    openDrawer() {
      this.mini = !this.mini
    },
    logout() {
      this.loading = true
      this.$axios.get('/logout')
        .then((response) => {
          this.$auth.logout()
          this.$router.push('/auth')
        })
        .catch((error) => {
          this.$toast.error(error.response.data.message)
        })
        .finally(() => {
          this.loading = false
        })
    }
  },

}
</script>

<style scoped>
.radius {
  border-radius: 10px;
}
</style>
