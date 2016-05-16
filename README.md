# Relational Models in Ember Application Demo

! Note: this app is generated with `ember-cli@2.6.0-beta.2`

**Models**

user | country
--- | ---
:name | :name
:email | :code
:country | :users


## Implementation Log

Add bootstrap

    $ ember install ember-cli-sass && ember install ember-cli-bootstrap-sassy && 
      echo '@import "bootstrap";' > ./app/styles/app.scss && rm ./app/styles/app.css

Add ember-mirage

    $ ember install ember-cli-mirage

Generate models

    $ ember g model user name email country:belongsTo
    $ ember g model country name code users:hasMany

Removing example file from mirage/factory folder
    
    $ ember d factory contact
    
Create factories for ember-mirage demo api

    $ ember g factory country
    $ ember g factory user

Add content to each factory

    // app/mirage/factories/country.js
    import Mirage, {faker} from 'ember-cli-mirage';
    
    export default Mirage.Factory.extend({
    
      name: faker.address.country,
      code: faker.address.countryCode
    
    });
    

    // app/mirage/factories/user.js
    import Mirage, {faker} from 'ember-cli-mirage';

    export default Mirage.Factory.extend({

      name: faker.name.findName,
      email: faker.internet.email

    });

Add scenario to ember-mirage

    // app/mirage/scenarios/default.js
    export default function(server) {
    
      server.createList('user', 100);
      server.createList('country', 10);
      
    }

Ember Mirage configuration

    export default function() {
    
      this.namespace = 'api';    // make this `api`, for example, if your API is namespaced
      this.timing = 400;      // delay for each request, automatically set to 0 during testing
    
      this.get('/countries', function(db, request) {
        return {
          data: db.countries.map(attrs => (
          {type: 'countries', id: attrs.id, attributes: attrs}
          ))
        };
      });
    
      this.get('/users', function(db, request) {
        return {
          data: db.users.map(attrs => (
          {type: 'users', id: attrs.id, attributes: attrs}
          ))
        };
      }); 
    }

Add default JSONApi adapter

    $ ember g adapter application
    
    // app/adapters/application.js
    import JSONAPIAdapter from 'ember-data/adapters/json-api';
    
    export default JSONAPIAdapter.extend({
      namespace: '/api'
    });
    
Add default application.hbs

    $ ember g template application
    
    <div class="container">
      {{outlet}}
    </div>
    
Add index route

    $ ember g route index

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

Index template content

    <h1>Countries</h1>
    
    {{#each model as |country|}}
      <pre>{{country.name}} ({{country.code}})</pre>
      <ul>
        {{#each country.users as |user|}}
          <li>{{user.name}}</li>
        {{/each}}
      </ul>
    {{/each}}
    
    
    <h1>Users</h1>
    
    <table class="table table-bordered table-condensed">
      <thead>
        <tr>
          <th>Name</th>
          <th>Country</th>
        </tr>
      </thead>
      <tbody>
        {{#each users as |user|}}
          <tr>
            <td>{{user.name}}</td>
            <td>{{user.country.name}}</td>
          </tr>
        {{/each}}
      </tbody>
    </table>
