Modals
==================
This document describes how communicated components with modals
 
 # Send actions from modals to Parent Component
 
 ## Before you show a modal, you need to build the model object in the parent component. 
 Inside this object you can pass any object that you need in the modal. Also you can send
  the action to be triggered on the component parent from your modal.
 
   ```let model = {
       objectToUseOnModal
       callback:{
         success: component.sendAction('actionName') //Parent component action
       }
    };```
    
  component.actions.showModal.call(component, 'modal-Name',model, null, null, null, false);
    
 ##  To trigger the parent component action, you should use the callback in the modal action
   ```actions:{
     modalAction:function(){
       this.get('model').callback.success(); 
     }```
  },
    
