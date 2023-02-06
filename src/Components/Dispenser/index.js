import React from "react";
import {useState, useEffect} from 'react';
import DispenserForm from "../DispenserForm";
import { 
    Box,
    Card,
    NoticeBox,
    DataTable,
    DataTableHead,
    DataTableColumnHeader,
    DataTableRow,
    DataTableToolbar,
    DataTableBody,
    DataTableCell,
} from '@dhis2/ui';

import ConfirmationModal from "../ConfirmationModal";
import SubmitToDataStoreButton from "../SubmitToDataStore";

export const Dispenser = (props) => {

    const [modalStatusShow, setModalStatusShow] = useState(false);
    const [dispenseDataValues, setDispenseDataValues] = useState(null);
    const [commoditySelection, setCommoditySelection] = useState('');
    const [commodityValues, setCommodityValues] = useState(null);

    useEffect(() =>{
        if(commoditySelection !== null || commoditySelection !== undefined){
            let matchingCommodity = getCommodityForMatching(commoditySelection);
            setCommodityValues(matchingCommodity);
        }
        return() =>{
            setCommodityValues(null)
        }
    },[commoditySelection]);


    //Renders the confimation modal
    // Params: 
    // dispenseData - values to show confirmation of
    // setModalStatusShow - status if modal is showing
    // handleConfirmation - function to call if confirmed
    const renderModal = () => {
        return (
            <ConfirmationModal 
                dispenseData={dispenseDataValues} 
                setModalStatusShow={setModalStatusShow}
                confirmDispense={handleConfirmation}
            />);
    }


    const handleConfirmation = () => {
        let today = new Date()
        let currentDate = today.getFullYear() + '' + (today.getMonth() + 1) + '' + today.getDate();
        let currentTime = today.getHours() + '.' + today.getMinutes();
        props.addHistory({
            commodity: dispenseDataValues.commodity,
            dispensedTo: dispenseDataValues.dispensedToPerson,
            dispensedBy: props.user,
            amount: dispenseDataValues.amount,
            date: currentDate,
            time: currentTime
        });
   
        updateDataForAll();
    }

    

    const updateDataForAll = () => { 
        let commodityId = commodityValues[0].id;
        let newConsumption = dispenseDataValues.amount
        let newEndBalance = dispenseDataValues.newEndBalance.toString()

        let dataFromQuery = props.data;
        dataFromQuery.forEach(item => {
            if(item.id == commodityId){
                     item.values[0].element.value = (parseInt(item.values[0].element.value)+parseInt(newConsumption)).toString()
                    item.values[2].element.value = newEndBalance
            }
        })
        props.setData(dataFromQuery);
        return (
            <SubmitToDataStoreButton data={dataFromQuery}/>
        )

    }

  

    
    // Gets commodity 
    const getCommodityForMatching = (selectedItem) => {
        selectedItem = selectedItem.toLowerCase()
        let matchingItem = props.data.filter( items => {
            let commodityItem = items.name.toLowerCase();
            if(commodityItem === (selectedItem)){
                return true;
            }
        })  
        return matchingItem;
    }

    const renderStockForMatches = (matchingItems) => {
        return(
            <DataTableBody>
                {matchingItems
                    .map(({ name,id, values }) => (
                        <DataTableRow key={id}>
                            <DataTableCell>{name}</DataTableCell>
                            <DataTableCell>{values[2].element.value}</DataTableCell>
                         </DataTableRow>
                    ))}
            </DataTableBody>
        );
    }

    const renderStockBalanceTableHead = () => {
        return (
                <DataTableHead>
                    <DataTableRow>
                        <DataTableColumnHeader
                            name="commodity"
                        >
                            Commodity
                        </DataTableColumnHeader>
                        <DataTableColumnHeader
                            name={'endBalance'}
                        >
                            End Balance
                        </DataTableColumnHeader>
                    </DataTableRow>
                </DataTableHead>

        );
    }


    const renderStockBalance = (selectedItem) => {
        
        let matchingItems = getCommodityForMatching(selectedItem);
        return(
            <> 
                <DataTable>
                    {renderStockBalanceTableHead()}
                    {
                        renderStockForMatches(matchingItems)
                    }                    
                </DataTable>
            </>
        );
    }

    const renderNoSelectionInfo = () => {
        return(
            <NoticeBox title="Nothing selected">
                Please enter a commodity name in the form above to view stock balance information.
            </NoticeBox>
        );
    }


    //Renders Dispenser
    return (
        <div>
            <h1>Dispenser</h1>
            <Box>
                <Card>
                    <DispenserForm 
                        data={props.data}                       
                        setData={setDispenseDataValues}         
                        setModalStatusShow={setModalStatusShow}
                        setCommoditySelection={setCommoditySelection} 
                        commodityValues={commodityValues} // Values for selected commodity
                    />
                </Card>
            </Box>
            { modalStatusShow? (renderModal()) : null }
            {
                (commoditySelection !== '')?
                    renderStockBalance(commoditySelection):   
                    renderNoSelectionInfo()
            }
        </div>
    );
};

export default Dispenser;