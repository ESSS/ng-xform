import { async } from '@angular/core/testing';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { TextField, SelectField, MeasureField, NgXformComponent, CheckboxField } from '@esss/ng-xform';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/map';
import { Title } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  public editing = true;
  public model: any = {};
  private colors: any[] = [
    { id: 1, name: 'blue' },
    { id: 2, name: 'yellow' },
    { id: 3, name: 'white' },
    { id: 4, name: 'black' },
    { id: 5, name: 'orange' },
    { id: 6, name: 'purple' }
  ];

  public fields = [
    new TextField({
      key: 'name',
      label: 'Name',
      validators: [
        Validators.required,
        Validators.minLength(3)
      ]
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
      key: 'color',
      label: 'Color',
      searchable: true,
      options: this.colors,
      labelAttribute: 'name',
    }),
    new SelectField({
      key: 'address',
      label: 'Address',
      searchHandler: this.observableSource.bind(this),
      searchByValueAttributeHandler: this.observableSourceByPlaceId.bind(this),
      searchable: true,
      labelAttribute: 'formatted_address',
      valueAttribute: 'place_id',
      validators: [
        Validators.required
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
      key: 'type_tags',
      label: 'Type tags',
      options: [{id: 1, description: 'A'}, {id: 2, description: 'B'}, {id: 3, description: 'C'}],
      labelAttribute: 'description',
      valueAttribute: 'id',
      multiple: true
    }),
    new MeasureField({
      key: 'order',
      label: 'Order',
      unit: 'º'
    }),
    new CheckboxField({
      key: 'news',
      label: 'News'
    })
  ];

  constructor(private titleService: Title, private http: HttpClient) {}

  ngOnInit() {
    this.titleService.setTitle('Home | @esss/ng-xform');
  }

  public onSubmit(values: object) {
    this.editing = !this.editing;
    this.model = values;
    console.log(values);
  }

  populate() {
    this.model = {
      name: 'Customer',
      email: 'customer@mail.com',
      type_tags: [2],
      type: 'b',
      color: { id: 3, name: 'white' },
      address: 'ChIJn7h-4b9JJ5URGCq6n0zj1tM',
      order: 2,
      news: true
    };
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

  public observableSourceByPlaceId(place_id: any): Observable<any> {
    return Observable.of({
      'place_id': 'ChIJn7h-4b9JJ5URGCq6n0zj1tM',
      'formatted_address': 'Florianópolis - State of Santa Catarina, Brazil'
    }).delay(500);
  }
}
