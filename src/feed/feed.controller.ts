import { Controller, Get, Post, Query, Request, UseGuards } from '@nestjs/common';
import { FeedService } from './feed.service';
import { JwtAuthGuard } from 'src/auth/auth.guard';

@Controller('feed')
export class FeedController {
  constructor(private readonly feedService: FeedService) {}

  @UseGuards(JwtAuthGuard)
  @Post('create-me')
  public getHello(@Request() req) {
    return this.feedService.createFeed(req.headers.authorization);
  }

  @Get('all')
  public getActiveFeeds(@Query('type') type: string) {
    return this.feedService.getActiveFeeds(type);
  }

  @Post('update')
  public updateFeed(@Request() req) {
    return this.feedService.updateStatus(req.headers.authorization);
  }
}

