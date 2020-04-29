import React from 'react';
import { MenuItem } from '@material-ui/core';
//UTILS
import PatientStatus from './PatientStatus';
import Sex from './Sex';
const fields = [
  {
    label: 'First Name',
    required: true,
    type: 'text',
    xs: 12,
    sm: 6,
    md: 4,
    value: 'firstName',
  },
  {
    label: 'Last Name',
    required: true,
    type: 'text',
    xs: 12,
    sm: 6,
    md: 4,
    value: 'lastName',
  },
  {
    label: 'SSN',
    required: true,
    type: 'text',
    xs: 12,
    sm: 6,
    md: 2,
    value: 'ssn',
  },
  {
    label: 'Bed',
    //required: true,
    type: 'text',
    xs: 12,
    sm: 6,
    md: 2,
    value: 'bed',
  },
  {
    label: 'Age',
    required: true,
    type: 'number',
    xs: 6,
    sm: 6,
    md: 1,
    value: 'age',
  },
  {
    label: 'Sex',
    required: true,
    select: true,
    type: 'text',
    xs: 6,
    sm: 6,
    md: 1,
    value: 'sex',
    child: Sex.map((e) => (
      <MenuItem key={e.value} value={e.value}>
        {e.label}
      </MenuItem>
    )),
  },
  {
    label: 'Status',
    select: true,
    type: 'text',
    xs: 12,
    sm: 6,
    md: 4,
    value: 'status',
    child: PatientStatus.map((e) => (
      <MenuItem key={e.value} value={e.value}>
        {e.label}
      </MenuItem>
    )),
  },
];
export default fields;
