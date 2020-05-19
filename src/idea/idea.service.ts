import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

import { IdeaEntity } from './idea.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { IdeaDto } from './idea.dto';
import { UserEntity } from '../user/user.entity';

@Injectable()
export class IdeaService {
  constructor(
    @InjectRepository(IdeaEntity)
    private ideaRepository: Repository<IdeaEntity>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>
  ) {
  }

  async showAll() {
    const ideas = await this.ideaRepository.find({relations: ['author']});
    return ideas.map(idea => this.toResponseObject(idea));
  }

  async create(userId: string, data: IdeaDto) {
    const user = await this.userRepository.findOne({where: {id: userId}});
    const idea = await this.ideaRepository.create({...data, author: user});
    await this.ideaRepository.save(idea);
    return this.toResponseObject(idea);
  }

  async read(id: string) {
    const idea = await this.ideaRepository.findOne({where: {id}});
    if (!idea) {
      throw new HttpException('Not found idea', HttpStatus.NOT_FOUND);
    }

    return idea;
  }

  async update(id: string, data: Partial<IdeaDto>) {
    let idea = await this.ideaRepository.findOne({where: {id}});
    if (!idea) {
      throw new HttpException('Not found idea', HttpStatus.NOT_FOUND);
    }

    await this.ideaRepository.update({id}, data);
    idea = await this.ideaRepository.findOne({where: {id}});
    return idea;
  }

  async destroy(id: string) {
    const idea = await this.ideaRepository.findOne({where: { id }});
    if (!idea) {
      throw new HttpException('Not found idea', HttpStatus.NOT_FOUND);
    }
    await this.ideaRepository.delete({id});
    return idea;
  }

  private toResponseObject(idea: IdeaEntity, ) {
    return { ...idea, author: idea.author.toResponseObject(false) }
  }
}
