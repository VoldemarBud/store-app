import {ComponentFixture, TestBed} from '@angular/core/testing';
import {Component, DebugElement} from '@angular/core';
import {By} from '@angular/platform-browser';
import {LogClickDirective} from './log-click.directive';

// Компонент-макет для тестування директиви
@Component({
    template: `
        <button appLogClick (clickChanges)="counterComponent = $event"></button>
    `
})
class TestComponent {
    public counterComponent?: number;
}

describe('LogClickDirective', () => { // Описуємо блок тестів для директиви LogClickDirective
    let fixture: ComponentFixture<TestComponent>; // Фікстура для компонента
    let component: TestComponent; // Екземпляр тестового компонента
    let directiveElement: DebugElement; // Елемент, на якому застосовується директива

    beforeEach(() => { // Виконується перед кожним тестом
        TestBed.configureTestingModule({
            declarations: [LogClickDirective, TestComponent] // Декларація директиви та тестового компонента
        }).compileComponents(); // Компілюємо компонент

        fixture = TestBed.createComponent(TestComponent); // Створення фікстури для тестового компонента
        component = fixture.componentInstance; // Отримання екземпляра тестового компонента
        directiveElement = fixture.debugElement.query(By.directive(LogClickDirective)); // Отримання елемента з директивою
    });

    it('should increment the counter and emit the value on click', () => {
        // Отримання екземпляру директиви з елемента
        const directiveInstance: LogClickDirective = directiveElement.injector.get(LogClickDirective);
        // Клік на елементі, що має директиву
        directiveElement.triggerEventHandler('click', null);
        // Перевірка, чи збільшився лічильник
        expect(directiveInstance.counter).toBe(1);
        // Перевірка, чи відбулась емісія значення
        expect(component.counterComponent).toBe(1);
    });
});
