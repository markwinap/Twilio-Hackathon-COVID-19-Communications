// store.js
import React, { createContext, useReducer } from 'react';

const initialState = {
  page: 'main',
  data: [],
  patient: {},
  family: {},
  selectedPatient: {},
  selectedPatientNote: {},
  filters: [
    {
      field: 1,
      condition: 1,
      value: '',
      and: false,
      or: false,
    },
  ],
};
const store = createContext(initialState);
const { Provider } = store;

const StateProvider = ({ children }) => {
  const [state, dispatch] = useReducer((state, action) => {
    switch (action.type) {
      case 'set-data':
        return { ...state, ...{ data: action.value } };
      case 'set-page':
        return { ...state, ...{ page: action.value } };
      case 'set-patient':
        return { ...state, ...{ patient: action.value } };
      case 'set-selected-patient':
        return { ...state, ...{ selectedPatient: action.value } };
      case 'set-selected-patient-note':
        return { ...state, ...{ selectedPatientNote: action.value } };
      case 'set-family':
        return { ...state, ...{ family: action.value } };
      case 'set-filters':
        return { ...state, ...{ filters: action.value } };
      default:
        throw new Error();
    }
  }, initialState);

  return <Provider value={{ state, dispatch }}>{children}</Provider>;
};

export { store, StateProvider };
