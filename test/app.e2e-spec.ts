import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaModule } from '../src/prisma/prisma.module';
import { PrismaService } from '../src/prisma/prisma.service';

let app: INestApplication;
let prisma: PrismaService;

beforeEach(async () => {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule, PrismaModule],
  }).compile();

  app = moduleFixture.createNestApplication();
  app.useGlobalPipes(new ValidationPipe());
  prisma = app.get(PrismaService)

  await prisma.publication.deleteMany();
  await prisma.media.deleteMany();
  await prisma.post.deleteMany();

  await app.init();

});

describe('Medias + health', () => {
  it('/health', () => {
    return request(app.getHttpServer())
      .get('/health')
      .expect(200)
      .expect("I'm okay!");
  });

  it("post /medias => shold return 400 if the body is missing a fied", () => {
    return request(app.getHttpServer())
      .post("/medias")
      .send({
        "title": "Instagram"
      })
      .expect(400)
  })

  it("post /medias => Shold respond with 409 if thers already a media with the same combination of title and username", async () => {
    const medias = await prisma.media.create({
      data: {
        title: "Twitter",
        username: "myusername"
      }
    })

    return request(app.getHttpServer())
      .post("/medias")
      .send({
        title: "Twitter",
        username: "myusername"
      })
      .expect(409)
  })

  it("post /medias => Shold respond with 201 when a new media is created", async () => {
    return request(app.getHttpServer())
      .post("/medias")
      .send({
        title: "Twitter",
        username: "myusername"
      })
      .expect(201)
  })

  it("get /medias => Shold respond with a array of medias", async () => {
    const medias = await prisma.media.create({
      data: {
        title: "Twitter",
        username: "myusername"
      }
    })

    return request(app.getHttpServer())
      .get("/medias")
      .expect([medias])
  })

  it("get /medias => Shold respond with a empty array when ther is no media on the DB", async () => {
    return request(app.getHttpServer())
      .get("/medias")
      .expect([])
  })

  it("get /media/:id => should respond 404 when thers no media for the id passed", async () => {
    const medias = await prisma.media.create({
      data: {
        title: "Twitter",
        username: "myusername"
      }
    })
    return request(app.getHttpServer())
      .get(`/medias/${medias.id + 1}`)
      .expect(404)
  })

  it("get /media/:id => should respond with the media of the id passed", async () => {
    const medias = await prisma.media.create({
      data: {
        title: "Twitter",
        username: "myusername"
      }
    })
    return request(app.getHttpServer())
      .get(`/medias/${medias.id}`)
      .expect(medias)
  })

  it("put /media/:id => Should update the media", async () => {
    const medias = await prisma.media.create({
      data: {
        title: "Twitter",
        username: "myusername"
      }
    })
    return request(app.getHttpServer())
      .put(`/medias/${medias.id}`)
      .send({
        title: "Twitter",
        username: "myusername-2"
      })
      .expect({
        id: medias.id,
        title: "Twitter",
        username: "myusername-2"
      })
  })

  it("put /media/:id => Shold respond with 409 if thers already a media with the same combination of title and username", async () => {
    const medias = await prisma.media.create({
      data: {
        title: "Twitter",
        username: "myusername"
      }
    })
    await prisma.media.create({
      data: {
        "title": "Instagram",
        "username": "myusername-2",
      }
    })
    return request(app.getHttpServer())
      .put(`/medias/${medias.id}`)
      .send({
        title: "Instagram",
        username: "myusername-2"
      })
      .expect(409)
  })

  it("put /media/:id => Should respond 404 when ther's no media for the id passed", async () => {
    const medias = await prisma.media.create({
      data: {
        title: "Twitter",
        username: "myusername"
      }
    })
    return request(app.getHttpServer())
      .put(`/medias/${medias.id + 1}`)
      .send({
        title: "Twitter",
        username: "myusername-2"
      })
      .expect(404)
  })

  it("delet /media/:id => Should delete the media", async () => {
    const medias = await prisma.media.create({
      data: {
        title: "Twitter",
        username: "myusername"
      }
    })
    return request(app.getHttpServer())
      .delete(`/medias/${medias.id}`)
      .expect(200)
  })

  it("delet /media/:id => Should respond 404 when ther's no media for the id passed", async () => {
    const medias = await prisma.media.create({
      data: {
        title: "Twitter",
        username: "myusername"
      }
    })
    return request(app.getHttpServer())
      .delete(`/medias/${medias.id + 1}`)
      .expect(404)
  })
});

