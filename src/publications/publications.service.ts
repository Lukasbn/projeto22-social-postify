import { HttpException, Injectable } from '@nestjs/common';
import { publicationDto } from './dto/create-publication.dto';
import { PublicationsRepository } from './publications.repository';
import { PostsService } from 'src/posts/posts.service';
import { MediasService } from 'src/medias/medias.service';

@Injectable()
export class PublicationsService {
  constructor(
    private readonly repository: PublicationsRepository,
    private readonly posts: PostsService,
    private readonly medias: MediasService,
  ) {}

  async create(body: publicationDto) {
    await this.medias.findOne(body.mediaId);
    await this.posts.findOne(body.postId);
    await this.repository.createPublication(body);
  }

  async findAll() {
    return await this.repository.getAllPublications();
  }

  async findOne(id: number) {
    const result = await this.repository.getPublicationById(id);
    if (!result) throw new HttpException('publication Not Found', 404);
    return result;
  }

  async update(id: number, body: publicationDto) {
    const DBpublication = await this.findOne(id);
    await this.medias.findOne(body.mediaId);
    await this.posts.findOne(body.postId);
    const currentDate = new Date();
    if (DBpublication.date <= currentDate)
      throw new HttpException(
        'This Publication has already been published',
        403,
      );
    return await this.repository.update(id, body);
  }

  async remove(id: number) {
    await this.findOne(id);
    return await this.repository.delete(id);
  }
}
