import React from 'react';
import { MenuItem } from '@material-ui/core';
//UTILS
import Relationship from './Relationship';
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
    label: 'Relationship',
    required: true,
    select: true,
    type: 'text',
    xs: 12,
    sm: 6,
    md: 4,
    value: 'relationship',
    child: Relationship.map((e) => (
      <MenuItem key={e.value} value={e.value}>
        {e.label}
      </MenuItem>
    )),
  },
  {
    label: 'Email',
    //required: true,
    type: 'email',
    xs: 6,
    sm: 6,
    md: 3,
    value: 'email',
  },
  {
    label: 'Mobile',
    //required: true,
    type: 'text',
    xs: 6,
    sm: 6,
    md: 3,
    value: 'mobile',
  },
];
export default fields;
