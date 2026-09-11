import prisma from '@config/db.js';
import * as SearchDTO from '@dtos/searchDTO.js';
import * as StoryDTO from '@dtos/storyDTO.js';
import * as CommonItemDTO from '@dtos/commonItemDTO.js';

export default class StoryRepository {
  constructor() {}

  async CreateStory(story: StoryDTO.Create): Promise<StoryDTO.StoryWithAuthor> {
    const { categories, ...storyData } = story;

    return await prisma.story.create({
      data: {
        ...storyData,
        categories: {
          connect: categories.map((c) => ({ id: c.id })),
        },
      },
      include: {
        user: true,
        categories: true,
        votes: true,
        comments: true,
      },
    });
  }

  async GetAllStories(
    queryData: StoryDTO.Query,
  ): Promise<{ stories: StoryDTO.StoryWithAuthor[]; total: number }> {
    const { page, limit, sortBy, sortOrder } = queryData;
    const skip = (page - 1) * limit;

    const whereClause = { is_deleted: false };

    const [stories, total] = await Promise.all([
      prisma.story.findMany({
        where: whereClause,
        skip,
        take: limit,
        orderBy: { [sortBy || 'created_at']: sortOrder || 'desc' },
        include: {
          user: true,
          categories: true,
          votes: true,
          // Corrected nested include syntax:
          comments: {
            include: {
              votes: true, // Use the correct relation name 'votes' as per schema
            },
          },
        },
      }),
      prisma.story.count({ where: whereClause }),
    ]);

    return { stories, total };
  }

  async GetStoryByID(id: CommonItemDTO.Id['id']): Promise<StoryDTO.StoryWithAuthor | null> {
    return await prisma.story.findUnique({
      where: {
        id: id,
      },
      include: {
        user: true,
        categories: true,
        votes: true,
        comments: {
          include: {
            user: true,
          },
        },
      },
    });
  }

  async UpdateStory(
    id: CommonItemDTO.Id['id'],
    data: StoryDTO.Update,
  ): Promise<StoryDTO.StoryWithAuthor> {
    const { categories, ...rest } = data;

    return await prisma.story.update({
      where: { id },
      data: {
        ...rest,
        ...(categories && {
          categories: {
            set: categories.map((c) => ({ id: c.id })),
          },
        }),
      },
      include: {
        user: true,
        categories: true,
        votes: true,
        comments: true,
      },
    });
  }

  async RemoveStory(id: CommonItemDTO.Id['id']) {
    await prisma.story.delete({
      where: {
        id: id,
      },
    });
  }

  async SearchStory(queryData: SearchDTO.Query): Promise<StoryDTO.StoryWithAuthor[]> {
    const { page, limit, sortBy, sortOrder, search } = queryData;
    const skip = (page - 1) * limit;
    const res = await prisma.story.findMany({
      where: {
        is_deleted: false,
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { body: { contains: search, mode: 'insensitive' } },
          { categories: { some: { name: { contains: search, mode: 'insensitive' } } } },
        ],
      },
      include: {
        user: true,
        categories: true,
        votes: true,
        comments: true,
      },
      skip: skip,
      take: queryData.limit,
      orderBy: {
        [sortBy || 'created_at']: sortOrder || 'desc',
      },
    });

    return res;
  }
}
