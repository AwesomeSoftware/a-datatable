import {
    Component, Input, Output, EventEmitter, ContentChildren, QueryList,
    TemplateRef, ContentChild, ViewChildren, OnInit
} from '@angular/core';

import {
    RowCallback, AwesomeDataTableParams, AwesomeDataTableSortCallback,
    AwesomeDataTableTranslations, defaultTranslations
} from './../shared';
import { AwesomeDataTableColumn } from './../column/column.directive';
import { AwesomeDataTableRow } from './../row/row.component';
import { drag } from './../shared';

@Component({
    selector: 'adata-table',
    templateUrl: './table.component.html',
    styleUrls: ['./table.component.scss']
})
export class AwesomeDataTable implements AwesomeDataTableParams, OnInit {

    private _items: any[] = [];

    @Input('items') get items() {
        return this._items;
    }

    set items(items: any[]) {
        this._items = items;
        if (this.reloading) {
            this._onReloadFinished();
        }
    }

    @Input() itemCount: number;

    // UI components

    @ContentChildren(AwesomeDataTableColumn) columns: QueryList<AwesomeDataTableColumn>;
    @ViewChildren(AwesomeDataTableRow) rows: QueryList<AwesomeDataTableRow>;
    @ContentChild('dataTableExpand') expandTemplate: TemplateRef<any>;
    @Input() noDataTemplate: TemplateRef<any>;

    // One-time optional bindings with default values

    @Input() headerTitle: string;
    @Input() header = true;
    @Input() pagination = true;
    @Input() indexColumn = false;
    @Input() indexColumnHeader = '';
    @Input() rowColors: RowCallback;
    @Input() rowTooltip: RowCallback;
    @Input() selectColumn = false;
    @Input() multiSelect = true;
    @Input() substituteRows = false;
    @Input() expandableRows = false;
    @Input() translations: AwesomeDataTableTranslations = defaultTranslations;
    @Input() selectOnRowClick = false;
    @Input() autoReload = false;
    @Input() showReloading = false;
    @Input() showDownloadButton = false;
    @Input() showReloadButton = true;
    @Input() cssClass = 'table-hover';

    // UI state without input

    indexColumnVisible: boolean;
    selectColumnVisible: boolean;
    expandColumnVisible: boolean;

    // UI state: visible ge/set for the outside with @Input for one-time initial values

    private _sortBy: string;
    private _sortAsc = true;
    private _customSort: AwesomeDataTableSortCallback;

    private _offset = 0;
    private _limit = 10;

    @Input() get sortBy() {
        return this._sortBy;
    }

    set sortBy(value) {
        this._sortBy = value;
        this._triggerReload();
    }

    @Input()
    get sortAsc() {
        return this._sortAsc;
    }

    set sortAsc(value) {
        this._sortAsc = value;
        this._triggerReload();
    }

    @Input()
    get customSort() {
        return this._customSort;
    }

    set customSort(value) {
        this._customSort = value;
        this._triggerReload();
    }

    @Input()
    get offset() {
        return this._offset;
    }

    set offset(value) {
        this._offset = value;
        this._triggerReload();
    }

    @Input()
    get limit() {
        return this._limit;
    }

    set limit(value) {
        this._limit = value;
        this._triggerReload();
    }

    // calculated property:

    @Input()
    get page() {
        return Math.floor(this.offset / this.limit) + 1;
    }

    set page(value) {
        this.offset = (value - 1) * this.limit;
    }

    get lastPage() {
        return Math.ceil(this.itemCount / this.limit);
    }

    // setting multiple observable properties simultaneously

    sort(sortBy: string, asc: boolean, customSort: AwesomeDataTableSortCallback) {
        this.sortBy = sortBy;
        this.sortAsc = asc;
        this.customSort = customSort;
    }

    // init

    ngOnInit() {
        this._initDefaultValues();
        this._initDefaultClickEvents();
        this._updateDisplayParams();

        if (this.autoReload && this._scheduledReload == null) {
            this.reloadItems();
        }
    }

    private _initDefaultValues() {
        this.indexColumnVisible = this.indexColumn;
        this.selectColumnVisible = this.selectColumn;
        this.expandColumnVisible = this.expandableRows;
    }

    private _initDefaultClickEvents() {
        this.headerClick.subscribe((tableEvent: any) => this.sortColumn(tableEvent.column));
        if (this.selectOnRowClick) {
            this.rowClick.subscribe((tableEvent: any) => tableEvent.row.selected = !tableEvent.row.selected);
        }
    }

    // Reloading:
    _reloading = false;

    get reloading() {
        return this._reloading;
    }

    @Output() reload = new EventEmitter();

    reloadItems() {
        this._reloading = true;
        this.reload.emit(this._getRemoteParameters());
    }

    private _onReloadFinished() {
        this._updateDisplayParams();

        this._selectAllCheckbox = false;
        this._reloading = false;
    }

    // params of the last finished reload
    _displayParams = <AwesomeDataTableParams>{};

    get displayParams() {
        return this._displayParams;
    }

    _updateDisplayParams() {
        this._displayParams = {
            sortBy: this.sortBy,
            customSort: this.customSort,
            sortAsc: this.sortAsc,
            offset: this.offset,
            limit: this.limit
        };
    }

    _scheduledReload: any = null;

    // for avoiding cascading reloads if multiple params are set at once:
    _triggerReload() {
        if (this._scheduledReload) {
            clearTimeout(this._scheduledReload);
        }
        this._scheduledReload = setTimeout(() => {
            this.reloadItems();
        });
    }

