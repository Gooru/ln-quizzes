import Ember from 'ember';

export default Ember.Component.extend({
  // -------------------------------------------------------------------------
  // Dependencies
  /**
   * @property {Service} I18N service
   */
  i18n: Ember.inject.service(),

  // -------------------------------------------------------------------------
  // Attributes

  classNames: ['gru-assignments-table'],


  // -------------------------------------------------------------------------
  // Actions

  actions: {
    /***
     * Search assignment
     */
    selectAssignment: function (assignment) {
      this.selectAssignment(assignment);
      this.sendAction('onSelectAssignment',assignment);
    }
  },
  // -------------------------------------------------------------------------
  // Methods
  /**
   * Set assignment as selected
   */
  selectAssignment:function(assignment){
    this.unSelectAssignment();
    assignment.set('selected',true);
  },
  /**
   * Unselected assignment
   */
  unSelectAssignment:function(){
    var selectedAssignment = this.get('assignments').findBy('selected',true);
    if(selectedAssignment){
      selectedAssignment.set('selected',false);
    }
  }
});
