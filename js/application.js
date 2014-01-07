window.App = Ember.Application.create();
App.ApplicationAdapter = DS.FixtureAdapter.extend();

App.Store = DS.Store.extend({
	revision: 11,
	adapter: 'DS.FixtureAdapter'
});

//Routers
App.Router.map(function() {
	this.resource('users', function(){
		this.resource('user', {path:':user_id'}, function(){
			this.route('edit');
		});
		this.route('create');
	}); 
});

App.IndexRoute = Ember.Route.extend({
	redirect:function(){
		this.transitionTo('users');
	}
});

App.UsersRoute = Ember.Route.extend({
	model: function(){
		return this.store.find('user');
	}
});

App.UserEditRoute = Ember.Route.extend({
	model: function(){
		return this.modelFor('user');
	}
});

App.UsersCreateRoute = Ember.Route.extend({
	model: function(){
		return Em.Object.create({});
	},

	renderTemplate: function(){
		this.render('user.edit', {controller: 'usersCreate'});
	}
});

//Controllers
App.PortfolioController = Ember.ObjectController.extend();
App.BlockController = Ember.ArrayController.extend();
App.SecurityController = Ember.ArrayController.extend();
App.PositionController = Ember.ArrayController.extend();
App.BrokerageAccountsController = Ember.ArrayController.extend();

App.UserController = Ember.ObjectController.extend({
	actions: {
		addNewAccount: function(){

			var newAccount = this.store.createRecord('brokerageAccount', {
				financialInstitution: this.get('newFinancialInstitution'),
				accountType: this.get('newAccountType'),
				accountNumber: this.get('accountNumber')				
			});

			var user = this.get('model');
			{{debugger}}
			user.brokerageAccounts.pushObject(newAccount);
			user.save();
		}
	}
});

App.UsersCreateController = Ember.ObjectController.extend({
	actions:{
		save: function(){
			this.get('model').set('createDate', new Date());

			var newUser = this.store.createRecord('user', this.get('model'));
			newUser.save();

			this.transitionToRoute('user', newUser);
		},
		addAccount: function(){
			this.toggleProperty('addAccountMode');
		},
		confirmAddAccount: function(){
			this.get('model').brokerageAccounts.add
		}
	}
});

//View
Ember.Handlebars.registerBoundHelper('formatCurrency', function(value){
	return '$'+parseFloat(value, 10).toFixed(2);
});


//Models
App.BrokerageAccount = DS.Model.extend({
	user: DS.belongsTo('user'),

 	financialInstitution: DS.attr('string'),
 	accountType: DS.attr('string'),
 	accountNumber: DS.attr('string')
 });

 App.Security = DS.Model.extend({
 	symbol: DS.attr('string'),
 	name: DS.attr('string'),
 	price: DS.attr('number')
 });

App.Position = DS.Model.extend({
	block: DS.belongsTo('block'),

 	//brokerageAccount: DS.belongsTo('brokerageAccount'),
 	security: DS.belongsTo('security'),

 	currentVal: DS.attr('number'),
 	targetVal: DS.attr('number'),
 	diffVal: DS.attr('number'),

 	currentPct: DS.attr('number'),
 	targetPct: DS.attr('number'),
 	diffPct: DS.attr('number'),

 	currentShares: DS.attr('number'),
 	targetShares: DS.attr('number'),
 	diffShares: DS.attr('number')
 });

 App.Block = DS.Model.extend({
 	portfolio: DS.belongsTo('portfolio'),

 	strategy: DS.attr('string'),
 	universe: DS.attr('string'),
 	positions: DS.hasMany('position'),

 	currentVal: function() {
	  	return this.get('positions').getEach('currentVal').reduce(function(accum, item){
	  			return accum+item;
	  		}, 0);
 	}.property('positions.@each.currentVal'),

 	targetVal: function() {
	  	return this.get('positions').getEach('targetVal').reduce(function(accum, item){
	  			return accum+item;
	  		}, 0);
 	}.property('positions.@each.targetVal'),

 	diffVal: function() {
	  	return this.get('positions').getEach('diffVal').reduce(function(accum, item){
	  			return accum+item;
	  		}, 0);
 	}.property('positions.@each.diffVal')

 });

