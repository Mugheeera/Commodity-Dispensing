import React , {useState, useEffect} from "react";
import { OnChange } from 'react-final-form-listeners';
import {
    ReactFinalForm,
    InputFieldFF,
    composeValidators,
    number,
    hasValue,
    Button,
    ButtonStrip,
    string,
    createMinNumber,
    SingleSelectFieldFF,
    createMaxNumber
} from '@dhis2/ui';

import styles from './styles.module.css';


const DispenserForm = (props) => {

    const [maxCommodityEndBalance,  setMaxCommodityEndBalance ] = useState(1);

    useEffect( () => {
        if(props.commodityValues !== null && props.commodityValues[0] !== undefined){
            setMaxCommodityEndBalance(parseInt(props.commodityValues[0].values[2].element.value));
        }
    },[props.commodityValues])

    const createCommodityArray = () => {
        let tempCommodityArray = []
        props.data.forEach(item => {
            tempCommodityArray.push({
                label: item.name,
                value: item.name
            })
        })
        return tempCommodityArray;
    }

    const commodityArray = createCommodityArray()


    const confirmationModal = (values) => {
        values.newEndBalance=(maxCommodityEndBalance - values.amount)
        props.setModalStatusShow(true);
        props.setData(values)
    }

    const handleCommodityChange = (value) => {
       props.setCommoditySelection(value);
    }

    return (
        <div className={styles.container}>
            <ReactFinalForm.Form onSubmit={confirmationModal}>
                {({ handleSubmit }) => (
                    <form onSubmit={handleSubmit}>

                        <div className={styles.row}>
                            <ReactFinalForm.Field
                                name="commodity"
                                label="Commodity"
                                component={SingleSelectFieldFF}
                                className={styles.title}
                                initialValue=""
                                options={commodityArray}
                            />
                                <OnChange name="commodity">
                                    {value => {
                                        handleCommodityChange(value)
                                    }}
                                </OnChange>
                        </div>

                        <div className={styles.row}>
                            <ReactFinalForm.Field
                                required
                                name="amount"
                                label="Amount to Dispense"
                                component={InputFieldFF}
                                className={styles.amount}
                                validate={
                                    composeValidators(
                                        number,
                                        hasValue,
                                        createMinNumber(1),
                                        createMaxNumber(maxCommodityEndBalance)
                                    )
                                }
                            />
                        </div>

                        <div className={styles.row}>
                            <ReactFinalForm.Field
                                required
                                name="dispensedToPerson"
                                label="Dispense To"
                                component={InputFieldFF}
                                className={styles.person}
                                validate={composeValidators(hasValue, string)}
                            />
                        </div>

                        <div className={styles.row}>
                            <Button type="submit" primary>
                                Submit
                            </Button>
                        </div>
                    </form>
                )}
            </ReactFinalForm.Form>
        </div>
    );
};


export default DispenserForm;
