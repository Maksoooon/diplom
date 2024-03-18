import { Injectable } from '@nestjs/common';
import { Contract } from './contract.entity';
import { JwtService } from '@nestjs/jwt';
import { CreateContractDto, UpdateContractDto } from 'src/dto/contract.dto';
import { ContractData } from './contract.data.entity';

@Injectable()
export class ContractService {
  constructor(private jwtService: JwtService) {}

  async createContract(contract, token: string, files) {
    const payload = this.jwtService.decode(token.slice(7));
    const contractBody = new Contract();

    contractBody.userId = payload.id;
    contractBody.tariffId = contract.tariffId || null;

    const newData = new ContractData();
    newData.data = JSON.parse(contract.data);
    const data = await ContractData.save(newData);

    contractBody.data = data;
    contractBody.isFinished = contract.isFinished || false;
    contractBody.type = contract.type;
    contractBody.passportScan = [];
    files.forEach(file => {
      contractBody.passportScan.push(file.filename);
    })

    await Contract.save(contractBody);
    return contractBody;
  }

  async updateContract(contract) {
    const currentContract = await Contract.findOne({where: {
      contactId: contract.contractId
    }, relations: ["data"]});
    
    const currentDataContract = await ContractData.findOne({where: {
      contactDataId: currentContract.data.contactDataId
    }})

    const newData = {
      ...currentDataContract.data,
    ...contract.data,
    }

    currentDataContract.data = newData;
    const newContractData = await ContractData.save(currentDataContract);
    console.log(newContractData)

    currentContract.data = newContractData;
    currentContract.isFinished = contract.isFinished;
    currentContract.type = contract.type;

    const updated = Contract.save(currentContract);
    return updated;
  }

  async getContract() {
    const contracts = await Contract.find({
      relations: ["data"]
    })
    return contracts;
  }
}
