import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableToolbarComponent } from './table-toolbar';

describe('TableToolbarComponent', () => {
  let component: TableToolbarComponent;
  let fixture: ComponentFixture<TableToolbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableToolbarComponent],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(TableToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
