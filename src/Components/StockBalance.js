import React, { useState } from 'react';
import {
  DataTable,
  DataTableHead,
  DataTableBody,
  DataTableRow,
  DataTableCell,
  DataTableColumnHeader,
  Input,
  Card,
  NoticeBox
} from '@dhis2/ui'

export function StockBalance(props) {
  
  const [{ column, value }, setFilter] = useState({
    column: null,
    value: '',
  })
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
    return(
      <NoticeBox title="No data found.">
      </NoticeBox>
    );
  }

  // Function that renders table body
  const renderTableBody = (rows) => {
    return(
      <DataTableBody>
        {rows
          .sort((a, b) => {
            let fa = a.name.toLowerCase(),
              fb = b.name.toLowerCase();
              if(fa > fb) return 1;
              if(fa < fb) return -1;
              return 0;
            })
          .filter((row) => {
            if (!column || !value) {
              return true
            }
          if(row.name !== undefined){
            return row.name
            .toUpperCase()
            .includes(value.toUpperCase())
          }
          })
          .map(e => {
              return(
                <DataTableRow key={e.id}>
                  <DataTableCell>{e.name}</DataTableCell>
                  <DataTableCell>{e.values[2].element.value}</DataTableCell>
                </DataTableRow>
              )
            }    
        )}
      </DataTableBody>
    );
  }

  // Function that renders table headers
  const renderDataTable = (data) => {
    return (  
      <>
        <DataTable>
            <DataTableHead>
                <DataTableRow>
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
                    fixed top="0"
                  >
                    Commodity
                  </DataTableColumnHeader>
                
                  <DataTableColumnHeader
                    name={'End balance'}
                    fixed top="0"
                  >
                    End Balance
                  </DataTableColumnHeader>
          
                </DataTableRow>
              </DataTableHead>
            {(data.length !== undefined)? renderTableBody(data): null}
          </DataTable>
        {(data.length !== undefined)? null:renderNoDataInfo()}
      </>
    );
  }

  return (
    <div>
      <h1>Stock Balance</h1>
      <Card> 
        {
          renderDataTable(props.data)
        }
      </Card>
    </div>
  )
};
