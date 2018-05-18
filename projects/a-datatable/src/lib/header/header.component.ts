import { Component, Inject, forwardRef, Host } from '@angular/core';

import { AwesomeDataTable } from './../table/table.component';

@Component({
  selector: 'adata-table-header',
  templateUrl: './header.component.html',
  styleUrls: ['header.component.scss']
})
export class AwesomeDataTableHeader {
    columnSelectorOpen = false;

    @Host() _closeSelector() {
        this.columnSelectorOpen = false;
    }

    constructor(@Inject(forwardRef(() => AwesomeDataTable)) public adataTable: AwesomeDataTable) {}

    settingsClick($event) {
        $event.stopPropagation();
        const self = this;
        if (this.columnSelectorOpen) {
            this.columnSelectorOpen = false;
        } else {
            this.columnSelectorOpen = true;
            document.body.onclick = () => {
                self.columnSelectorOpen = false;
                document.body.onclick = null;
            };
        }
    }

    onLimitValueChange($event) {
        this.columnSelectorOpen = false;
        document.body.onclick = null;
        this.adataTable.page = 1;
    }
}
