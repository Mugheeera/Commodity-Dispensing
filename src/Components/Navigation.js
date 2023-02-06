import React from "react";
import { Menu, MenuItem } from "@dhis2/ui";


export function Navigation(props) {
  return (
    <Menu>
      <MenuItem
        label="Stock Balance"
        active={props.activePage == "StockBalance"}
        onClick={() => props.activePageHandler("StockBalance")}
      />
      <MenuItem
        label="Dispenser"
        active={props.activePage == "Dispenser"}
        onClick={() => props.activePageHandler("Dispenser")}
      />
      <MenuItem
        label="Consumption Form"
        active={props.activePage == "ConsumptionForm"}
        onClick={() => props.activePageHandler("ConsumptionForm")}
      />
      <MenuItem
        label="Transaction History"
        active={props.activePage == "TransactionHistory"}
        onClick={() => props.activePageHandler("TransactionHistory")}
      />
    </Menu>    
    
  );
}
