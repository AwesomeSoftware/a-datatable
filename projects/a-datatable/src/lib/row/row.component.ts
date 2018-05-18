import { Component, Input, Inject, forwardRef, Output, EventEmitter, OnDestroy } from '@angular/core';

import { AwesomeDataTable } from './../table/table.component';

@Component({
    selector: '[adataTableRow]',
    templateUrl: './row.component.html',
    styleUrls: ['./row.component.scss']
})
export class AwesomeDataTableRow implements OnDestroy {

    @Input() item: any;
    @Input() index: number;

    expanded: boolean;

    // row selection:

    public _selected: boolean;

    @Output() selectedChange = new EventEmitter();
    @Output() expandRowChange = new EventEmitter();

    get selected() {
        return this._selected;
    }

    set selected(selected) {
        this._selected = selected;
        this.selectedChange.emit(selected);
    }

    // other:

    get displayIndex() {
        if (this.adataTable.pagination) {
            return this.adataTable.displayParams.offset + this.index + 1;
        } else {
            return this.index + 1;
        }
    }

    public _this = this; // FIXME is there no template keyword for this in angular 2?

    getTooltip() {
        if (this.adataTable.rowTooltip) {
            return this.adataTable.rowTooltip(this.item, this, this.index);
        }
        return '';
    }

    expandRow(event: Event) {
        event.stopPropagation();
        this.expanded = !this.expanded;
        this.expandRowChange.emit();
    }

    constructor(@Inject(forwardRef(() => AwesomeDataTable)) public adataTable: AwesomeDataTable) {}

    ngOnDestroy() {
        this.selected = false;
    }
}
