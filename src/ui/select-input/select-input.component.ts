import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import {
  Observable,
  Subject,
  debounceTime,
  distinctUntilChanged,
  map,
} from 'rxjs';

export type TSelectOption = {
  id: string;
  label: string;
  value: any;
};

@Component({
  selector: 'app-select-input',
  standalone: true,
  imports: [NgSelectModule, FormsModule],
  templateUrl: './select-input.component.html',
  styleUrl: './select-input.component.css',
})
export class SelectInputComponent implements OnInit {
  @Input() label: string = '';
  @Input() name: string = '';
  @Input() id: string = '';
  @Input() placeholder: string = 'Select...';
  @Input() multiple: boolean = false;
  @Input() clearable: boolean = true;
  @Input() loadOptions!: (
    search: string
  ) => Promise<Observable<TSelectOption[]>>;
  @Input() selected: TSelectOption[] = [];
  @Input() maxLength: number | null = null;
  @Output() selectedChange = new EventEmitter<TSelectOption[]>();

  options: TSelectOption[] = [];
  loading = false;

  searchInput$ = new Subject<string>();

  ngOnInit(): void {
    this.searchInput$
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        map((term) => this.loadOptions(term))
      )
      .subscribe(async (results) => {
        this.loading = true;
        (await results).subscribe({
          next: (data) => {
            this.options = data;
          },
          error: () => {
            this.loading = false;
          },
          complete: () => {
            this.loading = false;
          },
        });
      });
  }

  compareFn = (opt1: TSelectOption, opt2: TSelectOption) => opt1.id === opt2.id;

  onChange(selected: TSelectOption | TSelectOption[]) {
    if (Array.isArray(selected)) {
      this.selectedChange.emit(selected);
    } else if (selected) {
      this.selectedChange.emit([selected]);
    } else {
      this.selectedChange.emit([]);
    }
  }
}
