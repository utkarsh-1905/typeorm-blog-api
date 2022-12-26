import { Request, Response } from "express";
import { dataSource } from "../data-source";
import { Blogs } from "../entities/Blogs";
import { Users } from "../entities/Users";
import { Auth } from "../entities/Auth";

async function createPost(req: Request, res: Response) {
  try {
    if (!req.headers.authorization) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    if (
      !req.body.title ||
      !req.body.content ||
      !req.body.category ||
      !req.body.keywords
    ) {
      return res.status(400).json({
        message: "Please fill all the fields",
      });
    }
    const token = req.headers.authorization;
    const user: Users | null = await dataSource.getRepository(Users).findOne({
      relations: ["auth"],
      where: {
        auth: {
          token,
        },
      },
    });

    if (!user) {
      return res.status(401).json({
        message: "No user found",
      });
    }

    const { title, content, category, keywords } = req.body;
    let keywordArray = keywords.split(",");
    keywordArray = keywordArray.map((keyword: string) => keyword.trim());

    let blog = new Blogs();
    blog.title = title;
    blog.content = content;
    blog.category = category;
    blog.keywords = keywordArray;
    blog.author = user;
    blog.dislikes = 0;
    blog.likes = 0;
    blog.created_at = new Date();
    blog.comments = [];

    const savedBlog = await dataSource.getRepository(Blogs).save(blog);
    res.status(200).json({
      message: "Blog created successfully",
      id: savedBlog.id,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error,
    });
  }
}

async function getBlogByID(req: Request, res: Response) {
  try {
    const blog = await dataSource.getRepository(Blogs).findOne({
      relations: {
        author: {
          profile: true,
        },
        comments: true,
      },
      where: {
        id: parseInt(req.params.id),
      },
    });

    if (!blog) {
      return res.status(404).json({
        message: "Blog not found",
      });
    }

    res.status(200).json({
      ...blog,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
    });
  }
}

async function updateBlogByID(req: Request, res: Response) {
  try {
    if (!req.headers.authorization) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const token: string = req.headers.authorization;

    const user: Blogs | null = await dataSource.getRepository(Blogs).findOne({
      relations: {
        author: {
          auth: true,
        },
      },
      where: {
        id: parseInt(req.params.id),
        author: {
          auth: {
            token: token,
          },
        },
      },
    });

    if (!user) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    if (!req.body.title || !req.body.content) {
      return res.status(400).json({
        message: "Nothing to update",
      });
    }

    const blog = await dataSource.getRepository(Blogs).update(
      {
        id: parseInt(req.params.id),
      },
      {
        title: req.body.title,
        content: req.body.content,
      }
    );

    if (!blog) {
      return res.status(404).json({
        message: "Blog not found",
      });
    }

    res.status(200).json({
      message: "Blog updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
    });
  }
}

//to delete a blog
//first check if the user is authorized
//then delete the relation in Users table,
//delete the comments associated with the blog
//and then delete the blog

async function deletePostByID(req: Request, res: Response) {
  try {
    if (!req.headers.authorization) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const token = req.headers.authorization;

    const deletedBlog = await dataSource
      .getRepository(Blogs)
      .createQueryBuilder("blog")
      .leftJoinAndSelect("blog.author", "author")
      .leftJoinAndSelect("author.auth", "auth", "auth.token=:token", {
        token: token,
      })
      .delete()
      .where("id=:id", { id: parseInt(req.params.id) })
      .execute();

    if (!deletedBlog) {
      return res.status(404).json({
        message: "Blog not found/Unauthorized",
      });
    }

    console.log(deletedBlog);

    res.status(200).json({
      message: "Blog deleted successfully",
    });
  } catch (error) {
    res.json(500).json({
      message: "Server error",
      error,
    });
  }
}

export { createPost, getBlogByID, updateBlogByID, deletePostByID };
