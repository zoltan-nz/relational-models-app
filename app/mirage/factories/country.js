import Mirage, {faker} from 'ember-cli-mirage';

export default Mirage.Factory.extend({

  name: faker.address.country,
  code: faker.address.countryCode

});
