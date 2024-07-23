import React from 'react';
import { useRefresh, useNotify, useDataProvider, useRecordContext } from 'react-admin';
import { Button } from '@material-ui/core';

const ToggleButton = ({ field }) => {
    const refresh = useRefresh();
    const notify = useNotify();
    const dataProvider = useDataProvider();
    const record = useRecordContext();

    if (!record) return null;

    const fieldValue = record[field] !== undefined ? record[field] : false;

    const handleClick = () => {
        const updatedRecord = { ...record, [field]: !fieldValue };
        dataProvider.update('posts', { id: record.id, data: updatedRecord, previousData: record })
            .then(() => {
                notify('Updated successfully', 'info');
                refresh();
            })
            .catch(error => {
                notify(`Error: ${error.message}`, 'warning');
            });
    };

    return (
        <Button onClick={handleClick}>
            {fieldValue ? `Un${field}` : `Set ${field}`}
        </Button>
    );
};

export default ToggleButton;
