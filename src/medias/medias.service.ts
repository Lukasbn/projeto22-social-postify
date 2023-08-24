import { HttpException, Injectable } from '@nestjs/common';
import { mediaDto } from './dto/media.dto';
import { MediasRepository } from './medias.repository';

@Injectable()
export class MediasService {
  constructor(private readonly repository: MediasRepository) {}

  async create(body: mediaDto) {
    await this.verifyDuplicates(body);
    return await this.repository.createMedia(body);
  }

  async verifyDuplicates(body: mediaDto) {
    const duplicatedMedia = await this.repository.getDublicadetMedia(body);
    if (duplicatedMedia)
      throw new HttpException('This media is already registered.', 409);
  }

  async findAll() {
    return await this.repository.getAllMedias();
  }

  async findOne(id: number) {
    const media = await this.repository.getMediaById(id);
    if (!media) throw new HttpException('Media not Found', 404);
    return media;
  }

  async update(id: number, body: mediaDto) {
    await this.findOne(id);
    await this.verifyDuplicates(body);
    return this.repository.updateMedia(id, body);
  }

  async remove(id: number) {
    await this.findOne(id);
    const conflict = await this.repository.findConflict(id);
    if (conflict)
      throw new HttpException(
        'This media is already registered in a publication.',
        403,
      );
    return await this.repository.deleteMedia(id);
  }
}
