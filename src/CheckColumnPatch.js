Ext.define('Ext.ux.CheckColumnPatch', {
    override: 'Ext.ux.CheckColumn',

    /**
     * @cfg {Boolean} [columnHeaderCheckbox=false]
     * True to enable check/uncheck all rows
     */
    columnHeaderCheckbox: false,

    constructor: function (config) {
        var me = this;
        me.callParent(arguments);

        me.addEvents('beforecheckallchange', 'checkallchange');

        if (me.columnHeaderCheckbox) {
            me.on('headerclick', function () {
                this.updateAllRecords();
            }, me);

            me.on('render', function (comp) {
                var grid = comp.up('grid');
                this.mon(grid, 'reconfigure', function () {
                    if (this.isVisible()) {
                        this.bindStore();
                    }
                }, this);

                if (this.isVisible()) {
                    this.bindStore();
                }

                this.on('show', function () {
                    this.bindStore();
                });
                this.on('hide', function () {
                    this.unbindStore();
                });
            }, me);
        }
    },

    onStoreDateUpdate: function () {
        var allChecked,
            image;

        if (!this.updatingAll) {
            allChecked = this.getStoreIsAllChecked();
            if (allChecked !== this.allChecked) {
                this.allChecked = allChecked;
                image = this.getHeaderCheckboxImage(allChecked);
                this.setText(image);
            }
        }
    },

    getStoreIsAllChecked: function () {
        var me = this,
            allChecked = true;
        me.store.each(function (record) {
            if (!record.get(this.dataIndex)) {
                allChecked = false;
                return false;
            }
        }, me);
        return allChecked;
    },

    bindStore: function () {
        var me = this,
            grid = me.up('grid'),
            store = grid.getStore();

        me.store = store;

        me.mon(store, 'datachanged', function () {
            this.onStoreDateUpdate();
        }, me);
        me.mon(store, 'update', function () {
            this.onStoreDateUpdate();
        }, me);

        me.onStoreDateUpdate();
    },

    unbindStore: function () {
        var me = this,
            store = me.store;

        me.mun(store, 'datachanged');
        me.mun(store, 'update');
    },

    updateAllRecords: function () {
        var me = this,
            allChecked = !me.allChecked;

        if (me.fireEvent('beforecheckallchange', me, allChecked) !== false) {
            this.updatingAll = true;
            me.store.suspendEvents();
            me.store.each(function (record) {
                record.set(this.dataIndex, allChecked);
            }, me);
            me.store.resumeEvents();
            me.up('grid').getView().refresh();
            this.updatingAll = false;
            this.onStoreDateUpdate();
            me.fireEvent('checkallchange', me, allChecked);
        }
    },

    getHeaderCheckboxImage: function (allChecked) {
        var cls = [],
            cssPrefix = Ext.baseCSSPrefix;

        if (this.columnHeaderCheckbox) {
            allChecked = this.getStoreIsAllChecked();
            //Extjs 4.2.x css
            cls.push(cssPrefix + 'grid-checkcolumn');
            //Extjs 4.1.x css
            cls.push(cssPrefix + 'grid-checkheader');

            if (allChecked) {
                //Extjs 4.2.x css
                cls.push(cssPrefix + 'grid-checkcolumn-checked');
                //Extjs 4.1.x css
                cls.push(cssPrefix + 'grid-checkheader-checked');
            }
        }
        return '<div style="margin:auto" class="' + cls.join(' ') + '">&#160;</div>'
    }
});

