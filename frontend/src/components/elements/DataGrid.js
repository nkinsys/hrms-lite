import { DataGrid as BaseDataGrid, GridActionsCellItem, GridOverlay, GridToolbar, useGridApiRef } from "@mui/x-data-grid";
import { Box, CircularProgress, useTheme } from "@mui/material";
import { MODE_DARK, tokens } from "../../scripts/theme";
import { useEffect, useRef, useState } from "react";
import Api from "../../services/Api";
import { useNavigate } from "react-router-dom";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

const dateAdapter = new AdapterDayjs();
let timeout = null;

export function ActionCellItem({ link, ...props }) {
    const navigate = useNavigate();

    if (link) {
        if (link.indexOf('/') !== 0) {
            link = window.location.pathname + '/' + link;
            link = link.replace('//', '/');
        }

        props.onClick = () => navigate(link);
    }

    return (
        <GridActionsCellItem {...props} />
    );
}

function DataGrid({ columns, url, defaultParams, identifier, multiselect, noRowsText, noResultsText, selectedRows, setSelectedRows, showError }) {
    const apiRef = useGridApiRef();
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [isLoading, setIsLoading] = useState(false);
    const mapPageToNextCursor = useRef({});
    const totalCount = useRef(null);
    const [pageinfo, setPageInfo] = useState({ rows: [], page: 0, hasNextPage: false, totalRowCount: 0 });
    const searchCriteria = useRef({
        pagination: {
            pageSize: 20,
            page: 0
        },
        sort: [],
        filter: {}
    });
    const [emptyText, setEmptyText] = useState(noRowsText ? noRowsText : "No Rows");
    const [rowSelectionModel, setRowSelectionModel] = useState([]);
    const selected = useRef({});

    if (!identifier) {
        identifier = 'id';
    }

    columns.forEach(column => {
        if (column.type === 'date') {
            column['valueFormatter'] = (value) => {
                if (value) {
                    return dateAdapter.formatByString(value, "DD/MM/YYYY");
                }
                return '';
            };
        } else if (column.type === 'dateTime') {
            column['valueFormatter'] = (value) => {
                if (value) {
                    return dateAdapter.formatByString(value, "DD/MM/YYYY HH:mm:ss");
                }
                return '';
            };
        }
    });

    multiselect = Boolean(multiselect);

    const getQueryParams = function (searchCriteria) {
        const operators = {
            '=': 'exact',
            '!=': '~exact',
            '>': 'gt',
            '>=': 'gte',
            '<': 'lt',
            '<=': 'lte',
            'is': 'exact',
            'not': '~exact',
            'after': 'gt',
            'onOrAfter': 'gte',
            'before': 'lt',
            'onOrBefore': 'lte',
            'contains': 'icontains',
            'equals': 'iexact',
            'startsWith': 'istartswith',
            'endsWith': 'iendswith',
            'isEmpty': 'exact',
            'isNotEmpty': '~iexact',
            'isAnyOf': 'in'
        };

        let params = {
            "pagination": {
                "pageSize": 20,
                "page": 0
            },
            "sort": [],
            "filter": {}
        };

        if (defaultParams && typeof defaultParams === 'object') {
            params = { ...params, ...defaultParams };
        }
        params.pagination.pageSize = searchCriteria.pagination.pageSize;
        params.pagination.page = searchCriteria.pagination.page;

        if (searchCriteria.filter.hasOwnProperty('items')) {
            params.filter['items'] = [];
            searchCriteria.filter.items.forEach((item) => {
                item = {
                    'field': item.field,
                    'operator': item.operator,
                    'value': item.value
                };
                if (operators.hasOwnProperty(item['operator'])) {
                    item['operator'] = operators[item['operator']];
                }
                params.filter.items.push(item);
            });
        }

        searchCriteria.sort.forEach(function (item) {
            item = {
                "field": item.field,
                "sort": item.sort
            };
            params.sort.push(item);
        });

        return params;
    }

    const loadData = async (delay = false) => {
        if (isLoading) {
            return;
        }

        if (timeout) {
            clearTimeout(timeout);
            timeout = null;
        }

        function getCursor(link) {
            const url = new URL(link);
            const params = new URLSearchParams(url.search);
            return params.get('cursor');
        }

        async function load() {
            setIsLoading(true);
            if (timeout) {
                clearTimeout(timeout);
                timeout = null;
            }
            try {
                const params = getQueryParams(searchCriteria.current)
                const page = params['pagination']['page'];
                if (page > 0) {
                    params['cursor'] = mapPageToNextCursor.current[page];
                }
                const response = await Api.get(
                    url,
                    params,
                    { "Content-Type": "application/json" }
                );

                if (response.responseJSON.next) {
                    mapPageToNextCursor.current[page + 1] = getCursor(response.responseJSON.next);
                }
                if (response.responseJSON.previous) {
                    mapPageToNextCursor.current[page - 1] = getCursor(response.responseJSON.previous);
                }
                if (page > 0) {
                    pageinfo.totalRowCount = page * params['pagination']['pageSize'];
                } else {
                    pageinfo.totalRowCount = 0;
                }
                pageinfo.totalRowCount += response.responseJSON.results.length;
                pageinfo.rows = response.responseJSON.results;
                pageinfo.page = page;
                pageinfo.hasNextPage = !!response.responseJSON.next;
                if (!pageinfo.hasNextPage) {
                    totalCount.current = pageinfo.totalRowCount;
                }
                setPageInfo({ ...pageinfo });

                const ids = [];
                pageinfo.rows.forEach(row => {
                    if (selected.current.hasOwnProperty(row[identifier])) {
                        ids.push(row[identifier]);
                    }
                });
                setRowSelectionModel(ids);
            } catch (response) {
                totalCount.current = 0;
                setPageInfo({
                    page: -1,
                    rows: [],
                    hasNextPage: false,
                    totalRowCount: 0
                });
                if (showError) {
                    if (response.responseJSON && response.responseJSON.detail) {
                        setEmptyText(<Box sx={{ textAlign: "center", color: "error.main" }}><span>{response.responseJSON.detail}</span></Box>);
                    } else {
                        setEmptyText(<Box sx={{ textAlign: "center", color: "error.main" }}><span>{response.responseText}</span></Box>);
                    }
                } else {
                    console.error(response.responseText);
                    setEmptyText(noResultsText ? noResultsText : "No results found.");
                }
            }
            setIsLoading(false);
        }

        if (delay) {
            timeout = setTimeout(load, 1000);
        } else {
            await load();
        }
    };

    useEffect(function () {
        if (selectedRows) {
            selectedRows.forEach(row => {
                selected.current[row[identifier]] = row;
            });
        }

        loadData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            <Box
                margin="0 0 20px 0"
                sx={{
                    "& .MuiDataGrid-root": { border: "none" },
                    "& .name-column--cell": { color: colors.greenAccent[300] },
                    "& .MuiDataGrid-columnHeaders": {
                        backgroundColor: theme.palette.mode === MODE_DARK ? colors.blueAccent[700] : "primary",
                        borderBottom: "none",
                    },
                    "& .MuiDataGrid-virtualScroller": {
                        backgroundColor: colors.primary[400],
                    },
                    "& .MuiDataGrid-footerContainer": {
                        borderTop: "none",
                        backgroundColor: theme.palette.mode === MODE_DARK ? colors.blueAccent[700] : "primary",
                    },
                    "& .MuiCheckbox-root": {
                        color: `${colors.greenAccent[200]} !important`,
                    },
                    "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
                        color: `${colors.grey[100]} !important`,
                    },
                }}
            >
                <BaseDataGrid
                    autoHeight={true}
                    apiRef={apiRef}
                    initialState={{
                        pagination: {
                            paginationModel: { pageSize: 20, page: 0 },
                        },
                    }}
                    checkboxSelection={multiselect}
                    disableRowSelectionOnClick
                    columns={columns}
                    onColumnVisibilityModelChange={(newModel) => {
                        apiRef.current.autosizeColumns({
                            expand: true
                        })
                    }}
                    getRowId={(row) => row[identifier]}
                    slots={{
                        toolbar: GridToolbar,
                        loadingOverlay: () => {
                            return (
                                <GridOverlay>
                                    <CircularProgress sx={{
                                        color: colors.grey[100]
                                    }}></CircularProgress>
                                </GridOverlay>
                            );
                        },
                        noRowsOverlay: () => {
                            return (
                                <GridOverlay>{emptyText}</GridOverlay>
                            );
                        },
                    }}
                    loading={isLoading}
                    rows={pageinfo.rows}
                    rowCount={totalCount.current ? totalCount.current : (pageinfo.hasNextPage ? -1 : pageinfo.totalRowCount)}
                    pageSizeOptions={[20, 30, 50, 100]}
                    sortingMode="server"
                    filterMode="server"
                    paginationMode="server"
                    paginationMeta={{ hasNextPage: pageinfo.hasNextPage }}
                    onPaginationModelChange={(newPaginationModel) => {
                        searchCriteria.current.pagination = newPaginationModel;
                        loadData();
                    }}
                    onSortModelChange={(newSortModel) => {
                        searchCriteria.current.sort = newSortModel;
                        loadData();
                    }}
                    onFilterModelChange={(newFilterModel) => {
                        searchCriteria.current.filter = newFilterModel;
                        if (
                            newFilterModel['items'].length > 0 &&
                            !['isEmpty', 'isNotEmpty'].includes(newFilterModel['items'][0]['operator']) &&
                            [undefined, null, ''].includes(newFilterModel['items'][0]['value'])
                        ) {
                            return;
                        }
                        searchCriteria.current.pagination.page = 0;
                        mapPageToNextCursor.current = {};
                        totalCount.current = null;
                        loadData(true);
                    }}
                    onRowSelectionModelChange={(newRowSelectionModel) => {
                        setRowSelectionModel(newRowSelectionModel);

                        let id;
                        pageinfo.rows.forEach(row => {
                            id = row[identifier];
                            if (newRowSelectionModel.includes(id)) {
                                selected.current[id] = row;
                            } else if (selected.current.hasOwnProperty(id)) {
                                delete selected.current[id];
                            }
                        });

                        if (setSelectedRows) {
                            setSelectedRows(Object.values(selected.current));
                        }
                    }}
                    rowSelectionModel={rowSelectionModel}
                    sx={{
                        "& .MuiDataGrid-cell": { border: "none", outline: "none" },
                        "& .MuiDataGrid-columnHeader": {
                            backgroundColor: theme.palette.mode === MODE_DARK ? colors.blueAccent[700] : "primary"
                        },
                        "& .MuiTablePagination-selectLabel": { "& .p": { marginTop: 12, marginBottom: 12 } },
                        '--DataGrid-overlayHeight': '182px'
                    }}
                />
            </Box>
        </>
    );

}

export default DataGrid;