import { Component } from '@angular/core';
import { TestHttpComponent } from './test-http.component';

@Component({
  selector: 'app-dashboard',
  imports: [TestHttpComponent],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
  standalone: true,
})
export class Dashboard {}
