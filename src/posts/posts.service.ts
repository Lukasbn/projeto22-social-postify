import { HttpException, Injectable } from '@nestjs/common';
import { postDto } from './dto/create-post.dto';
import { PostRepository } from './posts.repository';
import { Post } from '@prisma/client';

@Injectable()
export class PostsService {
  constructor(private readonly repository: PostRepository) {}

  async create(body: postDto) {
    return await this.repository.createPost(body);
  }

  async findAll() {
    const posts = await this.repository.getPosts();
    return this.formatPost(posts);
  }

  formatPost(posts: Post[]) {
    const result = posts.map((post) => ({
      id: post.id,
      title: post.title,
      text: post.text,
      ...(post.image && { image: post.image }),
    }));
    return result;
  }

  async findOne(id: number) {
    const post = await this.repository.getPostById(id);
    if (!post) throw new HttpException('Post not Found', 404);
    return {
      id: post.id,
      title: post.title,
      text: post.text,
      ...(post.image && { image: post.image }),
    };
  }

  async update(id: number, body: postDto) {
    await this.findOne(id);
    return this.repository.updatePost(id, body);
  }

  async remove(id: number) {
    await this.findOne(id);
    const conflict = await this.repository.findConflict(id);
    if (conflict)
      throw new HttpException(
        'This media is already registered in a publication.',
        403,
      );
    return await this.repository.deletePost(id);
  }
}
