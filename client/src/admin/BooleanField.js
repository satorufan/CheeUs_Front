import React from 'react';
import { useRecordContext } from 'react-admin';

const BooleanField = ({ source }) => {
    const record = useRecordContext();
    if (!record || typeof record[source] === 'undefined') {
        return null;
    }
    return (
        <span>
            {record[source] ? '✅' : '❌'}
        </span>
    );
};

export default BooleanField;
