import {
    AfterViewChecked,
    Input,
    Output,
    EventEmitter,
    QueryList,
    ElementRef,
    Renderer2,
    ViewChild,
    ViewChildren
} from '@angular/core';

export class SortedTableHeaderComponent<TData> implements AfterViewChecked {
    @ViewChildren('widthCol') widthCols: QueryList<ElementRef>;
    @Output() sortFunChanged = new EventEmitter<(a: TData, b: TData) => number>();
    @Output() colWidthsChanged = new EventEmitter<number[]>();
    private sortAscFun: (a: TData, b: TData) => number;
    private sortAsc: boolean;

    constructor(
        private renderer3: Renderer2,
        defaultSortFun: (a: TData, b: TData) => number,
        defaultSortAsc?: boolean
    ) {
        this.sortAsc = (defaultSortAsc != null) ? defaultSortAsc : true;
        this.sortAscFun = defaultSortFun;
    }

    ngAfterViewChecked() {
        this.colWidthsChanged.emit(this.colWidths);
    }

    get colWidths(): number[] {
        const colWidths = [];
        this.widthCols.forEach(column => colWidths.push(column.nativeElement.offsetWidth - 2));
        return colWidths;
    }

    @Input() set colWidths(colWidths: number[]) {
        this.widthCols.forEach(
            (column, i) => this.renderer3.setStyle(column.nativeElement, 'width', `${colWidths[i]}px`)
        );
    }

    get sortFun(): (a: TData, b: TData) => number {
        return this.sortAsc ? this.sortAscFun : (a, b) => this.sortAscFun(b, a);
    }

    @Input() set sortFun(sortFun: (a: TData, b: TData) => number) {
        this.sortAsc = this.sortAscFun === sortFun ? !this.sortAsc : true;
        this.sortAscFun = sortFun;
        this.sortFunChanged.emit(this.sortFun);
    }
}

export class SortedTableComponent<TData> {
    @ViewChild('stickyHeader') stickyHeader: SortedTableHeaderComponent<TData>;
    private allRowData: TData[] = [];

    get rowData(): TData[] {
        return this.allRowData;
    }

    @Input() set rowData(rowData: TData[]) {
        this.allRowData = rowData;
        this.sort();
    }

    sort() {
        this.allRowData.sort(this.stickyHeader.sortFun);
    }
}
