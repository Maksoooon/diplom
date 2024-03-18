
import { Register } from "src/auth/auth.entity";
import { Contract } from "src/contract/contract.entity";
import { BaseEntity, Entity, PrimaryGeneratedColumn, OneToMany, Column } from "typeorm";

@Entity()
export class Tariff extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    tariffId: string;

    @Column()
    name: string;

    @Column()
    price: number;

    @OneToMany(() => Contract, (contract) => contract.userId)
    contracts?: Contract[]
}
