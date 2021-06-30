import { SET_DATA } from "./mutation-types";

export default {
  /**
   *
   * @param { MapState } state
   * @param { array } data
   */
  [SET_DATA](state, { data }) {
    state.data = data;
  },
};
