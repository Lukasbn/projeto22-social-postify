import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { mediaDto } from './dto/media.dto';

@Injectable()
export class MediasRepository {
  constructor(private readonly prisma: PrismaService) {}

  getDublicadetMedia(body: mediaDto) {
    return this.prisma.media.findFirst({
      where: {
        title: body.title,
        username: body.username,
      },
    });
  }

  createMedia(body: mediaDto) {
    return this.prisma.media.create({
      data: {
        title: body.title,
        username: body.username,
      },
    });
  }

  getAllMedias() {
    return this.prisma.media.findMany();
  }

  getMediaById(id: number) {
    return this.prisma.media.findFirst({
      where: {
        id,
      },
    });
  }

  updateMedia(id: number, body: mediaDto) {
    return this.prisma.media.update({
      data: {
        title: body.title,
        username: body.username,
      },
      where: {
        id,
      },
    });
  }

  deleteMedia(id: number) {
    return this.prisma.media.delete({
      where: {
        id,
      },
    });
  }

  findConflict(id: number) {
    return this.prisma.publication.findFirst({
      where: {
        mediaId: id,
      },
    });
  }
}
