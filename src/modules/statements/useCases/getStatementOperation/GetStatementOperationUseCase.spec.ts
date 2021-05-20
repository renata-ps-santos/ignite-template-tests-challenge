import { InMemoryStatementsRepository } from "@modules/statements/repositories/in-memory/InMemoryStatementsRepository";
import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "@modules/users/useCases/createUser/CreateUserUseCase";
import { AppError } from "@shared/errors/AppError";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let createUserUseCase: CreateUserUseCase;
let createStatementUseCase: CreateStatementUseCase;
let getStatementOperationUseCase: GetStatementOperationUseCase;

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}
describe("Show User Statements Operations", () => {
  beforeEach(() => {

    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository,inMemoryStatementsRepository);
    getStatementOperationUseCase = new GetStatementOperationUseCase(inMemoryUsersRepository, inMemoryStatementsRepository);

  });
  it("should be able to show user statement operation", async () => {
    const user = await createUserUseCase.execute({
      name: "Test Create User",
      email: "test@create.user",
      password: "test123"
    });
    const operation = await createStatementUseCase.execute({
      user_id: user.id,
      type: OperationType.DEPOSIT,
      amount: 1000,
      description: 'Study'
    });
    const statement = await getStatementOperationUseCase.execute({
      user_id: operation.user_id,
      statement_id: operation.id
    });
    expect(statement).toHaveProperty("id");
    expect(statement.type).toEqual("deposit");
    expect(statement.amount).toEqual(1000);
  });

  it("shouldn't be able to show user non existent statement", () => {
    expect(async () => {
      const user = await createUserUseCase.execute({
        name: "Test Create User",
        email: "test@create.user",
        password: "test123"
      });

      await getStatementOperationUseCase.execute({
        user_id: user.id,
        statement_id: "fake statement"
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it("shouldn't be able to show a statement non existent user", () => {
    expect(async () => {
      const user = await createUserUseCase.execute({
        name: "Test Create User",
        email: "test@create.user",
        password: "test123"
      });
      const operation = await createStatementUseCase.execute({
        user_id: user.id,
        type: OperationType.DEPOSIT,
        amount: 1000,
        description: 'Study'
      });
      await getStatementOperationUseCase.execute({
        user_id: "123abc",
        statement_id: operation.id
      });
    }).rejects.toBeInstanceOf(AppError);
  });
})
