import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';

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
export class SelectInputComponent {
  @Input() label: string = '';
  @Input() name: string = '';
  @Input() id: string = '';
  @Input() placeholder: string = 'Select...';
  @Input() multiple: boolean = false;
  @Input() clearable: boolean = true;
  @Input() loadOptions!: (search: string) => Promise<TSelectOption[]>;
  @Input() selected: TSelectOption[] = [];
  @Output() selectedChange = new EventEmitter<TSelectOption[]>();

  options: TSelectOption[] = [{ id: '0', label: '', value: '' }];
  loading = false;

  onSearch = async ({ term }: { term: string; items: TSelectOption[] }) => {
    this.loading = true;
    const search = term.split(' ').at(-1)?.trim() ?? '';
    if (search) {
      this.options = await this.loadOptions(search);
    } else {
      this.options = [];
    }
    this.loading = false;
  };

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
