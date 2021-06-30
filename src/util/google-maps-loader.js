import { Loader } from "@googlemaps/js-api-loader";
import { waitUntil } from "@/util/wait-until";
import Supercluster from "supercluster";

export class GoogleMapsLoader {
  _loader = undefined;
  _maps = undefined;
  _ready = false;
  maps = undefined;
  cluster = new Supercluster();
  constructor() {
    this._initLoader();
    this._initMaps()
      .then(() => this._initCluster())
      .catch(() => console.log("Couldn't clustering"));
  }
  _initLoader() {
    console.log(process.env);
    this._loader = new Loader({
      apiKey: process.env.VUE_APP_GOOGLE_KEY,
      version: "weekly",
      language: "en",
    });
  }
  async _initMaps() {
    if (this._loader) {
      const loaded = await this._loader.load();
      this._maps = loaded.maps;
      this.maps = loaded.maps;
      this._ready = true;
    }
  }
  async isReady() {
    await waitUntil(() => this._ready);
    return this._ready;
  }
  _initCluster() {
    this.maps.SuperCluster = (options) => new Supercluster(options);
  }
}
