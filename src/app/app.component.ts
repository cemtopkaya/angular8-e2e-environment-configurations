import { Component } from '@angular/core';
import {environment} from '../environments/environment'

import portlar from '../assets/port.json'

@Component({
  selector: 'app-root',
  template: `Api Adresi: http://{{apiAdresi}}:{{ports.apiPort}}`,
  // templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'e2e-project';
  apiAdresi = environment.api_sunucu_adresi
  ports = portlar
}
