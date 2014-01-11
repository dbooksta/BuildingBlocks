window.App = Ember.Application.create();
App.ApplicationAdapter = DS.FixtureAdapter.extend();

App.Store = DS.Store.extend({
	revision: 11,
	adapter: 'DS.FixtureAdapter'
});

//Routers
App.Router.map(function() {
	this.resource('modelPortfolio', {path:'modelPortfolio/:modelPortfolio_id'});
	this.resource('strategy', {path:'strategy/:strategy_id'});
});

//Controllers
App.NavBarController = Ember.ObjectController.extend({

	actions: {
		addModelPortfolio: function(){
			var newModelPortfolio = this.store.createRecord('modelPortfolio', {name:'New Model'});
			this.transitionToRoute('modelPortfolio', newModelPortfolio);
		},
		addStrategy: function(){
			var newStrategy = this.store.createRecord('strategy', {name:'New Strategy'});
			this.transitionToRoute('strategy', newStrategy);
		}
	},

	//Computed property to provide list of modelPortfolios in nav bar
	modelPortfolios: function() {
		return this.store.find('modelPortfolio');
	}.property(),

	//Computed property to provide list of strategies in nav bar
	strategies: function() {
		return this.store.find('strategy');
	}.property()
});

App.ModelPortfolioController = Ember.ObjectController.extend({

	//Computed property to provide list of strategies in nav bar
	strategies: function() {
		return this.store.find('strategy');
	}.property()
});

//View
Ember.Handlebars.registerBoundHelper('formatCurrency', function(value){
	return '$'+parseFloat(value, 10).toFixed(2);
});

Ember.Handlebars.registerBoundHelper('formatPercent', function(value){
	return (value*100.0).toFixed(0)+'%';
});

//Models
App.ModelPortfolio = DS.Model.extend({
	name: DS.attr('string'),
	nav: DS.attr('money'),
	weightedStrategys: DS.hasMany('weightedStrategy', { async: true })
});

App.WeightedStrategy = DS.Model.extend({
	weight: DS.attr('number'),
	strategy: DS.belongsTo('strategy')
});

App.Strategy = DS.Model.extend({
	name: DS.attr('string'),
	universe: DS.belongsTo('universe'),
	portfolioAlgo: DS.belongsTo('portfolioAlgo'),
	weightedHoldings: DS.hasMany('weightedHolding', { async: true })
});

App.WeightedHolding = DS.Model.extend({
	security: DS.belongsTo('security'),
	weight: DS.attr('number')
});

App.Security = DS.Model.extend({
 	symbol: DS.attr('string'),
 	price: DS.attr('number')
});

App.Universe = DS.Model.extend({
	type: DS.attr('string'),
	name: DS.attr('string')
});

App.PortfolioAlgo = DS.Model.extend({
	type: DS.attr('string'),
	name: DS.attr('string')
});

//Fixtures
App.ModelPortfolio.FIXTURES = [
	{id: 1, name: 'High Yield', weightedStrategys: [1]},
	{id: 2, name: 'Passive ETF', weightedStrategys: [2]},
	{id: 3, name: 'Active Speculation', weightedStrategys: [3,4]},
	{id: 4, name: 'Diversified', weightedStrategys: [5,6,7,8]}
];

App.WeightedStrategy.FIXTURES = [
	{id: 1,	weight: 1, strategy: 1},
	{id: 2, weight: 1, strategy: 2},
	{id: 3, weight: .5, strategy: 3},
	{id: 4, weight: .5, strategy: 4},
	{id: 5, weight: .1, strategy: 1},
	{id: 6, weight: .7, strategy: 2},
	{id: 7, weight: .1, strategy: 3},
	{id: 8, weight: .1, strategy: 4}
];

