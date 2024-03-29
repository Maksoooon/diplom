import { Register } from "src/auth/auth.entity";
import { BaseEntity, Entity, PrimaryGeneratedColumn, ManyToOne, Column } from "typeorm";

@Entity()
export class Feed extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    feedId: string;

    @ManyToOne(() => Register, (user) => user.feeds)
    userId: Register;

    @Column({nullable: false, default: true})
    isActive: boolean;
}