    // Download
    @Output() download = new EventEmitter();

    downloadItems() {
        this.download.emit(this._getRemoteParameters());
    }

    // event handlers:

    @Output() rowClick = new EventEmitter();
    @Output() rowDoubleClick = new EventEmitter();
    @Output() headerClick = new EventEmitter();
    @Output() cellClick = new EventEmitter();
    @Output() rowExpandChange = new EventEmitter();
    @Output() rowSelectChange = new EventEmitter();

    private rowClicked(row: AwesomeDataTableRow, event: Event) {
        this.rowClick.emit({row, event});
    }

    private rowDoubleClicked(row: AwesomeDataTableRow, event: Event) {
        this.rowDoubleClick.emit({row, event});
    }

    private headerClicked(column: AwesomeDataTableColumn, event: MouseEvent) {
        this.page = 1;
        if (!this._resizeInProgress) {
            this.headerClick.emit({column, event});
        } else {
            this._resizeInProgress = false; // this is because I can't prevent click from mousup of the drag end
        }
    }

    private cellClicked(column: AwesomeDataTableColumn, row: AwesomeDataTableRow, event: MouseEvent) {
        this.cellClick.emit({row, column, event});
    }

    // functions:

    public _getRemoteParameters(): AwesomeDataTableParams {
        const params = <AwesomeDataTableParams>{};

        if (this.sortBy) {
            params.sortBy = this.sortBy;
            params.customSort = this.customSort;
            params.sortAsc = this.sortAsc;
        }
        if (this.pagination) {
            params.offset = this.offset;
            params.limit = this.limit;
        }
        return params;
    }

    private sortColumn(column: AwesomeDataTableColumn) {
        if (column.sortable) {
            const ascending = this.sortBy === column.property ? !this.sortAsc : true;
            this.sort(column.property, ascending, column.customSort);
        }
    }

    get columnCount() {
        let count = 0;
        count += this.indexColumnVisible ? 1 : 0;
        count += this.selectColumnVisible ? 1 : 0;
        count += this.expandColumnVisible ? 1 : 0;
        this.columns.toArray().forEach(column => {
            count += column.visible ? 1 : 0;
        });
        return count;
    }

    private getRowColor(item: any, index: number, row: AwesomeDataTableRow) {
        if (this.rowColors !== undefined) {
            return (<RowCallback>this.rowColors)(item, row, index);
        }
    }

    // selection

    selectedRow: AwesomeDataTableRow;
    selectedRows: AwesomeDataTableRow[] = [];

    private _selectAllCheckbox = false;

    get selectAllCheckbox() {
        return this._selectAllCheckbox;
    }

    set selectAllCheckbox(value) {
        this._selectAllCheckbox = value;
        this._onSelectAllChanged(value);
    }

    private _onSelectAllChanged(value: boolean) {
        this.rows.toArray().forEach(row => row.selected = value);
    }

    onRowSelectChanged(row: AwesomeDataTableRow) {
        // maintain the selectedRow(s) view
        if (this.multiSelect) {
            const index = this.selectedRows.indexOf(row);
            if (row.selected && index < 0) {
                this.selectedRows.push(row);
            } else if (!row.selected && index >= 0) {
                this.selectedRows.splice(index, 1);
            }
        } else {
            if (row.selected) {
                this.selectedRow = row;
            } else if (this.selectedRow === row) {
                this.selectedRow = row;
            }
        }

        // unselect all other rows:
        if (row.selected && !this.multiSelect) {
            this.rows.toArray().filter(row_ => row_.selected).forEach(row_ => {
                if (row_ !== row) { // avoid endless loop
                    row_.selected = false;
                }
            });
        }
        this.rowSelectChange.emit(row);
    }

    onRowExpandChanged(row: AwesomeDataTableRow) {
        this.rowExpandChange.emit(row);
    }

    // other

    get substituteItems() {
        return Array.from({length: this.displayParams.limit - this.items.length});
    }

    // column resizing

    private _resizeInProgress = false;

    private resizeColumnStart(event: MouseEvent, column: AwesomeDataTableColumn, columnElement: HTMLElement) {
        this._resizeInProgress = true;

        drag(event, {
            move: (moveEvent: MouseEvent, dx: number) => {
                if (this._isResizeInLimit(columnElement, dx)) {
                    column.width = columnElement.offsetWidth + dx;
                }
            },
        });
    }

    resizeLimit = 30;

    private _isResizeInLimit(columnElement: HTMLElement, dx: number) {
        // This is needed because CSS min-width didn't work on table-layout: fixed.
        // Without the limits, resizing can make the next column disappear completely,
        // and even increase the table width. The current implementation suffers from the fact,
        // that offsetWidth sometimes contains out-of-date values.
        if ((dx < 0 && (columnElement.offsetWidth + dx) <= this.resizeLimit) || !columnElement.nextElementSibling || // resizing doesn't make sense for the last visible column
            (dx >= 0 && ((<HTMLElement> columnElement.nextElementSibling).offsetWidth + dx) <= this.resizeLimit)) {
            return false;
        }
        return true;
    }

    private rowsLimitList: number[] = [];

    public getRowsLimitList(): number[] {
        if (this.rowsLimitList.length === 0) {
            this.rowsLimitList = [5, 10, 25, 50, 100, 200];
        }
        return this.rowsLimitList;
    }
}
