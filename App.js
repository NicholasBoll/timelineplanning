
Ext.define('CustomApp', {
    extend: 'Rally.app.App',
    componentCls: 'app',

    launch: function() {

        this.timelineStore = Ext.create('Timeline.data.store.Timeline');

        var comboBox = Ext.widget('combobox', {
            fieldLabel: 'Choose Timeline',
            displayField: 'name',
            valueField: 'id',
            store: this.timelineStore,
            listeners: {
                'select': this.selectedTimeline,
                scope: this
            }
        });

        this.add(comboBox);
    },

    selectedTimeline: function (combobox, records, options) {
        var timeline = records.shift(),
            columns = timeline;

        this.timeframeStore = Ext.create('Timeline.data.store.Timeframe');

        this.timeframeStore.load({
            params: {
                group: timeline.get('id')
            }
        });

        this.timeframeStore.mon(this.timeframeStore, 'datachanged', this.fetchedPlans, this);
        this.setLoading(true);
    },

    fetchedPlans: function (store) {
        this.planningStore = Ext.create('Planning.data.store.Plan');

        this.planningStore.load();

        this.planningStore.mon(this.planningStore, 'datachanged', this.buildCardboard, this);
    },

    buildCardboard: function (store) {
        this.setLoading(false);
        var plans = store.getRange();
        var columns = [{
            displayValue: 'Backlog'
        }];

        Ext.Array.each(plans, function (plan, index) {
            var timeframe = this.timeframeStore.findRecord('id', plan.get('timeframe'));
            columns.push({
                displayValue: timeframe.get('name'),
                startDate: timeframe.get('start'),
                endDate: timeframe.get('end'),
                capacity: plan.get('capacity')
            });
        }, this);

        var cardboard = Ext.widget('rallycardboard', {
            types: 'PortfolioItem/Feature',
            columns: columns,
            columnConfig: {
                xtype: 'planningcolumn',
                capacity: -1
            }
        });
        this.add(cardboard);
    }
});

