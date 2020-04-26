import React, { useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import {
  Grid,
  Typography,
  TextField,
  MenuItem,
  Button,
  CircularProgress,
} from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';

//STORE
import { store } from '../../store.js';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    paddingTop: 40,
    paddingBottom: 40,
    paddingLeft: 40,
    paddingRight: 40,
  },
}));
const required = ['firstName', 'lastName', 'relationship', 'patient'];
const relationship = [
  {
    value: 1,
    label: 'Friend',
  },
  {
    value: 2,
    label: 'Spouse',
  },
  {
    value: 3,
    label: 'Parent',
  },
  {
    value: 4,
    label: 'Child',
  },
  {
    value: 5,
    label: 'Sibling',
  },
  {
    value: 99,
    label: 'Other',
  },
];
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
    child: relationship.map((e) => (
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
    type: 'phone',
    xs: 6,
    sm: 6,
    md: 3,
    value: 'mobile',
  },
];
RegisterFamily.propTypes = {
  title: PropTypes.string,
};
RegisterFamily.defaultProps = {
  title: 'Title',
};

export default function RegisterFamily(props) {
  const [Errors, setErrors] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const [options, setOptions] = React.useState([]);
  const loading = open && options.length === 0;
  const classes = useStyles();
  const globalState = useContext(store);
  const { dispatch, state } = globalState;

  useEffect(() => {
    let active = true;

    if (!loading) {
      return undefined;
    }
    /*
  "SZ": {
    "index-entry-number": "208",
    "entry-number": "208",
    "entry-timestamp": "2018-06-13T13:54:40Z",
    "key": "SZ",
    "item": [
      {
        "country": "SZ",
        "official-name": "Kingdom of Eswatini",
        "name": "Eswatini",
        "citizen-names": "Swazi"
      }
    ]
  },
*/
    (async () => {
      //const response = await fetch('https://country.register.gov.uk/records.json?page-size=5000');
      const response =
        '{"MM":{"index-entry-number":"210","entry-number":"210","entry-timestamp":"2019-06-14T14:27:30Z","key":"MM","item":[{"country":"MM","official-name":"The Republic of the Union of Myanmar","name":"Myanmar (Burma)","citizen-names":"Citizen of Myanmar"}]}}';
      //await sleep(1e3); // For demo purposes.
      const countries = JSON.parse(response);

      if (active) {
        setOptions(Object.keys(countries).map((key) => countries[key].item[0]));
      }
    })();

    return () => {
      active = false;
    };
  }, [loading]);

  useEffect(() => {
    if (!open) {
      setOptions([]);
    }
  }, [open]);

  function checkMissing(obj) {
    let _temp = [];
    for (let i of required) {
      if (!obj.hasOwnProperty(i)) {
        _temp.push(i);
      } else {
        if (obj[i] === '') {
          _temp.push(i);
        }
      }
    }
    return _temp;
  }
  return (
    <div className={classes.root}>
      <Grid item xs={12}>
        <Typography
          variant="h3"
          component="h3"
          align="center"
          color="primary"
          gutterBottom
        >
          {props.title}
        </Typography>
      </Grid>
      <Grid
        spacing={3}
        container
        //direction="row"
        //justify="center"
        //alignItems="center"
      >
        {fields.map((e, i) => (
          <Grid
            item
            xs={e.xs}
            sm={e.sm}
            md={e.md}
            key={`grid_register_patitent_${i}`}
          >
            <TextField
              required={e?.required}
              error={Errors.includes(e.value)}
              fullWidth
              select={e?.select}
              type={e?.type}
              id={`register_patient_${e?.label}`}
              label={e?.label}
              value={state.patient[e?.value]}
              onChange={(f) => {
                const patient = state.patient;
                dispatch({
                  type: 'set-patient',
                  value: {
                    ...{ patient },
                    ...{ [e.value]: f.currentTarget.value },
                  },
                });
              }}
            >
              {e?.child}
            </TextField>
          </Grid>
        ))}
        <Grid item xs={6} sm={6} md={6}>
          <Autocomplete
            id="search-patient"
            open={open}
            onOpen={() => {
              setOpen(true);
            }}
            onClose={() => {
              setOpen(false);
            }}
            getOptionSelected={(option, value) => option.name === value.name}
            getOptionLabel={(option) => option.name}
            options={options}
            loading={loading}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Patient"
                fullWidth
                //variant="outlined"
                onChange={(e) => {
                  console.log(e.currentTarget.value);
                }}
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {loading ? (
                        <CircularProgress color="inherit" size={20} />
                      ) : null}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={12} md={12}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              const _missing = checkMissing(state.patient);
              setErrors(_missing);
            }}
          >
            Submit
          </Button>
        </Grid>
      </Grid>
    </div>
  );
}
