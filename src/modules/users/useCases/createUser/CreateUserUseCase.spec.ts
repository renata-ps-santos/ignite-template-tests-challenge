import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "./CreateUserUseCase";

let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;

describe("Create User", () => {
  beforeEach(()=>{
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  });
  it("Should be able to create a new user", async () => {
    const user = await createUserUseCase.execute({
      name: "Test Create User",
      email: "test@create.user",
      password: "test123"
    });
    expect(user).toHaveProperty("id");
    expect(user.name).toEqual("Test Create User");
  });

  it("Shouldn't be able to create a new user when the email is already taken", () => {
   expect(async ()=>{
    await createUserUseCase.execute({
      name: "Test Create User",
      email: "test@create.user",
      password: "test123"
    });
    await createUserUseCase.execute({
      name: "Test Create User 2",
      email: "test@create.user",
      password: "test1234"
    });
   }).rejects.toBeInstanceOf(AppError);
  });
});
