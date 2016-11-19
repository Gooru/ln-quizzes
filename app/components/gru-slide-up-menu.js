import Ember from 'ember';

export default Ember.Component.extend({

  // -------------------------------------------------------------------------
  // Attributes

  classNames: ['gru-slide-up-menu'],

  actions:{
    closeMenu:function(){
      this.set('visible',false);
    }
  },
  // -------------------------------------------------------------------------
  // Events
  /**
   * DidInsertElement ember event
   */
  didInsertElement: function(){
    !this.get('visible') ? $('.gru-slide-up-menu').addClass('hide'): '';
  },

  visible: false,

  setVisible: Ember.observer('visible', function() {
    if(this.get('visible')) {
      $('.gru-slide-up-menu').toggleClass('hide');
      let menuHeight = `-${$('.list-group').innerHeight()}px`;
      $('body').toggleClass('disabled-screen');
      $('.gru-slide-up-menu .list-group').css('bottom',menuHeight).animate({
        bottom: '0'
      }, 600);
    } else {
      let menuHeight = `-${$('.list-group').innerHeight()}px`;
      $('.gru-slide-up-menu .list-group' ).animate({
        bottom: menuHeight
      }, 600, function() {
        $('.gru-slide-up-menu').toggleClass('hide');
        $('body').toggleClass('disabled-screen');
      });
    }
  })

});
