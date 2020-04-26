import React, { useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Paper, Tab, Tabs, Container } from '@material-ui/core';

import { store } from '../../store.js';
//Components
import RegisterPatient from '../../components/RegisterPatient';
import RegisterFamily from '../../components/RegisterFamily';
import TabPanel from '../../components/TabPanel';

const tabs = ['New Patient', 'New Family Member'];
export default function RegistryOptions() {
  const [value, setValue] = React.useState(0);
  const globalState = useContext(store);
  const { dispatch } = globalState;

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Container maxWidth="md">
      <Paper>
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
          aria-label="Register Options"
          centered
        >
          {tabs.map((e, i) => (
            <Tab key={`tab_register_${i}`} label={e} />
          ))}
        </Tabs>
      </Paper>
      <TabPanel value={value} index={0}>
        <Paper>
          <RegisterPatient title="Patient" />
        </Paper>
      </TabPanel>
      <TabPanel value={value} index={1}>
        <Paper>
          <RegisterFamily title="Familly" />
        </Paper>
      </TabPanel>
    </Container>
  );
}
