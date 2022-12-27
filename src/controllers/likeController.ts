import { Request, Response } from "express";
import { dataSource } from "../data-source";
import { Blogs } from "../entities/Blogs";

async function likeBlog(req: Request, res: Response) {
  try {
    const id = req.body.id;
    if (!id) {
      return res.status(400).json({
        message: "Send Blog ID",
      });
    }

    const likeBlog = await dataSource.getRepository(Blogs).findOne({
      where: {
        id: id,
      },
    });

    if (!likeBlog) {
      return res.status(404).json({
        message: "Blog not found",
      });
    }

    likeBlog!.likes++;

    await dataSource.getRepository(Blogs).save(likeBlog!);

    res.status(200).json({
      message: "Blog liked successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
    });
  }
}

async function dislikeBlog(req: Request, res: Response) {
  try {
    const id = req.body.id;
    if (!id) {
      return res.status(400).json({
        message: "Send Blog ID",
      });
    }

    const dislikeBlog = await dataSource.getRepository(Blogs).findOne({
      where: {
        id: id,
      },
    });

    if (!dislikeBlog) {
      return res.status(404).json({
        message: "Blog not found",
      });
    }

    dislikeBlog!.dislikes++;

    await dataSource.getRepository(Blogs).save(dislikeBlog!);

    res.status(200).json({
      message: "Blog disliked successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
    });
  }
}

export { likeBlog, dislikeBlog };
