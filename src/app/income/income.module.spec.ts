import { IncomeModule } from './income.module';

describe('IncomeModule', () => {
  let incomeModule: IncomeModule;

  beforeEach(() => {
    incomeModule = new IncomeModule();
  });

  it('should create an instance', () => {
    expect(incomeModule).toBeTruthy();
  });
});
