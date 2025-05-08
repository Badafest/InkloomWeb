import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputGroupComponent } from '../input-group/input-group.component';

export type TSelectOption = {
  id: string;
  label: string;
  value: any;
};

@Component({
  selector: 'app-select',
  standalone: true,
  imports: [FormsModule, InputGroupComponent],
  templateUrl: './select.component.html',
  styleUrl: './select.component.css',
})
export class SelectComponent {
  @Input() label: string = '';
  @Input() placeholder: string = 'Select...';
  @Input() multiple: boolean = false;
  @Input() loadOptions!: (search: string) => Promise<TSelectOption[]>;
  @Input() selected: TSelectOption[] = [];
  @Output() selectedChange = new EventEmitter<TSelectOption[]>();

  options: TSelectOption[] = [];
  search = '';
  loading = false;
  showOptions = false;

  async onSearchChange() {
    this.loading = true;
    this.options = (await this.loadOptions(this.search)).filter(
      (o) => !this.selected.some((s) => s.id === o.id)
    );
    this.loading = false;
    this.showOptions = this.search.length > 0;
  }

  onSelect(option: TSelectOption) {
    if (this.multiple) {
      if (!this.selected.some((s) => s.id === option.id)) {
        this.selected = [...this.selected, option];
      }
    } else {
      this.selected = [option];
    }
    this.selectedChange.emit(this.selected);
    this.showOptions = false;
  }

  onRemove(option: TSelectOption) {
    this.selected = this.selected.filter((s) => s.id !== option.id);
    this.selectedChange.emit(this.selected);
  }

  isSelected(option: TSelectOption) {
    return this.selected.some((s) => s.id === option.id);
  }
}
