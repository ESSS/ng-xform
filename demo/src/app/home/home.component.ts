import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { TextField, SelectField, MeasureField, AutocompleteField } from '@esss/ng-xform';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import { Title } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';

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
      listFormatter: 'id - name',
      valueFormatter: 'name'
    }),
    new AutocompleteField({
      key: 'address',
      label: 'Address',
      source: this.observableSource.bind(this),
      listFormatter: 'formatted_address',
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
    new SelectField({
      key: 'type_object',
      label: 'Type object',
      options: [{id: 1, description: 'A'}, {id: 2, description: 'B'}, {id: 3, description: 'C'}],
      labelAttribute: 'description',
      valueAttribute: 'id',
      multiple: true
    }),
    new MeasureField({
      key: 'order',
      label: 'Order',
      // unit: 'º'
    })
  ];

  constructor(private titleService: Title, private http: HttpClient) {}

  ngOnInit() {
    this.titleService.setTitle('Home | @esss/ng-xform');
  }

  public onSubmit(values: object) {
    this.editing = !this.editing;
    this.values = values;
  }

  public observableSource(keyword: any): Observable<any[]> {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${keyword}`;
    if (keyword) {
      return this.http.get(url)
        .map((res) => res['results']);
    } else {
      return Observable.of([]);
    }
  }
}
