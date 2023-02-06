import { useDataMutation } from "@dhis2/app-service-data";
import { Button } from '@dhis2/ui';

//Function for updating the commodities database

/*
USAGE:
Function accepts an array of all the values to update
Enter data in the following format:
[
    {
        dataElement: dataElement,
        categoryOptionCombo: categoryOptionCombo,
        value: value
    },
    {
        dataElement: dataElement,
        categoryOptionCombo: categoryOptionCombo,
        value: value
    }
    etc...
]
Put the button in the page render with all values
*/
const query = {
    dataSet: "ULowA8V3ucd",
    resource: 'dataValueSets',
    type: "create",
     data: ({statefulArray}) => ({
        orgUnit: "ImspTQPwCqd",
         period: "202109",
         dataValues: statefulArray
     })
     //{
    //     orgUnit: "ImspTQPwCqd",
    //     period: "202109",
    //     dataValues: ({changesArray}) => changesArray
    // }
}

function buildQuery(array){
    let queryArray = [];
    if(array.length === 0 || !array){
        console.log("Warning: buildQuery in the submit data button did not receive an array");
        return queryArray;
    }
    array.forEach(element => {
        element.values.forEach(optionCombo => {
            queryArray.push({
                dataElement: optionCombo.dataElement,
                categoryOptionCombo: optionCombo.categoryOptionCombo,
                value: optionCombo.element.value
            })
        })
    });
    return queryArray;
}

///TODO: Add error handling for storing the data locally if no internet
export const SubmitDataButton = (props) => {
    if (!props){
        return null;
    }
    console.log("received props ", props);
   const changesQuery = props.changesArray  ? props.changesArray : buildQuery(props.statefulData);
   console.log(changesQuery);
    let disabled = (changesQuery.length === 0) ? true : false;
    
    const [mutate, { loading, data}] = useDataMutation(query, {onError: handleError, onComplete: props.function, variables: {
        statefulArray: changesQuery
    }});
    
    const onClick = async () => {
        await mutate();
        
    }
    
    function handleError(error){
        console.log(error);
    }
    return (
        <Button primary disabled={disabled} onClick={onClick}>Submit</Button>
    )

}