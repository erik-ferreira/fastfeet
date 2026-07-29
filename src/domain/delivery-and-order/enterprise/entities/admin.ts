import { UniqueEntityID } from "@/core/entities/unique-entity-id"
import { User, UserProps } from "./abstract/user"

export interface AdminProps extends UserProps {}

export class Admin extends User {}
