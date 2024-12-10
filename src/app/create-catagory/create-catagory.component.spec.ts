import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateCatagoryComponent } from './create-catagory.component';

describe('CreateCatagoryComponent', () => {
  let component: CreateCatagoryComponent;
  let fixture: ComponentFixture<CreateCatagoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateCatagoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateCatagoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
