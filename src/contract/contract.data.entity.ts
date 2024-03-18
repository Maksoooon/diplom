import { CreateLawContractData, CreatePersonContractData } from "src/dto/contract.dto";
import { BaseEntity, Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class ContractData extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    contactDataId: string;

    @Column({
        type: 'jsonb'
    })
    data: CreateLawContractData | CreatePersonContractData;
}
