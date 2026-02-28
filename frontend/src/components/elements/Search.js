import { TextField } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import { useEffect, useRef, useState } from 'react';
import Api from '../../services/Api';

export default function Search(props) {
    const [value, setValue] = useState(props.value ? props.value : null);
    const [inputValue, setInputValue] = useState('');
    const [options, setOptions] = useState([]);
    const isLoading = useRef(false);

    useEffect(function () {
        if (isLoading.current || !props.searchUrl || !props.searchFields) {
            return;
        }

        if (inputValue === '') {
            if (props.hasOwnProperty('options') && Array.isArray(props.options)) {
                setOptions(props.options);
            } else {
                setOptions(value ? [value] : []);
            }
            return;
        }

        const opts = [];
        for (let i = 0; i < options.length; i++) {
            if (props.getOptionLabel(options[i]).indexOf(inputValue) !== -1) {
                opts.push(options[i]);
            }
        }
        if (opts.length > 0) {
            setOptions(opts)
            return;
        }

        isLoading.current = true;

        const params = {
            "filter": {
                "items": [],
                "logicOperator": "or"
            }
        };

        props.searchFields.forEach(field => {
            params["filter"]["items"].push(
                { "field": field, "operator": "icontains", "value": inputValue }
            );
        });

        Api.get(
            props.searchUrl, params
        ).then((response) => {
            setOptions(response.responseJSON.results);
        }).catch((response) => {
            console.log(response.responseText);
            setOptions([]);
        }).finally(() => {
            isLoading.current = false;
        });

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value, inputValue]);

    return (
        <Autocomplete
            options={options}
            noOptionsText={props.noOptionsText || ''}
            filterOptions={(x) => x}
            renderInput={(params) => {
                params = { ...params, ...props };
                delete params.options;
                delete params.noOptionsText;
                delete params.searchUrl;
                delete params.searchFields;
                delete params.onChange;
                delete params.getOptionKey;
                delete params.getOptionLabel;
                return <TextField {...params}></TextField>;
            }}
            onInputChange={(event, value, reason) => {
                setInputValue(value);
            }}
            onChange={(event, value, reason) => {
                if (props.onChange) {
                    props.onChange(value);
                }
                setValue(value);
            }}
            isOptionEqualToValue={(option, value) => {
                return option.id === value.id;
            }}
            getOptionKey={props.getOptionKey}
            getOptionLabel={props.getOptionLabel}
            value={value}
            fullWidth
        ></Autocomplete>
    );
}
