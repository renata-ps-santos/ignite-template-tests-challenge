import { InMemoryStatementsRepository } from "@modules/statements/repositories/in-memory/InMemoryStatementsRepository";
import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "@modules/users/useCases/createUser/CreateUserUseCase";
import { AppError } from "@shared/errors/AppError";
import { CreateStatementUseCase } from "./CreateStatementUseCase"

let createStatementUseCase: CreateStatementUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let createUserUseCase: CreateUserUseCase;

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}
describe("Create Statement", () => {

  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository)
    createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository,inMemoryStatementsRepository);
  })
  it("should be able to create a deposit", async () => {
    const user = await createUserUseCase.execute({
      name: "Test Create User",
      email: "test@create.user",
      password: "test123"
    });

    const statement = {
      user_id: user.id,
      type: OperationType.DEPOSIT,
      amount: 1000,
      description: 'Study'
    };
    const result = await createStatementUseCase.execute(statement)

    expect(result).toHaveProperty("id");
    expect(result.type).toEqual("deposit");
    expect(result.amount).toEqual(1000);
  });

  it("should be able to make a withdraw", async () => {
    const user = await createUserUseCase.execute({
      name: "Test Create User",
      email: "test@create.user",
      password: "test123"
    });

    await createStatementUseCase.execute({
      user_id: user.id,
      type: OperationType.DEPOSIT,
      amount: 1000,
      description: 'Study'
    });

    const result = await createStatementUseCase.execute({
      user_id: user.id,
      type: OperationType.WITHDRAW,
      amount: 400,
      description: 'Bills'
    });
    expect(result).toHaveProperty("id");
    expect(result.type).toEqual("withdraw");
  });

  it("shouldn't be able to a non existent user make a deposit", () => {

    expect( async () => {
      await createStatementUseCase.execute({
        user_id: "12bd32",
        type: OperationType.DEPOSIT,
        amount: 1000,
        description: 'Study'
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it("shouldn't be able to a non existent user make a withdraw", () => {
    expect( async () => {
      await createStatementUseCase.execute({
        user_id: "12bd32",
        type: OperationType.WITHDRAW,
        amount: 1000,
        description: 'Study'
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it("shouldn't be able to withdraw when there's not enough balance", () => {
    expect( async () => {

      const user = await createUserUseCase.execute({
      name: "Test Create User",
      email: "test@create.user",
      password: "test123"
    });

    await createStatementUseCase.execute({
      user_id: user.id,
      type: OperationType.DEPOSIT,
      amount: 300,
      description: 'Study'
    });

    await createStatementUseCase.execute({
      user_id: user.id,
      type: OperationType.WITHDRAW,
      amount: 400,
      description: 'Bills'
    });
    }).rejects.toBeInstanceOf(AppError);
  });
});

