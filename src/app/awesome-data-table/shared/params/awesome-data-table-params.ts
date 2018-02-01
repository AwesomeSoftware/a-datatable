import { AwesomeDataTableSortCallback } from './../callbacks/awesome-data-table-sort-callback';

export interface AwesomeDataTableParams {
    offset?: number;
    limit?: number;
    sortBy?: string;
    customSort?: AwesomeDataTableSortCallback;
    sortAsc?: boolean;
}
