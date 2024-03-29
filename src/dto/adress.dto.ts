import { Trim } from "class-sanitizer";

export class CreateAddress {
  @Trim()
  readonly address: string;
}
