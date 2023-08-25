import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { publicationDto } from './dto/create-publication.dto';

@Injectable()
export class PublicationsRepository {
  constructor(private readonly prisma: PrismaService) {}

  createPublication(body: publicationDto) {
    return this.prisma.publication.create({
      data: {
        date: body.date,
        mediaId: body.mediaId,
        postId: body.postId,
      },
    });
  }

  getAllPublications() {
    return this.prisma.publication.findMany();
  }

  getPublicationById(id: number) {
    return this.prisma.publication.findFirst({
      where: {
        id,
      },
    });
  }

  update(id: number, body: publicationDto) {
    return this.prisma.publication.update({
      data: {
        date: body.date,
        mediaId: body.mediaId,
        postId: body.postId,
      },
      where: {
        id,
      },
    });
  }

  delete(id: number) {
    return this.prisma.publication.delete({
      where: {
        id,
      },
    });
  }
}
