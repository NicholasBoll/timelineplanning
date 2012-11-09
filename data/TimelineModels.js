var timelineServer = 'http://test17cluster.rallydev.com:9020/api/';
var planningServer = 'http://test17cluster.rallydev.com:9030/';

/**
 * Timeframe Model
 */
Ext.define('Timeline.data.model.Timeframe', {
    extend: 'Ext.data.Model',
    fields: [
        { name: 'id', type: 'string' },
        { name: 'name', type: 'string' },
        { name: 'start', type: 'date' },
        { name: 'end', type: 'date' }
    ],

    belongsTo: {
        model: 'Timeline.data.store.Timeline',
        foreignKey: 'timelineId'
    }
});

/**
 * Timeframe Store
 */
Ext.define('Timeline.data.store.Timeframe', {
    extend: 'Ext.data.Store',
    model: 'Timeline.data.model.Timeframe',

    proxy: {
        type: 'jsonp',
        callbackKey: 'jsonp',
        reader: {
            type: 'json',
            root: 'data.results'
        },
        buildUrl: function (request) {
            return timelineServer + 'timeline/' + request.params.group + '/timeframes';
        }
    },

    sorters: [{
         property: 'end',
         direction: 'ASC'
    }]
});

/**
 * Timeline Model
 */
Ext.define('Timeline.data.model.Timeline', {
    extend: 'Ext.data.Model',
    fields: [
        { name: 'id', type: 'string' },
        { name: 'name', type: 'string' }
    ],

    hasMany: { model: 'Timeline.data.store.Timeframe', name: 'timeframes' },

    proxy: {
        type: 'jsonp',
        url: timelineServer + 'timeline',
        callbackKey: 'jsonp',
        reader: {
            type: 'json',
            root: 'data'
        }
    }
});

/**
 * Timeframe Store
 */
Ext.define('Timeline.data.store.Timeline', {
    extend: 'Ext.data.Store',
    model: 'Timeline.data.model.Timeline',

    proxy: {
        type: 'jsonp',
        url: timelineServer + 'timeline',
        callbackKey: 'jsonp',
        reader: {
            type: 'json',
            root: 'data.results'
        }
    }
});

/**
 * Planning model
 */
 Ext.define('Planning.data.model.Plan', {
    extend: 'Ext.data.Model',
    fields: [
        { name: 'id', type: 'string' },
        { name: 'name', type: 'string' },
        { name: 'capacity', type: 'int' },
        { name: 'timeframe' }
    ],

    hasOne: {
        associationKey: 'timeframe',
        model: 'Timeline.data.store.Timeframe',
        foreignKey: 'timeframe'
    }
 });

/**
 * Planning store
*/
 Ext.define('Planning.data.store.Plan', {
    extend: 'Ext.data.Store',
    model: 'Planning.data.model.Plan',

    proxy: {
        type: 'jsonp',
        url: planningServer + 'plan',
        callbackKey: 'jsonp',
        reader: {
            type: 'json',
            root: 'data.results'
        }
    }
 });