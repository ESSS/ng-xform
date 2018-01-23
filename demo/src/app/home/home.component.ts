import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { TextField, SelectField, MeasureField, AutocompleteField } from '@esss/ng-xform';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  public values: object;
  public editing = true;
  public fields = [
    new TextField({
      key: 'name',
      label: 'Name',
      validators: [
        Validators.required,
        Validators.minLength(3)
      ]
    }),
    new AutocompleteField({
      key: 'color',
      label: 'Color',
      source: [{id: 1, name: 'Green'}, {id: 2, name: 'Blue'}, { id: 3, name: 'Yellow'}],
      // source: ['Green', 'Blue', 'Yellow'],
      // listFormatter: 'id - name',
      optionLabel: 'name'
    }),
    new TextField({
      key: 'email',
      label: 'E-mail',
      validators: [
        Validators.required,
        Validators.email
      ]
    }),
    new SelectField({
      key: 'type',
      label: 'Type',
      options: ['a', 'b'],
      validators: [
        Validators.required
      ]
    }),
    new MeasureField({
      key: 'order',
      label: 'Order',
      // unit: 'º'
    })
  ];

  constructor(private titleService: Title) {}

  ngOnInit() {
    this.titleService.setTitle('Home | @esss/ng-xform');
  }

  public onSubmit(values: object) {
    this.editing = false;
    this.values = values;
  }
}
