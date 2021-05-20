import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { AppError } from "@shared/errors/AppError";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";

let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let authenticateUserUseCase: AuthenticateUserUseCase;


describe("Authenticate a user", ()=>{
  beforeEach(()=>{
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository)
  })
  it("should be able to authenticate a user", async () => {
    const user = {
      name: "Test Create User",
      email: "test@create.user",
      password: "test123"
    }
    await createUserUseCase.execute(user);
    const login = {
      email: user.email,
      password: user.password
    }
    const auth = await authenticateUserUseCase.execute(login);
    expect(auth.user).toHaveProperty("id")
    expect(auth).toHaveProperty("token")
  });

  it("shouldn't be able to authenticate a non existent user", () => {
    expect(async () => {
      const login = {
        email: "testFail@create.user",
        password: "test123"
      }
      await authenticateUserUseCase.execute(login);
    }).rejects.toBeInstanceOf(AppError);
  });

  it("shouldn't be able to authenticate a user with the wrong password", () => {
    expect(async () => {
      const user = {
        name: "Test Create User",
        email: "test@create.user",
        password: "test123"
      }
      await createUserUseCase.execute(user);
      const login = {
        email: user.email,
        password: "wrongPassword"
      }
      await authenticateUserUseCase.execute(login);
    }).rejects.toBeInstanceOf(AppError);
  });
});
