const getters = {
  isShowLoginBox: state => state.user.isShowLoginBox,
  getActivePath: state => state.activePath,
  sourceCitiesByAirport: state => state.airports.map(airport => airport.city)
};

export default getters;
