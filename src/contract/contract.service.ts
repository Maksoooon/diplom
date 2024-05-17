import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Equal } from "typeorm";
import { join } from "path";
import * as bcrypt from "bcryptjs";
import * as PDFDocument from "pdfkit";
import * as fs from "fs";
import { ApiConfig } from "./text";

import { Contract } from "./contract.entity";
import { ContractData } from "./contract.data.entity";
import { Register } from "src/auth/auth.entity";

@Injectable()
export class ContractService {
  constructor(private jwtService: JwtService) {}

  async createContract(contract, token: string, files) {
    const payload = this.jwtService.decode(token.slice(7));
    const contractBody = new Contract();
    contractBody.userId = payload.id;
    if (contract.type === "person") {
      const user = await Register.getUserById(payload.id);
      contractBody.fullName = user.fullName;
    }
    if (contract.type === "law") {
      const data = JSON.parse(contract.data);
      contractBody.fullName = data.orgName;
    }
    contractBody.tariffId = contract.tariffId || null;

    const newData = new ContractData();
    newData.data = JSON.parse(contract.data);
    const data = await ContractData.save(newData);

    contractBody.data = data;
    contractBody.isFinished = contract.isFinished || false;
    contractBody.type = contract.type;
    contractBody.passportScan = [];
    files.forEach((file) => {
      const fileNameHash = bcrypt.hashSync(file.filename);
      contractBody.passportScan.push(fileNameHash);
    });
    await Contract.save(contractBody);
    return contractBody;
  }

  async updateContract(contract) {
    const currentContract = await Contract.findOne({
      where: {
        contactId: contract.contractId,
      },
      relations: ["data"],
    });

    const currentDataContract = await ContractData.findOne({
      where: {
        contactDataId: currentContract.data.contactDataId,
      },
    });

    const newData = {
      ...currentDataContract.data,
      ...contract.data,
    };

    currentDataContract.data = newData;
    const newContractData = await ContractData.save(currentDataContract);

    currentContract.data = newContractData;
    currentContract.isFinished = contract.isFinished;
    currentContract.type = contract.type;

    const updated = Contract.save(currentContract);
    return updated;
  }

  async getContract() {
    const contracts = await Contract.find({
      relations: ["data", "userId", "tariffId"],
    });

    contracts.forEach((contract) => {
      const [firstImage, secondImage] = contract.passportScan; // до изменения

      contract.passportScan[0] = `${process.env.BASE_URL}/${firstImage}`,
      contract.passportScan[1] = `${process.env.BASE_URL}/${secondImage}`,
      delete contract.userId.login;
      delete contract.userId.password;
      delete contract.userId.isAdmin;
    });

    return contracts;
  }

  async createPDF(uuid) {
    const contract = await Contract.findOne({
      relations: {
        userId: true,
      },
      where: {
        contactId: Equal(uuid),
      },
    });

    if (!contract) {
      return {
        message: "Контракт не существует",
      };
    } else {
      const pdfDoc = new PDFDocument();
      const fileName = `${uuid}.pdf`;
      pdfDoc.pipe(fs.createWriteStream(`./pdf/${fileName}`));

      const text = ApiConfig.contract_text(contract);
      pdfDoc.font(`./arial.ttf`);
      pdfDoc.text(`${text}`);
      pdfDoc.end();
      return {fileName};
    }
  }
}
