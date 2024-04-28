import { Register } from "src/auth/auth.entity";
import { Tariff } from "src/tariff/tariff.entity";
import { ContractData } from "./contract.data.entity";
import {
    BaseEntity, Entity, PrimaryGeneratedColumn, UpdateDateColumn, ManyToOne, Column, OneToOne, JoinColumn
} from "typeorm";

@Entity()
export class Contract extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    contactId: string;

    @ManyToOne(() => Register, (user) => user.contracts)
    userId: Register;

    @Column("text", {nullable: true, default: null})
    fullName?: string;

    @ManyToOne(() => Tariff, (tariff) => tariff.contracts)
    tariffId?: Tariff;

    @OneToOne(() => ContractData, {onUpdate: 'CASCADE'})
    @JoinColumn()
    data?: ContractData;

    @UpdateDateColumn()
    created_at: Date;

    @Column({nullable: false, default: false})
    isFinished: boolean;

    @Column({enum: ['law', 'person'], default: 'person'})
    type: string;

    @Column("text", {nullable: true, array: true, default: null})
    passportScan?: string[];
}
