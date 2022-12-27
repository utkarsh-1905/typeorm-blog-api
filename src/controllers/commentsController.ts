import { Request, Response } from "express";
import { dataSource } from "../data-source";
import { Comments } from "../entities/Comments";
import { Blogs } from "../entities/Blogs";
import { Users } from "../entities/Users";

async function addComment(req: Request, res: Response) {
  try {
    if (!req.headers.authorization) {
      res.status(401).json({ message: "Unauthorized" });
    }

    const { content, postId } = req.body;

    const blog = await dataSource.getRepository(Blogs).findOne({
      where: {
        id: postId,
      },
    });
    if (!blog) {
      res.status(404).json({ message: "Post not found" });
      return;
    }

    const author = await dataSource.getRepository(Users).findOne({
      relations: {
        auth: true,
      },
      where: {
        auth: {
          token: req.headers.authorization,
        },
      },
    });

    if (!author) {
      res.status(404).json({
        message: "User not found",
      });
      return;
    }

    const comment = new Comments();
    comment.content = content;
    comment.created_at = new Date();
    comment.blog = blog;
    comment.author = author;

    const savedComment = await dataSource.getRepository(Comments).save(comment);

    if (!savedComment) {
      res.status(500).json({ message: "Server error" });
      return;
    }

    res.status(201).json({
      message: "Comment added",
    });
  } catch (error) {
    console.log(error);
    res.json(500).json({
      message: "Server error",
    });
  }
}

async function getCommentsByID(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const comments = await dataSource.getRepository(Comments).findOne({
      relations: {
        blog: true,
        author: true,
      },
      where: {
        id: parseInt(id),
      },
    });

    if (!comments) {
      res.status(404).json({ message: "Comments not found" });
      return;
    }

    res.status(200).json({
      message: "Comments found",
      comments,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server error",
    });
  }
}

async function getAllComments(req: Request, res: Response) {
  try {
    const comments = await dataSource.getRepository(Comments).find({
      relations: {
        blog: true,
        author: true,
      },
    });

    if (!comments) {
      res.status(404).json({
        message: "No Comments made",
      });
      return;
    }

    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
    });
  }
}

async function deleteCommentsByID(req: Request, res: Response) {
  try {
    if (!req.headers.authorization) {
      res.status(401).json({
        message: "Unauthorized",
      });
    }

    const { id } = req.params;

    const deletedComment = await dataSource.getRepository(Comments).findOne({
      relations: {
        author: {
          auth: true,
        },
      },
      where: {
        author: {
          auth: {
            token: req.headers.authorization,
          },
        },
        id: parseInt(id),
      },
    });

    if (!deletedComment) {
      res.status(404).json({
        message: "Comment not found",
      });
      return;
    }

    await dataSource.getRepository(Comments).delete(deletedComment);

    res.status(200).json({
      message: "Comment deleted",
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
    });
  }
}

async function updateCommentByID(req: Request, res: Response) {
  try {
    if (!req.headers.authorization) {
      res.status(401).json({
        message: "Unauthorized",
      });
      return;
    }

    if (!req.body.content) {
      res.status(400).json({
        message: "Nothing to update",
      });
      return;
    }

    const updatedComment = await dataSource.getRepository(Comments).findOne({
      relations: {
        author: {
          auth: true,
        },
      },
      where: {
        author: {
          auth: {
            token: req.headers.authorization,
          },
        },
        id: parseInt(req.params.id),
      },
    });

    if (!updatedComment) {
      res.status(404).json({
        message: "Comment not found",
      });
      return;
    }

    updatedComment.content = req.body.content;

    await dataSource.getRepository(Comments).save(updatedComment);

    res.status(200).json({
      message: "Comment updated",
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
    });
  }
}

export {
  addComment,
  getCommentsByID,
  getAllComments,
  deleteCommentsByID,
  updateCommentByID,
};
