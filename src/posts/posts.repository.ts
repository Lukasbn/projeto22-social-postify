import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { postDto } from './dto/create-post.dto';

@Injectable()
export class PostRepository {
  constructor(private readonly prisma: PrismaService) {}

  createPost(body: postDto) {
    return this.prisma.post.create({
      data: {
        text: body.text,
        title: body.title,
        image: body.image,
      },
    });
  }

  getPosts() {
    return this.prisma.post.findMany();
  }

  getPostById(id: number) {
    return this.prisma.post.findFirst({
      where: {
        id,
      },
    });
  }

  updatePost(id: number, body: postDto) {
    return this.prisma.post.update({
      data: {
        text: body.text,
        title: body.title,
        image: body.image,
      },
      where: {
        id,
      },
    });
  }

  findConflict(id: number) {
    return this.prisma.publication.findFirst({
      where: {
        postId: id,
      },
    });
  }

  deletePost(id: number) {
    return this.prisma.post.delete({
      where: {
        id,
      },
    });
  }
}
