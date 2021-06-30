export default {
  name: "App",
  components: {
    index: () =>
      import(
        /* webpackChunkName: "main" */ "./layouts/default/index/index.vue"
      ),
  },
  mixins: [],
  props: {},
  computed: {},
  watch: {},
  data() {
    return {};
  },
  created() {},
  mounted() {
    console.log(this.$route.path);
  },
  destroyed() {},
  methods: {},
};
