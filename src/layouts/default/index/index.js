export default {
  name: "DefaultLayout",
  components: {
    DefaultView: () =>
      import(/* webpackChunkName: "default-view" */ "../view/view.vue"),
  },
  mixins: [],
  props: {},
  computed: {},
  watch: {},
  data() {
    return {};
  },
  created() {},
  mounted() {},
  destroyed() {},
  methods: {},
};
