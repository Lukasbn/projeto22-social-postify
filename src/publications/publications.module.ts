import { Module } from '@nestjs/common';
import { PublicationsService } from './publications.service';
import { PublicationsController } from './publications.controller';
import { PublicationsRepository } from './publications.repository';
import { PostsModule } from '../posts/posts.module';
import { MediasModule } from '../medias/medias.module';

@Module({
  controllers: [PublicationsController],
  providers: [PublicationsService, PublicationsRepository],
  imports: [PostsModule, MediasModule],
})
export class PublicationsModule {}
