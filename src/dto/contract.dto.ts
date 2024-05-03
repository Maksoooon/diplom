export class CreateLawContractData {
    email: string;
    orgName: string;
    orgAddress?: string;
    orgToUser?: string;
    price?: number;
    regNumber?: string;
    INN?: string;
    KPP?: string;
    accountNumber?: string;
    BIK?: string;
    phone?: string;
}

export class CreatePersonContractData {
    address: string;
    email: string;
    fullName?: string;
    passportSeria?: string;
    passportNumber?: string;
    passportByWho?: string;
    passportGetDate?: string;
    passportBirthDate?: string;
    passportRegAddress?: string;
    phone?: string;
}

export class CreateContractDto {
    tariffId?: string;
    data: string; // JSON string
    isFinished?: boolean;
    type: string;
    files?: Express.Multer.File[];
}

export class UpdateContractDto {
    contractId: string;
    tariffId?: string;
    data?: CreateLawContractData | CreatePersonContractData;
    isFinished?: boolean;
    type?: string;
}