describe('Posts', () => {
  it("post /posts => shold return 400 if the body is missing a fied", () => {
    return request(app.getHttpServer())
      .post("/posts")
      .send({
        title: "Why you should have a guinea pig?"
      })
      .expect(400)
  })

  it("post /posts => Shold respond with 201 when a new post is created", async () => {
    return request(app.getHttpServer())
      .post("/posts")
      .send({
        title: "Why you should have a guinea pig?",
        text: "https://www.guineapigs.com/why-you-should-guinea"
      })
      .expect(201)
  })

  it("get /posts => Shold respond with a array of posts", async () => {
    const posts = await prisma.post.create({
      data: {
        title: "Why you should have a guinea pig?",
        text: "https://www.guineapigs.com/why-you-should-guinea"
      }
    })

    const post2 = await prisma.post.create({
      data: {
        title: "Why you should have a guinea pig?",
        text: "https://www.guineapigs.com/why-you-should-guinea",
        image: "http://placeholder.com/150x150"
      }
    })

    return request(app.getHttpServer())
      .get("/posts")
      .expect([{
        id: posts.id,
        text: posts.text,
        title: posts.title
      }, {
        id: post2.id,
        text: post2.text,
        title: post2.title,
        image: post2.image
      }])
  })

  it("get /posts => Shold respond with a empty array when ther is no posts on the DB", async () => {
    return request(app.getHttpServer())
      .get("/posts")
      .expect([])
  })

  it("get /posts/:id => should respond 404 when thers no post for the id passed", async () => {
    const posts = await prisma.post.create({
      data: {
        title: "Why you should have a guinea pig?",
        text: "https://www.guineapigs.com/why-you-should-guinea",
        image: "http://placeholder.com/150x150"
      }
    })
    return request(app.getHttpServer())
      .get(`/posts/${posts.id + 1}`)
      .expect(404)
  })

  it("get /posts/:id => should respond with the post of the id passed", async () => {
    const posts = await prisma.post.create({
      data: {
        title: "Why you should have a guinea pig?",
        text: "https://www.guineapigs.com/why-you-should-guinea",
        image: "http://placeholder.com/150x150"
      }
    })
    return request(app.getHttpServer())
      .get(`/posts/${posts.id}`)
      .expect(posts)
  })

  it("put /posts/:id => Should update the post", async () => {
    const posts = await prisma.post.create({
      data: {
        title: "Why you should have a guinea pig?",
        text: "https://www.guineapigs.com/why-you-should-guinea",
        image: "http://placeholder.com/150x150"
      }
    })
    return request(app.getHttpServer())
      .put(`/posts/${posts.id}`)
      .send({
        title: "Why you shouldn't have a guinea pig?",
        text: "https://www.guineapigs.com/why-you-shouldn't-guinea",
        image: "http://placeholder.com/1000x1000"
      })
      .expect({
        id: posts.id,
        title: "Why you shouldn't have a guinea pig?",
        text: "https://www.guineapigs.com/why-you-shouldn't-guinea",
        image: "http://placeholder.com/1000x1000"
      })
  })

  it("put /posts/:id => Should respond 404 when ther's no post for the id passed", async () => {
    const posts = await prisma.post.create({
      data: {
        title: "Why you should have a guinea pig?",
        text: "https://www.guineapigs.com/why-you-should-guinea",
        image: "http://placeholder.com/150x150"
      }
    })
    return request(app.getHttpServer())
      .put(`/posts/${posts.id + 1}`)
      .send({
        title: "Why you should have a guinea pig?",
        text: "https://www.guineapigs.com/why-you-should-guinea",
        image: "http://placeholder.com/150x150"
      })
      .expect(404)
  })

  it("delet /posts/:id => Should delete the post", async () => {
    const posts = await prisma.post.create({
      data: {
        title: "Why you should have a guinea pig?",
        text: "https://www.guineapigs.com/why-you-should-guinea",
        image: "http://placeholder.com/150x150"
      }
    })
    return request(app.getHttpServer())
      .delete(`/posts/${posts.id}`)
      .expect(200)
  })

  it("delet /posts/:id => Should respond 404 when ther's no post for the id passed", async () => {
    const posts = await prisma.post.create({
      data: {
        title: "Why you should have a guinea pig?",
        text: "https://www.guineapigs.com/why-you-should-guinea",
        image: "http://placeholder.com/150x150"
      }
    })
    return request(app.getHttpServer())
      .delete(`/posts/${posts.id + 1}`)
      .expect(404)
  })
});


