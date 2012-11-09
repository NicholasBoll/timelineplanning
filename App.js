
Ext.define('CustomApp', {
    extend: 'Rally.app.App',
    componentCls: 'app',

    launch: function() {

        this.timelineStore = Ext.create('Timeline.data.store.Timeline');

        var comboBox = Ext.widget('combobox', {
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
            columns = timeline,
            timeframeStore = Ext.create('Timeline.data.store.Timeframe');

        timeframeStore.load({
            params: {
                group: timeline.get('id')
            }
        });

        timeframeStore.mon(timeframeStore, 'datachanged', this.buildCardboard, this);
        this.setLoading(true);
    },

    fetchedPlans: function (store) {
        var planningStore = Ext.create('Planning.data.store.Plan');

        planningStore.load();

        planningStore.mon(planningStore, 'datachanged', this.buildCardboard, this);
    },

    buildCardboard: function (store) {
        this.setLoading(false);
        var timeframes = store.getRange();
        var columns = [{
            displayValue: 'Backlog'
        }];
        
        Ext.Array.each(timeframes, function (timeframe, index) {
            columns.push({
                displayValue: timeframe.get('name'),
                startDate: timeframe.get('start'),
                endDate: timeframe.get('end'),
                capacity: timeframe.get('capacity')
            });
        });

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

