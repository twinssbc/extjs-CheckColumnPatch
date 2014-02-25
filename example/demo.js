Ext.application({
    name: 'CheckColumn Patch Demo',
    launch: function () {
        Ext.create('Ext.container.Viewport', {
            layout: {
                type: 'vbox',
                defaultMargins: 10
            },
            items: [
                {
                    xtype: 'grid',
                    title: 'Grid with CheckColumn Patch',
                    height: 300,
                    width: 300,
                    store: Ext.create('Ext.data.Store', {
                        fields: ['name', 'selected'],
                        data: [
                            {
                                name: 'test 1',
                                selected: true
                            },
                            {
                                name: 'test 2'
                            }
                        ]
                    }),
                    columns: [
                        {
                            xtype: 'checkcolumn',
                            columnHeaderCheckbox: true,
                            sortable: false,
                            dataIndex: 'selected',
                            width: 50
                        },
                        {
                            text: 'Name',
                            dataIndex: 'name',
                            flex: 1
                        }
                    ]
                }
            ]
        });
    }
});