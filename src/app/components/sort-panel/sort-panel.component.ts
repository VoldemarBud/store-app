import {Component, EventEmitter, Output} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {QueryFn} from "../../models/queryFn";

@Component({
  selector: 'app-sort-panel',
  templateUrl: './sort-panel.component.html',
  styleUrls: ['./sort-panel.component.scss']
})
export class SortPanelComponent {
    @Output() sortBy: EventEmitter<QueryFn>  = new EventEmitter<QueryFn>();
 sortByForm: FormGroup = new FormGroup({
     fieldPath: new FormControl('title'),
     directionStr: new FormControl('asc')
 })
  constructor() {
  }

  onSort(){
      this.sortBy.emit(this.sortByForm.value)
  }
}
