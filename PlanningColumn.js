Ext.define('PlanningColumn', {
    extend: 'Rally.ui.cardboard.Column',
    alias: 'widget.planningcolumn',

    config: {
        startDate: undefined,
        endDate: undefined,
        capacity: undefined
    },

    initComponent: function () {
        this.callParent(arguments);

        this.mon(this, 'beforecarddroppedsave', this.onBeforeCardDroppedSave, this);
    },

    getHeaderTpl: function () {
        return Ext.create('Ext.XTemplate',
            '<div class="ellipsis" title="{columnTitle}">{columnTitle}</div>',
            '<div class="wipLimit">({cardCount}/{capacity})</div>'
        );
    },

    getHeaderTplData: function () {
        console.log('capacity', this.getCapacity());
        return {
            columnTitle: this.getDisplayValue() || this.getValue(),
            cardCount: this.getCardCount(),
            capacity: this.getCapacity() === -1? '&#8734;' : this.getCapacity()
        };
    },

    /**
     * @private
     */
    _buildTypeColumnStores: function() {
        var stores = [],
            wsapiStoreConfig,
            columnValue,
            store;

        Ext.each(this.types, function(type) {
            wsapiStoreConfig = Ext.apply({
                model: type,
                requester: this
            }, Ext.clone(this.storeConfig));

            wsapiStoreConfig.fetch = this.getAllFetchFields();
            
            wsapiStoreConfig.filters = this.getFilters();

            store = Ext.create('Rally.data.WsapiDataStore', wsapiStoreConfig);
            this._setPageSize(store);
            stores.push(store);
        }, this);
        return stores;
    },

    getFilters: function () {
        var filters = [];
        if (this.getEndDate()) {
            filters.push({
                property: 'PlannedEndDate',
                operator: ">=",
                value: this.getStartDate().toISOString()
            },
            {
                property: 'PlannedEndDate',
                operator: '<=',
                value: new Date(+this.getEndDate() + 86400000).toISOString() // Add 24 hours to the query... We have to figure out this timezone BS
            });
        } else {
            filters.push({
                property: 'PlannedEndDate',
                operator: "=",
                value: 'null'
            });
        }

        return filters;
    },

    /**
     * We will trust the server - he fights for the user
     */
    isMatchingRecord: function(record) {
        return true;
    },

    /**
     * Save the planned start and end date of the record
     */
    onBeforeCardDroppedSave: function (column, card, type) {

        card.record.set({
            PlannedStartDate: column.getStartDate() || 'null',
            PlannedEndDate: column.getEndDate() || 'null'
        });
    }
});