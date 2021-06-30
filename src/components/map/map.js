import { GoogleMapsLoader } from "@/util/google-maps-loader";
// import Supercluster from "supercluster";
import { waitUntil } from "@/util/wait-until";
import { getRandomInt } from "@/util/calculation";

export default {
  name: "Map",
  components: {},
  mixins: [],
  props: {},
  computed: {},
  watch: {},
  data() {
    return {
      google: new GoogleMapsLoader(),
      gmap: undefined,
      map: undefined,
      supercluster: undefined,
      markers: [],
      timerInterval: undefined,
      dragging: false,
    };
  },
  async created() {
    this.initMap();
  },
  async mounted() {},
  destroyed() {},
  methods: {
    async initMap() {
      await waitUntil(() => this.google.isReady());
      this.gmap = await this.google.maps;
      console.log(this.gmap);
      this.map = new this.gmap.Map(document.getElementById("map"), {
        center: { lat: 51.509865, lng: -0.118092 },
        zoom: 6,
        zoomControl: true,
        maxZoom: 16,
        minZoom: 3,
        mapTypeControl: false,
        scaleControl: false,
        streetViewControl: false,
        rotateControl: false,
        fullscreenControl: false,
        disableDefaultUi: true,
        styles: [
          {
            featureType: "poi",
            elementType: "labels",
            stylers: [{ visibility: "off" }],
          },
        ],
      });
      this.addMapEventListener();
      // this.google.initCluster({ radius: 40, maxZoom: 16 });
      this.supercluster = new this.google.maps.SuperCluster({
        radius: 100,
        minZoom: 3,
        maxZoom: 16,
      });
      let geoJson = await this.getJson("../../assets/places.json");
      let newFeatures = [];
      for (let i = 0; i < 100000; i++) {
        let index = getRandomInt(1, 140);
        newFeatures.push(geoJson.features[index]);
      }
      geoJson.features = geoJson.features.concat(newFeatures);
      this.supercluster.load(geoJson.features);
      await waitUntil(() => this.map);
      this.setupCluster();
    },
    async getJson(url) {
      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("GET", url, true);
        xhr.responseType = "json";
        xhr.setRequestHeader("Accept", "application/json");
        xhr.onload = () => {
          if (
            xhr.readyState === 4 &&
            xhr.status >= 200 &&
            xhr.status < 300 &&
            xhr.response
          ) {
            resolve(xhr.response);
          } else reject(xhr.response);
        };
        xhr.send();
      });
    },
    setupCluster() {
      let bounds = this.map.getBounds();
      let northEast = bounds.getNorthEast();
      let southWest = bounds.getSouthWest();
      let clusters = this.supercluster.getClusters(
        [southWest.lng(), southWest.lat(), northEast.lng(), northEast.lat()],
        this.map.zoom
      );
      let count = 1;
      for (let cluster of clusters) {
        // eslint-disable-next-line no-prototype-builtins
        let isCluster = !!cluster.properties.cluster;
        if (isCluster) {
          let marker = this.addClusterMarker(cluster);
          this.markers.push(marker);
        } else {
          let marker = undefined;
          count = count + 1;
          let cluster_id = getRandomInt(1, 6);
          let iconUrl =
            window.location.origin +
            "/assets/transparent-m" +
            cluster_id.toString() +
            ".png";
          let icon = {
            url: iconUrl,
            size: { width: 50, height: 60 },
            scaledSize: { width: 30, height: 40 },
          };
          let label = {
            text: " ",
            className: "customMarker customMarker-m" + cluster_id,
          };
          marker = this.addMarker(cluster, clusters, icon, label);
          this.markers.push(marker);
        }
      }
      // this.loading = false;
      this.$emit("loading", false);
    },
    addClusterMarker(cluster) {
      let cluster_id = getRandomInt(1, 6);
      let latlng = new this.gmap.LatLng(
        cluster.geometry.coordinates[1],
        cluster.geometry.coordinates[0]
      );
      let icon =
        window.location.origin +
        "/assets/transparent-m" +
        cluster_id.toString() +
        ".png";
      let marker = new this.gmap.Marker({
        position: latlng,
        icon: icon,
        // "https://maps.gstatic.com/mapfiles/transparent.png",
        label: {
          text: cluster.properties.point_count_abbreviated + "",
          className: "custom-clustericon custom-clustericon-m" + cluster_id,
        },
        map: this.map,
      });
      this.addClusterEventListener(marker, cluster, latlng);
      return marker;
    },
    addMarker(cluster, clusters, icon = "", label = "") {
      let marker = undefined;
      let latLng = new this.gmap.LatLng(
        cluster.geometry.coordinates[1],
        cluster.geometry.coordinates[0]
      );
      marker = new this.gmap.Marker({
        icon: icon,
        label: label,
        position: latLng,
        map: this.map,
      });
      this.addMarkerEventListener(marker, latLng, clusters);
      return marker;
    },
    async clearAllTheMarks() {
      return new Promise((resolve) => {
        for (let i = 0; i < this.markers.length; i++) {
          this.markers[i].setMap(null);
        }
        this.markers = [];
        resolve(true);
      });
    },
    addMapEventListener() {
      this.map.addListener("dragstart", () => {
        this.dragging = true;
      });
      this.map.addListener("dragend", () => {
        this.dragging = false;
        this.clearAllTheMarks().then(() => this.setupCluster());
      });
      this.map.addListener("zoom_changed", async () => {
        this.clearAllTheMarks().then(() => this.setupCluster());
      });
      // TODO: This is bad for performance use dragend instead
      // this.map.addListener("bounds_changed", () => {
      //   if (!this.dragging) {
      //     this.clearAllTheMarks().then(() => this.setupCluster());
      //   }
      // });
    },
    // eslint-disable-next-line no-unused-vars
    addMarkerEventListener(marker, latLng, properties = null) {
      this.google.maps.event.clearListeners(marker, "click");
      marker.addListener("click", () => {
        if (this.map.zoom < this.map.maxZoom) {
          this.map.setCenter(latLng);
          this.map.setZoom(this.map.zoom + 1);
        } else {
          console.log(properties);
        }
      });
    },
    addClusterEventListener(cluster, supercluster, latLng) {
      this.google.maps.event.clearListeners(cluster, "click");
      cluster.addListener("click", () => {
        let zoomCluster = this.supercluster.getClusterExpansionZoom(
          supercluster.properties.cluster_id
        );
        this.map.setCenter(latLng);
        // let zoom = zoomCluster + 1 < 17 ? zoomCluster + 1 : 16;
        // let zoom = zoomCluster + 1;
        this.map.setZoom(zoomCluster);
      });
    },
  },
};
