import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OrderHistoryComponent } from "./order-history.component";
import { BasketService } from "../../shared/services/basket.service";
import { OrderHistory } from "../../shared/models/orderHistory";
import { of } from "rxjs";

describe('OrderHistoryComponent', () => {
    let component: OrderHistoryComponent;
    let fixture: ComponentFixture<OrderHistoryComponent>;
    let basketService: jasmine.SpyObj<BasketService>;

    beforeEach(async () => {
        // Створення підробленого об'єкту BasketService з допомогою jasmine.createSpyObj
        const basketServiceSpy = jasmine.createSpyObj('BasketService', ['orderHistory']);

        await TestBed.configureTestingModule({
            declarations: [OrderHistoryComponent],
            providers: [{ provide: BasketService, useValue: basketServiceSpy }]
        }).compileComponents();

        // Отримання екземпляра BasketService та компонента OrderHistoryComponent
        basketService = TestBed.inject(BasketService) as jasmine.SpyObj<BasketService>;
        fixture = TestBed.createComponent(OrderHistoryComponent);
        component = fixture.componentInstance;
    });

    it('should create OrderHistoryComponent', () => {
        // Перевірка, чи було створено екземпляр OrderHistoryComponent
        expect(component).toBeTruthy();
    });

    it('should call basketService.orderHistory and assign the result to orderHistory$', () => {
        // Мокові дані для замовлень
        const mockOrderHistory: OrderHistory[] = [
            {
                dataOrder: '2023-01-01',
                products: ['fakeid','fakeid2'],
                totalPrice: '0'
            },
            {
                dataOrder: '2023-01-01',
                products: ['fakeid2','fakeid3'],
                totalPrice: '1'
            }
        ];

        // Налаштування повернення мокових даних для методу orderHistory підробленого об'єкту basketService
        spyOn(basketService, 'orderHistory').and.returnValue(of(mockOrderHistory));

        // Виклик методу fixture.detectChanges() для оновлення компонента
        fixture.detectChanges();

        // Перевірка, чи було викликано метод orderHistory підробленого об'єкту basketService
        expect(basketService.orderHistory).toHaveBeenCalled();

        // Перевірка, чи було присвоєно результат методу orderHistory до властивості orderHistory$ компонента
        component.orderHistory$.subscribe((result) => {
            expect(result).toEqual(mockOrderHistory);
        });
    });
});
