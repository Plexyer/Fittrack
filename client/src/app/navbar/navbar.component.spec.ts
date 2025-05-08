import {ComponentFixture, TestBed} from '@angular/core/testing';
import {NavbarComponent} from './navbar.component';
import {RouterTestingModule} from '@angular/router/testing';
import {CommonModule} from '@angular/common';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavbarComponent, RouterTestingModule, CommonModule],
    }).compileComponents();

    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
  });

  it('should create the NavbarComponent', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle menu open/close', () => {
    expect(component.isMenuOpen).toBeFalse();
    component.toggleMenu();
    expect(component.isMenuOpen).toBeTrue();
    component.toggleMenu();
    expect(component.isMenuOpen).toBeFalse();
  });

  it('should close menu', () => {
    component.isMenuOpen = true;
    component.closeMenu();
    expect(component.isMenuOpen).toBeFalse();
  });

  it('should update isScrolled to true when scrolled down', () => {
    window.scrollY = 20;
    component.onWindowScroll();
    expect(component.isScrolled).toBeTrue();
  });

  it('should update isScrolled to false when scrolled back up', () => {
    window.scrollY = 5;
    component.onWindowScroll();
    expect(component.isScrolled).toBeFalse();
  });
});