App.Portfolio = DS.Model.extend({
 	blocks: DS.hasMany('block')
});

App.User = DS.Model.extend({
	name: DS.attr('string'),
	portfolio: DS.belongsTo('portfolio'),
	brokerageAccounts: DS.hasMany('brokerageAccount', { async: true })
});

//Fixtures
App.User.FIXTURES = [{
		id: 1,
		name: 'Dan Bookstaber',
		portfolio: 1,
		brokerageAccounts: [1]
	},	{
		id: 2,
		name: 'Leland Stanford',
		portfolio: 2,
		brokerageAccounts: [2,3,4]
	}
];

 App.BrokerageAccount.FIXTURES = [
 	{
 		id: 1,
 		financialInstitution: 'Interactive Brokers',
 		accountType: 'Brokerage',
 		accountNumber: '517120'
 	},
 	{
 		id: 2,
 		financialInstitution: 'Schwab - Brokerage',
 		accountType: 'Brokerage',
 		accountNumber: '1025971'
 	},
 	{
 		id: 3,
 		financialInstitution: 'Schwab - 401K',
 		accountType: '401K',
 		accountNumber: 'ADD1027KK'
 	},
 	{
 		id: 4,
 		financialInstitution: 'BNY Mellon',
 		accountType: 'Custody',
 		accountNumber: 'AALWELG98'
 	}
 ];

 App.Portfolio.FIXTURES = [
 	{
 		id: 1,
 		blocks: [1,2,3]
 	},
 	{
 		id: 2,
 		blocks: [1]
 	}
 ];

 App.Block.FIXTURES = [
 	{
 		id: 1,
 		strategy: "Buy and Hold",
 		universe: "Global Beta",
 		positions: [1,2,3,4,5,6]
 	},
 	{
 		id: 2,
 		strategy: "Covered Call",
 		positions: [8,9,10]
 	},
 	{
 		id: 3,
 		strategy: "Custom",
 		universe: "Custom",
 		positions: [21,27,28,33]
 	}
 ];

 App.Position.FIXTURES = [
 	{
 	id:1,
 	security: 1,

 	currentVal:27816.8,
 	targetVal:27816.8,
 	diffVal:0,

 	currentPct:0.1233560976,
 	targetPct:0.1225,
 	diffPct:-0.000856097561,

 	currentShares:290,
 	targetShares:290,
 	diffShares: 0
 	},

 	{
 	id:2,
 	security: 2,

 	currentVal:17505.6,
 	targetVal:17505.6,
 	diffVal:0,

 	currentPct:0.07763015521,
 	targetPct:0.077,
 	diffPct:-0.0006301552106,

 	currentShares:420,
 	targetShares:420,
 	diffShares: 0
 	},

 	{
 	id:3,
 	security: 3,

 	currentVal:22215.6,
 	targetVal:22215.6,
 	diffVal:0,

 	currentPct:0.09851707317,
 	targetPct:0.098,
 	diffPct:-0.0005170731707,

 	currentShares:540,
 	targetShares:540,
 	diffShares: 0
 	},

 	{
 	id:4,
 	security: 4,

 	currentVal:3762,
 	targetVal:3762,
 	diffVal:0,

 	currentPct:0.01668292683,
 	targetPct:0.0175,
 	diffPct:0.0008170731707,

 	currentShares:50,
 	targetShares:50,
 	diffShares: 0
 	},

 	{
 	id:5,
 	security: 5,

 	currentVal:4042.5,
 	targetVal:4042.5,
 	diffVal:0,

 	currentPct:0.01792682927,
 	targetPct:0.0175,
 	diffPct:-0.0004268292683,

 	currentShares:110,
 	targetShares:110,
 	diffShares: 0
 	},

 	{
 	id:6,
 	security: 6,

 	currentVal:4149.6,
 	targetVal:4149.6,
 	diffVal:0,

 	currentPct:0.01840177384,
 	targetPct:0.0175,
 	diffPct:-0.0009017738359,

 	currentShares:40,
 	targetShares:40,
 	diffShares: 0
 	},

 	{
 	id:8,
 	security: 8,

 	currentVal:7482,
 	targetVal:7482,
 	diffVal:0,

 	currentPct:0.03317960089,
 	targetPct:0.03333333333,
 	diffPct:0.0001537324464,

 	currentShares:200,
 	targetShares:200,
 	diffShares: 0
 	},

 	{
 	id:9,
 	security: 9,

 	currentVal:8216,
 	targetVal:8216,
 	diffVal:0,

 	currentPct:0.0364345898,
 	targetPct:0.03333333333,
 	diffPct:-0.003101256467,

 	currentShares:200,
 	targetShares:200,
 	diffShares: 0
 	},

 	{
 	id:10,
 	security: 10,

 	currentVal:9722,
 	targetVal:9722,
 	diffVal:0,

 	currentPct:0.04311308204,
 	targetPct:0.03333333333,
 	diffPct:-0.009779748707,

 	currentShares:200,
 	targetShares:200,
 	diffShares: 0
 	},

 	{
 	id:21,
 	security: 21,

 	currentVal:3420,
 	targetVal:3420,
 	diffVal:0,

 	currentPct:0.01516629712,
 	targetPct:0.01516629712,
 	diffPct:0,

 	currentShares:400,
 	targetShares:400,
 	diffShares: 0
 	},

 	{
 	id:27,
 	security: 27,

 	currentVal:38766,
 	targetVal:38766,
 	diffVal:0,

 	currentPct:0.1719113082,
 	targetPct:0.1719113082,
 	diffPct:0,

 	currentShares:2600,
 	targetShares:2600,
 	diffShares: 0
 	},

 	{
 	id:28,
 	security: 28,

 	currentVal:-11148,
 	targetVal:-11148,
 	diffVal:0,

 	currentPct:-0.0494368071,
 	targetPct:-0.0494368071,
 	diffPct:0,

 	currentShares:-400,
 	targetShares:-400,
 	diffShares: 0
 	},

 	{
 	id:33,
 	security: 33,

 	currentVal:19442.7,
 	targetVal:19442.7,
 	diffVal:0,

 	currentPct:0.08622039911,
 	targetPct:0.08622039911,
 	diffPct:0,

 	currentShares:758,
 	targetShares:758,
 	diffShares: 0
 	}
 ];

 App.Security.FIXTURES = [
 {
 id:1,
 symbol:'VTI',
 name:'VTI',
 price:95.92
 },
 {
 id:2,
 symbol:'VEA',
 name:'VEA',
 price:41.68
 },
 {
 id:3,
 symbol:'VWO',
 name:'VWO',
 price:41.14
 },
 {
 id:4,
 symbol:'VIG',
 name:'VIG',
 price:75.24
 },
 {
 id:5,
 symbol:'DJP',
 name:'DJP',
 price:36.75
 },
 {
 id:6,
 symbol:'MUB',
 name:'MUB',
 price:103.74
 },
 {
 id:8,
 symbol:'MSFT',
 name:'MSFT',
 price:37.41
 },
 {
 id:9,
 symbol:'SDRL',
 name:'SDRL',
 price:41.08
 },
 {
 id:10,
 symbol:'BP',
 name:'BP',
 price:48.61
 },
 {
 id:21,
 symbol:'FNMAS',
 name:'FNMAS',
 price:8.55
 },
 {
 id:27,
 symbol:'NMFC',
 name:'NMFC',
 price:14.91
 },
 {
 id:28,
 symbol:'P',
 name:'P',
 price:27.87
 },
 {
 id:33,
 symbol:'STON',
 name:'STON',
 price:25.65
 }

 ];
