import React from "react";
import styled from "styled-components";
import AccountBalanceWalletIcon from "@material-ui/icons/AccountBalanceWallet";
import AccountBalanceIcon from "@material-ui/icons/AccountBalance";
import Drawer from "./common/Drawer";

export const DRAWER_WIDTH_PX = 250;

const NavigationDrawer = (): JSX.Element => {
    return <Drawer>Test2</Drawer>;
};
//     return (
//         <Drawer variant="permanent">
//             <DrawerList>
//                 <ListItem>
//                     <ListItemText primary="Budger" />
//                 </ListItem>
//             </DrawerList>
//             <Divider />
//             <DrawerList>
//                 <ListItem button>
//                     <ListItemIcon>
//                         <AccountBalanceWalletIcon />
//                     </ListItemIcon>
//                     <ListItemText primary="Budget" />
//                 </ListItem>
//                 <ListItem button>
//                     <ListItemIcon>
//                         <AccountBalanceIcon />
//                     </ListItemIcon>
//                     <ListItemText primary="Accounts" />
//                 </ListItem>
//             </DrawerList>
//         </Drawer>
//     );
// };

export default NavigationDrawer;