App.Strategy.FIXTURES= [
	{
		id: 1,
		name: 'S&P500 High Yield Covered Call',
		universe: 1,
		portfolioAlgo: 2,
		weightedHoldings: [1,2,3,4,5]
	},
	{
		id: 2,
		name: 'Passive ETF Balanced Strategy',
		universe: 5,
		portfolioAlgo: 1,
		weightedHoldings: [6,7,8,9,10,11]
	},
	{
		id: 3,
		name: 'New Tech Mo Shorts',
		universe: 8,
		portfolioAlgo: 3,
		weightedHoldings: [12,13,14]
	},
	{
		id: 4,
		name: 'Hedge Fund: Third Point Mirror',
		universe: 11,
		portfolioAlgo: 4,
		weightedHoldings: [15,16,17,18,19]
	}
];

App.WeightedHolding.FIXTURES = [
	{id: 1, weight: .2, security: 1},
	{id: 2, weight: .2, security: 2},
	{id: 3, weight: .2, security: 3},
	{id: 4, weight: .2, security: 4},
	{id: 5, weight: .2, security: 5},
	{id: 6, weight: .35, security: 6},
	{id: 7, weight: .22, security: 7},
	{id: 8, weight: .28, security: 8},
	{id: 9, weight: .05, security: 9},
	{id: 10, weight: .05, security: 10},
	{id: 11, weight: .05, security: 11},
	{id: 12, weight: .5, security: 12},
	{id: 13, weight: .25, security: 13},
	{id: 14, weight: .25, security: 14},
	{id: 15, weight: .3, security: 15},
	{id: 16, weight: .28, security: 16},
	{id: 17, weight: .17, security: 17},
	{id: 18, weight: .13, security: 18},
	{id: 19, weight: .12, security: 19}
];

App.Universe.FIXTURES = [
	{id: 1, type: 'Yield', name: 'S&P High Dividend'},
	{id: 2, type: 'Yield', name: 'MLP Dividends'},
	{id: 3, type: 'Yield', name: 'REIT Dividends'},
	{id: 4, type: 'Yield', name: 'MBS Closed End Funds'},
	{id: 5, type: 'ETF', name: 'Passive Balanced'},
	{id: 6, type: 'ETF', name: 'Commodity Funds'},
	{id: 7, type: 'ETF', name: 'Emerging Equity ETFs'},
	{id: 8, type: 'Sector', name: 'New Tech'},
	{id: 9, type: 'Sector', name: 'Oil Majors'},
	{id: 10, type: 'Sector', name: 'Big Cap Tech'},
	{id: 11, type: 'Hedge Fund', name: 'Third Point'},
	{id: 12, type: 'Hedge Fund', name: 'Greenlight'},
	{id: 13, type: 'Hedge Fund', name: 'Relational Investors'},
	{id: 14, type: 'Hedge Fund', name: 'Appaloosa'}
];

App.PortfolioAlgo.FIXTURES = [
	{id: 1, type: 'Passive', name: 'Buy and Hold'},
	{id: 2, type: 'Passive', name: 'Covered Call'},
	{id: 3, type: 'Active', name: 'Short Momentum'},
	{id: 4, type: 'Passive', name: 'Hedge Fund Clone'}
];

App.Security.FIXTURES = [
	{id: 1, symbol: 'MSFT', price: 35.53},
	{id: 2, symbol: 'SDRL', price: 39.71},
	{id: 3, symbol: 'BP', price: 48.85},
	{id: 4, symbol: 'FMC', price: 74.36},
	{id: 5, symbol: 'MRK', price: 49.52},
	{id: 6, symbol: 'VTI', price: 95.57},
	{id: 7, symbol: 'VEA', price: 41.09},
	{id: 8, symbol: 'VWO', price: 39.11},
	{id: 9, symbol: 'VIG', price: 74.72},
	{id: 10, symbol: 'DJP', price: 35.75},
	{id: 11, symbol: 'MUB', price: 104.8},
	{id: 12, symbol: 'TWTR', price: 57},
	{id: 13, symbol: 'FB', price: 57.94},
	{id: 14, symbol: 'P', price: 33.47},
	{id: 15, symbol: 'YHOO', price: 41.23},
	{id: 16, symbol: 'AIG', price: 52.22},
	{id: 17, symbol: 'BID', price: 52.27},
	{id: 18, symbol: 'FDX', price: 142.63},
	{id: 19, symbol: 'LBTYA', price: 89.65}
];