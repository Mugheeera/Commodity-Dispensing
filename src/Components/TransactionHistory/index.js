import React, { useState } from 'react';
import styles from './styles.module.css';

import {
    DataTable,
    DataTableToolbar,
    DataTableHead,
    DataTableBody,
    DataTableFoot,
    DataTableRow,
    DataTableCell,
    DataTableColumnHeader,
    Input,
    Card,
    NoticeBox
} from '@dhis2/ui'
import { useDataQuery } from '@dhis2/app-service-data';

const query = {
    TransactionHistory: {resource: "dataStore/OrcInc/TransactionHistory"}
}
export const TransactionHistory = ({data}) => {

    
    const testData = [
        {
            commodity: 'Onyekachukwu',
            dispensedTo: 'Kariuki',
            dispensedBy: 'Kariuki',
            amount: 1234,
            time: 1230,
            date: 20210210
        },
        {
            commodity: 'Onyekachukwu1',
            dispensedTo: 'Kariuki1',
            dispensedBy: 'Kariuki1',
            amount: 3232435,
            time: 1230,
            date: 19990210
        },
        {
            commodity: 'Onyekachukwu2',
            dispensedTo: 'Kariuki2',
            dispensedBy: 'Kariuki2',
            amount: 1239,
            time: 1230,
            date: 20200210
        },
        {
            commodity: 'Onyekachukwu3',
            dispensedTo: 'Kariuki3',
            dispensedBy: 'Kariuki3',
            amount: 1237,
            time: 1230,
            date: 20230210
        }
    ]

    const [{ column, value }, setFilter] = useState({
        column: null,
        value: '',
    })
    const [{ columnDirection, direction }, setSortInstructions] = useState({
        columnDirection: 'amount',
        direction: 'default',
    });

    const {loading, error, returnedData} = useDataQuery(query);

    if(loading){
        return <p>Loading...</p>
    }

    if(error){
        console.log(error)
    }

    console.log("heres the data from datastore: ",returnedData);

    const getSortDirection = (columnName) =>
        columnName === columnDirection ? direction : 'default'
    const onSortIconClick = ({ name, direction }) => {
        setSortInstructions({
            columnDirection: name,
            direction,
        })
    }
    const onFilterIconClick = ({ name, show }) => {
        setFilter({
            column: show ? name : null,
            value: '',
        })
    }
    const onFilterInputChange = ({ value }) => {
        setFilter({
            column: column,
            value,
        })
    }

    const renderNoDataInfo = () => {
       //Add info that there is no data 
       return(
           <NoticeBox title="No data found.">
           </NoticeBox>
       );
    }

    const beautifyDate = (date) => {
        return date.slice(0,4)+"."+date.slice(4,6)+'.'+date.slice(6,8)
    }

    const renderTableBody = (rows) => {
        return(
            <DataTableBody>
                {rows
                    .sort((a, b) => {
                        const strA = a[columnDirection]
                        const strB = b[columnDirection]

                        if (
                            (direction === 'asc' && strA < strB) ||
                            (direction === 'desc' && strA > strB)
                        ) {
                            return -1
                        }
                        if (
                            (direction === 'desc' && strA < strB) ||
                            (direction === 'asc' && strA > strB)
                        ) {
                            return 1
                        }

                        return 0
                    })
                    .filter((row) => {
                        if (!column || !value) {
                            return true
                        }
                        return row[column]
                            .toUpperCase()
                            .includes(value.toUpperCase())
                    })
                    .map(({ date, time, amount, commodity, dispensedTo, dispensedBy }) => (
                        <DataTableRow key={date + time + amount + commodity + dispensedTo + dispensedBy}>
                            <DataTableCell>{beautifyDate(date)}</DataTableCell>
                            <DataTableCell>{time}</DataTableCell>
                            <DataTableCell>{amount}</DataTableCell>
                            <DataTableCell>{commodity}</DataTableCell>
                            <DataTableCell>{dispensedTo}</DataTableCell>
                            <DataTableCell>{dispensedBy}</DataTableCell>
                        </DataTableRow>
                    ))}
            </DataTableBody>
        );
    }

    const renderDataTable = (data) => {
        return (
            <>
            <DataTable>
                <DataTableHead>
                    <DataTableRow>
                        <DataTableColumnHeader
                            onSortIconClick={onSortIconClick}
                            sortDirection={getSortDirection('date')}
                            name={'date'}
                        >
                            Date
                        </DataTableColumnHeader>
                        <DataTableColumnHeader
                            name={'time'}
                        >
                            Time
                        </DataTableColumnHeader>
                        <DataTableColumnHeader
                            name={'amount'}
                        >
                            Amount
                        </DataTableColumnHeader>
                        <DataTableColumnHeader
                            onFilterIconClick={onFilterIconClick}
                            name="commodity"
                            showFilter={column === 'commodity'}
                            filter={
                                <Input
                                    dense
                                    onChange={onFilterInputChange}
                                    name="commodity"
                                    value={value}
                                />
                            }
                        >
                            Commodity
                        </DataTableColumnHeader>

                        <DataTableColumnHeader
                            onFilterIconClick={onFilterIconClick}
                            name="dispensedTo"
                            showFilter={column === 'dispensedTo'}
                            filter={
                                <Input
                                    dense
                                    onChange={onFilterInputChange}
                                    name="dispensedTo"
                                    value={value}
                                />
                            }
                        >
                            Dispensed To
                        </DataTableColumnHeader>
                        <DataTableColumnHeader
                            onFilterIconClick={onFilterIconClick}
                            name="dispensedBy"
                            showFilter={column === 'dispensedBy'}
                            filter={
                                <Input
                                    dense
                                    onChange={onFilterInputChange}
                                    name="dispensedBy"
                                    value={value}
                                />
                            }
                        >
                            Dispensed By
                        </DataTableColumnHeader>
                    </DataTableRow>
                </DataTableHead>
                {( (data.length !== undefined) && (data.length > 0))? renderTableBody(data): null}
            </DataTable>
            {( (data.length !== undefined) && (data.length > 0))? null:renderNoDataInfo()}
            </>
        );
    }


    return (
        <div>
            <h1>Transaction History</h1>
            <Card> 
                {console.log(data)}
                {
                    //Need to handle data properly
                    //still need to fix when passing empty data
                    //renderDataTable(testData)
                    //console.log(data)
                    renderDataTable(data)
                    
                }
            </Card>
        </div>
    );

}


export default TransactionHistory;



