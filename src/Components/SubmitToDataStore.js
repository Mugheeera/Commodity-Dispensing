import {useDataMutation} from '@dhis2/app-service-data';
import {Button} from '@dhis2/ui';

import { CircularLoader } from '@dhis2/ui'

const query = {
    resource: "dataStore/OrcInc/TransactionHistory" ,
    type: "update",
    data: ({myData}) => myData
}
export const SubmitToDataStoreButton = (props) => {

    const [mutate, {data, error}] = useDataMutation(query, {variables: {
        myData: props.data
    }});

    const onClick = async () => {
        await mutate();

    }
    if(error){
        console.log(error);
    }
    if(loading){
        return <CircularLoader small />
    }
    if(data){
        console.log(data);
    }
    return <Button primary onClick={onClick}>Submit</Button>

}
export default SubmitToDataStoreButton;