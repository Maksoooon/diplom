import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Feed } from "./feed.entity";

@Injectable()
export class FeedService {
  constructor(private jwtService: JwtService) {}
  getHello(): string {
    return "Its feed service!";
  }

  public async createFeed(token) {
    const payload = this.jwtService.decode(token.slice(7));

    const feed = new Feed();
    feed.userId = payload.id;
    feed.isActive = true;
    await Feed.save(feed);

    return {
      message: "Обращение успешно создано, наши специалисты с вами свяжутся",
    };
  }

  public async getActiveFeeds(type) {
    const feeds = await Feed.find({
      where: {
        isActive: true
      },
      relations: ["userId"],
      select: {
        feedId: true,
        isActive: true,
        userId: {
          type: true,
          fullName: true,
          phone: true,
          login: true,
        },
      },
    })

    return feeds
  }

  public async updateStatus(token) {
    const payload = this.jwtService.decode(token.slice(7));
    const userId = payload.id;
    const feeds = await Feed.find({
      relations: ["userId"],
      where: {
        userId,
        isActive: true
      }
    })

    feeds.forEach((feed) => {
      feed.isActive = false;
    })

    await Feed.save(feeds); 

    return {
      message: "Обращения этого пользователя переведены в статус Выполнено",
    };
  }
}

