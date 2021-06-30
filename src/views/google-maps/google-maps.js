export default {
  name: "GoogleMaps",
  components: {
    gmap: () =>
      import(
        /* webpackChunkName: "google-maps" */ "../../components/map/map.vue"
      ),
  },
  mixins: [],
  props: {},
  computed: {},
  watch: {
    loading: {
      handler(now) {
        if (!now) this.stopTimer();
      },
    },
  },
  data() {
    return {
      loading: true,
      timerInterval: undefined,
    };
  },
  created() {
    this.startTimer();
  },
  mounted() {},
  destroyed() {},
  methods: {
    startTimer() {
      let startTimer = Date.now();
      if (!this.timerInterval) {
        this.timerInterval = setInterval(() => {
          let elapsedTime = Date.now() - startTimer;
          document.getElementById("timer").innerHTML = (
            elapsedTime / 1000
          ).toFixed(3);
        }, 100);
      }
    },
    stopTimer() {
      clearInterval(this.timerInterval);
    },
  },
};
