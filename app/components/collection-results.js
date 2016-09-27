import Ember from 'ember';
import ModalMixin from 'gooru-web/mixins/modal';

export default Ember.Component.extend(ModalMixin, {

  /**
   * @property {array} Collection results for the search
   */
  collectionResults: null,

  /**
   * @property {array} Term used to search
   */
  term: '',

  /**
   * @property {string} on content player action
   */
  onOpenContentPlayer: "onOpenContentPlayer",


  /**
   * DidInsertElement ember event
   */
  didInsertElement: function() {
      var component = this;
      component.$('[data-toggle="tooltip"]').tooltip({trigger: 'hover'});
  },
  actions:{

    /**
     * Action triggered to open the content player
     * @param {string} collectionId collection identifier
     */
    openContentPlayer: function(collectionId) {
      this.sendAction("onOpenContentPlayer", collectionId);
    },

    /**
     * On card remix collection button click
     * @param {Collection} collection
     */
    remixCollection: function (collection) {
      var remixModel = {
        content: collection
      };
      if(collection.get('isCollection')) {
        this.send('showModal', 'content.modals.gru-collection-remix', remixModel);
      } else {
        this.send('showModal', 'content.modals.gru-assessment-remix', remixModel);
      }
    }
  }
});
