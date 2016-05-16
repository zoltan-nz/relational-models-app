import Ember from 'ember';

export default Ember.Route.extend({

  model() {
    return Ember.RSVP.hash({
      countries: this.store.findAll('country'),
      users: this.store.findAll('user')
    });
  },
  
  setupController(controller, model) {
    this._super(controller, model.countries);
    
    controller.set('users', model.users);
  }
});
