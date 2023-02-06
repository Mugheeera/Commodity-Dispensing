import React from 'react';

import { 
    Modal, 
    ModalTitle,
    ModalActions, 
    ModalContent,
    ButtonStrip,
    Button
} from '@dhis2/ui';



const ConfirmationModal = (props) => {

    const handleConfirm = () => {
        // todo set transaction history
        // and send data
        // set data values to null 
        // alert bar with success msg
        props.setModalStatusShow(false);
        console.log("Confirm!");
        props.confirmDispense()
    }


    const handleCancel = () => {
        // set data values to null 
        //show alert
        props.setModalStatusShow(false);
    }


    return (
        <Modal onClose={ () => props.setModalStatusShow(false)}>
            <ModalTitle>
                Please confirm
            </ModalTitle>
            <ModalContent>
               <div>
                    <p>
                        <b>Commodity </b>: { props.dispenseData.commodity }
                    </p>
                    <p>
                        <b>Amount </b>: { props.dispenseData.amount }
                    </p>
                    <p>
                        <b>Dispensed to </b>: { props.dispenseData.dispensedToPerson }
                    </p>
                    <p>
                        <b>New end balance </b>: { props.dispenseData.newEndBalance } 
                    </p>
                </div>
            </ModalContent>
            <ModalActions>
                <ButtonStrip end>
                    <Button destructive name="Cancel button" onClick={handleCancel} >
                        Cancel
                    </Button>
                    <Button onClick={handleConfirm} primary>
                        Confirm
                    </Button>
                </ButtonStrip>
            </ModalActions>
        </Modal>
    );
}

export default ConfirmationModal;
