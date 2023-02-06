import React from 'react'
import classes from './App.module.css'
import { Navigation } from './Components/Navigation';
import { useState } from "react";
import { useDataQuery } from '@dhis2/app-service-data';

import { Dispenser } from "./Components/Dispenser";
import { StockBalance } from "./Components/StockBalance";
import { ConsumptionForm } from "./Components/ConsumptionForm";
<<<<<<< HEAD

import { TransactionHistory } from "./Components/TransactionHistory";

=======
import { TransactionHistory } from "./Components/TransactionHistory";

import { CircularLoader } from '@dhis2/ui'
>>>>>>> 8b52b596c7df468028d3b5ae29c3f9698b5ee9d9

const query = {
    dataSets: {
        dataSet: "ULowA8V3ucd",
        resource: 'dataSets/ULowA8V3ucd',
        params: {
            paging: false,
            fields: [
                'id',
                'name',
                'dataSetElements[dataElement[name,id,categoryCombo[name,id,categoryOptionCombos[name,id]]]'
            ]
        }
    },
    dataValueSets: {
        resource: 'dataValueSets',
        params: {
            dataSet: "ULowA8V3ucd",
            period: "202109",
            orgUnit: "ImspTQPwCqd"
        }
    },
    me: {
        resource: 'me',
        params: {
            fields: [
                "id",
                "name",
                "email"
            ]
        }
    }
}

const queryUser = {
    me: {
        resource: 'me',
        params: {
            fields: [
                "id",
                "name",
                "email"
            ]
        }
    }
}

function mergeData(data) {

    //Checks if the categoryoptioncombo has an associated value and returns the associated element if it finds it
    function returnFoundDataElementOrZero(categoryOptionCombo) {
        let dataElementOrZero = {
            type: categoryOptionCombo.name,
            element: data.dataValueSets.dataValues.find((element) => {
                return categoryOptionCombo.id == element.categoryOptionCombo
            })
        }
        //Lifts the most used data up a level for easier access
        if (dataElementOrZero.element) {
            dataElementOrZero.categoryOptionCombo = dataElementOrZero.element.categoryOptionCombo;
            dataElementOrZero.dataElement = dataElementOrZero.element.dataElement;
        }
        //If it didn't find anything, return false as element with a value of zero 
        else {
            dataElementOrZero.value = 0;
            dataElementOrZero.element = false;
        }
        return dataElementOrZero;
    }

    
    return data.dataSets.dataSetElements.map(dataSetElement => {
        return {
            name: dataSetElement.dataElement.name.split("- ")[1],
            id: dataSetElement.dataElement.id,
            values: dataSetElement.dataElement.categoryCombo.categoryOptionCombos.map(returnFoundDataElementOrZero)
        }
    });
}

<<<<<<< HEAD

=======
>>>>>>> 8b52b596c7df468028d3b5ae29c3f9698b5ee9d9
function MyApp() {
    const [activePage, setActivePage] = useState("StockBalance");
    const [dispenseDataHistory, setDispenseDataHistoy] = useState([]);
    const [userName , setUsername] = useState("admin")
    //NEW STATEFUL VARIABLE
    const [statefulMergedData, setMergedData] = useState(null);
    
    //Checks if it has data already stored before sending data query
    const { loading, error, data } = useDataQuery(!statefulMergedData ? query : {});
    if (error) { console.log(error); return <span>ERROR</span> }

    if (loading || !data.dataSets) return <CircularLoader small />


    function activePageHandler(page) {
        setActivePage(page);
    }

    if(!statefulMergedData){
        setMergedData(mergeData(data));
    }

    //update data with changes from dispense
    const updateDataHistoy = (addedElement) => { 
        setDispenseDataHistoy(prevItems =>  [...prevItems, addedElement]);
        setTimeout(() => {  setActivePage("StockBalance")}, 1000);
    }

    return (
        <div className={classes.container}>
            <div className={classes.left}>
                <Navigation
                    activePage={activePage}
                    activePageHandler={activePageHandler}
                />
            </div>
            <div className={classes.right}>
<<<<<<< HEAD

=======
>>>>>>> 8b52b596c7df468028d3b5ae29c3f9698b5ee9d9
                <>
                    {activePage === "StockBalance" && <StockBalance data={statefulMergedData} />}
                    {activePage === "Dispenser" && <Dispenser data={statefulMergedData}
                                                        setData={setMergedData} 
                                                        addHistory={updateDataHistoy}
                                                        user={userName}
                                                        />}
                    {activePage === "ConsumptionForm" && <ConsumptionForm data={statefulMergedData} />}
                    {activePage === "TransactionHistory" && <TransactionHistory data={dispenseDataHistory} />}

                </>

            </div>

        </div>
    )
}

export default MyApp;