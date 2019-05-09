var router = new VueRouter({
  mode: "history",
  routes: []
});

const selectors = {
  checkboxItemClass: ".consultant-finder__checkbox",
  checkboxItemDisabled: "consultant-finder__multi-checkbox-item--disabled",
  checkboxIdAttribute: "data-checkbox-id"
};

Vue.component("consultant-finder-text-search", {
  data: function() {
    return {
      searchQuery: ""
    };
  },
  methods: {
    setExistingFilters: function() {
      if (window.location.search.indexOf("search") > -1) {
        const params = router.history.current.query["search"];
        this.searchQuery = params;
      }
    }
  },
  mounted: function() {
    this.setExistingFilters();
  },
  watch: {
    searchQuery: function() {
      this.$parent.$options.methods.addQueryStrings("search", this.searchQuery);
    }
  }
});

Vue.component("consultant-finder-distance-search", {
  data: function() {
    return {
      userSuppliedLocation: "",
      lat: "",
      lng: "",
      city: "",
      browserSuppliedLocation: "",
      distanceRadius: "",
      distanceMetricUnit: ""
    };
  },
  methods: {
    setExistingFilters: function() {
      if (window.location.search.indexOf("city") > -1) {
        const params = router.history.current.query["city"];
        this.city = params;
      }
      if (window.location.search.indexOf("radius") > -1) {
        const params = router.history.current.query["radius"];
        this.distanceRadius = params;
      }
    }
  },
  mounted: function() {
    var parentMethods = this.$parent.$options.methods;
    this.autocomplete = new google.maps.places.Autocomplete(
      this.$refs.autocomplete,
      { types: ["geocode"] }
    );

    this.autocomplete.addListener("place_changed", () => {
      let place = this.autocomplete.getPlace();
      let ac = place.address_components;
      this.lat = place.geometry.location.lat();
      this.lng = place.geometry.location.lng();
      this.city = ac[0]["short_name"];

      parentMethods.addQueryStrings("lat", this.lat);
      parentMethods.addQueryStrings("lng", this.lng);
      parentMethods.addQueryStrings("city", this.city);
    });

    this.setExistingFilters();
  },
  watch: {
    distanceRadius: function() {
      this.$parent.$options.methods.addQueryStrings(
        "radius",
        this.distanceRadius
      );
    }
  }
});

Vue.component("consultant-finder-checkboxes", {
  props: ["checkboxGroup", "checkboxItems"],
  data: function() {
    return {
      searchQuery: "",
      checkboxes: [],
      chosenConditions: []
    };
  },
  methods: {
    getAllCheckboxes: function() {
      const checkboxes = Array.from(this.$refs["checkboxGroups"].children);
      this.checkboxes = checkboxes;
    },
    checkForExistingQueryString: function() {
      if (window.location.search.indexOf(this.checkboxGroup) > -1) {
        const params = router.history.current.query[this.checkboxGroup];
        const paramsArray = params.split(",");

        if (Array.isArray(paramsArray)) {
          console.log("is array");
          for (var i = 0; i < paramsArray.length; i++) {
            this.chosenConditions.push(paramsArray[i]);
          }
        } else {
          this.chosenConditions.push(paramsArray);
        }
      }
    }
  },
  mounted: function() {
    this.getAllCheckboxes();
    this.checkForExistingQueryString();
  },
  watch: {
    chosenConditions: function() {
      this.$parent.$options.methods.addQueryStrings(
        this.checkboxGroup,
        this.chosenConditions
      );
    },
    searchQuery: function() {
      const checkboxArray = this.checkboxes;
      if (checkboxArray.length > 0) {
        for (var i = 0; i < checkboxArray.length; i++) {
          var checkboxId = checkboxArray[i].getAttribute(
            selectors.checkboxIdAttribute
          );
          var doesItExist = checkboxId.indexOf(this.searchQuery.toLowerCase());
          if (doesItExist === -1) {
            checkboxArray[i].classList.add(selectors.checkboxItemDisabled);
          } else {
            checkboxArray[i].classList.remove(selectors.checkboxItemDisabled);
          }
        }
      }
    }
  },
  computed: {}
});

Vue.component("consultant-finder-radio-buttons", {
  props: ["radioGroup"],
  data: function() {
    return {
      radioButtons: [],
      selectedRadioButtons: ""
    };
  },
  methods: {
    getRadioSelection: function() {
      const radioButtons = Array.from(this.$refs["radioGroups"].children);
      this.radioButtons = radioButtons;
    },
    setExistingFilters: function() {
      if (window.location.search.indexOf(this.radioGroup) > -1) {
        const params = router.history.current.query[this.radioGroup];
        this.selectedRadioButtons = params;
      }
    }
  },
  mounted: function() {
    this.getRadioSelection();
    this.setExistingFilters();
  },
  watch: {
    selectedRadioButtons: function() {
      this.$parent.$options.methods.addQueryStrings(
        this.radioGroup,
        this.selectedRadioButtons
      );
    }
  }
});

var app = new Vue({
  router,
  el: ".consultant-finder",
  data: {},
  methods: {
    addQueryStrings: function(queryStringParam, queryString) {
      var queryStringEncoded = Array.isArray(queryString)
        ? queryString.join(",")
        : queryString;
      router.push({
        path: window.location.search,
        query: { [queryStringParam]: queryStringEncoded }
      });
    }
  },
  mounted: function() {}
});