describe('Publications', () => {
  it("post /publications => shold return 400 if the body is missing a fied", async () => {
    return request(app.getHttpServer())
      .post("/publications")
      .send({
        mediaId: 1,
        postId: 1,
      })
      .expect(400)
  })

  it("post /publications => Shold respond with 201 when a new publication is created", async () => {
    const posts = await prisma.post.create({
      data: {
        title: "Why you should have a guinea pig?",
        text: "https://www.guineapigs.com/why-you-should-guinea",
        image: "http://placeholder.com/150x150"
      }
    })
    const medias = await prisma.media.create({
      data: {
        title: "Twitter",
        username: "myusername"
      }
    })

    return request(app.getHttpServer())
      .post("/publications")
      .send({
        mediaId: medias.id,
        postId: posts.id,
        date: "2023-08-26T15:30:00Z"
      })
      .expect(201)
  })
  it("post /publications => Shold respond with 404 when thers no media or post registred on the id passed", async () => {
    const posts = await prisma.post.create({
      data: {
        title: "Why you should have a guinea pig?",
        text: "https://www.guineapigs.com/why-you-should-guinea",
        image: "http://placeholder.com/150x150"
      }
    })

    return request(app.getHttpServer())
      .post("/publications")
      .send({
        mediaId: 8,
        postId: posts.id,
        date: "2023-08-26T15:30:00Z"
      })
      .expect(404)
  })

  // it("get /publications => Shold respond with a array of publications", async () => {
  //   const posts = await prisma.post.create({
  //     data: {
  //       title: "Why you should have a guinea pig?",
  //       text: "https://www.guineapigs.com/why-you-should-guinea",
  //       image: "http://placeholder.com/150x150"
  //     }
  //   })
  //   const medias = await prisma.media.create({
  //     data: {
  //       title: "Twitter",
  //       username: "myusername"
  //     }
  //   })
  //   const publications = await prisma.publication.create({
  //     data:{
  //       date:"2023-08-26T15:30:00Z",
  //       mediaId: medias.id,
  //       postId: posts.id
  //     }
  //   })

  //   return request(app.getHttpServer())
  //     .get("/publications")
  //     .expect([{
  //       id:publications.id,
  //       mediaId: publications.mediaId,
  //       postId: publications.postId,
  //       date: "2023-08-26T15:30:00Z"
  //     }])
  // })

  it("get /publications => Shold respond with a empty array when ther is no publications on the DB", async () => {
    return request(app.getHttpServer())
      .get("/publications")
      .expect([])
  })

  it("get /publications/:id => should respond 404 when thers no publication for the id passed", async () => {
    const posts = await prisma.post.create({
      data: {
        title: "Why you should have a guinea pig?",
        text: "https://www.guineapigs.com/why-you-should-guinea",
        image: "http://placeholder.com/150x150"
      }
    })
    const medias = await prisma.media.create({
      data: {
        title: "Twitter",
        username: "myusername"
      }
    })
    const publications = await prisma.publication.create({
      data: {
        date: "2023-08-26T15:30:00Z",
        mediaId: medias.id,
        postId: posts.id
      }
    })
    return request(app.getHttpServer())
      .get(`/publications/${publications.id + 1}`)
      .expect(404)
  })

  // it("get /publications/:id => should respond with the publication of the id passed", async () => {
  //   const posts = await prisma.post.create({
  //     data: {
  //       title: "Why you should have a guinea pig?",
  //       text: "https://www.guineapigs.com/why-you-should-guinea",
  //       image: "http://placeholder.com/150x150"
  //     }
  //   })
  //   const medias = await prisma.media.create({
  //     data: {
  //       title: "Twitter",
  //       username: "myusername"
  //     }
  //   })
  //   const publications = await prisma.publication.create({
  //     data: {
  //       date: "2023-08-26T15:30:00Z",
  //       mediaId: medias.id,
  //       postId: posts.id
  //     }
  //   })
  //   return request(app.getHttpServer())
  //     .get(`/publications/${publications.id}`)
  //     .expect(publications)
  // })

  // it("put /publications/:id => Should update the publication", async () => {
  //   const posts = await prisma.post.create({
  //     data: {
  //       title: "Why you should have a guinea pig?",
  //       text: "https://www.guineapigs.com/why-you-should-guinea",
  //       image: "http://placeholder.com/150x150"
  //     }
  //   })
  //   const medias = await prisma.media.create({
  //     data: {
  //       title: "Twitter",
  //       username: "myusername"
  //     }
  //   })
  //   const publications = await prisma.publication.create({
  //     data: {
  //       date: "2024-08-26T15:30:00Z",
  //       mediaId: medias.id,
  //       postId: posts.id
  //     }
  //   })
  //   return request(app.getHttpServer())
  //     .put(`/publications/${publications.id}`)
  //     .send({
  //       date: "2023-08-26T15:30:00Z",
  //       mediaId: medias.id,
  //       postId: posts.id
  //     })
  //     .expect({
  //       id: publications.id,
  //       date: "2023-08-26T15:30:00Z",
  //       mediaId: medias.id,
  //       postId: posts.id
  //     })
  // })

  it("put /publications/:id => Should respond 404 when ther's no publication for the id passed", async () => {
    const posts = await prisma.post.create({
      data: {
        title: "Why you should have a guinea pig?",
        text: "https://www.guineapigs.com/why-you-should-guinea",
        image: "http://placeholder.com/150x150"
      }
    })
    const medias = await prisma.media.create({
      data: {
        title: "Twitter",
        username: "myusername"
      }
    })
    const publications = await prisma.publication.create({
      data: {
        date: "2024-08-26T15:30:00Z",
        mediaId: medias.id,
        postId: posts.id
      }
    })
    return request(app.getHttpServer())
      .put(`/publication/${publications.id + 1}`)
      .send({
        date: "2028-08-26T15:30:00Z",
        mediaId: medias.id,
        postId: posts.id
      })
      .expect(404)
  })

  it("delet /publications/:id => Should delete the publication", async () => {
    const posts = await prisma.post.create({
      data: {
        title: "Why you should have a guinea pig?",
        text: "https://www.guineapigs.com/why-you-should-guinea",
        image: "http://placeholder.com/150x150"
      }
    })
    const medias = await prisma.media.create({
      data: {
        title: "Twitter",
        username: "myusername"
      }
    })
    const publications = await prisma.publication.create({
      data: {
        date: "2024-08-26T15:30:00Z",
        mediaId: medias.id,
        postId: posts.id
      }
    })
    return request(app.getHttpServer())
      .delete(`/publications/${publications.id}`)
      .expect(200)
  })

  it("delet /publications/:id => Should respond 404 when ther's no publication for the id passed", async () => {
    const posts = await prisma.post.create({
      data: {
        title: "Why you should have a guinea pig?",
        text: "https://www.guineapigs.com/why-you-should-guinea",
        image: "http://placeholder.com/150x150"
      }
    })
    const medias = await prisma.media.create({
      data: {
        title: "Twitter",
        username: "myusername"
      }
    })
    const publications = await prisma.publication.create({
      data: {
        date: "2024-08-26T15:30:00Z",
        mediaId: medias.id,
        postId: posts.id
      }
    })
    return request(app.getHttpServer())
      .delete(`/publications/${publications.id + 1}`)
      .expect(404)
  })
});

