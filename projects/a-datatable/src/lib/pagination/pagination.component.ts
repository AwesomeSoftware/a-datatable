import { Component, Inject, forwardRef } from '@angular/core';

import { AwesomeDataTable } from './../table/table.component';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'adata-table-pagination',
  templateUrl: 'pagination.component.html',
  styleUrls: ['pagination.component.scss']
})
// tslint:disable-next-line:component-class-suffix
export class AwesomeDataTablePagination {
    get maxPage() {
        return Math.ceil(this.adataTable.itemCount / this.adataTable.limit);
    }

    get pages() {
        return Array.from(Array(this.maxPage).keys());
    }

    get limit() {
        return this.adataTable.limit;
    }

    set limit(value) {
        this.adataTable.limit = Number(<any>value); // TODO better way to handle that value of number <input> is string?
    }

    get page() {
        return this.adataTable.page;
    }

    set page(value) {
        this.adataTable.page = Number(<any>value);
    }

    get btnNextAvaialble() {
        return !((this.adataTable.offset + this.adataTable.limit) >= this.adataTable.itemCount);
    }

    get btnPrevAvaialble() {
        return !(this.adataTable.offset <= 0);
    }

    constructor(@Inject(forwardRef(() => AwesomeDataTable)) public adataTable: AwesomeDataTable) {}

    pageBack(allow: boolean = true) {
        if (allow) {
            this.adataTable.offset -= Math.min(this.adataTable.limit, this.adataTable.offset);
        }
    }

    pageForward(allow: boolean = true) {
        if (allow) {
            this.adataTable.offset += this.adataTable.limit;
        }
    }

    pageFirst(allow: boolean = true) {
        if (allow) {
            this.adataTable.offset = 0;
        }
    }

    pageLast(allow: boolean = true) {
        if (allow) {
            this.adataTable.offset = (this.maxPage - 1) * this.adataTable.limit;
        }
    }

    pageNavigate(page) {
        const val = page * this.adataTable.limit;
        if (val !== this.adataTable.offset) {
            this.adataTable.offset = val;
        }
    }
}
