import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import * as bcrypt from 'bcryptjs';

import { Contract } from 'src/contract/contract.entity';
import { Feed } from 'src/feed/feed.entity';

@Entity("user")
export class Register extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    userId: string;

    @Column({ type: 'varchar'})
    fullName: string;

    @Column({ type: 'varchar', unique: true})
    phone: string;

    @Column({ type: 'varchar', unique: true})
    login: string;

    @Column({ type: 'varchar'})
    password: string;

    @Column({ type: 'boolean', nullable: false, default: false})
    isAdmin: boolean;

    @OneToMany(() => Contract, (contract) => contract.userId)
    contracts?: Contract[]

    @OneToMany(() => Feed, (feed) => feed.userId)
    feeds?: Feed[]

    @Column({enum: ['law', 'person'], default: 'person'})
    type: string;

    private static checkPassword(password, userPassword) {
        return bcrypt.compareSync(password, userPassword);
    }

    static async isUserExist(phone, login) {
        return this.createQueryBuilder("user")
        .where("user.phone = :phone", { phone })
        .orWhere("user.login = :login", { login })
        .getOne();
    }

    static async getUserById(userId) {
        return this.createQueryBuilder("user")
        .where("user.userId = :userId", { userId })
        .getOne();
    }

    static generatePasswordHash(password: string) {
        const salt = bcrypt.genSaltSync(10);
        return bcrypt.hashSync(password, salt);
    }

    static async loginProccess(login, password) {
        const user = await this.createQueryBuilder("user")
        .where("user.login = :login", {login})
        .getOne();
        
        if (!user) return false;

        const isPasswordValid = await this.checkPassword(password, user.password || null);

        if(!isPasswordValid) return false;

        return user;
    }
}