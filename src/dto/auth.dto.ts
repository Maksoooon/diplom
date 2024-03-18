import { Trim } from "class-sanitizer";

export class RegisterDto {
    public readonly fullName: string;

    @Trim()
    public readonly phone: string;

    @Trim()
    public readonly login: string;

    @Trim()
    public readonly password: string;
}

export class LoginDto {
    public readonly login: string;
    public readonly password: string;
}