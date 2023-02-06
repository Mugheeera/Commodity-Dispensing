import React, { useState } from 'react';
import {
  DataTable,
  DataTableHead,
  DataTableBody,
  DataTableRow,
  DataTableCell,
  DataTableColumnHeader,
  Input,
  Modal,
  ModalContent,
  Card,
  NoticeBox,
  Button,
  ButtonStrip
} from '@dhis2/ui';
import { SubmitDataButton } from "./SubmitData";

export function ConsumptionForm(props) {
  // console.log(props.data)
  const [showModal, setShowModal] = useState(false);
  
  // Function that stores non-empty input fields in local storage
  function storeValue(){
    let inputs = document.querySelectorAll("input");
    inputs.forEach(e => {
      if(e.value > 0) {
        window.localStorage.setItem(e.id, e.value);
      }
      else{
        window.localStorage.removeItem(e.id);
      }
    })
  }
  
  // Function that produces changesArray based on input-values
  function aggregateChanges(){
    let changesArray = [];
    let inputs = document.querySelectorAll("input");
    // Loop through all the input fields. Only use the non-empty
    inputs.forEach(input => {
      if(input.value > 0) {
        // Loop through props to find entry with same id
        props.data.map(e => {
          if(input.id === e.id){
            // console.log(e.values[1].element.value + "=>" + (+input.value + +e.values[1].element.value))
            let change = {
              dataElement: e.values[1].element.dataElement,
              categoryOptionCombo: e.values[1].element.categoryOptionCombo,
              value: (+e.values[1].element.value + +input.value).toString()
            }
            // console.log(change);
            changesArray.push(change);
          }
        })
      }
    })
    // console.log(changesArray)
    return(changesArray);
  }

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
    //Add info that there is no data 
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
            // console.log(row)
            // console.log("value:" + value)
          if(row.name !== undefined){
            return row.name
            .toUpperCase()
            .includes(value.toUpperCase())
          }
          })
          .map(e => {
            // If local storage contains an item with key = e.id, set defaultValue in the input to the stored value
            if(localStorage.getItem(e.id) !== null){
              return(
                <DataTableRow key={e.id}>
                  <DataTableCell>{e.name}</DataTableCell>
                  <DataTableCell>{e.values[0].element.value}</DataTableCell>
                  <DataTableCell>{e.values[2].element.value}</DataTableCell>
                  <DataTableCell>{<input type="number" min="0" id={e.id} defaultValue={localStorage.getItem(e.id)} onInput={storeValue}></input>}</DataTableCell>
                </DataTableRow>
              )
            }
            // Otherwise, display the placeholder in the input
            else {
              return(
                <DataTableRow key={e.id}>
                  <DataTableCell>{e.name}</DataTableCell>
                  <DataTableCell>{e.values[0].element.value}</DataTableCell>
                  <DataTableCell>{e.values[2].element.value}</DataTableCell>
                  <DataTableCell>{<input type="number" min="0" id={e.id} placeholder="Enter amount here" onInput={storeValue}></input>}</DataTableCell>
                </DataTableRow>
              )
            }
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
                  name={'Consumption'}
                  fixed top="0"
                >
                  Consumption
                </DataTableColumnHeader>
                <DataTableColumnHeader
                  name={'End balance'}
                  fixed top="0"
                >
                  End Balance
                </DataTableColumnHeader>
                <DataTableColumnHeader
                  name={'Quantity to be ordered'}
                  fixed top="0"
                >
                  Quantity to be ordered
                </DataTableColumnHeader>
              </DataTableRow>
            </DataTableHead>
          {(data.length !== undefined)? renderTableBody(data): null}
        </DataTable>
      {(data.length !== undefined)? null:renderNoDataInfo()}
    </>
  );
}

// Function that displays popup
const ChangesModal = () => {
  let array = aggregateChanges();

  return (
    <Modal onClose={hideModal}>
      <ModalContent>
        <h2> Receipt </h2>
        <DataTable>
          <DataTableHead>
            <DataTableRow>
              <DataTableColumnHeader>
                Commoditiy
              </DataTableColumnHeader>
              <DataTableColumnHeader>
                Quantity to be ordered
              </DataTableColumnHeader>
            </DataTableRow>
          </DataTableHead>
        {props.data.map(e => {
          if(array.filter(entry => entry.dataElement === e.values[1].element.dataElement).length > 0){
            let value = document.getElementById(e.id).value
            if(value > 0) {
              return(
                <DataTableBody key={e.id}>
                  <DataTableRow>
                    <DataTableCell>{e.name}</DataTableCell>
                    <DataTableCell>{value}</DataTableCell>
                  </DataTableRow>
                </DataTableBody>
              )
            }
          }
        })}
        </DataTable>
        <ButtonStrip end>
          <Button destructive name="cancel" onClick={hideModal}>Cancel</Button>
          <SubmitDataButton changesArray={array} function={resetInput}/>
        </ButtonStrip>
      </ModalContent>
    </Modal>
  )
}
// Function that deletes input-values from local storage and resets the input-values
// Also closes the modal.
function resetInput(){
  let inputs = document.querySelectorAll("input");
  inputs.forEach(e => {
    // If localstorage contains an item with key = e.id
    if(localStorage.getItem(e.id) !== null){
      localStorage.removeItem(e.id)
      e.value = null;
    }
  })
  hideModal();
}

function revealModal(){
  setShowModal(true);
}

function hideModal(){
  setShowModal(false);
}

  return (
    <div>
      <h1>Consumption Form</h1>
      <NoticeBox title="Remember to report in pack sizes"></NoticeBox>
      {showModal === true && <ChangesModal />}
      <Card> 
        {
          renderDataTable(props.data)
        }
      </Card>
      <ButtonStrip>
        <Button primary name="submit" onClick={revealModal}>Submit</Button>
      </ButtonStrip>
    </div>
    
)};
