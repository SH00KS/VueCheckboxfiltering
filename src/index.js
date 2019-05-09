var router = new VueRouter({
  mode: "history",
  routes: []
});

const selectors = {
  checkboxItemClass: ".consultant-finder__checkbox",
  checkboxItemDisabled: "consultant-finder__multi-checkbox-item--disabled",
  checkboxIdAttribute: "data-checkbox-id"
};

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

        if (Array.isArray(params)) {
          for (var i = 0; i < params.length; i++) {
            this.chosenConditions.push(params[i]);
          }
        } else {
          this.chosenConditions.push(params);
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
      selectedRadioButtons: []
    };
  },
  methods: {
    getRadioSelection: function() {
      const radioButtons = Array.from(this.$refs["radioGroups"].children);
      this.checkboxes = radioButtons;
    }
  },
  mounted: function() {
    this.getRadioSelection();
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
      var queryStringEncoded = queryString.isArray
        ? queryString.join("-")
        : queryString;
      router.push({
        path: window.location.search,
        query: { [queryStringParam]: queryStringEncoded }
      });
    }
  },
  mounted: function() {}
});
