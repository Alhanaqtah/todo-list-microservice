import { Role } from "src/roles/roles.model"

export class CreateUserDto {
    readonly email: string
    readonly password: string
    readonly roles: string[]
}