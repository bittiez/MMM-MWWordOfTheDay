Module.register("MMM-MWWordOfTheDay",{
	// Default module config.
	defaults: {
		updateInterval: 120000,
		headerText: "Word of the day"
	},
	
	requiresVersion: "2.1.0",

	start: function() {
		var self = this;
		var dataNotification = null;

		// Schedule update timer.
		this.getData();
		setInterval(function() {
			self.updateDom();
		}, this.config.updateInterval);
	},
	
	getScripts: function() {
		return [
			'xml2json.min.js',
		]
	},
	
	getStyles: function() {
		return [
			this.file('style.css'), // this file will be loaded straight from the module folder.
		]
	},
	
	getData: function() {
		var self = this;
		this.sendSocketNotification("MMM-MWWordOfTheDay-DATA_CHANGE", null);
	},
	
	scheduleUpdate: function(delay) {
		var nextLoad = this.config.updateInterval;
		if (typeof delay !== "undefined" && delay >= 0) {
			nextLoad = delay;
		}
		nextLoad = nextLoad ;
		var self = this;
		setTimeout(function() {
			self.getData();
		}, nextLoad);
	},

	socketNotificationReceived: function (notification, payload) {
		var self = this;
		if(notification === "MMM-MWWordOfTheDay-DATA_CHANGE") {
			var x2js = new X2JS();
			var jsonObj = x2js.xml_str2json( payload );
			this.dataNotification = jsonObj;
			self.updateDom(self.config.animationSpeed);
		}
	},

	// Override dom generator.
	getDom: function() {
		var self = this;
		var wrapper = document.createElement("div");
		var wotd = document.createElement("div");
		wotd.setAttribute('class', 'wotd-title');
		var headerLabel = document.createElement("header");
		headerLabel.setAttribute('class', 'wotd-header module-header');
		headerLabel.innerHTML = "<span style=\"text-decoration: underline;\">" + this.config.headerText + "</span>";
		var summary = document.createElement("span");
		summary.setAttribute('class', 'wotd-summary');
		if(this.dataNotification != null){
			wotd.innerHTML = this.dataNotification.rss.channel.item[0].title;
			summary.innerHTML = this.dataNotification.rss.channel.item[0].shortdef;
		}
		wrapper.appendChild(headerLabel);
		wrapper.appendChild(wotd);
		wrapper.appendChild(summary);
		return wrapper;
	},
});