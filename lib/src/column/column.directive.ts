import { Directive, Input, ContentChild, OnInit } from '@angular/core';

import { AwesomeDataTableRow } from './../row/row.component';
import { CellCallback, AwesomeDataTableSortCallback } from './../shared';

@Directive({
    selector: 'adata-table-column'
})
export class AwesomeDataTableColumn implements OnInit {
    // init
    @Input() header: string;
    @Input() sortable = false;
    @Input() resizable = false;
    @Input() property: string;
    @Input() styleClass: string;
    @Input() cellColors: CellCallback;
    @Input() customSort: AwesomeDataTableSortCallback;

    // init and state
    @Input() width: number | string;
    @Input() visible = true;
    @Input() alignRight = false;

    @ContentChild('adataTableCell') cellTemplate: any;
    @ContentChild('adataTableHeader') headerTemplate: any;

    // for [ngClass]
    private styleClassObject = {};

    getCellColor(row: AwesomeDataTableRow, index: number) {
        if (this.cellColors !== undefined) {
            return (<CellCallback>this.cellColors)(row.item, row, this, index);
        }
    }

    ngOnInit() {
        this.initCellClass();
    }

    private initCellClass() {
        if (!this.styleClass && this.property) {
            if (/^[a-zA-Z0-9_]+$/.test(this.property)) {
                this.styleClass = 'column-' + this.property;
            } else {
                this.styleClass = 'column-' + this.property.replace(/[^a-zA-Z0-9_]/g, '');
            }
        }

        if (this.styleClass != null) {
            this.styleClassObject = {
                [this.styleClass]: true
            };
        }
    }
}
